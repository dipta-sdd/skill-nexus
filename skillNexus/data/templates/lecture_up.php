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
  <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
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
        <li class="breadcrumb-item" aria-current="page">Login</li>
      </ol>
    </nav>

    <!-- main body-->
    <div class="row my-color mybg my-row" style="font-family: cursive;">
      <div class="ok d-flex justify-content-center align-items-center">
        <div class="col-md-6">
          <h3 style="text-align: center; margin-top: 10px;">Upload Lecture</h3>
          <form id="courseForm" enctype="multipart/form-data">

            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" name="title" required>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="wdescription" name="lecture_description" rows="4"
                required></textarea>
            </div>

            <div class="mb-3">
              <label for="pdfFile" class="form-label">PDF File</label>
              <input type="file" class="form-control" id="pdfFile" name="material"
                accept="application/pdf">
            </div>


            <div class="mb-3">
              <label for="videoFile" class="form-label">Video File</label>
              <input type="file" class="form-control" id="videoFile" name="video" accept="video/*">
            </div>

            <button type="submit" class="btn btn-primary d-block mx-auto">Create</button>
          </form>
        </div>
      </div>
    </div>
  </div>

 
<script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
  <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
  <script src="{% static 'js/script.js' %}"></script>
  <script>
    $(document).ready(function() {
      on_page_load([]);
      $('#courseForm').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission
        const url = window.location.href;
        // Extract the value after the hyphen
        const value = url.split('?')[1];
        // Log the extracted value
        console.log(value);

        var formData = new FormData(this);
        formData.append("course", value);
        $.ajax({
          url: 'http://127.0.0.1:8000/api/course_lecture/add',
          type: 'POST',
          headers: {
            Authorization: "Bearer " + getCookie("token"),
            'X-CSRFToken': $('meta[name="csrf-token"]').attr(
              'content') // Add CSRF token
          },
          data: formData,
          processData: false,
          contentType: false,
          success: function(response) {
            // alert('Lecture uploaded successfully!');
            showToast("Lecture uploaded successfully in that course!", "Primary");
            // You can redirect or update the page content here
          },
          error: function(jqXHR, textStatus, errorThrown) {
            alert('Failed to upload lecture: ' + textStatus);
            console.log('Error details:', errorThrown, jqXHR.responseText);
          }
        });
      });
    });
  </script>
</body>

</html>