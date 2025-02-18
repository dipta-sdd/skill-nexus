{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - {{ user.first_name }} {{ user.last_name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            line-height: 1.6;
            color: #333;
            max-width: 210mm; /* A4 width */
            min-height: 297mm; /* A4 height */
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20px;
        }
        .personal-info {
            flex: 1;
        }
        .personal-info h1 {
            margin: 0;
            color: #2c3e50;
            font-size: 2.5em;
        }
        .personal-info p {
            margin: 5px 0;
            font-size: 1.1em;
        }
        .profile-pic {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .thick-divider {
            border-top: 3px solid #2c3e50;
            margin: 5px 0 15px 0;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 0;
            text-transform: uppercase;
        }
        .experience-item {
            margin-bottom: 20px;
            padding-left: 20px;
            position: relative;
        }
        .experience-item:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #2c3e50;
            font-size: 1.2em;
            font-weight: bold;
        }
        .experience-item h3 {
            margin: 0;
            color: #34495e;
            font-weight: bold;
        }
        .experience-item p {
            margin: 5px 0;
            color: #333;
            font-weight: normal;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding-left: 20px;
        }
        .skill-item {
            position: relative;
            padding-left: 15px;
            font-weight: normal;
            color: #333;
        }
        .skill-item:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #2c3e50;
            font-weight: bold;
        }
        .education-item {
            margin-bottom: 20px;
            padding-left: 20px;
            position: relative;
        }
        .education-item:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #2c3e50;
            font-size: 1.2em;
            font-weight: bold;
        }
        .education-item h3 {
            margin: 0;
            color: #34495e;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-weight: bold;
        }
        .education-item .year {
            color: #333;
            font-size: 0.9em;
            font-weight: normal;
        }
        .education-details {
            margin-top: 5px;
            color: #333;
            font-weight: normal;
        }
        .personal-details {
            padding-left: 20px;
        }
        .personal-details dt {
            float: left;
            clear: left;
            width: 120px;
            font-weight: bold;
            color: #34495e;
        }
        .personal-details dd {
            margin-left: 130px;
            color: #333;
            margin-bottom: 10px;
            font-weight: normal;
        }
        .print-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .print-button:hover {
            background: #34495e;
        }
        @media print {
            body {
                padding: 20px;
                box-shadow: none;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="personal-info">
            <h1>{{ user.first_name }} {{ user.last_name }}</h1>
            <p><strong>Mobile:</strong> {{ user.mobile }}</p>
        </div>
        {% if user.profile_picture %}
        <img src="{{ user.profile_picture.url }}" alt="Profile Picture" class="profile-pic">
        {% endif %}
    </div>
    <div class="thick-divider"></div>
    {% if user.bio %}
    <div class="section">
        <p>{{ user.bio }}</p>
    </div>
    {% endif %}

    {% if experiences %}
    <div class="section">
        <div class="section-title">Experience</div>
        <div class="thick-divider"></div>
        {% for exp in experiences %}
        <div class="experience-item">
            <h3>{{ exp.designation }}</h3>
            <p>{{ exp.organisation_name }}</p>
            <p>{{ exp.department }} | {{ exp.location }}</p>
            <p>{{ exp.start_date }} - {{ exp.end_date }}</p>
        </div>
        {% endfor %}
    </div>
    {% endif %}

    {% if skills %}
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="thick-divider"></div>
        <div class="skills-list">
            {% for skill in skills %}
            <span class="skill-item">{{ skill.skill.name }}</span>
            {% endfor %}
        </div>
    </div>
    {% endif %}

    {% if education %}
    <div class="section">
        <div class="section-title">Educational Qualification</div>
        <div class="thick-divider"></div>
        {% for edu in education %}
        <div class="education-item">
            <h3>
                {{ edu.institute }}
                <span class="year">{{ edu.passing_year }}</span>
            </h3>
            <div class="education-details">
                <p>{{ edu.degree.name }} in {{ edu.group.name }} | Level: {{ edu.level.name }}</p>
                {% if edu.gpa %}
                <p>GPA: {{ edu.gpa }}/{{ edu.gpa_scale }}</p>
                {% endif %}
            </div>
        </div>
        {% endfor %}
    </div>
    {% endif %}

    <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="thick-divider"></div>
        <dl class="personal-details">
            <dt>Name</dt>
            <dd>{{ user.first_name }} {{ user.last_name }}</dd>
            
            <dt>Date of Birth</dt>
            <dd>{{ personal_details.date_of_birth|default:"Not specified" }}</dd>
            
            <dt>Email</dt>
            <dd>{{ user.email }}</dd>
            
            <dt>Address</dt>
            <dd>{{ user.country|default:"Not specified" }}</dd>
        </dl>
    </div>

    <button onclick="window.print()" class="print-button no-print">
        Print CV
    </button>
</body>
</html> 