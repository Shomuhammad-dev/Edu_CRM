from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class DaysChoices(models.TextChoices):
    JUFT = 'Juft', 'Juft'
    TOQ = 'Toq', 'Toq'
    BOSHQA = 'Boshqa', 'Boshqa'

class GroupStatusChoices(models.TextChoices):
    ACTIVE = 'Active', 'Active'
    INACTIVE = 'Inactive', 'Inactive'

class StudentStatusChoices(models.TextChoices):
    YANGI = 'Yangi', 'Yangi'
    FAOL = 'Faol', 'Faol'
    MUZLATILGAN = 'Muzlatilgan', 'Muzlatilgan'

class Group(models.Model):
    name = models.CharField(max_length=150, help_text="Guruh nomi (masalan: '3A guruh')")
    course_name = models.CharField(max_length=150, help_text="Kurs nomi")
    teacher = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='taught_groups',
        help_text="Asosiy o'qituvchi"
    )
    support_teacher = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='supported_groups',
        help_text="Yordamchi o'qituvchi"
    )
    days = models.CharField(
        max_length=20, 
        choices=DaysChoices.choices, 
        help_text="Dars kunlari (Juft/Toq/Boshqa)"
    )
    time_slot = models.CharField(
        max_length=100, 
        help_text="Dars vaqti (masalan: '16:00 / 18:00')"
    )
    max_capacity = models.PositiveIntegerField(help_text="Guruhdagi maksimal o'quvchilar soni")
    student_count = models.PositiveIntegerField(
        default=0, 
        help_text="Hozirgi faol o'quvchilar soni (konkurrentlikni boshqarish uchun)"
    )
    start_date = models.DateField(help_text="Guruh boshlanish sanasi")
    end_date = models.DateField(help_text="Guruh tugash sanasi")
    status = models.CharField(
        max_length=20, 
        choices=GroupStatusChoices.choices, 
        default=GroupStatusChoices.ACTIVE,
        help_text="Guruh holati (Active/Inactive)"
    )

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} ({self.course_name})"


class Student(models.Model):
    first_name = models.CharField(max_length=150, help_text="Ismi")
    last_name = models.CharField(max_length=150, help_text="Familiyasi")
    
    # O'zbekiston telefon raqamlari validator (masalan: +998991234567 yoki 998991234567)
    phone_regex = RegexValidator(
        regex=r'^\+?998?\d{9}$',
        message="Telefon raqami noto'g'ri formatda. Masalan: '+998991234567'."
    )
    phone = models.CharField(
        validators=[phone_regex], 
        max_length=20, 
        help_text="Telefon raqami"
    )
    birth_date = models.DateField(help_text="Tug'ilgan sanasi")
    balance = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.00, 
        help_text="Balans (so'mda)"
    )
    status = models.CharField(
        max_length=25, 
        choices=StudentStatusChoices.choices, 
        default=StudentStatusChoices.YANGI,
        help_text="O'quvchining holati (Yangi/Faol/Muzlatilgan)"
    )
    comment = models.TextField(
        blank=True, 
        null=True, 
        help_text="Izoh"
    )
    groups = models.ManyToManyField(
        Group, 
        related_name='students', 
        blank=True,
        help_text="O'quvchi a'zo bo'lgan guruhlar"
    )
    
    # UI talablariga mos qo'shimcha maydonlar (baho va keyingi to'lov)
    rating = models.CharField(
        max_length=100, 
        default="Bahosi yo'q", 
        blank=True, 
        null=True, 
        help_text="O'quvchi bahosi"
    )
    next_payment_date = models.DateField(
        null=True, 
        blank=True, 
        help_text="Keyingi to'lov muddati"
    )

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
