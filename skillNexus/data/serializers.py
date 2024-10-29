from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        # ['id', 'username', 'email', 'first_name', 'last_name', 'bio',
        #   'location', 'profile_picture', 'rating', 'role', 'last_login']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id']

    # class Meta:
    #     model = User
    #     fields = ['id', 'username', 'password', 'email', 'first_name',
    #               'last_name', 'bio', 'mobile', 'country', 'profile_picture', 'rating', 'role']
    #     extra_kwargs = {'password': {'write_only': True}}

    # def create(self, validated_data):
    #     user = User.objects.create(**validated_data)
    #     return user

    # def update(self, instance, validated_data):
    #     # Override the update method if needed
    #     instance.username = validated_data.get('username', instance.username)
    #     # Hash the new password if it is provided
    #     new_password = validated_data.get('password')
    #     if new_password:
    #         instance.password = make_password(new_password)
    #     # Add other fields as needed
    #     instance.save()
    #     return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

# for edit profile


class editUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('bio', 'country', 'profile_picture', 'mobile',
                  'first_name', 'last_name', 'email')
# for personal details


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'profile_picture',
                  'first_name', 'last_name', 'email', 'username', 'role', 'date_joined', 'last_login', 'status')


class PersonalDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetails
        fields = ('id', 'father_name', 'mother_name',
                  'gender', 'date_of_birth', 'religion', 'marital_status')


class Edu_levelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edu_level
        fields = ('id', 'name')


class Edu_degreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edu_degree
        fields = ('id', 'name', 'level')


class Edu_group_or_majorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Edu_group_or_major
        fields = ('id', 'name', 'degree')


class EducationSerializer (serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class TrainingSerializer (serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = '__all__'


class ExperienceSeriallizer (serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class CompanySerializer (serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class UniversitySerializer (serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'


class UniversityProgramSerial (serializers.ModelSerializer):
    class Meta:
        model = UniversityProgram
        fields = '__all__'


class CourseSeriallizer (serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class CourseLectureSeriallizer (serializers.ModelSerializer):
    class Meta:
        model = CourseLecture
        fields = '__all__'


class SkillSeriallizer (serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class EnrollmentSeriallizer (serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'


class User_skillSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_skill
        fields = '__all__'
