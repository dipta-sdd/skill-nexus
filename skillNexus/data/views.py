
from django.shortcuts import render


def home(request):
    return render(request, 'home.php')


def login(request):
    return render(request, 'login.php')


def signup(request):
    return render(request, 'signup.php')


def profile(request):
    return render(request, 'profile.php')


def profile2(request):
    return render(request, 'profile2.php')


def education(request):
    return render(request, 'education.php')


def my_skills(request):

    return render(request, 'skills.php')


def experience(request):

    return render(request, 'experience.php')


def manage_education(request):
    # Add logic for managing education here (e.g., create, update, delete)
    return render(request, 'manage_education.php')


def training(request):

    return render(request, 'training.php')


def programs(request):

    return render(request, 'programs.php')


def users(request):
    # Add logic for displaying users (consider pagination)
    return render(request, 'users.php')


def suspended(request):
    return render(request, 'sus.html')


def program(request, program_id):  # Assuming you want to display a specific program

    return render(request, 'program.php')


def lecture_up(request):
    # Add logic for lecture upload
    return render(request, 'lecture_up.php')


def all_course_detail(request):
    return render(request, 'all_course_detail.php')


def course_detail(request, course_id):
    return render(request, 'course_detail.php')


def course_list(request):
    return render(request, 'course_list.php')


def course_list_single(request):
    return render(request, 'course_list_single.php')


def edit_detail(request):
    # Add logic for editing details
    return render(request, 'edit_detail.php')


def edit_video(request):
    # Add logic for editing video
    return render(request, 'edit_video.php')


def create_course(request):
    # Add logic for creating a course
    return render(request, 'create_course.php')


def lec_detail(request, lecture_id):
    return render(request, 'lec_detail.php')


def student_view_lec_detail(request, lecture_id):

    return render(request, 'student_view_lec_detail.php')


def videoshow(request):
    return render(request, 'videoshow.php')


def allvideoshow(request):
    return render(request, 'allvideoshow.php')


def handler404(request, exception):
    return render(request, '404.php', status=404)
