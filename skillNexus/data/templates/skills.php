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
    <link rel="stylesheet" href="{%  static 'css/skills.css' %}" />
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
              <h2 class="flex-grow-1 mb-2 text-primary"><b>My Skills</b></h2>
              <div class="mb-2">
                
                <a class="btn btn-outline-primary btn-add" >
                  Add Skills
                </a>
              </div>
            </div>
            <hr class="profile-hr" />
            <div class="col-12">
              <div class="row details">
                <div class="col ">
                  <div class="row px-1 details-con">
                    <!-- <center class="text-danger">No skills found.</center> -->
                    <div class="collapse mb-2" id="collapse">
                      <div class="card card-body">
                        <div class="row">
                          <div class="col-11"><strong class="mb-2">Select skills to add:</strong></div>
                          <div class="col-1"><button type="button" class="btn-close" aria-label="Close"></button></div>
                        </div>
                        
                        <div class="all-skill skill-flex">
                        
                        </div>
                      </div>
                    </div>
                    <div class="my-skill skill-flex ">
                        </div>
                    
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
    <script src="{% static 'js/skills.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load(['Student']);
      });
    </script>
  </body>
</html>
 