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
    <!-- <style>
    .course-list-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding: 15px 0;
    }
    .course-thumbnail {
      width: 70%;
      height: 70%;
      object-fit: cover;
    }
    .course-details {
      flex-grow: 1;
    }
    .course-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .course-outcome {
      margin: 10px 0;
      font-family: cursive;
      font-size: 1rem;
    }
    .course-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .course-actions button {
      width: 100px;
    }
    .modal-content {
      font-size: 1rem;
    }
    .video-card {
      background-color: #000;
      color: #fff;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
     
    }
    .video-thumbnail {
 
      margin-bottom: 20px;
    
    }
    .video-title {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    .video-description {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    .btn-outline-secondary {
      color: #fff;
      border-color: #fff;
    }
    .btn-outline-secondary:hover {
      background-color: #fff;
      color: #000;
    }
  </style> -->

    <style>
    .course-list-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: 15px 0;
    }

    .course-thumbnail {
        width: 70%;
        height: 70%;
        object-fit: cover;
    }

    .course-details {
        flex-grow: 2;
        padding: 0 20px;
    }

    .course-title {
        margin: 0;
        font-size: 1.0rem;
        /* Increased size */
        font-weight: bold;
        color: #343a40;
    }

    .course-outcome {
        margin: 10px 0;
        font-family: cursive;
        font-size: 1.1rem;
        /* Increased size */
        color: #6c757d;
    }

    .course-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        /* Adjust the gap between buttons */
    }

    .course-actions button {
        width: 120px;
    }

    .modal-content {
        font-size: 1rem;
        /* Adjust modal font size */
    }

    .video-card {
        background-color: #000;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .video-thumbnail video {
        width: 100%;
        border-radius: 10px;
    }

    .video-details {
        padding: 10px 0;
    }

    .video-title {
        margin-top: 20px;
        color: #007bff;
        font-weight: bold;
    }

    .video-description {
        margin-top: 20px;
        font-family: cursive;
        color: #343a40;
    }

    .btn-outline-secondary {
        margin-top: 20px;
        color: #343a40;
        border-color: #343a40;
    }

    .btn-outline-secondary:hover {
        background-color: #343a40;
        color: #fff;
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
                <li class="breadcrumb-item" aria-current="page">Showing Lecture Details</li>
            </ol>
        </nav>
        <!-- main body-->
        <div class="row my-color mybg my-row" id="course" style="font-family: cursive">
            <!-- Edit Modal -->
        </div>
        <!-- main body-->
    </div>
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script>
    $(document).ready(function() {
        on_page_load([]);
        const url = window.location.href;
        const params = url.split('?')[1].split('&');
        const courseId = params[0];
        const lectureId = params[1];

        $.ajax({
            type: "GET",
            url: apiLink + "/api/enrolled_course_video/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
                lecture_id: lectureId,
            },
            success: function(res) {
                $("#course").html("");
                res.forEach(function(courseLecture) {
                    showCourseLecture(courseLecture);
                });
            },
            error: function(err) {
                console.error('Failed to fetch course lectures:', err);
            },
        });

        // Function to display course lecture details
        function showCourseLecture(courseLecture) {
            $("#course").append(`
                <div class="col-12">
                    <div class="video-card md-5">
                        
                        <div class="video-thumbnail">
                            <center><video src="${apiLink + courseLecture.video}" controls style="width: 100%;"></video></center>
                        </div>
                        <div class="video-details">
                            <h4 class="video-title my-color">Lecture title: ${courseLecture.title}</h4>
                            <h4 class="video-description my-color" style="font-family:cursive;">Lecture Description: ${courseLecture.lecture_description}</h4>
                            <a href="${apiLink + courseLecture.material}" target="_blank" class="btn btn-sm btn-outline-secondary">Download Material</a>
                        </div>
                        
                    </div>
                </div>
            `);
        }
    });
    </script>
</body>

</html>