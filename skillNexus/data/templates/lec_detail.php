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
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
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
        font-size: 1.8rem;
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
        const courseId = url.split('?')[1]; // Extract the course ID from the URL

        // Fetch course lecture details based on the course ID
        $.ajax({
            type: "GET",
            url: apiLink + "/api/course_video/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
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
                <center><video src="${apiLink + courseLecture.video}" controls></video></center>
              </div>
              <div class="video-details">
                <h4 class="video-title">Lecture title: ${courseLecture.title}</h4>
                <h4 class="video-description">Lecture Description: ${courseLecture.lecture_description}</h4>
                <a href="${apiLink + courseLecture.material}" target="_blank" class="btn btn-sm btn-outline-secondary">Download Material</a>
               <a href="#" class="btn btn-danger" style="float:right; margin-left:10px;">Delete</a>
<a href="/edit_video?${courseLecture.id}" class="btn btn-primary" style="float:right;">Edit Lecture</a>

              </div>
            </div>
          </div>
        `);
        }

        // Function to handle edit video
        window.editVideo = function(id, title, description) {
            console.log("Edit button clicked"); // Debug log
            $('#lectureTitle').val(title);
            $('#lectureDescription').val(description);
            $('#editModal').modal('show');

            $('#saveChanges').off('click').on('click', function() {
                const updatedTitle = $('#lectureTitle').val();
                const updatedDescription = $('#lectureDescription').val();
                const updatedMaterial = $('#lectureMaterial')[0].files[0];
                const updatedVideo = $('#lectureVideo')[0].files[0];

                const formData = new FormData();
                formData.append('id', id);
                formData.append('title', updatedTitle);
                formData.append('lecture_description', updatedDescription);
                if (updatedMaterial) {
                    formData.append('material', updatedMaterial);
                }
                if (updatedVideo) {
                    formData.append('video', updatedVideo);
                }

                $.ajax({
                    type: "POST",
                    url: apiLink + "/api/course_video/edit",
                    headers: {
                        Authorization: "Bearer " + getCookie("token"),
                    },
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(res) {
                        $('#editModal').modal('hide');
                        location.reload();
                    },
                    error: function(err) {
                        console.error('Failed to update course lecture:', err);
                    },
                });
            });
        };

        // Function to handle delete video (adjust this as per your backend logic)
        window.deleteVideo = function(id) {
            if (confirm("Are you sure you want to delete this video?")) {
                $.ajax({
                    type: "DELETE",
                    url: apiLink + "/api/course_video/delete/" + id,
                    headers: {
                        Authorization: "Bearer " + getCookie("token"),
                    },
                    success: function(res) {
                        location.reload();
                    },
                    error: function(err) {
                        console.error('Failed to delete video:', err);
                    },
                });
            }
        };
    });
    </script>
</body>

</html>