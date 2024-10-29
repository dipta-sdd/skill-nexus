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
    <link rel="stylesheet" href="{%  static 'css/manage_education.css' %}" />
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
              <li class="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
              <li class="breadcrumb-item" aria-current="page">Education</li>
            </ol>
          </nav>

          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <div class="row text-light mybg my-row">
            <h3 class="my-color col-12">Education Levels:</h3>
            <div class="level-con col-12">
                
            </div>
          </div>
          <!-- add edu level -->
          <div class="row text-light mybg my-row" id="addLevel">
            <h3 class="my-color col-12 mb-0">Add Education Level:</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center mt-0">
              <div class="col-12">
                <label class="visually-hidden" for="inlineFormInputGroupUsername">Level Name</label>
                <div class="input-group">
                  <div class="input-group-text">Level Name</div>
                  <input type="text" class="form-control" name="name" placeholder="Secondery">
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
          <!-- add edu degree -->
          <div class="row text-light mybg my-row" id="addDegree">
            <h3 class="my-color col-12 mb-0">Add Education Degree :</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center mt-0">
              <div class="col-12">
                <label class="visually-hidden" for="inlineFormInputGroupUsername">Level Name</label>
                <div class="input-group">
                  <div class="input-group-text">Level Name</div>
                  <select class="form-select form-control level" name="level" aria-label="Default select example">
                    
                    <!-- <option class="d-none" value="1">One</option> -->
                  </select>
                </div>
              </div>
              <div class="col-12">
                <label class="visually-hidden" for="inlineFormInputGroupUsername">Degree Name</label>
                <div class="input-group">
                  <div class="input-group-text">Degree Name</div>
                  <input type="text" class="form-control" name="name" placeholder="Secondery">
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
          <!-- add edu group or mejor -->
          <div class="row text-light mybg my-row" id="addGroup">
            <h3 class="my-color col-12 mb-0">Add Education Group or Mejor :</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center mt-0">
              <div class="col-12">
                <label class="visually-hidden" for="inlineFormInputGroupUsername">Level Name</label>
                <div class="input-group">
                  <div class="input-group-text">Level Name</div>
                  <select id="addGrouplevel" class="form-select form-control level" name="level" aria-label="Default select example">
                    
                    <!-- <option class="d-none" value="1">One</option> -->
                  </select>
                </div>
              </div>
              <div class="col-12">
                <label class="visually-hidden" for="inlineFormInputGroupUsername">Degree Name</label>
                <div class="input-group">
                  <div class="input-group-text">Degree Name</div>
                  <select class="form-select form-control degree" name="degree" aria-label="Default select example">
                    
                    <!-- <option class="d-none" value="1">One</option> -->
                  </select>
                </div>
              </div>
              <div class="col-12">
                <label class="visually-hidden" for="inlineFormInputGroupUsername">Group Name</label>
                <div class="input-group">
                  <div class="input-group-text">Group Name</div>
                  <input type="text" class="form-control" name="name" placeholder="Secondery">
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
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
    <script src="{% static 'js/manage_education.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load(['Admin']);
      });
    </script>
  </body>
</html>
 