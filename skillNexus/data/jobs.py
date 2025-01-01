from django.db import connection
from django.shortcuts import render, redirect
from .serializers import *
from .models import *
from .views import getUser, login_required, run_raw_sql


@login_required
def profile_jobs(request):
    # Implementation for displaying the jobs related to the user's profile
    pass


def jobs(request):
    user = getUser(request)
    jobs = run_raw_sql(
        """
        SELECT DISTINCT job.* , 
        GROUP_CONCAT(CONCAT(' ' , skill.name)) as skills,
        COUNT(offer.id) as offer_count ,
        CASE WHEN job.freelancer_id IS NULL 
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
        GROUP BY job.id
        """)
    skills = Skill.objects.all()
    skills = SkillSeriallizer(skills, many=True).data
    return render(request, 'jobs.html', {'jobs': jobs, 'skills': skills})


def job(request, job_id):
    user = getUser(request)
    user_id = 'x'
    if user:
        user_id = user['id']
    job = run_raw_sql(
        """
        SELECT DISTINCT job.* , 
        GROUP_CONCAT(CONCAT(' ' , skill.name)) as skills,
        COUNT(offers.id) as offer_count ,
        CASE WHEN job.freelancer_id IS NULL 
            THEN 'open' 
            ELSE 
                CASE WHEN job.payment_id IS NULL 
                    THEN 'in progress' 
                    ELSE 'completed' 
                END 
            END 
        as status,
        CONCAT(employer.first_name, ' ', employer.last_name) as employer,
        CASE WHEN offer.id IS NULL THEN FALSE ELSE offer.status END as applied_status,
        offer.id as offer_id,
        offer.proposed_rate as proposed_rate,
        offer.proposal as proposal,
        offer.proposed_deadline as proposed_deadline
        FROM data_job as job
        INNER JOIN data_job_skill as js ON job.id = js.job_id
        INNER JOIN data_skill as skill ON skill.id = js.skill_id
        LEFT JOIN data_joboffer as offers ON job.id = offers.job_id
        INNER JOIN data_user as employer ON employer.id = job.employer_id
        LEFT JOIN data_joboffer as offer ON ( job.id = offer.job_id AND offer.freelancer_id = %s )
        WHERE job.id = %s
        GROUP BY job.id
        """, (user_id, job_id,)
    )
    return render(request, 'job.html', {'job': job[0]})


def employer_jobs(request):
    # Implementation for displaying jobs posted by the employer
    user = getUser(request)
    jobs = run_raw_sql(
        """
        SELECT DISTINCT job.* , 
        GROUP_CONCAT(CONCAT(' ' , skill.name)) as skills,
        COUNT(offer.id) as offer_count ,
        CASE WHEN job.freelancer_id IS NULL 
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
        WHERE job.employer_id = %s
        GROUP BY job.id
        """,
        (user['id'],)
    )
    skills = Skill.objects.all()
    skills = SkillSeriallizer(skills, many=True).data
    return render(request, 'employer_jobs.html', {'jobs': jobs, 'skills': skills})


def employer_job(request, job_id):
    # Implementation for displaying details of a specific job posted by the employer
    job = run_raw_sql(
        """
        SELECT DISTINCT job.* , 
        GROUP_CONCAT(CONCAT(' ' , skill.name)) as skills,
        CASE WHEN job.freelancer_id IS NULL 
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
        WHERE job.id = %s
        GROUP BY job.id
        """, (job_id,)
    )
    offers = run_raw_sql(
        """
        SELECT offer.* , 
        CONCAT(freelancer.first_name, ' ', freelancer.last_name) as freelancer
        FROM data_joboffer as offer
        INNER JOIN data_user as freelancer ON offer.freelancer_id = freelancer.id
        WHERE offer.job_id = %s
        """, (job_id,)
    )
    return render(request, 'employer_job.html', {'job': job[0], 'offers': offers})


def employer_jobs_offers(request):
    # Implementation for displaying offers for jobs posted by the employer
    pass


def employer_job_offer(request, offer_id):
    job = run_raw_sql(
        """
        SELECT DISTINCT job.* , 
        GROUP_CONCAT(CONCAT(' ' , skill.name)) as skills,
        CASE WHEN job.freelancer_id IS NULL 
            THEN 'open' 
            ELSE 
                CASE WHEN job.payment_id IS NULL 
                    THEN 'in progress' 
                    ELSE 'completed' 
                END 
            END 
        as status,
        CONCAT(freelancer.first_name, ' ', freelancer.last_name) as freelancer,
        freelancer.role,
        offer.*
        FROM data_job as job
        LEFT JOIN data_job_skill as js ON job.id = js.job_id
        LEFT JOIN data_skill as skill ON skill.id = js.skill_id
        INNER JOIN data_joboffer as offer ON ( job.id = offer.job_id and offer.id = %s )
        INNER JOIN data_user as freelancer ON offer.freelancer_id = freelancer.id
        GROUP BY job.id
        """,
        (offer_id,)
    )
    return render(request, 'employer_job_offer.html', {'offer': job[0]})
