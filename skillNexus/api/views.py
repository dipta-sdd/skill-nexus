# views.py
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from data.models import *
from data.serializers import *
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
import json
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


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


def getUser(request):
    if isinstance(request.user, User):
        serializer = UserSerializer(request.user)
        return serializer.data


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Current User",
    # request_body=editUserSerializer,
    security=[{"Bearer": []}]
)
@api_view(['GET'])
def current_user(request):
    if isinstance(request.user, User):
        serializer = UserSerializer(request.user)
        if serializer.data['status'] == 'Banned':
            return Response({"message": "Banned"}, status=status.HTTP_401_UNAUTHORIZED)
        print('_________________________________________________________________________________')
        print(serializer.data)
        return Response(serializer.data)
    else:
        return Response({"detail": "Authentication credentials were not provided."}, status=401)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Create User",
    # operation_description="Create a new user account.",
    request_body=UserSerializer,
    # request_body=openapi.Schema(
    #     type=openapi.TYPE_OBJECT,
    #     required=['username', 'email', 'password'],
    #     properties={
    #         'username': openapi.Schema(type=openapi.TYPE_STRING),
    #         'email': openapi.Schema(type=openapi.TYPE_STRING),
    #         'password': openapi.Schema(type=openapi.TYPE_STRING)
    #     }
    # ),
    # security=[{"Bearer": []}]
)
@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['password'] = make_password(
                serializer.validated_data.get('password'))
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Login",
    request_body=LoginSerializer,
    # security=[{"Bearer": []}]
)
@api_view(['POST'])
@permission_classes([])
def login_view(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            raw_password = serializer.validated_data['password']
            user = User.objects.get(username=username)
            user_data = UserSerializer(user).data
            print(user_data)
            if user_data['status'] == 'Banned':
                return Response({"message": "Sorry you are banned"}, status=status.HTTP_401_UNAUTHORIZED)
            if check_password(raw_password, user.password):
                login(request, user)
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({"message": "Login successful", "access_token": access_token, "user": user_data}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Edit Profile",
    request_body=editUserSerializer,
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def editProfile(request):
    print("________________________edit_profile_______________________")
    user = request.user
    print(user)
    serializer = editUserSerializer(
        user, data=request.data, partial=True)  # For partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['Post'],
    operation_summary="Personal Details",
    request_body=PersonalDetailsSerializer
)
@api_view(['POST'])
def getPersonaDetails(req):
    print("____________________get_personal_details_____________________")
    data = req.data

    try:
        obj = PersonalDetails.objects.get(pk=data['id'])
        serializer = PersonalDetailsSerializer(obj)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except PersonalDetails.DoesNotExist:
        return Response({"error": "Personal details not found"}, status=status.HTTP_404_NOT_FOUND)


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Edit Personal Details",
    request_body=PersonalDetailsSerializer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def editPersonaDetails(request):
    print("________________________Edit Personal Details_______________________")
    try:
        instance = PersonalDetails.objects.get(
            id=request.data['id'])  # check if details already exists
        # if exists update it
        serializer = PersonalDetailsSerializer(instance=instance,
                                               data=request.data, partial=True)
    except:
        # if not exists create new
        serializer = PersonalDetailsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Edit Education Level",
    request_body=Edu_levelSerializer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def edu_level(req):
    user = getUser(req)
    # print(user)
    if req.method == 'GET':
        try:
            obj = Edu_level.objects.all()
            serializer = Edu_levelSerializer(obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'msg': 'No level Found'}, status=status.HTTP_204_NO_CONTENT)
    elif req.method == 'POST' and user['role'] == 'Admin':
        serializer = Edu_levelSerializer(data=req.data, partial=True)
        if serializer.is_valid():
            level = serializer.save()
            return Response(Edu_levelSerializer(level).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Education (degree)",
    security=[{"Bearer": []}],
    responses={
        200: openapi.Response(
            description="Degree List",
            schema=Edu_degreeSerializer
        )
    }
)
@swagger_auto_schema(
    methods=['post'],
    operation_summary="Create Education (degree)",
    request_body=Edu_degreeSerializer,
    security=[{"Bearer": []}],
    responses={
        201: openapi.Response(
            description="Degree created",
            schema=Edu_degreeSerializer
        )
    }
)
@ api_view(["GET", 'POST'])
def edu_degree(req):
    user = getUser(req)
    if req.method == 'GET':
        try:
            obj = Edu_degree.objects.get()
            serializer = Edu_degreeSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'msg': 'No degree found'}, status=status.HTTP_204_NO_CONTENT)
    elif req.method == 'POST' and user['role'] == 'Admin':
        serializer = Edu_degreeSerializer(data=req.data, partial=True)
        if serializer.is_valid():
            obj = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Education (group or major)",
    security=[{"Bearer": []}],
    responses={
        200: openapi.Response(
            description="Group or major List",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER)
                    }
                )
            )
        )
    }
)
@swagger_auto_schema(
    methods=['post'],
    operation_summary="Create Education (group or major)",
    request_body=Edu_group_or_majorSerializer,
    security=[{"Bearer": []}],
    responses={
        201: openapi.Response(
            description="Group or major created",
            schema=Edu_group_or_majorSerializer
        ),
        400: openapi.Response(
            description="Bad Request",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "errors": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "name": openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(
                                    type=openapi.TYPE_STRING
                                )
                            )
                        }
                    )
                }
            )
        )
    }
)
@ api_view(["GET", 'POST'])
def edu_group_or_mejor(req):
    user = getUser(req)
    if req.method == 'GET':
        try:
            obj = Edu_group_or_major.objects.all()
            serializer = Edu_group_or_majorSerializer(obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'msg': 'No group/major Found'}, status=status.HTTP_204_NO_CONTENT)
    elif req.method == 'POST' and user['role'] == 'Admin':
        serializer = Edu_group_or_majorSerializer(data=req.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Education (user)",
    security=[{"Bearer": []}],
    responses={
        200: openapi.Response(
            description="Education List",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "degrees": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                    "groups": openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(
                                            type=openapi.TYPE_OBJECT,
                                            properties={
                                                "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                "id": openapi.Schema(type=openapi.TYPE_INTEGER)
                                            }
                                        )
                                    )
                                }
                            )
                        )
                    }
                )
            )
        )
    }
)
@ api_view(["GET"])
def edu_get(req):
    with connection.cursor() as cursor:
        cursor.execute(
            "select * from data_edu_level")
        levels = cursor.fetchall()
        levels = [dict(zip(['name', 'id'], level))
                  for level in levels]
        # result= []
        for level in levels:
            # print(level['id'])
            cursor.execute(
                f"select name,id from data_edu_degree where level_id={level['id']}")
            degrees = cursor.fetchall()
            degrees = [dict(zip(['name', 'id'], degree)) for degree in degrees]
            for degree in degrees:
                cursor.execute(
                    f"select name,id from data_edu_group_or_major where degree_id={degree['id']}")
                groups = cursor.fetchall()
                groups = [dict(zip(['name', 'id'], group))
                          for group in groups]
                degree['groups'] = groups
            level['degrees'] = degrees
        return Response(levels, status=status.HTTP_200_OK)


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Edit Education (user)",
    request_body=EducationSerializer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def addEducation(req):
    user = getUser(req)
    data = req.data.copy()
    # print(user)
    # print(req.data)
    data['user'] = user['id']
    # print(data)
    if 'id' in data:
        obj = Education.objects.get(id=data['id'], user=user['id'])
        serializer = EducationSerializer(obj, data=data, partial=True)
    else:
        serializer = EducationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Education (user)",
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getEducation(req):
    user = getUser(req)
    print('-------------------get education of a user------------------------')
    with connection.cursor() as cursor:
        cursor.execute(
            f"select data_education.id, data_edu_level.name, data_edu_degree.name, data_edu_group_or_major.name , result_type , result, gpa, gpa_scale,institute, passing_year from data_education, data_edu_level, data_edu_degree, data_edu_group_or_major where data_education.level_id=data_edu_level.id and data_education.degree_id=data_edu_degree.id and data_education.group_id=data_edu_group_or_major.id and user_id={user['id']}")
        edus = cursor.fetchall()
        # print(edus)
        edus = [dict(zip(['id', 'name', 'degree', 'group', 'result_type', 'result', 'gpa', 'gpa_scale', 'institute', 'passing_year'], edu))
                for edu in edus]
        print(edus)
        return Response(edus, status=status.HTTP_200_OK)


@ swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete Education (user)",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['education_id'],
        properties={
            'education_id': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    security=[{"Bearer": []}]
)
@ api_view(['DELETE'])
def delEducation(req):
    user = getUser(req)

    education_id = req.data['education_id']
    try:
        education = Education.objects.get(id=education_id, user=user['id'])
        education.delete()
        print(education)
        return Response({"message": "Education has been deleted"}, status=status.HTTP_200_OK)
    except Education.DoesNotExist:
        return Response({"error": "Education record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Add Training ",
    request_body=TrainingSerializer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def addTraining(req):
    print('_____________________add training_______________________')
    user = getUser(req)
    data = req.data.copy()
    data['user'] = user['id']
    if 'id' in data:
        obj = Training.objects.get(id=data['id'], user=user['id'])
        serializer = TrainingSerializer(obj, data=data, partial=True)
    else:
        serializer = TrainingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete Training",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['training_id'],
        properties={
            'training_id': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    security=[{"Bearer": []}]
)
@ api_view(['DELETE'])
def delTraining(req):
    user = getUser(req)
    training_id = req.data['training_id']
    try:
        training = Training.objects.get(id=training_id, user=user['id'])
        training.delete()
        return Response({"message": "Training has been deleted"}, status=status.HTTP_200_OK)
    except Training.DoesNotExist:
        return Response({"error": "Training record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Training",
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getTraining(req):
    user = getUser(req)
    print('-------------------get training of a user------------------------')

    try:
        if 'training_id' in req.query_params:
            objs = Training.objects.filter(
                user=user['id'], id=req.query_params['training_id'])
        else:
            objs = Training.objects.filter(user=user['id'])
        print(objs)
        trainings = TrainingSerializer(objs, many=True)
        return Response(trainings.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Traings Found'}, status=status.HTTP_204_NO_CONTENT)

# experience


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Add Experience ",
    request_body=ExperienceSeriallizer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def addExperience(req):
    print('_____________________add training_______________________')
    user = getUser(req)
    data = req.data.copy()
    data['user'] = user['id']
    if 'id' in data:
        obj = Experience.objects.get(id=data['id'], user=user['id'])
        serializer = ExperienceSeriallizer(obj, data=data, partial=True)
    else:
        serializer = ExperienceSeriallizer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete Training",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['experience_id'],
        properties={
            'experience_id': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    security=[{"Bearer": []}]
)
@ api_view(['DELETE'])
def delExperience(req):
    user = getUser(req)
    experience_id = req.data['experience_id']
    try:
        experience = Experience.objects.get(id=experience_id, user=user['id'])
        experience.delete()
        return Response({"message": "Experience has been deleted"}, status=status.HTTP_200_OK)
    except Experience.DoesNotExist:
        return Response({"error": "Experience record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Experience",
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getExperience(req):
    user = getUser(req)
    try:
        if 'experience_id' in req.query_params:
            objs = Experience.objects.filter(
                user=user['id'], id=req.query_params['experience_id'])
        else:
            objs = Experience.objects.filter(user=user['id'])
        print(objs)
        experiences = ExperienceSeriallizer(objs, many=True)
        return Response(experiences.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Experience Found'}, status=status.HTTP_204_NO_CONTENT)


@ swagger_auto_schema(
    methods=['get'],
    operation_summary="Get Employer Company",
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getCompany(req):
    user = getUser(req)
    print('___________________________________________________________________________________________')
    try:
        obj = Company.objects.get(user=user['id'])
        company = CompanySerializer(obj)
        print(company.data)
        return Response(company.data, status=status.HTTP_200_OK)
    except:
        return Response({'message': 'No company details found.'}, status=status.HTTP_204_NO_CONTENT)


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Add employer company ",
    request_body=ExperienceSeriallizer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def addCompany(req):
    user = getUser(req)
    data = req.data.copy()
    data['user'] = user['id']
    try:
        obj = Company.objects.get(user=user['id'])
        company = CompanySerializer(obj, data=data, partial=True)
    except:
        company = CompanySerializer(data=data)
    if company.is_valid():
        company.save()
        return Response(company.data, status=status.HTTP_201_CREATED)
    return Response(company.errors, status=status.HTTP_400_BAD_REQUEST)


@ swagger_auto_schema(
    methods=['get'],
    operation_summary="Get University",
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getUniversity(req):
    user = getUser(req)
    print('___________________________________________________________________________________________')
    try:
        obj = University.objects.get(user=user['id'])
        university = UniversitySerializer(obj)
        print(university.data)
        return Response(university.data, status=status.HTTP_200_OK)
    except:
        return Response({'message': 'No university details found.'}, status=status.HTTP_204_NO_CONTENT)


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Add university ",
    request_body=UniversitySerializer,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def addUniversity(req):
    user = getUser(req)
    data = req.data.copy()
    data['user'] = user['id']
    try:
        obj = University.objects.get(user=user['id'])
        university = UniversitySerializer(obj, data=data, partial=True)
    except:
        university = UniversitySerializer(data=data)
    if university.is_valid():
        university.save()
        return Response(university.data, status=status.HTTP_201_CREATED)
    return Response(university.errors, status=status.HTTP_400_BAD_REQUEST)


@ swagger_auto_schema(
    methods=['post'],
    operation_summary="Add university program/course ",
    request_body=UniversityProgramSerial,
    security=[{"Bearer": []}]
)
@ api_view(['POST'])
def addProgram(req):
    user = getUser(req)
    data = req.data.copy()
    data['user'] = user['id']
    if 'id' in data:
        obj = UniversityProgram.objects.get(id=data['id'], user=user['id'])
        program = UniversityProgramSerial(obj, data=data, partial=True)
    else:
        program = UniversityProgramSerial(data=data)
    if program.is_valid():
        program.save()
        return Response(program.data, status=status.HTTP_201_CREATED)
    return Response(program.errors, status=status.HTTP_400_BAD_REQUEST)


@ swagger_auto_schema(
    methods=['get'],
    operation_summary="Get programs ans courses",
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getProgram(req):
    user = getUser(req)
    try:
        if 'program_id' in req.query_params:
            objs = UniversityProgram.objects.filter(
                user=user['id'], id=req.query_params['program_id'])
        else:
            objs = UniversityProgram.objects.filter(user=user['id'])

        print(objs)
        program = UniversityProgramSerial(objs, many=True)
        return Response(program.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No program or course Found'}, status=status.HTTP_204_NO_CONTENT)


@ swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete program or course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['program_id'],
        properties={
            'program_id': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    security=[{"Bearer": []}]
)
@ api_view(['DELETE'])
def deelProgram(req):
    user = getUser(req)
    program_id = req.data['program_id']
    try:
        program = UniversityProgram.objects.get(id=program_id, user=user['id'])
        program.delete()
        return Response({"message": "Program has been deleted"}, status=status.HTTP_200_OK)
    except UniversityProgram.DoesNotExist:
        return Response({"error": "Program record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Add Course",
    request_body=CourseSeriallizer,
    responses={201: CourseSeriallizer, 400: 'Bad Request'},
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def addCourse(req):
    print('_____________________add training_______________________')
    user = getUser(req)
    data = req.data.copy()
    data['user'] = user['id']

    serializer = CourseSeriallizer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get a course by ID",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={
        200: CourseSeriallizer(many=True),
        204: 'No Course Found'
    },
    security=[{"Bearer": []}]
)
@ api_view(['GET'])
def getCourseDetail(req):
    user = getUser(req)
    try:
        if 'course_id' in req.query_params:
            objs = Course.objects.filter(
                user=user['id'], id=req.query_params['course_id'])
        else:
            objs = Course.objects.filter(user=user['id'])
        print(objs)
        course = CourseSeriallizer(objs, many=True)
        return Response(course.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Course Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete a course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['course_id'],
        properties={
            'course_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Course ID')
        }
    ),
    responses={
        200: openapi.Response(description='Course has been deleted'),
        404: openapi.Response(description='Course record not found or does not belong to the user'),
        500: openapi.Response(description='Internal Server Error')
    },
    security=[{"Bearer": []}]
)
@api_view(['DELETE'])
def delcourse(req):
    user = getUser(req)

    course_id = req.data['course_id']
    try:
        course = Course.objects.get(id=course_id, user=user['id'])
        course.delete()
        print(course)
        return Response({"message": "Course has been deleted"}, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({"error": "Course record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Add Course Lecture",
    request_body=CourseLectureSeriallizer,
    responses={201: CourseLectureSeriallizer, 400: 'Bad Request'},
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def addCourseLecture(req):
    print('_____________________add Lecture_______________________')
    user = getUser(req)
    print(req.data)
    data = req.data.dict()
    data['user'] = user['id']
    print(data)
    serializer = CourseLectureSeriallizer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete a course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['course_id'],
        properties={
            'course_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Course ID')
        }
    ),
    responses={
        204: openapi.Response(description='Course has been deleted'),
        404: openapi.Response(description='Course record not found or does not belong to the user'),
        500: openapi.Response(description='Internal Server Error')
    },
    security=[{"Bearer": []}]
)
@api_view(['DELETE'])
def delCourse(request):
    user = request.user  # Assuming you're using Django Rest Framework's authentication
    # Use request.data.get to safely retrieve data
    course_id = request.data.get('course_id')

    try:
        course = Course.objects.get(id=course_id, user=user)
        course.delete()
        return Response({"message": "Course has been deleted"}, status=status.HTTP_204_NO_CONTENT)
    except Course.DoesNotExist:
        return Response({"error": "Course record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Edit a course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'course_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Course ID'),
            'title': openapi.Schema(type=openapi.TYPE_STRING, description='Course Title'),
            'course_outcome': openapi.Schema(type=openapi.TYPE_STRING, description='Course Outcome'),
            'course_contain': openapi.Schema(type=openapi.TYPE_STRING, description='Course Content'),
            'course_thumbnil': openapi.Schema(type=openapi.TYPE_FILE, description='Course Thumbnail')
        }
    ),
    responses={
        200: openapi.Response(description='Course has been updated'),
        404: openapi.Response(description='Course record not found or does not belong to the user'),
        500: openapi.Response(description='Internal Server Error')
    },
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def editCourse(request):
    user = request.user
    course_id = request.data.get('course_id')
    try:
        course = Course.objects.get(id=course_id, user=user)
        course.title = request.data.get('title', course.title)
        course.course_outcome = request.data.get(
            'course_outcome', course.course_outcome)
        course.course_contain = request.data.get(
            'course_contain', course.course_contain)

        if 'course_thumbnil' in request.FILES:
            course.course_thumbnil = request.FILES['course_thumbnil']

        course.save()
        return Response({"message": "Course has been updated"}, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({"error": "Course record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get a course by ID",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: CourseLectureSeriallizer(many=True)}
)
@ api_view(['GET'])
def getLectureDetail(req):
    user = getUser(req)
    try:
        if 'course_id' in req.query_params:
            objs = CourseLecture.objects.filter(
                user=user['id'], id=req.query_params['course_id'])
        else:
            objs = CourseLecture.objects.filter(user=user['id'])
        print(objs)
        course = CourseLectureSeriallizer(objs, many=True)
        return Response(course.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Lecture Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get a course by ID",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: CourseLectureSeriallizer(many=True)}
)
@ api_view(['GET'])
def getCourseVideo(req):
    user = getUser(req)
    try:
        if 'course_id' in req.query_params:
            objs = CourseLecture.objects.filter(
                user=user['id'], id=req.query_params['course_id'])
        else:
            objs = CourseLecture.objects.filter(user=user['id'])
        print(objs)
        course = CourseLectureSeriallizer(objs, many=True)
        return Response(course.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Lecture Found'}, status=status.HTTP_204_NO_CONTENT)


# @api_view(['GET'])
# def getEnrolledCourseVideo(req):
#     user = getUser(req)
#     try:
#         if 'course_id' in req.query_params:
#             course_id = req.query_params['course_id']


#             enrollment = Enrollment.objects.filter(user=user['id'], course_id=course_id).exists()
#             if enrollment:
#                 objs = CourseLecture.objects.filter(course_id=course_id)
#             else:
#                 return Response({'msg': 'Not Enrolled in Course'}, status=status.HTTP_403_FORBIDDEN)
#         else:
#             return Response({'msg': 'Course ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
#         print(objs)
#         course = CourseLectureSeriallizer(objs, many=True)
#         return Response(course.data, status=status.HTTP_200_OK)
#     except:
#         return Response({'msg': 'No Lecture Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get enrolled course video",
    manual_parameters=[
        openapi.Parameter('course_id', openapi.IN_QUERY,
                          description="Course ID", type=openapi.TYPE_INTEGER),
        openapi.Parameter('lecture_id', openapi.IN_QUERY,
                          description="Lecture ID", type=openapi.TYPE_INTEGER)
    ],
    responses={
        200: CourseLectureSeriallizer(many=True),
        400: 'Course ID or Lecture ID not provided',
        403: 'Not Enrolled in Course',
        204: 'No Lecture Found',
        500: 'Internal Server Error'
    },
    security=[{"Bearer": []}]
)
@api_view(['GET'])
def getEnrolledCourseVideo(req):
    user = getUser(req)
    try:
        if 'course_id' in req.query_params and 'lecture_id' in req.query_params:
            course_id = req.query_params['course_id']
            lecture_id = req.query_params['lecture_id']

            enrollment = Enrollment.objects.filter(
                user=user['id'], course_id=course_id).exists()
            if enrollment:
                objs = CourseLecture.objects.filter(
                    course_id=course_id, id=lecture_id)
            else:
                return Response({'msg': 'Not Enrolled in Course'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'msg': 'Course ID or Lecture ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if objs.exists():
            course = CourseLectureSeriallizer(objs, many=True)
            return Response(course.data, status=status.HTTP_200_OK)
        else:
            return Response({'msg': 'No Lecture Found'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'msg': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['post'], responses={200: CourseLectureSeriallizer(many=True)})
@api_view(['POST'])
def edit_course_video(request):
    try:
        user = getUser(request)  # Assuming `getUser` retrieves user info
        course_id = request.query_params.get('course_id')

        if course_id:
            objs = CourseLecture.objects.filter(user=user['id'], id=course_id)
        else:
            objs = CourseLecture.objects.filter(user=user['id'])

        if objs.exists():
            serializer = CourseLectureSeriallizer(objs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'msg': 'No Lecture Found'}, status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['get'], responses={200: CourseSeriallizer(many=True)})
@ api_view(['GET'])
def courselist(req):
    try:
        if 'course_id' in req.query_params:
            objs = Course.objects.filter(id=req.query_params['course_id'])
        else:
            objs = Course.objects.filter()
        print(objs)
        course = CourseSeriallizer(objs, many=True)
        return Response(course.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Course Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(methods=['get'], responses={200: CourseSeriallizer(many=True)})
@ api_view(['GET'])
def getSingleCourseDetail(req):

    try:
        if 'course_id' in req.query_params:
            objs = Course.objects.filter(
                id=req.query_params['course_id'])
        else:
            objs = Course.objects.filter()
        print(objs)
        course = CourseSeriallizer(objs, many=True)
        return Response(course.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No Course Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(methods=['get'], responses={200: SkillSeriallizer(many=True)})
@api_view(['GET'])
def allSkill(req):
    try:
        obj = Skill.objects.all()
        skills = SkillSeriallizer(obj, many=True)
        return Response(skills.data, status=status.HTTP_200_OK)
    except:
        return Response({'message': 'No skill found.'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(methods=['get'], responses={200: User_skillSerializer(many=True)})
@api_view(['GET'])
def getSkill(req):
    user = getUser(req)
    try:
        objs = User_skill.objects.filter(user=user['id'])
        skills = User_skillSerializer(objs, many=True)
        return Response(skills.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No skill Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(methods=['post'], request_body=User_skillSerializer, responses={201: User_skillSerializer})
@api_view(['POST'])
def addSkill(req):
    user = getUser(req)
    data = req.data.dict()
    data['user'] = user['id']
    serializer = User_skillSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['delete'], request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'skill_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='skill id'),
    }
), responses={200: openapi.Response(description='Skill has been deleted', schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
    'message': openapi.Schema(type=openapi.TYPE_STRING, description='message'),
})),
    404: openapi.Response(description='Skill record not found or does not belong to the user', schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
        'error': openapi.Schema(type=openapi.TYPE_STRING, description='error'),
    })),
    500: openapi.Response(description='Internal Server Error', schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
        'error': openapi.Schema(type=openapi.TYPE_STRING, description='error'),
    })),
})
@api_view(['DELETE'])
def delSkill(req):
    user = getUser(req)
    skill_id = req.data['skill_id']
    try:
        skill = User_skill.objects.get(skill=skill_id, user=user['id'])
        skill.delete()
        return Response({"message": "Skill has been deleted"}, status=status.HTTP_200_OK)
    except User_skill.DoesNotExist:
        return Response({"error": "Skill record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['get'], responses={200: SkillSeriallizer(many=True)})
@api_view(['GET'])
def allSkill(req):
    try:
        obj = Skill.objects.all()
        skills = SkillSeriallizer(obj, many=True)
        return Response(skills.data, status=status.HTTP_200_OK)
    except Skill.DoesNotExist:
        return Response({'message': 'No skill found.'}, status=status.HTTP_404_NOT_FOUND)


@ api_view(['GET'])
def allSkilladd(req):
    categories = [
        "Frontend Development",
        "Backend Development",
        "Full-Stack Development",
        "API Development",
        "Native App Development",
        "Hybrid App Development",
        "Data Analysis",
        "Machine Learning",
        "Big Data Analysis",
        "Ethical Hacking",
        "Network Security",
        "Security Analysis",
        "Cloud Computing",
        "Version Control",
        "Scrum",
        "Kanban",
        "Lean",
        "Project Management",
        "Continuous Integration/Continuous Deployment (CI/CD)",
        "Infrastructure as Code (IaC)",
        "Configuration Management",
        "Python",
        "JavaScript",
        "Java",
        "C#",
        "C++",
        "PHP",
        "Ruby",
        "Swift",
        "Kotlin",
        "Django",
        "React",
        "Angular",
        "Vue.js",
        "Node.js",
        "Unity",
        "TensorFlow",
        "PyTorch",
        "Print Design",
        "Web Design",
        "Branding & Logo Design",
        "UX/UI Design Principles",
        "Prototyping",
        "User Research",
        "Linear Editing",
        "Motion Graphics",
        "3D Modeling",
        "3D Animation",
        "Game Design",
        "Game Programming",
        "Game Art",
        "Music Production",
        "Content Writing",
        "Copywriting",
        "Editing & Proofreading",
        "Coding Bootcamps",
        "Coursera",
        "Udemy",
        "edX",
        "Pluralsight",
        "Codecademy",
        "LinkedIn Learning",
        "Webinars & Workshops",
        "W3Schools",
        "MDN Web Docs",
        "Stack Overflow",
        "Tutorialspoint",
        "GeeksforGeeks"
    ]
    for x in categories:
        skills = SkillSeriallizer(data={'name': x})
        if skills.is_valid():
            skills.save()
    return Response(skills.data, status=status.HTTP_200_OK)
    return Response({'message': 'No skill found.'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get skills of a user",
    responses={200: User_skillSerializer(many=True)}
)
@ api_view(['GET'])
def getSkill(req):
    user = getUser(req)
    try:
        objs = User_skill.objects.filter(user=user['id'])
        skills = User_skillSerializer(objs, many=True)
        return Response(skills.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No skill Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Add a skill to a user",
    request_body=User_skillSerializer,
    responses={201: User_skillSerializer, 400: 'Bad Request'}
)
@ api_view(['POST'])
def addSkill(req):
    user = getUser(req)
    data = req.data.dict()
    data['user'] = user['id']
    serializer = User_skillSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['delete'],
    operation_summary="Delete a skill",
    manual_parameters=[
        openapi.Parameter(
            'skill_id', openapi.IN_QUERY,
            description="Skill ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: openapi.Response(description="Skill has been deleted")}
)
@ api_view(['DELETE'])
def delSkill(req):
    user = getUser(req)
    skill_id = req.data['skill_id']
    try:
        skill = User_skill.objects.get(skill=skill_id, user=user['id'])
        skill.delete()
        return Response({"message": "Skill has been deleted"}, status=status.HTTP_200_OK)
    except User_skill.DoesNotExist:
        return Response({"error": "Skill record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get a course by ID",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: openapi.Response(description="Course found")}
)
@ api_view(['GET'])
def get_lectures(request):
    course_id = request.query_params.get('course_id')
    if not course_id:
        return Response({'error': 'Course ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lectures = CourseLecture.objects.filter(course_id=course_id)
        serializer = CourseLectureSeriallizer(lectures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CourseLecture.DoesNotExist:
        return Response({'error': 'Lectures not found'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get programs of students",
    responses={200: openapi.Response(description="Programs of students found")}
)
@ api_view(['GET'])
def getProgramStudent(req):
    with connection.cursor() as cursor:
        cursor.execute(
            f"select data_universityProgram.id,data_universityProgram.name, data_universityProgram.type , data_universityProgram.duration_year , data_universityProgram.duration_month , data_universityProgram.description , data_university.user_id, data_university.name , data_university.address from data_universityProgram , data_university where data_university.user_id = data_universityProgram.user_id")
        edus = cursor.fetchall()
        edus = [dict(zip(['id', 'name', 'type', 'duration_year', 'duration_month', 'description',
                     'university_id', 'university_name', 'university_address'], edu)) for edu in edus]
        return Response(edus, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get a course by ID",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: CourseSeriallizer, 404: 'Course not found'}
)
@api_view(['GET'])
def get_course_list_single(request):
    course_id = request.GET.get('course_id')
    courses = Course.objects.filter(id=course_id)
    response_data = []

    for course in courses:
        course_data = CourseSeriallizer(course).data
        # Check if the user is already enrolled
        is_enrolled = Enrollment.objects.filter(
            course=course, user=request.user).exists()
        course_data['is_enrolled'] = is_enrolled
        response_data.append(course_data)

    return Response(response_data)

# @api_view(['POST'])
# def course_enroll(request):
#     try:
#          course_id = request.GET.get('course_id')
#     except Course.DoesNotExist:
#         return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

#     # Get the user (assuming you have a way to retrieve the user from the request)
#     user = getUser(request)

#     # Check if the user is already enrolled in the course
#     if Enrollment.objects.filter(course=course_id, user=user).exists():
#         return Response({'detail': 'Already enrolled in this course.'}, status=status.HTTP_400_BAD_REQUEST)

#     # Enroll the user
#     enrollment = Enrollment.objects.create(course=course_id, user=user)
#     return Response({'detail': 'Successfully enrolled in the course.'}, status=status.HTTP_201_CREATED)


# @api_view(['GET'])
# def check_enrollment(request):
#     course_id = request.GET.get('course_id')
#     try:
#         course = Course.objects.get(id=course_id)
#     except Course.DoesNotExist:
#         return Response({'enrolled': False}, status=status.HTTP_404_NOT_FOUND)

#     user = getUser(request)

#     # Check if the user is enrolled in the course
#     is_enrolled = Enrollment.objects.filter(course=course, user=user).exists()

#     return Response({'enrolled': is_enrolled})

@swagger_auto_schema(
    methods=['post'],
    operation_summary="Enroll in a course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'course_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Course ID')
        }
    ),
    responses={201: 'Enrolled successfully.',
               400: 'Bad Request', 404: 'Course not found'},
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def course_enroll(request):
    # Use request.data to retrieve POST data
    course_id = request.data.get('course_id')
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user  # Assuming you have authentication middleware to get the user

    # Check if the user is already enrolled in the course
    if Enrollment.objects.filter(course=course, user=user).exists():
        return Response({'detail': 'Already enrolled in this course.'}, status=status.HTTP_400_BAD_REQUEST)
    print('++++++++++++++++++++++++++++++++++++++++++++')
    # Enroll the user
    enrollment = Enrollment.objects.create(course=course, user=user)
    return Response({'detail': 'Enrolled successfully.'}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Check if a user is enrolled in a course",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: openapi.Schema(
        type=openapi.TYPE_BOOLEAN, description='Enrollment status'), 404: 'Course not found'},
    security=[{"Bearer": []}]
)
@api_view(['GET'])
def check_enrollment(request):
    course_id = request.query_params.get('course_id')
    user = request.user

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user is enrolled in the course
    is_enrolled = Enrollment.objects.filter(course=course, user=user).exists()
    return Response({'enrolled': is_enrolled}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Get all enrolled users in a course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'role': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            'status': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            'sort_by': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ),
    responses={
        200: UserListSerializer(many=True),
        401: openapi.Response(description='Unauthorized user'),
        204: openapi.Response(description='No User Found')
    },
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def allUsers(req):
    user = getUser(req)
    data = req.data.dict()
    role = json.loads(data['role'])
    sta = json.loads(data['status'])
    print(role)
    if user['role'] != 'Admin':
        return Response({'msg': 'Unauthorized user.'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        objs = User.objects.filter(role__in=role, status__in=sta).exclude(role='').order_by(
            data['sort_by'])
        users = UserListSerializer(objs, many=True)
        return Response(users.data, status=status.HTTP_200_OK)
    except:
        return Response({'msg': 'No User Found'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Edit User Status",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'status': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ),
    responses={
        201: UserListSerializer(),
        400: openapi.Response(description='Bad Request')
    },
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def editStatus(req):
    user = getUser(req)
    data = req.data.dict()
    user = User.objects.get(id=data['id'])
    serializer = UserListSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get all enrolled users in a course",
    manual_parameters=[
        openapi.Parameter(
            'course_id', openapi.IN_QUERY,
            description="Course ID",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: UserSerializer(many=True), 404: 'Course not found'},
    security=[{"Bearer": []}]
)
@api_view(['GET'])
def get_enrolled_users(request):
    course_id = request.GET.get('course_id')
    if not course_id:
        return Response({"error": "Course ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        course = Course.objects.get(id=course_id)
        enrolled_users = Enrollment.objects.filter(course=course)
        users = [enrollment.user for enrollment in enrolled_users]
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=['delete'],
    operation_summary="Ban a user from a course",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'course_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Course ID'),
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID')
        }
    ),
    responses={204: 'User has been banned successfully.',
               400: 'Bad Request', 404: 'Course not found'},
    security=[{"Bearer": []}]
)
@api_view(['DELETE'])
def ban_user_from_course(request):
    course_id = request.data.get('course_id')
    user_id = request.data.get('user_id')

    if not course_id or not user_id:
        return Response({"error": "Course ID and User ID are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        enrollment = Enrollment.objects.get(
            course_id=course_id, user_id=user_id)
        enrollment.delete()
        return Response({"message": "User has been banned successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Enrollment.DoesNotExist:
        return Response({"error": "Enrollment not found"}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Add or Edit University Program Session",
    request_body=UniversityProgramSessionSerializer,
    responses={201: UniversityProgramSessionSerializer, 400: 'Bad Request'},
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def addEditSession(req):
    print('addEditSession')
    user = getUser(req)
    data = req.data.dict()
    if 'id' in data:
        obj = UniversityProgramSession.objects.get(id=data['id'])
        serializer = UniversityProgramSessionSerializer(
            obj, data=data, partial=True)
    else:
        serializer = UniversityProgramSessionSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['post'],
    operation_summary="Apply to University",
    request_body=ProgramApplicationSerializer,
    responses={201: ProgramApplicationSerializer, 400: 'Bad Request'},
    security=[{"Bearer": []}]
)
@api_view(['POST'])
def applyUniversity(req):
    user = getUser(req)
    data = req.data.dict()
    data['user'] = user['id']

    serializer = ProgramApplicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['get'],
    operation_summary="Get University Application",
    manual_parameters=[
        openapi.Parameter(
            'application_id', openapi.IN_PATH,
            description="ID of the application",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: 'University Application Data', 404: 'Not Found'},
    security=[{"Bearer": []}]
)
@api_view(['GET', 'POST'])
def unuiversityApplication(req, application_id):
    if req.method == 'GET':
        try:
            data = run_raw_sql(
                """
                SELECT
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
                data_programapplication.updated_at,
                CASE WHEN data_universityprogramsession.admission_end_date >= date('now') THEN true ELSE false END as editable
                FROM data_programapplication
                LEFT JOIN data_user
                ON data_programapplication.user_id = data_user.id
                LEFT JOIN data_universityprogramsession
                ON data_programapplication.session_id = data_universityprogramsession.id
                WHERE data_programapplication.id = %s
                """,
                [application_id]
            )

            educations = run_raw_sql(
                """
                SELECT
                data_education.id as education_id,
                data_edu_level.name as level,
                data_edu_degree.name as degree,
                data_edu_group_or_major.name as major,
                data_education.institute,
                data_education.passing_year,
                data_education.result_type,
                data_education.result,
                data_education.gpa,
                data_education.gpa_scale
                FROM data_education
                LEFT JOIN data_edu_level
                ON data_education.level_id = data_edu_level.id
                LEFT JOIN data_edu_degree
                ON data_education.degree_id = data_edu_degree.id
                LEFT JOIN data_edu_group_or_major
                ON data_education.group_id = data_edu_group_or_major.id
                WHERE data_education.user_id = %s
                ORDER BY data_education.level_id
                """,
                [data[0]['student_id']]
            )
            trainings = Training.objects.filter(user=data[0]['student_id'])
            experiences = Experience.objects.filter(user=data[0]['student_id'])
            trainings = TrainingSerializer(trainings, many=True).data
            experiences = ExperienceSeriallizer(experiences, many=True).data
            return Response({'applicant': data[0], 'educations': educations, 'trainings': trainings, 'experiences': experiences}, status=status.HTTP_200_OK)
        except ProgramApplication.DoesNotExist:
            return Response({'detail': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

    elif req.method == 'POST':
        try:
            obj = ProgramApplication.objects.get(id=application_id)
            serializer = ProgramApplicationSerializer(
                obj, data=req.data, partial=True)
        except ProgramApplication.DoesNotExist:
            return Response({'detail': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'detail': 'Method not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
