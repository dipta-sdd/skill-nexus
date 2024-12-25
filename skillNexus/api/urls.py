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



    path('course/add', views.addCourse),

    path('course_lecture/add', views.addCourseLecture),
    path('course/get', views.getCourseDetail),
    path('course_list_single/get', views.getSingleCourseDetail),
    path('course_del/del', views.delCourse),
    path('course_video/get', views.getCourseVideo),
    path('course_video/edit', views.edit_course_video),
    path('course/edit', views.editCourse),
    path('course_list/get', views.courselist),




    path('lecture/get', views.get_lectures, name='get_lectures'),

    path('course_list_single/get', views.get_course_list_single,
         name='course_list_single'),
    path('course_enroll/add', views.course_enroll, name='course_enroll'),
    path('course_enroll/check', views.check_enrollment),
    path('enrolled_course_video/get', views.getEnrolledCourseVideo),
    path('enrollment/get', views.get_enrolled_users, name='get_enrolled_users'),
    path('enrollment/delete', views.ban_user_from_course,
         name='ban_user_from_course'),

    #     jobs _____________________________
    path('employer/job/new', jobs.employer_job_new, name='employer_job_new'),
    path('jobs', jobs.jobs, name='jobs'),
]
