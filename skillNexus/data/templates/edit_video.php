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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f4f7f6;
      color: #333;
    }
    .edit-course-form {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .edit-course-form h2 {
      margin-bottom: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #007bff;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid #ddd;
      font-size: 16px;
      color: #333;
      background-color: #f9f9f9;
    }
    .form-group input:focus,
    .form-group textarea:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
      outline: none;
    }
    .form-group img {
      max-width: 100%;
      height: auto;
      margin-top: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .form-group button {
      display: block;
      width: 30%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: #fff;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-left: 180px;
    }
    .form-group button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  {% include "sidebar.php" %}
  <div aria-live="polite" aria-atomic="true" class="position-relative">
      <div class="toast-container top-0 end-0 p-3">
        <!-- Then put toasts within -->
      </div>
    </div>
  <div class="my-round" id="body">
    <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item" aria-current="page">Edit Course</li>
      </ol>
    </nav>
    <div class="row my-color mybg my-row" style="font-family: cursive;">
      <div class="ok d-flex justify-content-center align-items-center">
        <div class="col-md-6">
          <h3 style="text-align: center; margin-top: 10px;">Edit Lecture</h3>
          <form id="editForm" enctype="multipart/form-data">
            <input type="hidden" id="lectureId" name="id">

            <div class="mb-3">
              <label for="lectureTitle" class="form-label">Title</label>
              <input type="text" class="form-control" id="lectureTitle" name="title" required>
            </div>

            <div class="mb-3">
              <label for="lectureDescription" class="form-label">Description</label>
              <textarea class="form-control" id="lectureDescription" name="lecture_description" rows="4" required></textarea>
            </div>

            <div class="mb-3">
              <label for="lectureMaterial" class="form-label">PDF File</label>
              <input type="file" class="form-control" id="lectureMaterial" name="material" accept="application/pdf">
            </div>

            <div class="mb-3">
              <label for="lectureVideo" class="form-label">Video File</label>
              <input type="file" class="form-control" id="lectureVideo" name="video" accept="video/*">
            </div>

            <button type="button" id="saveChanges" class="btn btn-primary d-block mx-auto">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
  <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
  <script src="{% static 'js/script.js' %}"></script>
 
  <script>
    $(document).ready(function () {
      on_page_load([]);
      
      // Get lecture ID directly from URL (format: edit_video?11)
      const lectureId = window.location.href.split('?')[1];
      console.log("Lecture ID:", lectureId);

      if (!lectureId) {
          showToast("Invalid lecture ID", "danger");
          return;
      }

      // Fetch lecture details
      $.ajax({
          type: "GET",
          url: apiLink + "/api/course_video/get",
          headers: {
              Authorization: "Bearer " + getCookie("token"),
          },
          data: {
              lecture_id: lectureId,
          },
          success: function (res) {
              if (res && res.length > 0) {
                  const lecture = res[0];
                  $('#lectureId').val(lecture.id);
                  $('#lectureTitle').val(lecture.title);
                  $('#lectureDescription').val(lecture.lecture_description);
              } else {
                  showToast("Failed to load lecture details", "danger");
              }
          },
          error: function (err) {
              showToast("Failed to load lecture details", "danger");
          },
      });

      // Handle form submission for updating lecture details
      $('#saveChanges').on('click', function (e) {
          e.preventDefault();
          
          // Create a new FormData object
          const formData = new FormData();
          
          // Explicitly add each field with proper names
          formData.append('id', lectureId);
          formData.append('title', $('#lectureTitle').val());
          formData.append('lecture_description', $('#lectureDescription').val());
          
          // Only append files if they are selected
          const materialFile = $('#lectureMaterial')[0].files[0];
          const videoFile = $('#lectureVideo')[0].files[0];
          
          if (materialFile) {
              formData.append('material', materialFile);
          }
          if (videoFile) {
              formData.append('video', videoFile);
          }
          
          // Log the data being sent
          console.log("Submitting lecture update:");
          console.log("ID:", lectureId);
          console.log("Title:", $('#lectureTitle').val());
          console.log("Description:", $('#lectureDescription').val());
          console.log("Material:", materialFile);
          console.log("Video:", videoFile);
          
          $.ajax({
              type: "POST",
              url: apiLink + "/api/course_video/edit",
              headers: {
                  Authorization: "Bearer " + getCookie("token"),
              },
              data: formData,
              processData: false,
              contentType: false,
              success: function (res) {
                  console.log("Server response:", res);
                  
                  if (res.success) {
                      showToast('Lecture updated successfully', 'success');
                      
                      // Make a verification request
                      $.ajax({
                          type: "GET",
                          url: apiLink + "/api/course_video/get",
                          headers: {
                              Authorization: "Bearer " + getCookie("token"),
                          },
                          data: {
                              lecture_id: lectureId,
                          },
                          success: function(verifyRes) {
                              console.log("Verification response:", verifyRes);
                              
                              // Get course ID from referrer and redirect
                              const referrer = document.referrer;
                              const courseId = referrer.split('?')[1].split('&')[0];
                              const timestamp = new Date().getTime();
                              
                              setTimeout(() => {
                                  window.location.href = `/educator_view_lec_detail?${courseId}&${lectureId}`;
                              }, 3000);
                          }
                      });
                  } else {
                      showToast(res.message || 'Failed to update lecture', 'danger');
                  }
              },
              error: function (err) {
                  console.error("Update error:", err);
                  console.error("Error details:", err.responseJSON);
                  showToast('Failed to update lecture: ' + (err.responseJSON?.message || 'Server error'), 'danger');
              },
          });
      });
    });
  </script>
</body>
</html>
