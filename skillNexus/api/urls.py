from django.urls import path

from . import views, jobs


urlpatterns = [
    path('signup', views.signup),
    path('login', views.login_view),
    path('current_user', views.current_user),
    path('edit_profile', views.editProfile),
    path('personal_details', views.getPersonaDetails),
    path('personal_details/edit', views.editPersonaDetails),

    # educal api

    path('edu', views.edu_get),
    path('edu/level', views.edu_level),
    path('edu/degree', views.edu_degree),
    path('edu/group_or_mejor', views.edu_group_or_mejor),
    path('education/add', views.addEducation),
    path('education/get', views.getEducation),
    path('education/del', views.delEducation),
    path('training/get', views.getTraining),
    path('training/del', views.delTraining),
    path('training/add', views.addTraining),
    path('experience/add', views.addExperience),
    path('experience/del', views.delExperience),
    path('experience/get', views.getExperience),
    path('employer/company/get', views.getCompany),
    path('employer/company/add', views.addCompany),
    path('university/get', views.getUniversity),
    path('university/add', views.addUniversity),
    path('university/program/add', views.addProgram),
    path('university/program/get', views.getProgram),
    path('university/program/del', views.deelProgram),
    path('university/program/session', views.addEditSession),
    path('program', views.getProgramStudent),
    path('skills/all', views.allSkill),
    path('skills/add', views.addSkill),
    path('skills/get', views.getSkill),
    path('skills/del', views.delSkill),
    path('admin/users', views.allUsers),
    path('admin/user/status', views.editStatus),
    path('student/university/apply', views.applyUniversity),
    path('university/program/application/<int:application_id>',
         views.unuiversityApplication),



    #     jobs _____________________________
    path('employer/job/new', jobs.employer_job_new, name='employer_job_new'),
    path('jobs', jobs.jobs, name='jobs'),
    path('job/<int:job_id>/apply', jobs.job_apply, name='job_apply'),
    path('employer/job/offer/withdraw/<int:offer_id>',
         jobs.offer_withdraw, name='offer_withdraw'),
    path('employer/job/offer/accept/<int:offer_id>',
         jobs.offer_accept, name='offer_accept'),
    path('employer/job/offer/complete/<int:offer_id>',
         jobs.offer_complete, name='offer_complete'),
    path('jobs/offer/send_message', jobs.send_message, name='send_message'),

# polash

    path('course/add', views.addCourse),
    
    path('course_lecture/add', views.addCourseLecture),
    path('course/get', views.getCourseDetail),
    path('course_list_single/get', views.getSingleCourseDetail),
    path('course_del/del', views.delCourse),
    path('course_video/get', views.getCourseVideo),
    path('course_video/edit', views.edit_course_video),
    path('course/edit', views.editCourse),
    path('course_list/get', views.courselist),
    path('course/delete', views.course_delete),
    path('lecture/delete', views.lecture_delete),

    path('lecture/get', views.get_lectures, name='get_lectures'),

    path('course_list_single/get', views.get_course_list_single,
         name='course_list_single'),
    path('course_enroll/add', views.course_enroll, name='course_enroll'),
    path('course_enroll/check', views.check_enrollment),
    path('enrolled_course_video/get', views.getCourseVideo),
    path('enrollment/get', views.get_enrolled_users, name='get_enrolled_users'),
    path('enrollment/delete', views.ban_user_from_course, name='ban_user_from_course'),

    path('comments/get', views.get_course_comments, name='get_course_comments'),
    path('comments/add', views.add_comment, name='add_comment'),
    path('comments/edit', views.edit_comment, name='edit_comment'),
    path('comments/delete', views.delete_comment, name='delete_comment'),
    path('comments/like', views.like_comment, name='like_comment'),

    path('lecture_comments/get', views.get_lecture_comments, name='get_lecture_comments'),
    path('lecture_comments/add', views.add_lecture_comment, name='add_lecture_comment'),
    path('lecture_comments/edit', views.edit_lecture_comment, name='edit_lecture_comment'),
    path('lecture_comments/delete', views.delete_lecture_comment, name='delete_lecture_comment'),
    path('lecture_comments/like', views.like_lecture_comment, name='like_lecture_comment'),

    path('assignment/submit', views.submit_assignment, name='submit_assignment'),
    path('assignment/get', views.get_assignments, name='get_assignments'),
    path('assignment/update', views.update_assignment, name='update_assignment'),
    path('video/progress/update', views.update_video_progress, name='update_video_progress'),
    path('video/progress/get', views.get_video_progress, name='get_video_progress'),
    path('progress/video/', views.get_video_progress, name='video_progress'),
    path('progress/assignment/', views.get_assignment_progress, name='assignment_progress'),
    path('educator/student/progress/video', views.get_student_video_progress, name='student_video_progress'),
    path('educator/student/progress/assignment', views.get_student_assignment_progress, name='student_assignment_progress'),
    path('educator/enrolled_students', views.get_course_enrolled_students, name='get_course_enrolled_students'),
    path('course_messages/get', views.get_course_messages, name='get_course_messages'),
    path('course_messages/send', views.send_course_message, name='send_course_message'),

    path('educator/messages/get', views.get_educator_messages, name='get_educator_messages'),
    path('educator/messages/reply', views.educator_reply_message, name='educator_reply_message'),

    # Internship URLs
    path('student/internships/', views.list_student_internships, name='list_student_internships'),
    path('university/internships/', views.list_university_internships, name='list_university_internships'),
    path('internship/apply/', views.apply_internship, name='apply_internship'),
    path('internship/applications/', views.get_internship_applications, name='get_internship_applications'),
    path('internship/create/', views.create_internship, name='create_internship'),
    path('internship/update/', views.update_internship, name='update_internship'),
    path('internship/delete/', views.delete_internship, name='delete_internship'),
    path('student/applications/', views.get_student_applications, name='get_student_applications'),
    path('internship/application-count/<int:internship_id>/', 
         views.get_application_count, 
         name='get_application_count'),
         
    # Add new URL pattern for viewing applicants
    path('view_applicants/<int:internship_id>/', views.view_applicants, name='view_applicants'),
    path('update_application_status/', views.update_application_status, name='update_application_status'),
    path('internship/details/<int:internship_id>/', views.get_internship_details, name='get_internship_details'),
    path('university/details/<int:university_id>/', views.get_university_details, name='get_university_details'),
    path('payment/process', views.process_payment, name='process_payment'),
    
    # Course Review URLs
    path('course_reviews/get', views.get_course_reviews, name='get_course_reviews'),
    path('course_reviews/add', views.add_course_review, name='add_course_review'),
    path('course_reviews/edit', views.edit_course_review, name='edit_course_review'),
    path('course_reviews/delete', views.delete_course_review, name='delete_course_review'),
    path('instructor_details/get', views.get_instructor_details, name='get_instructor_details'),

    # Add these new URL patterns
    path('public/user-stats', views.get_public_user_stats, name='public_user_stats'),
    path('public/course-stats', views.get_public_course_stats, name='public_course_stats'),
    path('public/internship-stats', views.get_public_internships, name='public_internship_stats'),
    path('cv_view/', views.cv_view, name='cv_view'),
    
    # Certificate URLs
    path('certificate/check-eligibility/<int:course_id>/', views.check_certificate_eligibility, name='check_certificate_eligibility'),
    path('certificate/generate/<int:course_id>/', views.generate_certificate, name='generate_certificate'),


]
