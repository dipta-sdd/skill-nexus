
from datetime import datetime
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    bio = models.TextField(blank=True)
    mobile = models.TextField(blank=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    role = models.CharField(max_length=50, choices=[
        ('Employer', 'Employer'),
        ('Student', 'Student'),
        ('Freelancer', 'Freelancer'),
        ('Educator', 'Educator'),
        ('University', 'University'),
        ('Admin', 'Admin')
    ])
    status = models.CharField(max_length=50, choices=[
        ('Active', 'Active'),
        ('Banned', 'Banned'),
        ('Suspended', 'Suspended')
    ], blank=False, default='Active')
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"


class Category(models.Model):
    name = models.CharField(max_length=255)


class Subcategory(models.Model):
    name = models.CharField(max_length=255)


class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    # skills_required = models.ManyToManyField(Skill)
    status = models.CharField(max_length=20, choices=[(
        'open', 'Open'), ('closed', 'Closed'), ('in_progress', 'In Progress')])
    # participants = models.ManyToManyField(
    #     User, related_name='projects_participated', blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()


class Review(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name='reviews_given', null=True)
    subject = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name='reviews_received', null=True)
    rating = models.PositiveIntegerField()
    description = models.TextField()
    date = models.DateField()


class PersonalDetails(models.Model):
    id = models.OneToOneField("data.user", verbose_name=(
        "Id of user"), on_delete=models.CASCADE, primary_key=True)
    father_name = models.CharField(max_length=200, blank=True, null=True)
    mother_name = models.CharField(max_length=200, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True, choices=[
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ])
    date_of_birth = models.DateField(blank=True, null=True)
    religion = models.CharField(max_length=200, blank=True, null=True)
    marital_status = models.CharField(max_length=7, blank=True, null=True, choices=[
        ('Married', 'Married'),
        ('Single', 'Single')
    ])


class Edu_level(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)


class Edu_degree(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    level = models.ForeignKey(
        Edu_level, on_delete=models.CASCADE, null=True)


class Edu_group_or_major(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    degree = models.ForeignKey(
        Edu_degree, on_delete=models.CASCADE, null=True)


class Education(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=False)
    level = models.ForeignKey(
        Edu_level, on_delete=models.CASCADE,  blank=False)
    degree = models.ForeignKey(
        Edu_degree, on_delete=models.CASCADE, blank=False)
    group = models.ForeignKey(
        Edu_group_or_major, on_delete=models.CASCADE, blank=False)
    result_type = models.CharField(max_length=8, blank=False, choices=[
        ('Grade', 'Grade'),
        ('Class', 'Class'),
        ('Division', 'Division')
    ])
    result = models.IntegerField(null=True, blank=True)
    gpa = models.DecimalField(
        decimal_places=2, max_digits=3, null=True, blank=True)
    gpa_scale = models.DecimalField(
        decimal_places=2, max_digits=3, null=True, blank=True)
    institute = models.CharField(max_length=255, blank=False, null=False)
    passing_year = models.PositiveIntegerField(blank=False)
    # start_date = models.DateField()


class Training(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    title = models.CharField(max_length=250, blank=False)
    institution_name = models.CharField(max_length=300, blank=False)
    country = models.CharField(max_length=50, blank=False)
    duration_year = models.IntegerField(blank=False)
    duration_month = models.IntegerField(blank=False)
    duration_day = models.IntegerField(blank=False)
    start_date = models.DateField(blank=False)
    end_date = models.DateField(blank=False)


class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    designation = models.CharField(max_length=250, blank=False)
    department = models.CharField(max_length=250, blank=False)
    organisation_name = models.CharField(max_length=300, blank=False)
    location = models.CharField(max_length=50, blank=False)
    duration_year = models.IntegerField(blank=False)
    duration_month = models.IntegerField(blank=False)
    duration_day = models.IntegerField(blank=False)
    start_date = models.DateField(blank=False)
    end_date = models.DateField(blank=False)


class Company(models.Model):
    name = models.CharField(max_length=100)
    user = models.OneToOneField(
        User, primary_key=True, on_delete=models.CASCADE)
    industry = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=500, blank=False)
    address = models.CharField(max_length=100)
    url = models.CharField(max_length=100)


class University(models.Model):
    user = models.OneToOneField(
        User, primary_key=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=False)
    address = models.CharField(max_length=200)
    logo = models.ImageField(blank=True)
    description = models.CharField(max_length=1000, blank=False)
    url = models.URLField(blank=False)


class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    course_outcome = models.CharField(max_length=1000, blank=False)
    course_contain = models.CharField(max_length=1000, blank=False)
    course_fee = models.DecimalField(
        decimal_places=2, max_digits=5, blank=False)
    course_thumbnil = models.ImageField(upload_to="thumbnil/", blank=False)


class CourseLecture(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    lecture_description = models.CharField(max_length=1000, blank=False)
    material = models.FileField(upload_to='materials/', blank=True)
    video = models.FileField(upload_to='videos/', blank=True)


class Skill(models.Model):
    name = models.CharField(max_length=100, blank=False)


class User_skill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'skill')


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # enrolled_on = models.DateTimeField(default=datetime.now)

    class Meta:
        unique_together = ('user', 'course')


class Jobs(models.Model):
    employer = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'Employer'})
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.ManyToManyField(
        Skill)  # Many-to-many for multiple skills
    experience_required = models.PositiveIntegerField(
        help_text="Experience required in years")
    price = models.DecimalField(
        max_digits=10, decimal_places=2)  # Added price field
    deadline = models.DateTimeField()  # Added deadline field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.employer.company.name}"


class UniversityProgram(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=False)
    type = models.CharField(max_length=50, blank=False, choices=[
        ('Graduate', 'Graduate'),
        ('Undergraduate', 'Undergraduate'),
        ('Professional', 'Professional'),
        ('Certificate', 'Certificate'),
        ('Doctoral', 'Doctoral')
    ])
    duration_year = models.IntegerField(blank=False)
    duration_month = models.IntegerField(blank=False)
    description = models.CharField(max_length=200, blank=True)


class UniversityProgramSession(models.Model):
    program = models.ForeignKey(UniversityProgram, on_delete=models.CASCADE)
    session_name = models.CharField(max_length=200, blank=False)
    start_date = models.DateField(blank=False)
    end_date = models.DateField(blank=False)
    requirements = models.TextField(blank=True)
    syllabus = models.FileField(upload_to='syllabus/', blank=False)
    admission_start_date = models.DateField(blank=False)
    admission_end_date = models.DateField(blank=False)
    fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    admission_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False
    )
    registration_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    application_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False
    )
    other_fees = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )

    def __str__(self):
        return f"{self.program.name} - {self.session_name}"

    class Meta:
        unique_together = ('program', 'session_name')
        ordering = ['start_date']


class ProgramApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.ForeignKey(
        UniversityProgramSession, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Accepted', 'Accepted'),
            ('Rejected', 'Rejected')
        ],
        default='Pending'
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('session', 'user')
