from django.db.models import Q
from django_filters import rest_framework as filters
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Group, Student
from .serializers import GroupSerializer, StudentSerializer


class GroupFilter(filters.FilterSet):
    status = filters.CharFilter(field_name='status')
    teacher_id = filters.NumberFilter(field_name='teacher__id')
    course_name = filters.CharFilter(field_name='course_name', lookup_expr='icontains')

    class Meta:
        model = Group
        fields = ['status', 'teacher_id', 'course_name']


class StudentFilter(filters.FilterSet):
    group_id = filters.NumberFilter(field_name='groups__id')
    status = filters.CharFilter(field_name='status')
    payment_status = filters.CharFilter(method='filter_payment_status')
    search = filters.CharFilter(method='filter_search')
    teacher_id = filters.NumberFilter(field_name='groups__teacher__id')
    course = filters.CharFilter(field_name='groups__course_name', lookup_expr='icontains')

    class Meta:
        model = Student
        fields = ['group_id', 'status', 'payment_status', 'search', 'teacher_id', 'course']

    def filter_payment_status(self, queryset, name, value):
        """
        Balans holatiga qarab o'quvchilarni filtrlaydi.
        - 'qarzdor': balans 0 dan kichik
        - 'tolagan': balans 0 ga teng yoki undan katta
        """
        if value == 'qarzdor':
            return queryset.filter(balance__lt=0)
        elif value in ['tolagan', 'tolangan', "to'lagan", 'paid']:
            return queryset.filter(balance__gte=0)
        return queryset

    def filter_search(self, queryset, name, value):
        """
        O'quvchini ismi, familiyasi yoki telefon raqami bo'yicha qidiradi.
        """
        if not value:
            return queryset
        return queryset.filter(
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value) |
            Q(phone__icontains=value)
        )


class GroupViewSet(viewsets.ModelViewSet):
    """
    Guruhlar uchun CRUD API viewset.
    """
    queryset = Group.objects.all().select_related('teacher', 'support_teacher')
    serializer_class = GroupSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = GroupFilter

    # Qulaylik uchun guruh o'chirilayotganda active talabalar mavjudligini tekshirish
    def destroy(self, request, *args, **kwargs):
        group = self.get_object()
        if group.students.exists():
            return Response(
                {"detail": "Ushbu guruhda o'quvchilar borligi sababli uni o'chirib bo'lmaydi. Guruh holatini 'Inactive' ga o'zgartiring."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class StudentViewSet(viewsets.ModelViewSet):
    """
    O'quvchilar uchun CRUD API viewset.
    Optimallashtirilgan queryset yordamida N+1 muammosi hal etilgan.
    """
    serializer_class = StudentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = StudentFilter

    def get_queryset(self):
        # N+1 query problem is eliminated using prefetch_related for M2M groups and nested teacher relationships
        return Student.objects.all().prefetch_related(
            'groups',
            'groups__teacher',
            'groups__support_teacher'
        )
