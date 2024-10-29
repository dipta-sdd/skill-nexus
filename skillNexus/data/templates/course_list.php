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
    
    <style>
    .course-thumbnail {
      width: 100%;
      height: auto;
      object-fit: cover;
      margin-right: 20px;
      flex-shrink: 0; 
    }
    .course-outcome {
      margin: 10px 0;
      font-size: 0.9rem;
    }
    .course-actions {
      display: flex;
      align-items: center;
      margin-left: auto;
      gap: 10px;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    a {
      text-decoration: none;
    }

  </style>
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
              <li class="breadcrumb-item" aria-current="page">Login</li>
            </ol>
          </nav>

          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
           
          <div class="row text-light mybg my-row">
          <form class="col-12">
            <div class="row">
            <div class="col-lg-5">
              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-filter"></i>  &nbsp Filter</span>
                <select class="form-control per-name me-2" type="search" placeholder="Filter By" aria-label="Search">
                  <option value="free">Free</option>
                  <option value="price_low_high">Price low to high</option>
                  <option value="price_high_low">Price high to low</option>
                  <option selected value="name_a_z">Name : A to Z</option>
                  <option value="name_z_a">Name  : Z to A</option>
                </select>
              </div>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-4 pe-0">
              <input class="form-control " type="search" placeholder="Search" aria-label="Search">
            </div>
            <div class="col-lg-2"><button class="btn btn-outline-primary py-1" type="submit">
                Search
              </button></div>
                        
          </form>



          </div>
          <!-- main body-->
          <div class="row text-light mybg my-row"  id="course" style="font-family:cursive"></div>
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
    <script src="{% static 'js/course_list.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
  </body>
</html>
 