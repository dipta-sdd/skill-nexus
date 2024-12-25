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
from .views import getUser, run_raw_sql


@api_view(['POST'])
def employer_job_new(req):
    user = getUser(req)
    data = req.data.dict()
    data['skill'] = json.loads(data['skill'])
    data['employer'] = user['id']
    serializer = JobSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        job = run_raw_sql(
            """
        SELECT DISTINCT job.* , 
        GROUP_CONCAT(skill.name) as skills,
        COUNT(offer.id) as offer_count ,
        CASE WHEN job.freelencer_id IS NULL 
            THEN 'open' 
            ELSE 
                CASE WHEN job.payment_id IS NULL 
                    THEN 'in progress' 
                    ELSE 'completed' 
                END 
            END 
        as status
        FROM data_job as job
        INNER JOIN data_job_skill as js ON job.id = js.job_id
        INNER JOIN data_skill as skill ON skill.id = js.skill_id
        LEFT JOIN data_joboffer as offer ON job.id = offer.job_id
        WHERE job.id = %s
        GROUP BY job.id
        """,
            (serializer.data['id'],)
        )
        return Response(job[0], status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def jobs(req):
    user = getUser(req)
    data = req.data.dict()
    sort_by = data.get('sortby', 'created_at')
    sort_order = data.get('sortorder', 'DESC').upper()
    if sort_order not in ('ASC', 'DESC'):
        sort_order = 'DESC'
    table = """
        SELECT DISTINCT j.id,
        j.title,
        j.description,
        j.location,
        j.project_duration,
        j.price,
        j.deadline,
        j.freelancer_proposed_rate,
        j.freelancer_proposed_deadline,
        j.created_at,
        j.updated_at,
        j.employer_id,
        j.freelencer_id,
        j.payment_id
        FROM data_job as j
        INNER JOIN data_job_skill as js ON j.id = js.job_id
    """
    if 'skills' in data and data['skills'] != '[]':
        data['skills'] = data['skills'].replace("[", "(").replace("]", ")")
        table += f"""WHERE js.skill_id IN {data['skills']}"""
    table += """ ORDER BY j.created_at DESC"""
    query = """ SELECT * FROM
        ( SELECT DISTINCT job.* ,
        GROUP_CONCAT(skill.name) as skills,
        COUNT(offer.id) as offer_count ,
        CASE WHEN job.freelencer_id IS NULL
            THEN 'open'
            ELSE
                CASE WHEN job.payment_id IS NULL
                    THEN 'in progress'
                    ELSE 'completed'
                END
            END
        as status
        FROM (""" + table + """) as job
        INNER JOIN data_job_skill as js ON job.id = js.job_id
        INNER JOIN data_skill as skill ON skill.id = js.skill_id
        LEFT JOIN data_joboffer as offer ON job.id = offer.job_id
        GROUP BY job.id ) as jobs
        """
    if 'search' in data:
        query += """ WHERE jobs.title LIKE '%""" + data['search'] + """%' """
    query += """ ORDER BY """ + sort_by + """ """ + sort_order
    jobs = run_raw_sql(
        query,
    )
    # [data['sortby'], data['sortorder']]
    return Response(jobs, status=status.HTTP_201_CREATED)
