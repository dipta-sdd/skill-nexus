
{% load static %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkilNexus</title>
    <link
      href="{% static 'css/bootstrap.min.css' %}"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <link rel="stylesheet" href="{%  static 'css/login.css' %}" />
  </head>
  <body>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
      <div class="toast-container top-0 end-0 p-3">
        <!-- Then put toasts within -->
      </div>
    </div>

    {% include "sidebar.php" %}
 
      <div class="my-round" id="body"  data-bs-theme="light" >
        <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item" aria-current="page">Login</li>
          </ol>
        </nav>
        <div class="login-box-container">
          <div class="login-box">
            <h2>Login</h2>
            <form id="login_form">
              <div class="user-box username">
                <input
                  type="text"
                  name="username"
                  autocomplete="off"
                  required=""
                />
                <label>Username</label>
                <small class="err"> </small>
              </div>
              <div class="user-box password">
                <input
                  type="password"
                  name="password"
                  autocomplete="off"
                  required=""
                />
                <label>Password</label>
                <span class="eye" target="password"><i class="fa-regular fa-eye-slash" style="color: #ffffff;"></i></span>
                <small class="err"> </small>
              </div>
              <div class="message">
                <small class="text-danger"></small>
              </div>

              <p style="color: white">
                Don't have an account?
                <a class="link" href="/signup">Sign-up now!</a>
              </p>
              <a href="#" class="button" id="btn_login">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Login
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
</div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>

    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/auth.js' %}"></script>
    <script>
      $(document).ready(function () {
        // Sidebar();
        hide_sidebar();
        on_page_load('auth');
      });
    </script>
  </body>
</html>
