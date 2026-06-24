import threading
from datetime import date
from django.test import TransactionTestCase
from django.contrib.auth.models import User
from django.db import connection, transaction
from rest_framework.exceptions import ValidationError
from .models import Group, Student, DaysChoices, GroupStatusChoices
from .serializers import StudentSerializer


class DRFApiTestCase(TransactionTestCase):
    """
    Django REST Framework API uchun model, serializer va konkurrentlik testlari.
    """

    def setUp(self):
        # O'qituvchilar yaratish
        self.teacher1 = User.objects.create_user(
            username='ustoz1', first_name='Shonog\'monov', last_name='Shomuhammad', password='password123'
        )
        self.support_teacher1 = User.objects.create_user(
            username='yordamchi1', first_name='Ozod', last_name='Xolnazarov', password='password123'
        )

        # Guruh yaratish (Sig'imi 2 ta o'quvchi)
        self.group = Group.objects.create(
            name='3A guruh',
            course_name='IT',
            teacher=self.teacher1,
            support_teacher=self.support_teacher1,
            days=DaysChoices.JUFT,
            time_slot='16:00 / 18:00',
            max_capacity=2,
            student_count=0,
            start_date=date(2026, 5, 1),
            end_date=date(2026, 8, 1),
            status=GroupStatusChoices.ACTIVE
        )

    def test_add_student_successfully(self):
        """
        Oddiy sharoitda talaba guruhga muvaffaqiyatli qo'shilishi testi.
        """
        data = {
            "first_name": "Maqsad",
            "last_name": "Abdurahimov",
            "phone": "+998950033179",
            "birth_date": "2010-05-15",
            "balance": 150000.00,
            "status": "Yangi",
            "groups": [self.group.id]
        }
        serializer = StudentSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        student = serializer.save()

        # O'quvchi guruhga bog'langanini tekshirish
        self.assertIn(self.group, student.groups.all())
        
        # Guruhdagi talabalar soni 1 taga oshganini tekshirish
        self.group.refresh_from_db()
        self.assertEqual(self.group.student_count, 1)

    def test_capacity_limit_validation(self):
        """
        Guruh to'la bo'lganda yangi talaba qo'shib bo'lmasligi va ValidationError qaytarishi testi.
        """
        # Guruhni to'ldiramiz (sig'imi 2)
        # 1-talaba
        data1 = {
            "first_name": "O'quvchi 1", "last_name": "Test", "phone": "+998991112233",
            "birth_date": "2012-01-01", "groups": [self.group.id]
        }
        ser1 = StudentSerializer(data=data1)
        ser1.is_valid(raise_exception=True)
        ser1.save()

        # 2-talaba
        data2 = {
            "first_name": "O'quvchi 2", "last_name": "Test", "phone": "+998994445566",
            "birth_date": "2012-01-01", "groups": [self.group.id]
        }
        ser2 = StudentSerializer(data=data2)
        ser2.is_valid(raise_exception=True)
        ser2.save()

        # Guruhdagi sonni tekshiramiz
        self.group.refresh_from_db()
        self.assertEqual(self.group.student_count, 2)

        # 3-talaba (Xatolik berishi kerak, chunki max_capacity=2)
        data3 = {
            "first_name": "O'quvchi 3", "last_name": "Test", "phone": "+998997778899",
            "birth_date": "2012-01-01", "groups": [self.group.id]
        }
        ser3 = StudentSerializer(data=data3)
        self.assertTrue(ser3.is_valid())
        
        with self.assertRaises(ValidationError) as ctx:
            ser3.save()
        
        # Xatolik xabari talabga mosligini tekshiramiz
        self.assertIn("Bu guruhda bo'sh joy qolmadi.", str(ctx.exception))

    def test_duplicate_group_prevented(self):
        """
        O'quvchini ayni bir guruhga ikki marta qo'shish oldi olinishi testi.
        """
        data = {
            "first_name": "Doston",
            "last_name": "Maxmudov",
            "phone": "+998946073200",
            "birth_date": "2011-08-20",
            "groups": [self.group.id, self.group.id] # Duplicate group IDs
        }
        serializer = StudentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("groups", serializer.errors)
        self.assertIn("O'quvchini bir xil guruhga bir necha marta qo'shib bo'lmaydi.", serializer.errors["groups"])

    def test_n_plus_one_prevention(self):
        """
        O'quvchilar ro'yxatini yuklashda prefetch_related orqali N+1 muammosi hal etilganini tekshirish.
        """
        # Bir nechta talabalar va guruhlar yaratamiz
        for i in range(5):
            student = Student.objects.create(
                first_name=f"Student {i}",
                last_name="Test",
                phone=f"+99899000000{i}",
                birth_date="2010-01-01"
            )
            student.groups.add(self.group)

        # Queryset prefetch_related bilan yoki busiz chaqirilganini taqqoslaymiz.
        # Prefetch bilan chaqirilganda, guruhlar soni nechta bo'lishidan qat'i nazar doimiy (constant) so'rovlar bajarilishi kerak.
        from django.db import connection
        
        # SQL loglarni tozalash
        connection.queries_log.clear()
        
        # Optimallashgan queryset
        queryset = Student.objects.all().prefetch_related(
            'groups',
            'groups__teacher',
            'groups__support_teacher'
        )
        
        # Querysetni baholash va barcha nested ma'lumotlarni o'qish
        students_list = list(queryset)
        for s in students_list:
            for g in s.groups.all():
                teacher = g.teacher
                support = g.support_teacher
        
        queries_count_prefetched = len(connection.queries)
        
        # Prefetch qilinganda queries soni juda oz bo'lishi lozim (odatda 3-4 so'rov)
        # N=5 bo'lgani uchun agar prefetch bo'lmaganda queries soni 5 * 3 = 15+ so'rov bo'lar edi.
        self.assertLess(queries_count_prefetched, 6)

    def test_concurrency_race_condition(self):
        """
        Yuqori yuklamada (High-concurrency) select_for_update yordamida race condition oldi olinishini tekshirish.
        Ushbu test guruh sig'imi 1 qolganda parallel ravishda ikki xil tranzaksiyadan talaba qo'shishga urinishni simulyatsiya qiladi.
        """
        self.group.max_capacity = 1
        self.group.student_count = 0
        self.group.save()

        errors = []

        def register_student(student_data):
            # Biz bu yerda har bir thread uchun alohida db ulanishini ochishimiz kerak (Django TransactionTestCase da)
            try:
                # Tranzaksiyani boshlash
                with transaction.atomic():
                    serializer = StudentSerializer(data=student_data)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        errors.append(serializer.errors)
            except ValidationError as e:
                errors.append(e.detail)
            except Exception as e:
                errors.append(str(e))
            finally:
                connection.close()

        student_data_1 = {
            "first_name": "Parallel 1", "last_name": "Test", "phone": "+998990001111",
            "birth_date": "2010-01-01", "groups": [self.group.id]
        }
        student_data_2 = {
            "first_name": "Parallel 2", "last_name": "Test", "phone": "+998990002222",
            "birth_date": "2010-01-01", "groups": [self.group.id]
        }

        # Ikki parallel thread ishga tushiramiz
        t1 = threading.Thread(target=register_student, args=(student_data_1,))
        t2 = threading.Thread(target=register_student, args=(student_data_2,))

        t1.start()
        t2.start()

        t1.join()
        t2.join()

        # Guruhning student_count qiymati 1 dan oshib ketmaganini tekshiramiz
        self.group.refresh_from_db()
        self.assertEqual(self.group.student_count, 1)

        # Threadlardan biriValidationError olganini va xato xabari to'g'riligini tekshiramiz
        self.assertEqual(len(errors), 1)
        self.assertIn("Bu guruhda bo'sh joy qolmadi.", str(errors[0]))
