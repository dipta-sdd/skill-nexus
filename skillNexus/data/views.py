
from django.db import connection
from django.shortcuts import render, redirect
from .serializers import *
from .models import *


def getUser(request):
    if isinstance(request.user, User):
        serializer = UserSerializer(request.user)
        return serializer.data


def login_required(view_func):
    def wrapper(request, *args, **kwargs):
        user = getUser(request)
        if not user:
            return redirect('/')  # Redirect to home or another page
        else:
            return view_func(request, *args, **kwargs)
    return wrapper


def logout(request):
    if request.user.is_authenticated:
        request.session.flush()
        request.user = None
    return redirect('/login')


def home(request):
    return render(request, 'home.php')


def login(request):
    return render(request, 'login.php')


def signup(request):
    return render(request, 'reg.php')


@login_required
def profile(request):
    # user = getUser(request)
    # if user:
    return render(request, 'profile.php')
    # else:
    #     return render(request, 'login.php')


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


def university_programs(request):
    user = getUser(request)
    students = run_raw_sql(""" SELECT 
    data_programapplication.id as application_id ,
    data_user.first_name || ' ' || data_user.last_name as student_name ,
    data_user.id as student_id , 
    data_user.email ,
    data_user.mobile ,
    data_user.profile_picture,
    data_user.country,
    data_universityprogram.name as program_name,
    data_programapplication.status as status,
    data_universityprogramsession.session_name as session_name,
    data_programapplication.comment as comment,
    data_programapplication.created_at,
    data_programapplication.updated_at
    FROM data_programapplication 
    LEFT JOIN data_user 
    ON data_programapplication.user_id = data_user.id
    LEFT JOIN data_universityprogramsession 
    ON data_programapplication.session_id = data_universityprogramsession.id
    LEFT JOIN data_universityprogram 
    ON data_universityprogramsession.program_id = data_universityprogram.id
    WHERE data_universityprogram.user_id = %s 
    ORDER BY data_programapplication.updated_at DESC""", (user['id'],))
    return render(request, 'university_programs.php', {'applicants': students})


def users(request):
    # Add logic for displaying users (consider pagination)
    return render(request, 'users.php')


def suspended(request):
    return render(request, 'sus.html')


def lecture_up(request):
    # Add logic for lecture upload
    return render(request, 'lecture_up.php')


def all_course_detail(request):
    return render(request, 'all_course_detail.php')


def course_detail(request):

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


def lec_detail(request):
    return render(request, 'lec_detail.php')


def student_view_lec_detail(request):

    return render(request, 'student_view_lec_detail.php')


def videoshow(request):
    return render(request, 'videoshow.php')


def allvideoshow(request):
    return render(request, 'allvideoshow.php')

# /university/program/id


def manageProgram(request, program_id):
    program = UniversityProgram.objects.get(id=program_id)
    program = UniversityProgramSerial(program)
    sessions = UniversityProgramSession.objects.filter(program=program_id)
    sessions = UniversityProgramSessionSerializer(sessions, many=True)
    students = run_raw_sql(""" SELECT 
    data_programapplication.id as application_id ,
    data_user.first_name || ' ' || data_user.last_name as student_name ,
    data_user.id as student_id , 
    data_user.email ,
    data_user.mobile ,
    data_user.profile_picture,
    data_user.country,
    data_programapplication.status as status,
    data_universityprogramsession.session_name as session_name,
    data_programapplication.comment as comment,
    data_programapplication.created_at,
    data_programapplication.updated_at
    FROM data_programapplication 
    LEFT JOIN data_user 
    ON data_programapplication.user_id = data_user.id
    LEFT JOIN data_universityprogramsession 
    ON data_programapplication.session_id = data_universityprogramsession.id
    WHERE data_universityprogramsession.program_id = %s 
    ORDER BY data_programapplication.updated_at DESC""", (program_id,))

    return render(request, 'manageProgram.html', {'program': program.data, 'sessions': sessions.data, 'applicants': students})


def university_session(request, session_id):
    session = run_raw_sql(
        "SELECT data_universityprogramsession.* , data_universityprogram.name as program_name FROM data_universityprogramsession LEFT JOIN data_universityprogram ON data_universityprogramsession.program_id = data_universityprogram.id WHERE data_universityprogramsession.id = %s", (session_id,))
    students = run_raw_sql(""" SELECT 
    data_programapplication.id as application_id ,
    data_user.first_name || ' ' || data_user.last_name as student_name ,
    data_user.id as student_id , 
    data_user.email ,
    data_user.mobile ,
    data_user.profile_picture,
    data_user.country,
    data_programapplication.status as status,
    data_universityprogramsession.session_name as session_name,
    data_programapplication.comment as comment,
    data_programapplication.created_at,
    data_programapplication.updated_at
    FROM data_programapplication 
    LEFT JOIN data_user 
    ON data_programapplication.user_id = data_user.id
    LEFT JOIN data_universityprogramsession 
    ON data_programapplication.session_id = data_universityprogramsession.id
    WHERE data_programapplication.session_id = %s 
    ORDER BY data_programapplication.updated_at DESC""", (session_id,))
    return render(request, 'university_session.html', {'session': session[0], 'applicants': students})


