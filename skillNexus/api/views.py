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

from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
import traceback
from django.db.models import F
from django.db.models import Sum, Avg
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string, get_template
import os
from django.conf import settings
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.http import HttpResponse
from io import BytesIO
import uuid
from decimal import Decimal
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import time


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



# polash

@ api_view(['DELETE'])
def course_delete(req):
    
    experience_id = req.data['id']
    try:
        experience = Course.objects.get(id=experience_id)
        experience.delete()
        return Response({"message": "Experience has been deleted"}, status=status.HTTP_200_OK)
    except Experience.DoesNotExist:
        return Response({"error": "Experience record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






@ api_view(['DELETE'])
def lecture_delete(req):
    
    experience_id = req.data['id']
    try:
        experience = CourseLecture.objects.get(id=experience_id)
        experience.delete()
        return Response({"message": "Experience has been deleted"}, status=status.HTTP_200_OK)
    except Experience.DoesNotExist:
        return Response({"error": "Experience record not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_course_comments(request):
    course_id = request.query_params.get('course_id')
    print(f"Fetching comments for course: {course_id}")
    
    try:
        # Get all top-level comments (no parent) for the course
        comments = Comment.objects.filter(
            course_id=course_id,  # Changed from lecture_id to course_id
            parent=None
        ).select_related('user').prefetch_related('likes').order_by('-timestamp')
        
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching comments: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_comment(request):
    try:
        course_id = request.data.get('course_id')  # Changed from lecture_id
        content = request.data.get('content')
        parent_id = request.data.get('parent')

        # Validate required fields
        if not course_id or not content:
            return Response(
                {"error": "Both course_id and content are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create comment data
        comment_data = {
            'course_id': course_id,  # Changed from lecture_id
            'content': content,
            'user': request.user
        }

        # If there's a parent_id, add it to the comment data
        if parent_id:
            try:
                parent_comment = Comment.objects.get(id=parent_id)
                comment_data['parent'] = parent_comment
            except Comment.DoesNotExist:
                return Response(
                    {"error": "Parent comment not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )

        # Create the comment
        comment = Comment.objects.create(**comment_data)
        
        # Serialize and return the created comment
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Error creating comment:", str(e))  # Debug log
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['PUT'])
def edit_comment(request):
    try:
        comment_id = request.data.get('comment_id')
        new_content = request.data.get('content')
        comment = Comment.objects.get(id=comment_id, user=request.user)
        
        comment.content = new_content
        comment.edited = True
        comment.edited_at = timezone.now()
        comment.save()
        
        return Response({'message': 'Comment updated successfully'}, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_comment(request):
    try:
        comment_id = request.data.get('comment_id')
        comment = Comment.objects.get(id=comment_id, user=request.user)
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def like_comment(request):
    try:
        comment_id = request.data.get('comment_id')
        comment = Comment.objects.get(id=comment_id)
        
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
            liked = False
        else:
            comment.likes.add(request.user)
            liked = True
            
        return Response({
            'liked': liked,
            'like_count': comment.like_count()
        }, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_lecture_comments(request):
    print("=== DEBUG: get_lecture_comments ===")
    try:
        lecture_id = request.GET.get('lecture_id')
        print(f"DEBUG: Received lecture_id = {lecture_id}")
        
        if not lecture_id:
            print("DEBUG: No lecture_id provided")
            return Response({'error': 'Lecture ID is required'}, status=400)

        # Debug the query - using lecture instead of lecture_id
        comments = LectureComment.objects.filter(lecture__id=lecture_id).select_related('user', 'parent', 'lecture')
        print(f"DEBUG: SQL Query = {comments.query}")
        print(f"DEBUG: Comment Count = {comments.count()}")
        
        # Debug each comment
        for comment in comments:
            print(f"""
                DEBUG: Comment Details:
                ID: {comment.id}
                Content: {comment.content}
                User: {comment.user.username}
                Lecture: {comment.lecture.id}
                Parent ID: {comment.parent.id if comment.parent else 'None'}
                Timestamp: {comment.timestamp}
            """)

        serialized_comments = []
        for comment in comments:
            try:
                comment_data = {
                    'id': comment.id,
                    'content': comment.content,
                    'user_id': comment.user.id,
                    'username': comment.user.username,
                    'timestamp': comment.timestamp.strftime("%B %d, %Y %I:%M %p"),
                    'parent_id': comment.parent.id if comment.parent else None,
                    'is_reply': comment.parent is not None,
                    'like_count': comment.likes.count(),
                    'has_liked': comment.likes.filter(id=request.user.id).exists(),
                    'is_owner': comment.user.id == request.user.id,
                }
                serialized_comments.append(comment_data)
                print(f"DEBUG: Successfully serialized comment {comment.id}")
            except Exception as e:
                print(f"DEBUG: Error serializing comment {comment.id}: {str(e)}")
                import traceback
                print(f"DEBUG: Full error: {traceback.format_exc()}")
                continue

        print(f"DEBUG: Final serialized comments count = {len(serialized_comments)}")
        return Response(serialized_comments)
    
    except Exception as e:
        print(f"DEBUG: Critical error: {str(e)}")
        import traceback
        print(f"DEBUG: Full traceback: {traceback.format_exc()}")
        return Response(
            {'error': 'Failed to load comments', 'details': str(e)}, 
            status=500
        )


@api_view(['POST'])
def add_lecture_comment(request):
    try:
        lecture_id = request.data.get('lecture_id')
        content = request.data.get('content')
        parent_id = request.data.get('parent')  # ID of parent comment if this is a reply

        if not lecture_id or not content:
            return Response(
                {"error": "Both lecture_id and content are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the lecture
        lecture = CourseLecture.objects.get(id=lecture_id)
        
        # Prepare comment data
        comment_data = {
            'lecture': lecture,
            'course': lecture.course,
            'user': request.user,
            'content': content
        }

        # If this is a reply, add the parent comment
        if parent_id:
            try:
                parent_comment = LectureComment.objects.get(id=parent_id)
                comment_data['parent'] = parent_comment
            except LectureComment.DoesNotExist:
                return Response(
                    {"error": "Parent comment not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )

        # Create the comment
        comment = LectureComment.objects.create(**comment_data)
        
        # Serialize and return the new comment
        serializer = LectureCommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except CourseLecture.DoesNotExist:
        return Response(
            {"error": "Lecture not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['PUT'])
def edit_lecture_comment(request):
    try:
        comment_id = request.data.get('comment_id')
        new_content = request.data.get('content')
        comment = LectureComment.objects.get(id=comment_id, user=request.user)
        
        comment.content = new_content
        comment.edited = True
        comment.edited_at = timezone.now()
        comment.save()
        
        return Response({'message': 'Comment updated successfully'}, status=status.HTTP_200_OK)
    except LectureComment.DoesNotExist:
        return Response({'error': 'Comment not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_lecture_comment(request):
    try:
        comment_id = request.data.get('comment_id')
        comment = LectureComment.objects.get(id=comment_id, user=request.user)
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
    except LectureComment.DoesNotExist:
        return Response({'error': 'Comment not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def like_lecture_comment(request):
    try:
        comment_id = request.data.get('comment_id')
        comment = LectureComment.objects.get(id=comment_id)
        user = request.user

        if comment.likes.filter(id=user.id).exists():
            comment.likes.remove(user)
            liked = False
        else:
            comment.likes.add(user)
            liked = True

        return Response({
            'liked': liked,
            'like_count': comment.likes.count()
        }, status=status.HTTP_200_OK)
    except LectureComment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_assignment(request):
    try:
        # Get the file and data
        assignment_file = request.FILES.get('assignment_file')
        course_id = request.POST.get('course_id')
        lecture_id = request.POST.get('lecture_id')

        # Validate inputs
        if not all([assignment_file, course_id, lecture_id]):
            return Response({
                'error': 'Missing required fields'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate file type if needed
        allowed_types = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if hasattr(assignment_file, 'content_type') and assignment_file.content_type not in allowed_types:
            return Response({
                'error': 'Invalid file type. Please upload a PDF or Word document.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create or update submission
        submission, created = AssignmentSubmission.objects.update_or_create(
            user=request.user,
            course_id=course_id,
            lecture_id=lecture_id,
            defaults={
                'assignment_file': assignment_file,
                'submission_date': timezone.now(),
                'status': 0  # Reset status to 0 (pending) on resubmission
            }
        )

        return Response({
            'message': 'Assignment submitted successfully',
            'submission_id': submission.id,
            'file_url': request.build_absolute_uri(submission.assignment_file.url)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Assignment submission error: {str(e)}")  # Log the error
        return Response({
            'error': 'Failed to submit assignment. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assignments(request):
    try:
        course_id = request.GET.get('course_id')
        lecture_id = request.GET.get('lecture_id')
        
        print(f"Fetching assignments for course_id: {course_id}, lecture_id: {lecture_id}")  # Debug log

        submissions = AssignmentSubmission.objects.filter(
            course_id=course_id,
            lecture_id=lecture_id
        ).select_related('user')

        print(f"Found {submissions.count()} submissions")  # Debug log

        response_data = []
        for submission in submissions:
            print(f"Processing submission {submission.id} by user {submission.user.username}")  # Debug log
            submission_data = {
                'id': submission.id,
                'user_name': f"{submission.user.first_name} {submission.user.last_name}",
                'user_id': submission.user.id,
                'submission_date': submission.submission_date,
                'status': submission.status,
                'feedback': submission.feedback,
                'grade': submission.grade,
                'file_url': submission.assignment_file.url if submission.assignment_file else None
            }
            response_data.append(submission_data)

        print(f"Returning response data: {response_data}")  # Debug log
        return Response(response_data)

    except Exception as e:
        print(f"Error in get_assignments: {str(e)}")  # Debug log
        print(f"Full traceback: {traceback.format_exc()}")  # Full traceback
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_video_progress(request):
    try:
        # Log incoming data for debugging
        print("Received video progress data:", request.data)

        # Get and validate data
        lecture_id = request.data.get('lecture_id')
        watched_time = request.data.get('watched_time')
        video_duration = request.data.get('video_duration')

        # Validate all required fields are present
        if not all([lecture_id, watched_time is not None, video_duration is not None]):
            missing_fields = []
            if not lecture_id: missing_fields.append('lecture_id')
            if watched_time is None: missing_fields.append('watched_time')
            if video_duration is None: missing_fields.append('video_duration')
            
            return Response({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert to appropriate types
            lecture_id = int(lecture_id)
            watched_time = float(watched_time)
            video_duration = float(video_duration)
        except (ValueError, TypeError) as e:
            return Response({
                'error': 'Invalid data types',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate values are reasonable
        if watched_time < 0 or video_duration <= 0:
            return Response({
                'error': 'Invalid values',
                'details': 'watched_time and video_duration must be positive numbers'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get existing progress or None
        existing_progress = VideoProgress.objects.filter(
            user=request.user,
            lecture_id=lecture_id
        ).first()

        if existing_progress:
            # Only update if new watched_time is greater
            if watched_time > existing_progress.watched_time:
                existing_progress.watched_time = watched_time
                existing_progress.video_duration = video_duration
                existing_progress.save()
                progress = existing_progress
            else:
                progress = existing_progress
        else:
            # Create new progress record
            progress = VideoProgress.objects.create(
                user=request.user,
                lecture_id=lecture_id,
                watched_time=watched_time,
                video_duration=video_duration
            )

        return Response({
            'success': True,
            'progress': {
                'watched_time': progress.watched_time,
                'video_duration': progress.video_duration,
                'progress_percentage': (progress.watched_time / progress.video_duration) * 100
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("Video progress update error:", str(e))
        print("Traceback:", traceback.format_exc())
        return Response({
            'error': 'Server error',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_video_progress(request):
    try:
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({"error": "Course ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get all video progress for this user in this course
        video_progress = VideoProgress.objects.filter(
            user=request.user,
            lecture__course_id=course_id
        ).select_related('lecture')

        # Calculate total watch time (converting seconds to minutes)
        total_watch_time = video_progress.aggregate(
            total_time=Sum('watched_time')
        )['total_time'] or 0
        total_watch_time = round(total_watch_time / 60, 1)  # Convert to minutes

        # Get total lectures in course
        total_lectures = CourseLecture.objects.filter(course_id=course_id).count()

        # Count completed videos (90% or more watched)
        completed_videos = video_progress.filter(
            watched_time__gte=F('video_duration') * 0.9
        ).count()

        # Get recent activities
        recent_activities = video_progress.order_by('-last_updated')[:5].values(
            'lecture__title',
            'watched_time',
            'video_duration',
            'last_updated'
        )

        data = {
            'total_lectures': total_lectures,
            'completed_videos': completed_videos,
            'total_watch_time': total_watch_time,
            'completion_percentage': (completed_videos / total_lectures * 100) if total_lectures > 0 else 0,
            'recent_activities': list(recent_activities)
        }

        return Response(data)

    except Exception as e:
        print(f"Error in get_video_progress: {str(e)}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_assignment_progress(request):
    try:
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({"error": "Course ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get all submissions for this user in this course
        submissions = AssignmentSubmission.objects.filter(
            user=request.user,
            course_id=course_id
        ).select_related('lecture')

        # Calculate statistics
        total_submissions = submissions.count()
        graded_submissions = submissions.filter(status=1)
        avg_grade = graded_submissions.aggregate(Avg('grade'))['grade__avg'] or 0
        
        # Convert grade from 0-10 scale to 0-100 scale
        avg_grade = (avg_grade * 10)  # Convert to percentage

        # Format submission details
        submission_details = []
        for submission in submissions:
            submission_details.append({
                'lecture_title': submission.lecture.title,
                'submission_date': submission.submission_date,
                'status': submission.status,  # 0: Pending, 1: Graded
                'grade': submission.grade if submission.status == 1 else None,
                'feedback': submission.feedback if submission.status == 1 else None,
                'file_url': submission.assignment_file.url if submission.assignment_file else None
            })

        # Determine performance level based on average grade
        performance_level = "Bad"
        if avg_grade >= 90:
            performance_level = "Excellent"
        elif avg_grade >= 80:
            performance_level = "Good"
        elif avg_grade >= 70:
            performance_level = "Average"

        response_data = {
            'total_submissions': total_submissions,
            'graded_submissions': graded_submissions.count(),
            'pending_submissions': total_submissions - graded_submissions.count(),
            'avg_grade': round(avg_grade, 2),
            'performance_level': performance_level,
            'submissions': submission_details
        }

        return Response(response_data)

    except Exception as e:
        print(f"Error in get_assignment_progress: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_course_messages(request):
    try:
        course_id = request.GET.get('course_id')
        print(f"Received request for course_id: {course_id}")  # Debug print
        
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=400)
        
        # Convert course_id to integer
        try:
            course_id = int(course_id)
        except ValueError:
            return Response({'error': 'Invalid course ID format'}, status=400)
            
        course = get_object_or_404(Course, id=course_id)
        messages = CourseMessage.objects.filter(course=course).order_by('timestamp')
        
        print(f"Found {messages.count()} messages for course {course_id}")  # Debug print
        
        serializer = CourseMessageSerializer(messages, many=True)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    except Exception as e:
        print(f"Error in get_course_messages: {str(e)}")  # Debug print
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_course_message(request):
    try:
        print(f"Received data: {request.data}")  # Debug print
        
        # Handle both JSON and form data
        if isinstance(request.data, str):
            data = json.loads(request.data)
        else:
            data = request.data.copy()
            
        course_id = data.get('course_id')
        content = data.get('content')
        
        print(f"Parsed course_id: {course_id}, content: {content}")  # Debug print
        
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=400)
        if not content:
            return Response({'error': 'Message content is required'}, status=400)
        
        # Convert course_id to integer if it's a string
        try:
            course_id = int(course_id)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid course ID format'}, status=400)
        
        course = get_object_or_404(Course, id=course_id)
        
        # Create message with receiver automatically set to course educator
        message = CourseMessage.objects.create(
            sender=request.user,
            course=course,
            content=content.strip()
        )
        
        serializer = CourseMessageSerializer(message)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error in send_course_message: {str(e)}")  # Debug print
        return Response({'error': str(e)}, status=400)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_educator_messages(request):
    """Get all messages for a course that the educator owns"""
    try:
        course_id = request.GET.get('course_id')
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=400)
        
        # Verify the user is the course educator
        course = get_object_or_404(Course, id=course_id)
        if course.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)
            
        # Get all messages for this course
        messages = CourseMessage.objects.filter(course=course).select_related('sender')
        
        # Mark messages as read
        messages.filter(is_read=False).update(is_read=True)
        
        serializer = CourseMessageSerializer(messages, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def educator_reply_message(request):
    """Send a reply from educator to a student"""
    try:
        course_id = request.data.get('course_id')
        student_id = request.data.get('student_id')
        content = request.data.get('content')
        
        if not all([course_id, student_id, content]):
            return Response({'error': 'Course ID, student ID and content are required'}, status=400)
        
        # Verify the user is the course educator
        course = get_object_or_404(Course, id=course_id)
        if course.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)
            
        # Verify the student exists and has sent messages in this course
        student = get_object_or_404(User, id=student_id)
        if not CourseMessage.objects.filter(course=course, sender=student).exists():
            return Response({'error': 'Invalid student'}, status=400)
            
        # Create the reply message
        message = CourseMessage.objects.create(
            sender=request.user,
            course=course,
            content=content.strip()
        )
        
        serializer = CourseMessageSerializer(message)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_internship(request):
    """Create a new internship offer"""
    try:
        # Debug prints
        print("=== Debug create_internship ===")
        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User: {request.user}")
        print(f"Request data: {request.data}")
        
        # Validate that the user is a university
        if request.user.role != 'University':
            return Response(
                {'error': 'Only universities can create internship offers'}, 
                status=403
            )

        # Get skills from request data
        skills_ids = request.data.getlist('skills[]') if hasattr(request.data, 'getlist') else request.data.get('skills', [])
        print(f"Received skills: {skills_ids}")
        
        # Create internship without skills first
        data = request.data.copy()
        data['university'] = request.user.id
        data['status'] = InternshipOffer.STATUS_ACTIVE
        
        serializer = InternshipOfferSerializer(data=data)
        if serializer.is_valid():
            internship = serializer.save()
            
            # Add skills to the internship
            if skills_ids:
                try:
                    skills = Skill.objects.filter(id__in=skills_ids)
                    internship.skills_required.set(skills)
                    print(f"Added skills: {list(skills.values_list('name', flat=True))}")
                except Exception as e:
                    print(f"Error adding skills: {str(e)}")
            
            # Return the created internship with skills
            return Response(InternshipOfferSerializer(internship).data)
            
        return Response(serializer.errors, status=400)

    except Exception as e:
        print(f"Error in create_internship: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def list_internships(request):
    try:
        # Get query parameters
        university_id = request.GET.get('university_id')
        active_only = request.GET.get('active_only', 'true').lower() == 'true'
        
        # Debug prints
        print("=== Debug list_internships ===")
        print(f"User: {request.user}")
        print(f"University ID param: {university_id}")
        print(f"Active only: {active_only}")
        
        # Build the query
        query = Q()
        
        # If no university_id provided, use current user's ID
        if university_id:
            query &= Q(university_id=university_id)
        elif request.user.is_authenticated:
            query &= Q(university_id=request.user.id)
            
        # Get all internships matching the base query
        internships = InternshipOffer.objects.filter(query)
        
        # Update status for expired internships
        today = timezone.now().date()
        for internship in internships:
            if internship.status != InternshipOffer.STATUS_CLOSED:  # Don't change status of manually closed internships
                if internship.application_deadline < today:
                    internship.status = InternshipOffer.STATUS_ENDED
                    internship.save()
        
        # Apply active only filter if requested
        if active_only:
            internships = internships.filter(status=InternshipOffer.STATUS_ACTIVE)
        
        # Order by created date
        internships = internships.order_by('-created_at')
        
        print(f"Found {internships.count()} internships")
        print(f"Internships: {list(internships.values())}")
        
        serializer = InternshipOfferSerializer(internships, many=True)
        return Response(serializer.data)

    except Exception as e:
        print(f"Error in list_internships: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response(
            {'error': 'Failed to fetch internship offers'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_internship(request):
    try:
        internship_id = request.data.get('id')
        internship = InternshipOffer.objects.get(id=internship_id, university=request.user)
        
        serializer = InternshipOfferSerializer(
            internship, 
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except InternshipOffer.DoesNotExist:
        return Response(
            {'error': 'Internship not found or unauthorized'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error in update_internship: {str(e)}")
        return Response(
            {'error': 'Failed to update internship offer'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_internship(request):
    try:
        internship_id = request.data.get('id')
        internship = InternshipOffer.objects.get(id=internship_id, university=request.user)
        internship.delete()
        return Response(
            {'message': 'Internship offer deleted successfully'}, 
            status=status.HTTP_200_OK
        )

    except InternshipOffer.DoesNotExist:
        return Response(
            {'error': 'Internship not found or unauthorized'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error in delete_internship: {str(e)}")
        return Response(
            {'error': 'Failed to delete internship offer'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """Endpoint to verify JWT token validity"""
    return Response({
        'valid': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'role': request.user.role
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_internship(request):
    """Apply for an internship"""
    try:
        internship_id = request.data.get('internship_id')
        
        if not internship_id:
            return Response({
                'error': 'Internship ID is required'
            }, status=400)
            
        # Verify the internship exists and is active
        internship = get_object_or_404(InternshipOffer, id=internship_id)
        if internship.status != InternshipOffer.STATUS_ACTIVE:
            return Response({
                'error': 'This internship is no longer accepting applications'
            }, status=400)
            
        # Check if user has already applied
        if InternshipApplication.objects.filter(
            student=request.user,
            internship=internship
        ).exists():
            return Response({
                'error': 'You have already applied for this internship'
            }, status=400)
        
        # Create the application
        application = InternshipApplication.objects.create(
            student=request.user,
            internship=internship
        )
        
        # Handle optional file uploads
        if 'resume' in request.FILES:
            application.resume = request.FILES['resume']
        if 'cv' in request.FILES:
            application.cv = request.FILES['cv']
        
        if application.resume or application.cv:
            application.save()
            
        return Response({
            'message': 'Application submitted successfully',
            'application_id': application.id
        })
        
    except Exception as e:
        print(f"Error in apply_internship: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_internship_applications(request):
    """Get applications for a specific internship (for university users)"""
    try:
        internship_id = request.GET.get('internship_id')
        if not internship_id:
            return Response({'error': 'Internship ID is required'}, status=400)
            
        # Verify the user owns this internship
        internship = get_object_or_404(
            InternshipOffer, 
            id=internship_id,
            university=request.user
        )
        
        # Get all applications for this internship
        applications = InternshipApplication.objects.filter(
            internship=internship
        ).select_related('student')
        
        # Serialize the applications
        serializer = InternshipApplicationSerializer(applications, many=True)
        
        # Add additional profile data for each application
        data = []
        for app_data in serializer.data:
            student = User.objects.get(id=app_data['student'])
            university = student.university
            university_name = f"{university.first_name} {university.last_name}".strip() or university.username
            
            app_data['profile_data'] = {
                'education': list(student.education_set.values()),
                'experience': list(student.experience_set.values()),
                'training': list(student.training_set.values()),
                'skills': list(student.user_skill_set.values('skill__name'))
            }
            data.append(app_data)
            
        return Response({
            'internship': {
                'id': internship.id,
                'title': internship.title,
                'total_applications': len(data)
            },
            'applicants': data
        })
        
    except Exception as e:
        print(f"Error in get_internship_applications: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def list_student_internships(request):
    """List all active internship offers for students with filtering options"""
    try:
        print("=== Debug list_student_internships ===")
        print(f"Request method: {request.method}")
        print(f"Query params: {request.GET}")
        
        # Get query parameters
        search_term = request.GET.get('search', '')
        sort_by = request.GET.get('sort_by', '-created_at')
        
        print(f"Filters: search={search_term}, sort_by={sort_by}")
        
        # Start with all active internships and join with University and skills
        queryset = InternshipOffer.objects.filter(status=1).select_related(
            'university',
            'university__university'
        ).prefetch_related(
            'skills_required'  # Prefetch the skills
        )
        
        print(f"Initial queryset count: {queryset.count()}")
            
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(requirements__icontains=search_term) |
                Q(skills_required__name__icontains=search_term)  # Search in skills too
            ).distinct()  # Add distinct to avoid duplicates
            print(f"After search filter: {queryset.count()}")
            
        # Order by sort parameter
        if sort_by:
            queryset = queryset.order_by(sort_by)
        
        # Process results with skills
        results = []
        for internship in queryset:
            internship_data = InternshipOfferSerializer(internship).data
            # Get skills directly from the prefetched data
            skills = [{'id': skill.id, 'name': skill.name} for skill in internship.skills_required.all()]
            internship_data['skills_required'] = skills
            results.append(internship_data)
        
        response_data = {
            'count': len(results),
            'results': results
        }
        
        print(f"Final response count: {response_data['count']}")
        if results:
            print(f"Sample skills: {results[0]['skills_required']}")
        print("================================")
        
        return Response(response_data)
        
    except Exception as e:
        print(f"Error in list_student_internships: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_university_internships(request):
    """List internship offers for a university"""
    try:
        print("=== Debug list_university_internships ===")
        print(f"Request method: {request.method}")
        print(f"Query params: {request.GET}")
        
        # Verify the user is a university
        if request.user.role != 'University':
            return Response(
                {'error': 'Only universities can view their internship offers'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get query parameters
        search_term = request.GET.get('search', '')
        status_param = request.GET.get('status')
        sort_by = request.GET.get('sort_by', '-created_at')
        
        print(f"Filters: search={search_term}, status={status_param}, sort_by={sort_by}")
        
        # Get internships for this university
        queryset = InternshipOffer.objects.filter(university=request.user)
        print(f"Initial queryset count: {queryset.count()}")
            
        # Convert status to integer if provided
        if status_param and status_param.strip():
            try:
                status_int = int(status_param)
                queryset = queryset.filter(status=status_int)
                print(f"After status filter: {queryset.count()}")
            except (ValueError, TypeError):
                print(f"Invalid status value: {status_param}")
            
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(requirements__icontains=search_term)
            )
            print(f"After search filter: {queryset.count()}")
            
        # Order by sort parameter
        if sort_by:
            queryset = queryset.order_by(sort_by)
            
        # Include related data
        queryset = queryset.prefetch_related('skills_required')
        
        # Serialize the data
        serializer = InternshipOfferSerializer(queryset, many=True)
        
        response_data = {
            'count': queryset.count(),
            'results': serializer.data
        }
        print(f"Final response count: {response_data['count']}")
        print("================================")
        
        return Response(response_data)
        
    except Exception as e:
        print(f"Error in list_university_internships: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_applications(request):
    """Get all internship applications for the current student"""
    try:
        # Get all applications for this student
        applications = InternshipApplication.objects.filter(
            student=request.user
        ).select_related('internship', 'internship__university')
        
        # Serialize the data
        data = []
        for application in applications:
            university = application.internship.university
            university_name = f"{university.first_name} {university.last_name}".strip() or university.username
            
            app_data = {
                'id': application.id,
                'internship': {
                    'id': application.internship.id,
                    'title': application.internship.title,
                    'university_name': university_name,
                    'location': application.internship.location,
                    'stipend': application.internship.stipend,
                    'duration_months': application.internship.duration_months,
                    'application_deadline': application.internship.application_deadline,
                },
                'status': application.status,
                'applied_date': application.applied_at,
                'resume_url': request.build_absolute_uri(application.resume.url) if application.resume else None,
                'cv_url': request.build_absolute_uri(application.cv.url) if application.cv else None,
            }
            data.append(app_data)
            
        return Response(data)
        
    except Exception as e:
        print(f"Error in get_student_applications: {str(e)}")
        return Response({'error': str(e)}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_application_count(request, internship_id):
    try:
        # First check if the internship exists and belongs to the requesting university
        internship = get_object_or_404(InternshipOffer, 
                                     id=internship_id, 
                                     university=request.user)
        
        # Count applications for this internship
        count = InternshipApplication.objects.filter(
            internship=internship
        ).count()
        
        print(f"Found {count} applications for internship {internship_id}")  # Debug log
        return Response({'count': count})
        
    except InternshipOffer.DoesNotExist:
        return Response(
            {'error': 'Internship not found or access denied'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error in get_application_count: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_applicants(request, internship_id):
    try:
        # Get all applications for this internship
        applications = InternshipApplication.objects.filter(internship_id=internship_id)
        
        applicants_data = []
        for application in applications:
            # Get student details
            student = application.student
            student_data = UserSerializer(student).data
            
            # Get education details with related data
            education = Education.objects.filter(user=student).select_related('level', 'degree', 'group')
            education_data = []
            for edu in education:
                edu_dict = {
                    'institute': edu.institute,
                    'passing_year': edu.passing_year,
                    'result_type': edu.result_type,
                    'result': edu.result,
                    'gpa': edu.gpa,
                    'gpa_scale': edu.gpa_scale,
                    'level': {
                        'id': edu.level.id,
                        'name': edu.level.name
                    },
                    'degree': {
                        'id': edu.degree.id,
                        'name': edu.degree.name
                    },
                    'group': {
                        'id': edu.group.id,
                        'name': edu.group.name
                    }
                }
                education_data.append(edu_dict)
            
            # Get experience details
            experience = Experience.objects.filter(user=student)
            experience_data = ExperienceSeriallizer(experience, many=True).data
            
            # Get skills data
            user_skills = User_skill.objects.filter(user=student).select_related('skill')
            skills_data = [{'id': us.skill.id, 'name': us.skill.name} for us in user_skills]
            student_data['skills'] = skills_data
            
            # Combine all data
            applicant_data = {
                'application_id': application.id,
                'student': student_data,
                'education': education_data,
                'experience': experience_data,
                'status': application.status,
                'applied_date': application.applied_at,
                'cv': application.cv.url if application.cv else None,
                'resume': application.resume.url if application.resume else None
            }
            applicants_data.append(applicant_data)
        
        return Response({
            'internship_id': internship_id,
            'applicants': applicants_data
        })
        
    except Exception as e:
        print(f"Error in view_applicants: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_application_status(request):
    """Update the status of an internship application"""
    try:
        application_id = request.data.get('application_id')
        new_status = request.data.get('status')
        
        if not application_id or new_status is None:
            return Response({
                'error': 'Application ID and status are required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Get the application
        application = get_object_or_404(InternshipApplication, id=application_id)
        
        # Verify the user is the internship owner
        if application.internship.university != request.user:
            return Response({
                'error': 'You do not have permission to update this application'
            }, status=status.HTTP_403_FORBIDDEN)
            
        # Update the status
        application.status = new_status
        application.save()
        
        return Response({
            'message': 'Application status updated successfully',
            'application_id': application.id,
            'new_status': new_status
        })
        
    except Exception as e:
        print(f"Error in update_application_status: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_internship_details(request, internship_id):
    try:
        internship = get_object_or_404(InternshipOffer, id=internship_id)
        data = {
            'id': internship.id,
            'title': internship.title,
            'description': internship.description,
            'requirements': internship.requirements,
            'duration_months': internship.duration_months,
            'stipend': internship.stipend,
            'location': internship.location,
            'positions_available': internship.positions_available,
            'application_deadline': internship.application_deadline,
            'start_date': internship.start_date,
            'status': internship.status,
            'created_at': internship.created_at,
            'university': internship.university.id,
            'university_name': internship.university.university.name if hasattr(internship.university, 'university') else None,
            'skills_required': [{'id': skill.id, 'name': skill.name} for skill in internship.skills_required.all()]
        }
        return Response(data)
    except Exception as e:
        print(f"Error in get_internship_details: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_university_details(request, university_id):
    try:
        university_user = get_object_or_404(User, id=university_id)
        university = get_object_or_404(University, user=university_user)
        data = {
            'id': university_user.id,
            'Name': university.name,
            'address': university.address,
            'description': university.description,
            'url': university.url
        }
        return Response(data)
    except Exception as e:
        print(f"Error in get_university_details: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request):
    try:
        # Get course details
        course_id = request.data.get('course_id')
        course = Course.objects.get(id=course_id)
        
        # Create payment data
        payment_data = {
            'sender': request.user.id,
            'receiver': course.user.id,
            'amount': course.course_fee,
            'card_number': request.data.get('card_number'),
            'card_expiry': request.data.get('card_expiry'),
            'card_cvv': request.data.get('card_cvv'),
            'course_id': course_id,
            'transaction_id': str(uuid.uuid4())
        }
        
        # Validate payment data
        serializer = PaymentSerializer(data=payment_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # In a real application, you would integrate with a payment gateway here
        # For demo purposes, we'll simulate a successful payment
        payment = serializer.save()
        payment.status = 'completed'
        payment.save()
        
        # Enroll the student in the course
        enrollment = Enrollment.objects.create(
            user=request.user,
            course_id=course_id
        )
        
        return Response({
            'message': 'Payment successful',
            'payment_id': payment.id,
            'transaction_id': payment.transaction_id
        }, status=status.HTTP_200_OK)
        
    except Course.DoesNotExist:
        return Response({
            'error': 'Course not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_course_reviews(request):
    """Get all reviews for a course"""
    try:
        course_id = request.GET.get('course_id')
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=400)

        reviews = CourseReview.objects.filter(course_id=course_id)
        
        # Calculate average rating
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        avg_rating = round(avg_rating, 1) if avg_rating else 0
        
        # Get rating distribution
        rating_distribution = {
            i: reviews.filter(rating=i).count() for i in range(1, 6)
        }
        
        # Check if current user has reviewed
        has_reviewed = False
        if request.user.is_authenticated:
            has_reviewed = reviews.filter(user=request.user).exists()

        serializer = CourseReviewSerializer(reviews, many=True, context={'request': request})
        
        return Response({
            'reviews': serializer.data,
            'average_rating': avg_rating,
            'rating_distribution': rating_distribution,
            'total_reviews': reviews.count(),
            'has_reviewed': has_reviewed
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course_review(request):
    """Add a new review for a course"""
    try:
        course_id = request.data.get('course_id')
        rating = request.data.get('rating')
        review_text = request.data.get('review_text')

        if not all([course_id, rating, review_text]):
            return Response({'error': 'All fields are required'}, status=400)

        # Check if user is enrolled in the course
        if not Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response({'error': 'You must be enrolled in the course to review it'}, status=403)

        # Check if user has already reviewed
        if CourseReview.objects.filter(user=request.user, course_id=course_id).exists():
            return Response({'error': 'You have already reviewed this course'}, status=400)

        review = CourseReview.objects.create(
            user=request.user,
            course_id=course_id,
            rating=rating,
            review_text=review_text
        )

        serializer = CourseReviewSerializer(review, context={'request': request})
        return Response(serializer.data, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_course_review(request):
    """Edit an existing course review"""
    try:
        review_id = request.data.get('review_id')
        rating = request.data.get('rating')
        review_text = request.data.get('review_text')

        if not all([review_id, rating, review_text]):
            return Response({'error': 'All fields are required'}, status=400)

        review = CourseReview.objects.get(id=review_id, user=request.user)
        review.rating = rating
        review.review_text = review_text
        review.save()

        serializer = CourseReviewSerializer(review, context={'request': request})
        return Response(serializer.data)
    except CourseReview.DoesNotExist:
        return Response({'error': 'Review not found or you are not the owner'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_course_review(request):
    """Delete a course review"""
    try:
        review_id = request.data.get('review_id')
        if not review_id:
            return Response({'error': 'Review ID is required'}, status=400)

        review = CourseReview.objects.get(id=review_id, user=request.user)
        review.delete()
        return Response({'message': 'Review deleted successfully'})
    except CourseReview.DoesNotExist:
        return Response({'error': 'Review not found or you are not the owner'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_assignment(request):
    try:
        submission_id = request.data.get('id')
        grade = request.data.get('grade')
        feedback = request.data.get('feedback')
        submission_status = request.data.get('status')  # Renamed from status to submission_status

        # Validate inputs
        if not all([submission_id, grade, feedback, submission_status]):
            return Response({
                'error': 'Missing required fields'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get the submission
        submission = AssignmentSubmission.objects.get(id=submission_id)

        # Update submission
        submission.grade = grade
        submission.feedback = feedback
        submission.status = submission_status
        submission.save()

        return Response({
            'message': 'Assignment feedback updated successfully',
            'submission': {
                'id': submission.id,
                'grade': submission.grade,
                'feedback': submission.feedback,
                'status': submission.status
            }
        }, status=status.HTTP_200_OK)

    except AssignmentSubmission.DoesNotExist:
        return Response({
            'error': 'Assignment submission not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error updating assignment feedback: {str(e)}")
        return Response({
            'error': 'Failed to update assignment feedback'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_instructor_details(request):
    try:
        course_id = request.GET.get('course_id')
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=400)

        # Get course and instructor
        course = Course.objects.get(id=course_id)
        instructor = User.objects.get(id=course.user_id)

        # Get instructor's education details
        education = Education.objects.filter(user=instructor).select_related('level', 'degree', 'group')
        education_data = [{
            'degree_name': edu.degree.name,
            'level_name': edu.level.name,
            'group_name': edu.group.name,
            'institute': edu.institute,
            'passing_year': edu.passing_year,
            'gpa': float(edu.gpa) if edu.gpa else None,
            'gpa_scale': float(edu.gpa_scale) if edu.gpa_scale else None
        } for edu in education]

        # Get instructor's experience
        experience = Experience.objects.filter(user=instructor)
        experience_data = [{
            'designation': exp.designation,
            'organisation_name': exp.organisation_name,
            'location': exp.location,
            'start_date': exp.start_date,
            'end_date': exp.end_date
        } for exp in experience]

        # Get instructor's training
        training = Training.objects.filter(user=instructor)
        training_data = [{
            'title': train.title,
            'institution_name': train.institution_name,
            'country': train.country,
            'start_date': train.start_date,
            'end_date': train.end_date
        } for train in training]

        # Prepare response data
        instructor_data = {
            'first_name': instructor.first_name,
            'last_name': instructor.last_name,
            'email': instructor.email,
            'mobile': instructor.mobile,
            'bio': instructor.bio,
            'role': instructor.role,
            'profile_picture': instructor.profile_picture.url if instructor.profile_picture else None,
            'education': education_data,
            'experience': experience_data,
            'training': training_data
        }

        return Response(instructor_data)

    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    except User.DoesNotExist:
        return Response({'error': 'Instructor not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([])  # Allow public access
def get_public_user_stats(request):
    try:
        stats = {
            'student_count': User.objects.filter(role='Student').count(),
            'educator_count': User.objects.filter(role='Educator').count(),
            'university_count': User.objects.filter(role='University').count(),
            'freelancer_count': User.objects.filter(role='Freelancer').count(),
            'employer_count': User.objects.filter(role='Employer').count()
        }
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([])
def get_public_course_stats(request):
    try:
        courses = Course.objects.all()[:5]  # Get 5 latest courses
        course_data = [{
            'title': course.title,
            'course_outcome': course.course_outcome,
            'course_fee': float(course.course_fee)
        } for course in courses]
        
        return Response({
            'total_courses': Course.objects.count(),
            'popular_courses': course_data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([])
def get_public_internships(request):
    try:
        internships = InternshipOffer.objects.filter(
            status=InternshipOffer.STATUS_ACTIVE
        ).order_by('-created_at')[:5]
        
        internship_data = [{
            'title': internship.title,
            'location': internship.location,
            'duration_months': internship.duration_months,
            'stipend': float(internship.stipend) if internship.stipend else None
        } for internship in internships]
        
        return Response({
            'total_internships': InternshipOffer.objects.filter(status=InternshipOffer.STATUS_ACTIVE).count(),
            'recent_internships': internship_data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


def cv_view(request):
    user = request.user
    
    # Get education details with related data
    education = Education.objects.filter(user=user).select_related('level', 'degree', 'group')
    
    # Get experience details
    experiences = Experience.objects.filter(user=user)
    
    # Get skills
    user_skills = User_skill.objects.filter(user=user).select_related('skill')
    skills = [us.skill for us in user_skills]
    
    # Get personal details
    try:
        personal_details = PersonalDetails.objects.get(id=user)
    except PersonalDetails.DoesNotExist:
        personal_details = None
    
    context = {
        'user': user,
        'education': education,
        'experiences': experiences,
        'skills': skills,
        'personal_details': personal_details,
    }
    
    return render(request, 'cv_view.php', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Add this to ensure user is logged in
def cv_view(request):
    user = request.user
    
    # Get personal details
    try:
        personal_details = PersonalDetails.objects.get(id_id=user.id)
    except PersonalDetails.DoesNotExist:
        personal_details = None
        
    # Get education with related data
    education = Education.objects.filter(user=user).select_related('level', 'degree', 'group').order_by('-passing_year')
    
    # Get experience
    experiences = Experience.objects.filter(user=user).order_by('-start_date')
    
    # Get skills with related skill names
    skills = User_skill.objects.filter(user=user).select_related('skill')
    
    context = {
        'user': user,
        'personal_details': personal_details,
        'education': education,
        'experiences': experiences,
        'skills': skills
    }
    return render(request, 'cv_view.php', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_course_enrolled_students(request):
    course_id = request.GET.get('course_id')
    if not course_id:
        return Response({'error': 'Course ID is required'}, status=400)

    # Verify the educator owns the course
    course = Course.objects.get(id=course_id)
    if course.user.id != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)

    # Get enrolled students
    enrollments = Enrollment.objects.filter(course_id=course_id)
    students = [enrollment.user for enrollment in enrollments]
    
    # Serialize student data
    student_data = []
    for student in students:
        student_data.append({
            'id': student.id,
            'username': student.username,
            'first_name': student.first_name,
            'last_name': student.last_name,
            'profile_picture': student.profile_picture.url if student.profile_picture else None
        })
    
    return Response(student_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_video_progress(request):
    course_id = request.GET.get('course_id')
    student_id = request.GET.get('student_id')
    
    if not course_id or not student_id:
        return Response({'error': 'Course ID and Student ID are required'}, status=400)

    # Verify the educator owns the course
    course = Course.objects.get(id=course_id)
    if course.user.id != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)

    # Get all lectures for the course
    lectures = CourseLecture.objects.filter(course_id=course_id)
    total_lectures = lectures.count()
    
    # Get video progress for the student
    video_progress = VideoProgress.objects.filter(
        user_id=student_id,
        lecture__course_id=course_id
    )
    
    # Calculate completion metrics
    completed_videos = sum(1 for vp in video_progress if vp.watched_time >= 0.9 * vp.video_duration)
    total_watch_time = sum(vp.watched_time for vp in video_progress)
    completion_percentage = (completed_videos / total_lectures * 100) if total_lectures > 0 else 0
    
    # Get detailed progress for each video
    video_progress_data = []
    for lecture in lectures:
        progress = video_progress.filter(lecture=lecture).first()
        if progress:
            video_progress_data.append({
                'lecture_title': lecture.title,
                'watched_time': progress.watched_time,
                'video_duration': progress.video_duration
            })
        else:
            video_progress_data.append({
                'lecture_title': lecture.title,
                'watched_time': 0,
                'video_duration': 0
            })
    
    return Response({
        'completion_percentage': completion_percentage,
        'completed_videos': completed_videos,
        'total_lectures': total_lectures,
        'total_watch_time': total_watch_time / 60,  # Convert to minutes
        'video_progress': video_progress_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_assignment_progress(request):
    course_id = request.GET.get('course_id')
    student_id = request.GET.get('student_id')
    
    if not course_id or not student_id:
        return Response({'error': 'Course ID and Student ID are required'}, status=400)

    # Verify the educator owns the course
    course = Course.objects.get(id=course_id)
    if course.user.id != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)

    # Get all assignments submitted by the student
    submissions = AssignmentSubmission.objects.filter(
        user_id=student_id,
        course_id=course_id
    ).order_by('-submission_date')
    
    # Calculate metrics
    total_submissions = submissions.count()
    graded_submissions = submissions.filter(status=1)
    avg_grade = graded_submissions.aggregate(Avg('grade'))['grade__avg'] or 0
    
    # Determine performance level
    if avg_grade >= 90:
        performance_level = 'Excellent'
    elif avg_grade >= 80:
        performance_level = 'Very Good'
    elif avg_grade >= 70:
        performance_level = 'Good'
    elif avg_grade >= 60:
        performance_level = 'Fair'
    else:
        performance_level = 'Needs Improvement'
    
    # Prepare submission data
    submission_data = []
    for submission in submissions:
        submission_data.append({
            'lecture_title': submission.lecture.title,
            'submission_date': submission.submission_date,
            'status': submission.status,
            'grade': submission.grade,
            'feedback': submission.feedback
        })
    
    return Response({
        'total_submissions': total_submissions,
        'avg_grade': avg_grade,
        'performance_level': performance_level,
        'submissions': submission_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_certificate_eligibility(request, course_id):
    """Check if a user is eligible for a course certificate."""
    try:
        # First verify the course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
        # Initialize counters
        total_lectures = 0
        completed_videos = 0
        total_assignments = 0
        completed_assignments = 0
        
        # Get course completion data
        lectures = CourseLecture.objects.filter(course_id=course_id)
        total_lectures = lectures.count()
        
        # Get video progress
        for lecture in lectures:
            try:
                video_progress = VideoProgress.objects.filter(
                    user=request.user,
                    lecture=lecture
                ).first()
                
                if video_progress and video_progress.video_duration and video_progress.video_duration > 0:
                    if video_progress.watched_time >= 0.9 * video_progress.video_duration:
                        completed_videos += 1
            except Exception as e:
                print(f"Error checking video progress for lecture {lecture.id}: {str(e)}")
                continue
        
        # Get assignment progress
        try:
            # Get all submissions for this course by the user
            submissions = AssignmentSubmission.objects.filter(
                user=request.user,
                course_id=course_id
            )
            total_assignments = submissions.count()
            completed_assignments = submissions.filter(status=1).count()  # Status 1 means reviewed/completed
        except Exception as e:
            print(f"Error checking assignments: {str(e)}")
            total_assignments = 0
            completed_assignments = 0
        
        # Calculate eligibility
        # First check if there are any lectures
        if total_lectures == 0:
            return Response({
                'error': 'No lectures found in this course'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check video completion
        is_eligible = completed_videos == total_lectures
        
        # Only check assignment completion if there are assignments
        if total_assignments > 0:
            is_eligible = is_eligible and (completed_assignments == total_assignments)
        
        return Response({
            'eligible': is_eligible,
            'progress': {
                'videos': {
                    'completed': completed_videos,
                    'total': total_lectures,
                    'percentage': round((completed_videos / total_lectures * 100) if total_lectures > 0 else 0, 2)
                },
                'assignments': {
                    'completed': completed_assignments,
                    'total': total_assignments,
                    'percentage': round((completed_assignments / total_assignments * 100) if total_assignments > 0 else 0, 2)
                }
            }
        })
        
    except Exception as e:
        print(f"Error checking certificate eligibility: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response({
            'error': 'Failed to check certificate eligibility',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_certificate(request, course_id):
    """Generate certificate data for a completed course."""
    try:
        # First verify the course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check eligibility directly instead of calling the view function
        try:
            # Get course completion data
            lectures = CourseLecture.objects.filter(course_id=course_id)
            total_lectures = lectures.count()
            completed_videos = 0
            
            # Get video progress
            for lecture in lectures:
                try:
                    video_progress = VideoProgress.objects.filter(
                        user=request.user,
                        lecture=lecture
                    ).first()
                    
                    if video_progress and video_progress.video_duration and video_progress.video_duration > 0:
                        if video_progress.watched_time >= 0.9 * video_progress.video_duration:
                            completed_videos += 1
                except Exception as e:
                    print(f"Error checking video progress for lecture {lecture.id}: {str(e)}")
                    continue
            
            # Get assignment progress
            try:
                submissions = AssignmentSubmission.objects.filter(
                    user=request.user,
                    course_id=course_id
                )
                total_assignments = submissions.count()
                completed_assignments = submissions.filter(status=1).count()  # Status 1 means reviewed/completed
            except Exception as e:
                print(f"Error checking assignments: {str(e)}")
                total_assignments = 0
                completed_assignments = 0
            
            # Calculate eligibility
            if total_lectures == 0:
                return Response({
                    'error': 'No lectures found in this course'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check video completion
            is_eligible = completed_videos == total_lectures
            
            # Only check assignment completion if there are assignments
            if total_assignments > 0:
                is_eligible = is_eligible and (completed_assignments == total_assignments)

            if not is_eligible:
                return Response({
                    'error': 'Not eligible for certificate',
                    'progress': {
                        'videos': {
                            'completed': completed_videos,
                            'total': total_lectures,
                            'percentage': round((completed_videos / total_lectures * 100) if total_lectures > 0 else 0, 2)
                        },
                        'assignments': {
                            'completed': completed_assignments,
                            'total': total_assignments,
                            'percentage': round((completed_assignments / total_assignments * 100) if total_assignments > 0 else 0, 2)
                        }
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error checking eligibility: {str(e)}")
            return Response({
                'error': 'Failed to check certificate eligibility',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get completion date (latest between video and assignment completion)
        latest_video_progress = VideoProgress.objects.filter(
            user=request.user,
            lecture__course_id=course_id,
            watched_time__gte=F('video_duration') * 0.9
        ).order_by('-last_updated').first()
        
        latest_assignment = AssignmentSubmission.objects.filter(
            user=request.user,
            course_id=course_id,
            status=1  # Completed status
        ).order_by('-submission_date').first()
        
        # Get the latest completion date
        completion_dates = []
        if latest_video_progress:
            completion_dates.append(latest_video_progress.last_updated)
        if latest_assignment:
            completion_dates.append(latest_assignment.submission_date)
        
        completion_date = max(completion_dates) if completion_dates else timezone.now()

        # Generate certificate data
        certificate_data = {
            'student_name': f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
            'course_name': course.title,
            'completion_date': completion_date,
            'instructor_name': f"{course.user.first_name} {course.user.last_name}".strip() or course.user.username
        }

        return Response(certificate_data)

    except Exception as e:
        print(f"Error generating certificate: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return Response({
            'error': 'Failed to generate certificate',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)