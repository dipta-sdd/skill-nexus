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

    .discussion-post {
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }

    .discussion-post:hover {
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .discussion-main {
        position: relative;
    }

    .discussion-avatar img {
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .discussion-content {
        width: 100%;
    }

    .discussion-header {
        margin-bottom: 0.5rem;
    }

    .discussion-body {
        color: #2c3e50;
    }

    .discussion-actions button {
        color: #6c757d;
        text-decoration: none;
        transition: color 0.2s;
    }

    .discussion-actions button:hover {
        color: #0056b3;
    }

    .discussion-replies {
        border-left: 3px solid var(--border-color);
        padding-left: 1.5rem;
        margin-left: 2rem;
        margin-top: 1rem;
    }

    .comment-actions {
        opacity: 0;
        transition: opacity 0.2s;
    }

    .discussion-post:hover .comment-actions {
        opacity: 1;
    }

    .badge {
        font-size: 0.75em;
        padding: 0.25em 0.5em;
    }

    /* Comment list container */
    .comment-list-container {
        max-height: 600px;
        overflow-y: auto;
        padding: 1rem;
        background: var(--bg-color);
        border-radius: 8px;
    }

    /* Scrollbar styling */
    .comment-list-container::-webkit-scrollbar {
        width: 8px;
    }

    .comment-list-container::-webkit-scrollbar-track {
        background: var(--bg-color);
    }

    .comment-list-container::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 4px;
    }

    /* Video styling */
    .course-video {
        max-height: 400px;
        width: 100%;
        object-fit: contain;
    }

    .star-rating {
        display: flex;
        flex-direction: row-reverse;
        gap: 0.25rem;
        margin-bottom: 1rem;
    }

    .star-rating input {
        display: none;
    }

    .star-rating label {
        cursor: pointer;
        color: #ddd;
        font-size: 1.5rem;
    }

    .star-rating label:hover,
    .star-rating label:hover ~ label,
    .star-rating input:checked ~ label {
        color: #ffc107;
    }

    .star-rating label i {
        transition: color 0.2s ease;
    }

    .review-item {
        transition: background-color 0.2s ease;
    }

    .review-item:hover {
        background-color: rgba(0,0,0,0.01);
    }

    .review-item:last-child {
        border-bottom: none !important;
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }

    .dropdown-item {
        font-size: 0.875rem;
    }

    .dropdown-item i {
        width: 1rem;
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
        <li class="breadcrumb-item" aria-current="page">Course</li>
      </ol>
    </nav>

    <!-- main body-->
    <div class="row my-color mybg my-row" id="course" style="font-family: cursive;">
    </div>
    <!-- main body-->
  </div>

  <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
  <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
  <script src="{% static 'js/script.js' %}"></script>
  <script src="{% static 'js/single_course_detail.js' %}"></script>
  <script>
    $(document).ready(function() {
      on_page_load([]);
    });
  </script>
</body>

</html>