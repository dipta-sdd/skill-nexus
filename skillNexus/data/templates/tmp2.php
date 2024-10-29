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
  </head>
  <body>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
      <div class="toast-container top-0 end-0 p-3">
        <!-- Then put toasts within -->
      </div>
    </div>
    {% include "sidebar.php" %}
  
        <div class="my-round" id="body">
          <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item" aria-current="page">My Skills</li>
            </ol>
          </nav>

          <div class="row my-color mybg my-row">
            <div class="d-flex">
              <h2 class="flex-grow-1 mb-2 text-primary"><b>page title</b></h2>
              <div class="mb-2">
                <a href="/my_program" class="btn btn-outline-primary btn-add" data-bs-toggle="modal" data-bs-target="#addProgram">
                  button title
                </a>
              </div>
            </div>
            <hr class="profile-hr" />
            <div class="col-12">
              <div class="row details">
                <div class="col ">
                  <div class="row px-5 details-con">
                    <center class="text-danger">No program or course found.</center>
                  </div>  




                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
        </div>
      </div>
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>

    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
  </body>
</html>
 