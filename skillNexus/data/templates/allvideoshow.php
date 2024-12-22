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
        .video-card {
            display: flex;
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 10px;
            /* background-color: #fff; */
        }
        .video-thumbnail {
            width: 200px;
            height: 120px;
            margin-right: 20px;
        }
        .video-thumbnail img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
        }
        .video-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .video-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .video-uploader {
            font-size: 18px;
            /* color: #555; */
            opacity: .8;
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
    <div class="container my-color mybg my-row" id="course" style="font-family:cursive">
        <!-- Video cards will be appended here -->
    </div>
    <!-- main body-->
</div>

{% include "footer.html" %}
<script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
<script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
<script src="{% static 'js/script.js' %}"></script>
<script src="{% static 'js/allvideoshow.js' %}"></script>

<script>
    $(document).ready(function () {
        on_page_load([]);
    });
</script>
</body>
</html>
