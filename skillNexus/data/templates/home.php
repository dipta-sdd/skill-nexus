{% load static %}
<!DOCTYPE html>
<html>
  <head>
    <title>SkillNexus - Your Learning Platform</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Animate.css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" type="text/css" href="{% static 'css/home.css' %}">
    
    <meta name="google-site-verification" content="e7XoUKzSgrGBih7V9JQfBxe9b2tnyyivAiQ_1PloZwk"/>
    
    <style>
      /* Critical CSS for immediate loading */
      body {
        font-family: 'Poppins', sans-serif;
        background: #f4f7fe;
        overflow-x: hidden;
      }
      
      .navbar {
        background: #1a237e;
        padding: 1rem 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .navbar-brand {
        color: #fff !important;
        font-weight: 700;
        font-size: 1.5rem;
      }
      
      .nav-link {
        color: rgba(255,255,255,0.9) !important;
        font-weight: 500;
        transition: all 0.3s ease;
      }
      
      .nav-link:hover {
        color: #fff !important;
        transform: translateY(-2px);
      }
      
      /* Basic styles for slider */
      .slider {
        position: relative;
        height: 80vh;
        overflow: hidden;
      }
      
      .myslide {
        height: 100%;
        position: absolute;
        width: 100%;
        display: none;
      }
      
      .myslide.show {
        display: block;
      }
      
      .txt {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #fff;
        z-index: 2;
      }
      
      .txt h1 {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      
      .myslide img {
        object-fit: cover;
        filter: brightness(0.7);
      }

      /* Modern styling for sections */
      .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: #1a237e;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* User Type Cards */
      .user-type-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: none;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }

      .user-type-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.2);
      }

      .icon-wrapper {
        width: 80px;
        height: 80px;
        margin: 0 auto;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(45deg, #f3f4f6, #ffffff);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }

      /* Content Cards */
      .content-card, .api-content-card {
        padding: 2rem;
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }

      .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(255,255,255,0.9);
        border-radius: 10px;
        transition: transform 0.3s ease;
      }

      .feature-item:hover {
        transform: translateX(10px);
      }

      .feature-item i {
        margin-right: 1rem;
        font-size: 1.2rem;
      }

      /* Counter animation */
      .counter {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1a237e;
      }

      .counter-label {
        display: block;
        font-size: 1rem;
        color: #666;
      }

      /* API content styling */
      .popular-courses-list, .internships-list {
        max-height: 400px;
        overflow-y: auto;
        padding: 1rem;
      }

      .course-item, .internship-item {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        transition: transform 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }

      .course-item:hover, .internship-item:hover {
        transform: translateX(10px);
      }

      /* Section Headers */
      .section-header {
        margin-bottom: 3rem;
      }

      .section-divider {
        width: 80px;
        height: 4px;
        background: linear-gradient(45deg, #1a237e, #2196f3);
        margin: 1rem auto;
        border-radius: 2px;
      }

      .section-subtitle {
        font-size: 1.2rem;
        color: #666;
        font-weight: 300;
      }

      /* Image Styling */
      .image-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }

      .feature-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .image-wrapper:hover .feature-image {
        transform: scale(1.05);
      }

      /* API Content */
      .api-content {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        margin-top: 2rem;
      }

      /* Card Layout */
      .container-fluid {
        max-width: 1800px;
      }

      .user-type-col {
        padding: 0 10px;
      }

      .user-type-card {
        height: 100%;
        min-width: 200px;
      }

      /* Content Image */
      .content-image-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 15px;
        margin: 1rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }

      .content-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .content-image-wrapper:hover .content-image {
        transform: scale(1.05);
      }

      /* Responsive adjustments */
      @media (max-width: 1200px) {
        .user-type-col {
          flex: 0 0 33.333%;
          max-width: 33.333%;
          margin-bottom: 20px;
        }
      }

      @media (max-width: 768px) {
        .user-type-col {
          flex: 0 0 50%;
          max-width: 50%;
        }
      }

      @media (max-width: 576px) {
        .user-type-col {
          flex: 0 0 100%;
          max-width: 100%;
        }
      }

      /* Card Layout */
      .user-types-row {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding: 1rem 0;
        margin: 0 -10px;
      }

      .user-type-col {
        flex: 0 0 20%;
        padding: 0 10px;
        min-width: 250px;
      }

      /* Circular Image */
      .circular-image-wrapper {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border: 5px solid #fff;
      }

      .circular-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .circular-image-wrapper:hover .circular-image {
        transform: scale(1.1);
      }

      /* Section Title */
      .content-section-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1a237e;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e3e3e3;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="div" style="position: relative">
      <div class="con" id="nav_con">
        <div class="container">
          <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
            <div class="container">
              <a class="navbar-brand" href="#">SkillNexus</a>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <form class="d-flex ms-auto me-3">
                  <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button class="btn btn-outline-light" type="submit">
                    Search
                  </button>
                </form>
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item">
                    <a class="nav-link active" href="#">Home</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link btn btn-outline-light px-4" href="/login">Login</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <div class="slider" id="slider" style="margin-top: 0px">
      <!-- fade css -->
      <div class="myslide myslide1 fade show" next="2" prev="3">
        <div class="txt">
          <h1>SKILLNEXUS</h1>
          <p>
            Join Us<br />
            You are one step away!!!<br />
          </p>
          <a href="#" class="btn btn-primary">Sign-up</a>
        </div>

        <img src="{% static 'images/img4.jpg' %}" style="width: 100%; height: 100%" />
      </div>

      <div class="myslide myslide2 fade" next="4" prev="1">
        <div class="txt">
          <h1>IMAGE 2</h1>
          <p>Web Devoloper<br />Subscribe To My Channel For More Videos</p>
        </div>
        <img src="{% static 'images/img2.jpg' %}" style="width: 100%; height: 100%" />
      </div>

      <div class="myslide myslide3 fade" next="4" prev="2">
        <div class="txt">
          <h1>IMAGE 3</h1>
          <p>Web Devoloper<br />Subscribe To My Channel For More Videos</p>
        </div>
        <img src="{% static 'images/img3.jpg' %}" style="width: 100%; height: 100%" />
      </div>
      <div class="myslide myslide4 fade" next="1" prev="3">
        <div class="txt">
          <h1>IMAGE 3</h1>
          <p>Web Devoloper<br />Subscribe To My Channel For More Videos</p>
        </div>
        <img src="{% static 'images/img3.jpg' %}" style="width: 100%; height: 100%" />
      </div>

      <!-- /fade css -->

      <!-- onclick js -->
      <a class="prev" onclick="slideBack()">&#10094;</a>
      <a class="next" onclick="slide()">&#10095;</a>

      <div class="dotsbox" style="text-align: center">
        <span class="dot showing" target="1"></span>
        <span class="dot" target="2"></span>
        <span class="dot" target="3"></span>
        <span class="dot" target="4"></span>
      </div>
      <!-- /onclick js -->
    </div>
    <!-- User Types Showcase -->
    <section class="user-types-showcase py-5 bg-light">
        <div class="container-fluid px-4">
            <div class="section-header text-center mb-5">
                <h2 class="section-title animate__animated animate__fadeIn">Types of Users</h2>
                <div class="section-divider"></div>
                <p class="section-subtitle">Connecting talents, knowledge, and opportunities</p>
            </div>
            <div class="row justify-content-center">
                <div class="col" style="flex: 0 0 20%; max-width: 20%;">
                    <div class="card user-type-card animate__animated animate__fadeInUp">
                        <div class="card-body text-center">
                            <div class="icon-wrapper mb-3">
                                <i class="fas fa-user-graduate fa-3x text-primary"></i>
                            </div>
                            <h3 class="card-title">Students</h3>
                            <p class="card-text">Learn, grow, and achieve your goals</p>
                            <div class="stats-counter">
                                <span class="counter total-students">0</span>
                                <span class="counter-label">Active Students</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col" style="flex: 0 0 20%; max-width: 20%;">
                    <div class="card user-type-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
                        <div class="card-body text-center">
                            <div class="icon-wrapper mb-3">
                                <i class="fas fa-chalkboard-teacher fa-3x text-success"></i>
                            </div>
                            <h3 class="card-title">Educators</h3>
                            <p class="card-text">Share knowledge and inspire minds</p>
                            <div class="stats-counter">
                                <span class="counter total-educators">0</span>
                                <span class="counter-label">Active Educators</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col" style="flex: 0 0 20%; max-width: 20%;">
                    <div class="card user-type-card animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
                        <div class="card-body text-center">
                            <div class="icon-wrapper mb-3">
                                <i class="fas fa-university fa-3x text-info"></i>
                            </div>
                            <h3 class="card-title">Universities</h3>
                            <p class="card-text">Connect with talent and offer opportunities</p>
                            <div class="stats-counter">
                                <span class="counter total-universities">0</span>
                                <span class="counter-label">Partner Universities</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col" style="flex: 0 0 20%; max-width: 20%;">
                    <div class="card user-type-card animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
                        <div class="card-body text-center">
                            <div class="icon-wrapper mb-3">
                                <i class="fas fa-laptop-code fa-3x text-warning"></i>
                            </div>
                            <h3 class="card-title">Freelancers</h3>
                            <p class="card-text">Find opportunities and showcase skills</p>
                            <div class="stats-counter">
                                <span class="counter total-freelancers">0</span>
                                <span class="counter-label">Active Freelancers</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col" style="flex: 0 0 20%; max-width: 20%;">
                    <div class="card user-type-card animate__animated animate__fadeInUp" style="animation-delay: 0.8s">
                        <div class="card-body text-center">
                            <div class="icon-wrapper mb-3">
                                <i class="fas fa-building fa-3x text-danger"></i>
                            </div>
                            <h3 class="card-title">Employers</h3>
                            <p class="card-text">Find top talent for your organization</p>
                            <div class="stats-counter">
                                <span class="counter total-employers">0</span>
                                <span class="counter-label">Partner Companies</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Role Sections -->
    <section class="role-section student-section py-5" style="background-color: #f8f9fa;">
        <div class="container">
            <div class="section-header text-center mb-5">
                <h2 class="section-title">Students</h2>
                <div class="section-divider"></div>
                <p class="section-subtitle">Unlock your potential with our comprehensive learning platform</p>
            </div>
            <div class="content-card">
                <!-- Top row with facilities and image -->
                <div class="row align-items-center mb-4">
                    <div class="col-lg-6">
                        <h3 class="content-section-title">Our Facilities</h3>
                        <div class="features-list mb-4">
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Access to diverse online courses</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Interactive learning experience</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Track your progress</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center">
                        <div class="circular-image-wrapper">
                            <img src="{% static 'images/d.jpeg' %}" alt="Student Learning" class="circular-image">
                        </div>
                    </div>
                </div>
                <!-- Bottom row with available courses -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h3 class="content-section-title">Available Courses</h3>
                        <div class="api-content">
                            <div class="popular-courses-list">
                                <!-- Dynamically populated by API -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="role-section educator-section py-5" style="background-color: #e3f2fd;">
        <div class="container">
            <div class="section-header text-center mb-5">
                <h2 class="section-title"> Educators</h2>
                <div class="section-divider"></div>
                <p class="section-subtitle">Share your knowledge and inspire the next generation</p>
            </div>
            <div class="content-card">
                <div class="row align-items-center">
                    <div class="col-lg-6 text-center">
                        <div class="circular-image-wrapper">
                            <img src="{% static 'images/e.jpg' %}" alt="Educator Teaching" class="circular-image">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <h3 class="content-section-title">Teaching Facilities</h3>
                        <div class="features-list">
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Create and manage courses</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Upload lectures and materials</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Grade assignments and provide feedback</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Manage student enrollments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="role-section university-section py-5" style="background-color: #fff3e0;">
        <div class="container">
            <div class="section-header text-center mb-5">
                <h2 class="section-title">Universities</h2>
                <div class="section-divider"></div>
                <p class="section-subtitle">Connect with talented students and shape the future</p>
            </div>
            <div class="content-card">
                <!-- Top row with features and image -->
                <div class="row align-items-center mb-4">
                    <div class="col-lg-6">
                        <h3 class="content-section-title">University Features</h3>
                        <div class="features-list mb-4">
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Post internship opportunities</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Manage applications</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Connect with talented students</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center">
                        <div class="circular-image-wrapper">
                            <img src="{% static 'images/c.jpeg' %}" alt="University" class="circular-image">
                        </div>
                    </div>
                </div>
                <!-- Bottom row with opportunities -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h3 class="content-section-title">Current Opportunities</h3>
                        <div class="api-content">
                            <div class="internships-list">
                                <!-- Dynamically populated by API -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Us Section -->
    <section class="about-section">
        <div class="inner-container">
            <h1>About SkillNexus</h1>
            <p class="text">
                Connecting learners, educators, and institutions worldwide. Our platform provides a seamless experience for knowledge sharing and skill development.
            </p>
            <a href="#" class="btn">Learn More</a>
        </div>
    </section>
    <footer class="footer-section">
      <div class="container">
        <div class="footer-cta pt-5">
          <div class="row">
            <div class="col-xl-4 col-md-4 mb-30">
              <div class="single-cta">
                <i class="far fa-envelope-open"></i>
                <div class="cta-text ms-2">
                  <h4>Mail us</h4>
                  <span>skillnexus@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-content pt-5 pb-1">
          <div class="row">
            <div class="col-xl-4 col-lg-4 mb-50">
              <div class="footer-widget">
                <br />
                <!-- <div class="footer-logo">
														<a href="index.html"><img src="./assets/images/logo.png" class="img-fluid" alt="logo"></a>
												</div> -->
                <div class="footer-text">
                  <p>
                    Skillnexus unlocks possibilities for students &
                    universities. Students: learn new skills with free videos,
                    find freelance gigs, and apply to universities - all in one
                    place. Universities: discover top talent, showcase programs,
                    and offer exciting opportunities. It's a win-win for
                    everyone involved!
                  </p>
                </div>
                <div class="footer-social-icon">
                  <span>Follow us</span>
                  <ul class="social_icon">
                    <li>
                      <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa-brands fa-twitter"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa-brands fa-instagram"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa-brands fa-youtube"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-lg-4 col-md-6 mb-30">
              <div class="footer-widget">
                <div class="footer-widget-heading">
                  <h3>Useful Links</h3>
                </div>
                <ul>
                  <li><a href="#">Our Team</a></li>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Our Gallery</a></li>
                  <li><a href="#">Selection Process</a></li>
                </ul>
              </div>
            </div>
            <div class="col-xl-4 col-lg-4 col-md-6 mb-50">
              <div class="footer-widget">
                <div class="footer-widget-heading">
                  <h3>Subscribe</h3>
                </div>
                <div class="footer-text mb-25">
                  <p>
                    Don`t miss to subscribe to our new feeds, kindly fill the
                    form below.
                  </p>
                </div>
                <div class="subscribe-form">
                  <form action="#">
                    <input type="text" placeholder="Email Address" />
                    <button><i class="fab fa-telegram-plane"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright-area">
        <div class="container">
          <div class="row">
            <div class="col-xl-6 col-lg-6 text-center text-lg-left">
              <div class="copyright-text">
                <p>
                  Copyright &copy; 2024, All Right Reserved
                  <a href="#">SkillNexus</a>
                </p>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 d-none d-lg-block text-right">
              <div class="footer-menu">
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Terms</a></li>
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Policy</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div>
      <div class="loader-container bg-light">
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
    </div>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/home.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load("");
        goLight();
        fetchStats();
        initUserTypesCarousel();
      });
    </script>
    <script>
      async function fetchStats() {
        try {
            const [userStats, courseStats, internshipStats] = await Promise.all([
                fetch('/api/public/user-stats').then(res => res.json()),
                fetch('/api/public/course-stats').then(res => res.json()),
                fetch('/api/public/internship-stats').then(res => res.json())
            ]);

            // Update counters with animation
            document.querySelectorAll('.total-students').forEach(el => {
                el.textContent = userStats.student_count || '0';
                animateCounter(el, userStats.student_count);
            });

            document.querySelectorAll('.total-educators').forEach(el => {
                el.textContent = userStats.educator_count || '0';
                animateCounter(el, userStats.educator_count);
            });

            document.querySelectorAll('.total-universities').forEach(el => {
                el.textContent = userStats.university_count || '0';
                animateCounter(el, userStats.university_count);
            });

            // Update popular courses with animation
            const popularCoursesList = document.querySelector('.popular-courses-list');
            if (courseStats.popular_courses?.length > 0) {
                popularCoursesList.innerHTML = courseStats.popular_courses.map((course, index) => `
                    <div class="course-item animate__animated animate__fadeInRight" 
                         style="animation-delay: ${index * 0.1}s">
                        <h6 class="mb-1">${course.title}</h6>
                        <p class="mb-1 text-muted small">${course.course_outcome}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-primary">$${course.course_fee}</span>
                            <button class="btn btn-sm btn-outline-primary">Learn More</button>
                        </div>
                    </div>
                `).join('');
            }

            // Update internships list
            const internshipsList = document.querySelector('.internships-list');
            if (internshipStats.recent_internships?.length > 0) {
                internshipsList.innerHTML = internshipStats.recent_internships.map((internship, index) => `
                    <div class="internship-item animate__animated animate__fadeInRight"
                         style="animation-delay: ${index * 0.1}s">
                        <h6 class="mb-1">${internship.title}</h6>
                        <p class="mb-1 text-muted">
                            ${internship.location} • ${internship.duration_months} months
                            ${internship.stipend ? `• $${internship.stipend}/month` : ''}
                        </p>
                        <button class="btn btn-sm btn-outline-primary mt-2">Apply Now</button>
                    </div>
                `).join('');
            }

        } catch (error) {
            console.error('Error fetching statistics:', error);
            document.querySelectorAll('.counter').forEach(el => {
                el.textContent = 'N/A';
            });
        }
    }

    // Animate counter function
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            element.textContent = Math.round(current);
        }, 20);
    }
    </script>
    <!-- Add these before closing body tag -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  </body>
</html>
