<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<!-- start sidebar  -->
<div class="transition_speed m-0 p-0" id="left_side">
  <div class="" id="nav_con">
    <nav class="navbar navbar-expand-lg navbar-dark mybg my-round ms-0 px-2">
      <div class="container-fluid" style="background-color: transparent">
        <a class="navbar-brand my-color" href="#">SkillNexus</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon my-color"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex ms-auto me-5" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button class="btn navbar-btn btn-outline-dark" type="submit">
              Search
            </button>
          </form>
          <!-- theme switch -->
          <!-- theme switch -->
          <!-- theme switch -->
          <!-- theme switch -->
          <label class="switch">
            <input type="checkbox" id="theme" />
            <span class="slider"></span>
          </label>
          <!-- theme switch -->
          <!-- theme switch -->
          <!-- theme switch -->
          <!-- theme switch -->
          <!-- theme switch -->
          <ul class="navbar-nav ms-1 mb-2 mb-lg-0">
            
            {% if user.is_authenticated %}
            <div class="profile-con ms-1">
              
              {%  if user.profile_picture %}
                <img src="/{{user.profile_picture}}" alt="profile pic" />
              {% else %}
              <div class="icon">
                <i class="fa-solid fa-user fa-xl" style="color: #00eeff"></i>
              </div>
              {% endif %}
              <ul class="dropdown-menu bg-dar">
                <li>
                  <a class="dropdown-item" href="/profile">Profile</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">Another action</a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item logout" href="#">Logout</a>
                </li>
              </ul>
            </div>
            {% else  %}
            <li class="nav-item logged-out {% if user %}d-none{% endif %}">
              <a class="nav-link" href="/login" data="Link">Login</a>
            </li>
            {% endif %}

          </ul>
        </div>
      </div>
    </nav>

  </div>
<div id="sidebar" class="h-100 transition_speed">
    <ul class="list-unstyled components mb-5">
        <li>
            <a href="/"><span class="fa fa-home"></span> &nbsp; Home</a>
        </li>

        {% if user.is_authenticated %} 
            <li>
                <a href="/profile"><span class="fa fa-download"></span> &nbsp; Profile</a>
            </li>

            {% if user.role == 'Admin' %}
                <li>
                    <a href="/manage_education"><span class="fa fa-graduation-cap"></span> &nbsp; Educations</a>
                </li>
                <li>
                    <a href="/users"><span class="fa-solid fa-user"></span> &nbsp; Users</a>
                </li>
            {% endif %}

            {% if user.role == 'Student' %}
                <li>
                    <a href="/education"><span class="fa fa-graduation-cap"></span> &nbsp; Educations</a>
                </li>
                <li>
                    <a href="/training"><span class="fa-solid fa-clipboard-list"></span> &nbsp; Trainings</a>
                </li>
                <li>
                    <a href="/experience"><span class="fa-solid fa-briefcase"></span> &nbsp; Experience</a>
                </li>
                <li>
                    <a href="/course_list"><span class="fa-solid fa-book"></span> &nbsp; Course List</a>
                </li>
                <li>
                    <a href="/program"><span class="fa-solid fa-play"></span> &nbsp; Program</a>
                </li>
                <li>
                    <a href="/my_skills"><span class="fa-solid fa-tools"></span> &nbsp; Skills</a>
                </li>
            {% endif %}

            {% if user.role == 'Educator' %}
                <li>
                    <a href="/create_course"><span class="fa-solid fa-book"></span> &nbsp; Create Course</a>
                </li>
                <li>
                    <a href="/all_course_detail"><span class="fa-solid fa-hammer"></span> &nbsp; See Details</a>
                </li>
            {% endif %}

            {% if user.role == 'University' %}
                <li>
                    <a href="/programs"><span class="fa-solid fa-wand-magic-sparkles"></span> &nbsp; Programs</a>
                </li>
            {% endif %}

            <li class="logout">
                <a href="/logout"><span class="fa fa-sign-out mr-3 logout"></span> &nbsp; Sign Out</a>
            </li>

        {% else %}
            <li>
                <a href="/login"><span class="fa fa-sign-out mr-3"></span> &nbsp; Sign In</a>
            </li>
        {% endif %}

        <li>
            <a href="#"><i class="fa-solid fa-headset"></i> &nbsp; Support</a>
        </li>
    </ul>
</div>
  <div class="sidebar_btn">
    <i class="fa-solid fa-chevron-up fa-rotate-90 fa-2xl"></i>
  </div>

  <!-- loader code -->
  <div class="loader-container">
    <div class="loader">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
      <div class="bar7"></div>
      <div class="bar8"></div>
      <div class="bar9"></div>
      <div class="bar10"></div>
      <div class="bar11"></div>
      <div class="bar12"></div>
    </div>
  </div>
  <!-- side bar -->
  <div class="container">





    <!-- end sidebar  -->
    <!-- end sidebar  -->
    <!-- end sidebar  -->
    <!-- end sidebar  -->
    <!-- end sidebar  -->
    <!-- end sidebar  -->
    <!-- end sidebar  -->