
{% load static %}
<!DOCTYPE html>
<html>
  <head>
    <title>Homepage</title>
    <link rel="stylesheet" href="{% static 'css/home.css' %}" />
    <script
      src="https://kit.fontawesome.com/3b161c540c.js"
      crossorigin="anonymous"
    ></script>
    <link rel="stylesheet" href="{% static 'css/bootstrap.min.css' %}" />
    <meta
      name="google-site-verification"
      content="e7XoUKzSgrGBih7V9JQfBxe9b2tnyyivAiQ_1PloZwk"
    />
  </head>
  <body>
    <div class="div" style="position: relative">
      <div class="con" id="nav_con">
        <div class="container">
          <nav class="navbar navbar-expand-lg navbar-dark">
            <a class="navbar-brand me-5" href="#">SkillNexus</a>
            <button
              class="navbar-toggler d-lg-none"
              type="button"
              data-toggle="collapse"
              data-target="#collapsibleNavId"
              aria-controls="collapsibleNavId"
              aria-expanded="false"
              aria-label="Toggle navigation"
            ></button>
            <div class="collapse navbar-collapse" id="collapsibleNavId">
              <form class="d-flex justify-content-end my-2 my-lg-0 ms-auto">
                <input
                  class="form-control mr-sm-2 me-2"
                  type="text"
                  placeholder="Search"
                />
                <button
                  class="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
              <ul class="navbar-nav mr-auto mt-2 mt-lg-0 ms-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="#"
                    >Home <span class="sr-only">(current)</span></a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item logged-out d-none">
                  <a class="nav-link" href="/login" data="Link">Login</a>
                </li>
                <div class="profile-con ms-2 logged-in d-none">
                  <div class="icon">
                    <i
                      class="fa-solid fa-user fa-xl"
                      style="color: #00eeff"
                    ></i>
                  </div>
                  <ul class="dropdown-menu bg-dar">
                    <li>
                      <a class="dropdown-item" href="/profile">Profile</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Another action</a>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a class="dropdown-item logout" href="#">Logout</a>
                    </li>
                  </ul>
                </div>
              </ul>
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
    <!-- Four Cards -->
    <div style="background-color: #eef9ff; padding-top: 10px">
      <h2 style="text-align: center">Our features</h2>
    </div>

    <div class="card-container">
      <div class="card">
        <img src="{% static 'images/d.jpeg' %}" />
        <div class="card-body">
          <h5 class="card-title">Student</h5>
          <p class="card-text">
            Unlock your potential with access to a world of knowledge. Join a
            vibrant community of learners and explore endless possibilities.
          </p>
          <br />
          <a href="#" class="btn btn-primary">Visit</a>
        </div>
      </div>

      <div class="card">
        <img src="{% static 'images/e.jpg' %}" />
        <div class="card-body">
          <h5 class="card-title">Freelancer</h5>
          <p class="card-text">
            Empower your freelance journey with opportunities and tools. Build
            your brand, find clients, and thrive in the gig economy.
          </p>
          <br />
          <a href="#" class="btn btn-primary">Visit</a>
        </div>
      </div>

      <div class="card">
        <img src="{% static 'images/c.jpeg' %}" />
        <div class="card-body">
          <h5 class="card-title">Universities</h5>
          <p class="card-text">
            Elevate your institution with streamlined management and innovative
            solutions. Transform education, inspire minds.
          </p>
          <br />
          <a href="#" class="btn btn-primary">Visit</a>
        </div>
      </div>

      <div class="card">
        <img src="{% static 'images/b.jpeg' %}" />
        <div class="card-body">
          <h5 class="card-title">Employer</h5>
          <p class="card-text">
            We empower talent. Attracting and retaining skilled individuals is
            key to our success.We value collaboration and a positive work
            environment.
          </p>

          <a href="#" class="btn btn-primary">Visit</a>
        </div>
      </div>

      <div class="card">
        <img src="{% static 'images/f.jpg' %}" />
        <div class="card-body">
          <h5 class="card-title">Educator</h5>
          <p class="card-text">
            Inspiring minds, one lesson at a time.We shape the future, one
            student at a time.The joy of seeing a student learn is magic.
          </p>
          <br />
          <a href="#" class="btn btn-primary">Visit</a>
        </div>
      </div>
    </div>

    <!-- about us-->
    <div class="about-section">
      <div class="inner-container">
        <h1>About Us</h1>
        <p class="text">
          Skillnexus unlocks possibilities for students & universities.
          Students: learn new skills with free videos, find freelance gigs, and
          apply to universities - all in one place. Universities: discover top
          talent, showcase programs, and offer exciting opportunities. It's a
          win-win for everyone involved!
        </p>
        <a href="#" class="btn btn-primary">Learn More</a>
        <!-- <div class="skills">
							<span>Web Design</span>
							<span>Photoshop & Illustrator</span>
							<span>Coding</span>
					</div> -->
      </div>
    </div>
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
      });
    </script>
  </body>
</html>
