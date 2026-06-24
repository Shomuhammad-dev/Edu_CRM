from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Group, Student, GroupStatusChoices

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name', 'email']


class GroupSerializer(serializers.ModelSerializer):
    teacher_detail = UserSerializer(source='teacher', read_only=True)
    support_teacher_detail = UserSerializer(source='support_teacher', read_only=True)

    class Meta:
        model = Group
        fields = [
            'id', 'name', 'course_name', 'teacher', 'teacher_detail',
            'support_teacher', 'support_teacher_detail', 'days', 
            'time_slot', 'max_capacity', 'student_count', 
            'start_date', 'end_date', 'status'
        ]
        read_only_fields = ['student_count']


class GroupMinimalSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'time_slot', 'teacher_name']

    def get_teacher_name(self, obj):
        if obj.teacher:
            # Return first_name and last_name, or fall back to username
            full_name = obj.teacher.get_full_name()
            return full_name if full_name.strip() else obj.teacher.username
        return None


class StudentSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        required=False,
        help_text="Guruhlar ID ro'yxati"
    )

    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'phone', 'birth_date', 
            'balance', 'status', 'comment', 'groups', 'rating', 'next_payment_date'
        ]

    def validate_groups(self, value):
        # Check for duplicates in the incoming list of group IDs
        if len(value) != len(set(value)):
            raise serializers.ValidationError("O'quvchini bir xil guruhga bir necha marta qo'shib bo'lmaydi.")
        return value

    def to_representation(self, instance):
        # Return nested group details in responses (stacked rendering in UI)
        representation = super().to_representation(instance)
        # Prefetched groups will be rendered efficiently
        representation['groups'] = GroupMinimalSerializer(instance.groups.all(), many=True).data
        return representation

    @transaction.atomic
    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        student = Student.objects.create(**validated_data)

        if groups:
            # Sort IDs to prevent database deadlocks under high concurrency
            group_ids = sorted([g.id for g in groups])
            
            # Lock the group rows for update inside the atomic transaction
            locked_groups = {g.id: g for g in Group.objects.select_for_update().filter(id__in=group_ids)}
            
            for group_instance in groups:
                group = locked_groups.get(group_instance.id)
                if not group:
                    raise serializers.ValidationError(f"Guruh topilmadi (ID: {group_instance.id}).")
                
                # 1. Check if group is active
                if group.status != GroupStatusChoices.ACTIVE:
                    raise serializers.ValidationError(f"'{group.name}' guruhi faol emas.")
                
                # 2. Check capacity limit
                if group.student_count >= group.max_capacity:
                    raise serializers.ValidationError("Bu guruhda bo'sh joy qolmadi.")
                
                # 3. Safely increment student count
                group.student_count += 1
                group.save(update_fields=['student_count'])
                
                # 4. Link relationship
                student.groups.add(group)

        return student

    @transaction.atomic
    def update(self, instance, validated_data):
        if 'groups' in validated_data:
            new_groups = validated_data.pop('groups', [])
            old_groups = list(instance.groups.all())
            
            # Determine which groups are being added vs removed
            old_ids = {g.id for g in old_groups}
            new_ids = {g.id for g in new_groups}
            
            to_add_ids = sorted(list(new_ids - old_ids))
            to_remove_ids = sorted(list(old_ids - new_ids))
            
            # Gather and sort all IDs to lock them and avoid deadlocks
            all_ids_to_lock = sorted(list(new_ids | old_ids))
            
            if all_ids_to_lock:
                locked_groups = {g.id: g for g in Group.objects.select_for_update().filter(id__in=all_ids_to_lock)}
                
                # Remove student from groups and decrement their student counts
                for r_id in to_remove_ids:
                    group = locked_groups.get(r_id)
                    if group:
                        group.student_count = max(0, group.student_count - 1)
                        group.save(update_fields=['student_count'])
                        instance.groups.remove(group)
                
                # Add student to groups and check capacity/status
                for a_id in to_add_ids:
                    group = locked_groups.get(a_id)
                    if not group:
                        raise serializers.ValidationError(f"Guruh topilmadi (ID: {a_id}).")
                    
                    if group.status != GroupStatusChoices.ACTIVE:
                        raise serializers.ValidationError(f"'{group.name}' guruhi faol emas.")
                        
                    if group.student_count >= group.max_capacity:
                        raise serializers.ValidationError("Bu guruhda bo'sh joy qolmadi.")
                        
                    group.student_count += 1
                    group.save(update_fields=['student_count'])
                    instance.groups.add(group)
                    
        return super().update(instance, validated_data)
