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
    <style>
    .course-list-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: 15px 0;
    }

    .course-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .course-details {
        flex-grow: 1;
    }

    .course-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: bold;
    }

    .course-outcome {
        margin: 10px 0;
        font-size: 0.9rem;
    }

    .course-actions {
        margin-left: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .course-actions a,
    .course-actions button {
        margin-bottom: 5px;
        width: 100px;
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
        <div class="row my-color mybg my-row" id="course" style="font-family: cursive;">
        </div>
        <!-- Modal -->

        <!-- Modal -->
        <div class="modal fade modal-lg" style="z-index: 6000;" id="addTrainModel" tabindex="-1"
            aria-labelledby="myModel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="font-family:cursive;">
                    <div class="modal-header bg-primary text-light">
                        <h5 class="modal-title" id="myModel">Enrollment Confirmation</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body my-color">
                        <h4 class="mb-3" style="font-family:cursive;">Are you sure you want to enroll?</h4>
                        <p class="lead my-color" style="font-family:cursive;">Course Fee: <span id="course_fee"></span>
                            will be
                            deducted.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Yes</button>
                        <button type="button" class="btn btn-danger">No</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->

        <!-- Modal -->
        <!-- main body-->
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/course_list_single.js' %}"></script>
    <script>
    $(document).ready(function() {
        on_page_load([]);
    });
    </script>
</body>

</html>