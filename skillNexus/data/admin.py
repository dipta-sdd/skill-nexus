from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(User)
admin.site.register(PersonalDetails)
admin.site.register(Edu_level)
admin.site.register(Edu_degree)
admin.site.register(Edu_group_or_major)
admin.site.register(Education)
admin.site.register(Training)
admin.site.register(Experience)
admin.site.register(Company)
admin.site.register(University)
admin.site.register(UniversityProgram)
admin.site.register(UniversityProgramSession)
admin.site.register(Course)
admin.site.register(CourseLecture)
admin.site.register(Skill)
admin.site.register(User_skill)
admin.site.register(Enrollment)
admin.site.register(ProgramApplication)
admin.site.register(Job)
admin.site.register(Payment)
admin.site.register(Message)
admin.site.register(JobOffer)
