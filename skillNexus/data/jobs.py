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
    # Implementation for displaying a list of jobs
    pass


def job(request, job_id):
    # Implementation for displaying details of a specific job
    pass


def employer_jobs(request):
    # Implementation for displaying jobs posted by the employer
    user = getUser(request)
    jobs = run_raw_sql(
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
        WHERE job.employer_id = %s
        GROUP BY job.id
        """,
        (user['id'],)
    )
    return render(request, 'employer_jobs.html', {'jobs': jobs})


def employer_job(request, job_id):
    # Implementation for displaying details of a specific job posted by the employer
    pass


def employer_jobs_offers(request):
    # Implementation for displaying offers for jobs posted by the employer
    pass


def employer_job_offers(request, job_id):
    # Implementation for displaying offers for a specific job posted by the employer
    pass


def employer_job_offer(request, offer_id):
    # Implementation for displaying details of a specific offer
    pass
