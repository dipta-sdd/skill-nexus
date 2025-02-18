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


class UniversityProgramSessionSerializer (serializers.ModelSerializer):
    class Meta:
        model = UniversityProgramSession
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


class ProgramApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramApplication
        fields = '__all__'


# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


# polash

class User_skillSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_skill
        fields = '__all__'


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture']


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)
    timestamp = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user_id', 'username', 'user_profile_picture', 'content', 
                 'timestamp', 'edited', 'edited_at', 'replies', 'has_liked', 'like_count']

    def get_timestamp(self, obj):
        return obj.timestamp.strftime("%B %d, %Y %I:%M %p")

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        return CommentSerializer(replies, many=True, context=self.context).data

    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_like_count(self, obj):
        return obj.likes.count()


class LectureCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)
    timestamp = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_reply = serializers.SerializerMethodField()

    class Meta:
        model = LectureComment
        fields = [
            'id', 'user_id', 'username', 'user_profile_picture', 
            'content', 'timestamp', 'edited', 'edited_at', 
            'replies', 'has_liked', 'like_count', 'is_reply'
        ]

    def get_timestamp(self, obj):
        return obj.timestamp.strftime("%B %d, %Y %I:%M %p")

    def get_replies(self, obj):
        # Only get direct replies to this comment
        replies = LectureComment.objects.filter(
            parent=obj
        ).select_related('user').prefetch_related('likes').order_by('timestamp')
        return LectureCommentSerializer(replies, many=True, context=self.context).data

    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_reply(self, obj):
        return obj.parent is not None


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    submission_date = serializers.DateTimeField(format="%B %d, %Y %I:%M %p", read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = [
            'id', 'user', 'username', 'course', 'lecture',
            'assignment_file', 'submission_date', 'status',
            'feedback', 'grade'
        ]
        read_only_fields = ['submission_date']


class VideoProgressSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = VideoProgress
        fields = [
            'id', 'user', 'lecture', 'watched_time',
            'video_duration', 'last_updated', 'progress_percentage'
        ]
        read_only_fields = ['last_updated']

    def get_progress_percentage(self, obj):
        if obj.video_duration == 0:
            return 0
        return (obj.watched_time / obj.video_duration) * 100


class CourseMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_profile_picture = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    receiver_profile_picture = serializers.SerializerMethodField()
    is_course_creator = serializers.SerializerMethodField()

    class Meta:
        model = CourseMessage
        fields = ['id', 'sender', 'receiver', 'course', 'content', 'timestamp',
                 'sender_name', 'sender_profile_picture',
                 'receiver_name', 'receiver_profile_picture',
                 'is_course_creator']
        read_only_fields = ['sender', 'receiver', 'timestamp']

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip() or obj.sender.username

    def get_sender_profile_picture(self, obj):
        if obj.sender.profile_picture:
            return obj.sender.profile_picture.url
        return None

    def get_receiver_name(self, obj):
        return f"{obj.receiver.first_name} {obj.receiver.last_name}".strip() or obj.receiver.username

    def get_receiver_profile_picture(self, obj):
        if obj.receiver.profile_picture:
            return obj.receiver.profile_picture.url
        return None

    def get_is_course_creator(self, obj):
        return obj.sender == obj.course.user


class InternshipOfferSerializer(serializers.ModelSerializer):
    skills_required = SkillSeriallizer(many=True, read_only=True)
    university_name = serializers.SerializerMethodField()
    university_location = serializers.SerializerMethodField()
    
    class Meta:
        model = InternshipOffer
        fields = [
            'id', 'university', 'university_name', 'university_location',
            'title', 'description', 'requirements', 'duration_months', 
            'stipend', 'location', 'skills_required', 'positions_available', 
            'application_deadline', 'start_date', 'status', 'created_at', 
            'updated_at'
        ]
        
    def get_university_name(self, obj):
        if obj.university:
            if hasattr(obj.university, 'first_name') and hasattr(obj.university, 'last_name'):
                name = f"{obj.university.first_name} {obj.university.last_name}".strip()
                return name if name else obj.university.username
            elif hasattr(obj.university, 'university') and hasattr(obj.university.university, 'name'):
                return obj.university.university.name
        return 'Unknown University'
            
    def get_university_location(self, obj):
        if obj.university:
            if hasattr(obj.university, 'country'):
                return obj.university.country
            elif hasattr(obj.university, 'university') and hasattr(obj.university.university, 'address'):
                return obj.university.university.address
        return obj.location or 'Unknown Location'
            
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure description and requirements are not None
        data['description'] = instance.description or ''
        data['requirements'] = instance.requirements or ''
        # Get skills with their names
        skills = []
        for skill in instance.skills_required.all():
            skills.append({
                'id': skill.id,
                'name': skill.name
            })
        data['skills_required'] = skills
        return data


class InternshipApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    
    class Meta:
        model = InternshipApplication
        fields = [
            'id', 'student', 'student_name', 'student_email',
            'internship', 'internship_title', 'status', 'applied_at',
            'resume', 'cv'
        ]
        read_only_fields = ['applied_at']
    
    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip() or obj.student.username
    
    def get_student_email(self, obj):
        return obj.student.email


class PaymentSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'sender', 'sender_name', 'receiver', 'receiver_name',
            'amount', 'card_number', 'card_expiry', 'card_cvv',
            'course_id', 'timestamp', 'status', 'transaction_id'
        ]
        read_only_fields = ['timestamp', 'transaction_id', 'status']
        extra_kwargs = {
            'card_number': {'write_only': True},
            'card_cvv': {'write_only': True}
        }


class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_profile_picture = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = CourseReview
        fields = ['id', 'user', 'course', 'rating', 'review_text', 'created_at', 'updated_at', 
                 'is_edited', 'user_name', 'user_profile_picture', 'is_owner', 'formatted_date']
        read_only_fields = ['user', 'created_at', 'updated_at', 'is_edited']

    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.username

    def get_user_profile_picture(self, obj):
        if obj.user.profile_picture:
            return obj.user.profile_picture.url
        return None

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user_id == request.user.id
        return False

    def get_formatted_date(self, obj):
        return obj.created_at.strftime("%B %d, %Y")
    