def student_programs(request):
    user = getUser(request)
    if not user:
        sql = """SELECT 
            data_universityprogramsession.session_name , 
            data_universityprogramsession.id, 
            data_universityprogramsession.requirements , 
            data_universityprogramsession.start_date, 
            data_universityprogramsession.end_date , 
            data_universityprogramsession.admission_start_date, 
            data_universityprogramsession.admission_end_date , 
            data_universityprogram.name as program_name, 
            data_universityprogram.duration_year , 
            data_universityprogram.duration_month , 
            data_university.name as university ,
            CASE WHEN data_universityprogramsession.admission_start_date <= date('now')
                THEN 'upcoming' ELSE 
                CASE WHEN data_universityprogramsession.admission_end_date >= date('now')
                    THEN 'ongoing' ELSE 'completed' END END as status
            FROM data_universityprogramsession 
            LEFT JOIN data_universityprogram 
            ON data_universityprogramsession.program_id = data_universityprogram.id 
            LEFT JOIN data_university 
            ON data_universityprogram.user_id = data_university.user_id 
            WHERE data_universityprogramsession.admission_end_date > date('now')"""
    else:

        sql = """SELECT 
            data_universityprogramsession.session_name , 
            data_universityprogramsession.id, 
            data_universityprogramsession.requirements , 
            data_universityprogramsession.start_date, 
            data_universityprogramsession.end_date , 
            data_universityprogramsession.admission_start_date, 
            data_universityprogramsession.admission_end_date , 
            data_universityprogram.name as program_name, 
            data_universityprogram.duration_year , 
            data_universityprogram.duration_month , 
            data_university.name as university ,
            CASE WHEN data_universityprogramsession.admission_start_date >= date('now')
                THEN 'upcoming' ELSE 
                CASE WHEN data_universityprogramsession.admission_end_date >= date('now')
                    THEN 'ongoing' ELSE 'completed' END END as status,
            data_user.id as applied
            FROM data_universityprogramsession 
            INNER JOIN data_universityprogram 
                ON data_universityprogramsession.program_id = data_universityprogram.id 
            INNER JOIN data_university 
                ON data_universityprogram.user_id = data_university.user_id 
            LEFT JOIN  data_programapplication 
                ON ( data_programapplication.session_id = data_universityprogramsession.id and data_programapplication.user_id = %s )
            LEFT JOIN  data_user
                ON  data_programapplication.user_id = data_user.id
            WHERE data_universityprogramsession.admission_end_date > date('now')"""
    sessions = run_raw_sql(
        sql, (user['id'], ))

    return render(request, 'student_programs.html', {'programs': sessions})


def student_myprograms(request):
    user = getUser(request)
    if not user:
        return redirect('/')
    if user['role'] != 'Student':
        return redirect('/')

    sessions = run_raw_sql(
        """SELECT 
        data_universityprogramsession.session_name , 
        data_universityprogramsession.id, 
        data_universityprogramsession.start_date, 
        data_universityprogramsession.end_date , 
        data_universityprogram.name as program_name, 
        data_universityprogram.duration_year , 
        data_universityprogram.duration_month , 
        data_universityprogram.type , 
        data_university.name as university ,
        data_programapplication.status,
        data_programapplication.comment
        FROM data_universityprogramsession 
        LEFT JOIN data_universityprogram 
        ON data_universityprogramsession.program_id = data_universityprogram.id 
        LEFT JOIN data_university 
        ON data_universityprogram.user_id = data_university.user_id 
        LEFT JOIN  data_programapplication 
                ON data_programapplication.session_id = data_universityprogramsession.id
        WHERE data_programapplication.user_id = %s """, (user['id'],))

    return render(request, 'student_myprograms.html', {'programs': sessions})


def handler404(request, exception):
    return render(request, '404.php', status=404)


def run_raw_sql(query, params=None):
    """
    Execute a raw SQL query and return the results.

    Args:
        query (str): The raw SQL query to execute.
        params (tuple, optional): Parameters to safely include in the query.

    Returns:
        list[dict]: Query results as a list of dictionaries.
    """
    with connection.cursor() as cursor:
        cursor.execute(query, params or ())
        # Fetch all rows from the result
        columns = [col[0] for col in cursor.description]
        results = [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]
    return results
