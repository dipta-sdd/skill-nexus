from django.urls import path
from . import views  # Assuming your views are in views.py within the same directory
from . import jobs

urlpatterns = [
    path('', views.home, name='home'),
    path('account/login/', views.login, name='login'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('signup', views.signup, name='signup'),
    path('profile', views.profile, name='profile'),
    path('profile2', views.profile2, name='profile2'),
    path('education', views.education, name='education'),
    path('my_skills', views.my_skills, name='my_skills'),
    path('experience', views.experience, name='experience'),
    path('manage_education', views.manage_education, name='manage_education'),
    path('training', views.training, name='training'),
    path('users', views.users, name='users'),
    path('suspended', views.suspended, name='suspended'),
    path('programs', views.student_programs, name='student_programs'),
    path('lecture_up', views.lecture_up, name='lecture_up'),
    path('all_course_detail', views.all_course_detail, name='all_course_detail'),
    path('course_detail', views.course_detail, name='course_detail'),
    path('course_list', views.course_list, name='course_list'),
    path('course_list_single', views.course_list_single,
         name='course_list_single'),
    path('edit_detail', views.edit_detail, name='edit_detail'),
    path('edit_video', views.edit_video, name='edit_video'),
    path('create_course', views.create_course, name='create_course'),
    path('lec_detail', views.lec_detail, name='lec_detail'),
    path('student_view_lec_detail', views.student_view_lec_detail,
         name='student_view_lec_detail'),
    path('videoshow', views.videoshow, name='videoshow'),
    path('allvideoshow', views.allvideoshow, name='allvideoshow'),

    path('university/programs', views.university_programs, name='programs'),
    path('university/program/<int:program_id>',
         views.manageProgram, name='manageProgram'),
    path('university/program/session/<int:session_id>',
         views.university_session, name='university_session'),
    path('student/my_programs', views.student_myprograms,
         name='student_myprograms'),

    # jobs
    path('profile/jobs', jobs.profile_jobs, name='profile_jobs'),
    path('jobs', jobs.jobs, name='jobs'),
    path('job/<int:job_id>', jobs.job, name='job'),
    path('employer/jobs', jobs.employer_jobs, name='employer_jobs'),
    path('employer/job/<int:job_id>', jobs.employer_job, name='employer_job'),
    path('employer/jobs/offers', jobs.employer_jobs_offers,
         name='employer_jobs_offers'),

    path('employer/job/offer/<int:offer_id>', jobs.employer_job_offer,
         name='employer_job_offer'),

]
