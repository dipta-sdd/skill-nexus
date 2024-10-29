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
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <style>
      body {
        font-family: 'Roboto', sans-serif;
        background-color: #f4f7f6;
        color: #333;
      }
      .edit-course-form {
        max-width: 900px;
        margin: 20px auto;
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
        box-sizing: border-box;
      }
      .form-group input:focus,
      .form-group textarea:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        outline: none;
      }
      .form-group img {
        max-width: 100%;
        height: 200px;
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
        margin-left: 250px;
      }
      .form-group button:hover {
        background-color: #0056b3;
      }
      .form-row {
        display: flex;
        flex-wrap: wrap;
        margin: -10px;
      }
      .form-col {
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
      }
      .form-col.full-width {
        flex: 1 1 100%;
      }
      .form-row > .form-col {
        margin: 0;
      }
      @media (max-width: 768px) {
        .form-col {
          flex: 1 1 100%;
        }
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
          <li class="breadcrumb-item" aria-current="page">Edit Course</li>
        </ol>
      </nav>
      <div class="row my-color mybg my-row" style="font-family: cursive;">
        <div class="edit-course-form">
          <h2>Edit Course Details</h2>
          <form id="editCourse" enctype="multipart/form-data">
            <div class="form-group">
              <label for="title">Course Title</label>
              <input type="text" id="title" name="title" required>
            </div>
            <div class="form-row">
              <div class="form-col">
                <div class="form-group">
                  <label for="course_outcome">Course Outcome</label>
                  <textarea id="course_outcome" name="course_outcome" rows="4" required></textarea>
                </div>
              </div>
              <div class="form-col">
                <div class="form-group">
                  <label for="course_contain">Course Contain</label>
                  <textarea id="course_contain" name="course_contain" rows="4" required></textarea>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <div class="form-group">
                  <label for="course_fee">Course Fee</label>
                  <input type="number" id="course_fee" name="course_fee" required>
                </div>
              </div>
              <div class="form-col">
                <div class="form-group">
                  <label for="course_thumbnil">Course Thumbnail</label>
                  <input type="file" id="course_thumbnil" name="course_thumbnil" accept="image/*">
                  <!-- <img id="thumbnail_preview" src="" alt="Current Thumbnail"> -->
                </div>
              </div>
            </div>
            <div class="form-group">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/edit_detail.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
  </body>
</html>
