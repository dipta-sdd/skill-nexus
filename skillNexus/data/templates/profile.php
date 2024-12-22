{% load static %}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkilNexus | Profile</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{% static 'css/cropper.min.css' %}" />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <link rel="stylesheet" href="{%  static 'css/profile.css' %}" />
</head>

<body>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container top-0 end-0 p-3">
            <!-- Then put toasts within -->
        </div>
    </div>
    {% include "sidebar.php" %}

    <div class="my-round" id="body" data-bs-theme="light">
        <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Home</a></li>
                <li class="breadcrumb-item" aria-current="page">Profile</li>
            </ol>
        </nav>
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <div class="row my-color mybg my-row">
            <div class="col d-flex">
                <div class="profile-pic">
                    <!-- if no profile picture then it will be shown -->
                    <i class="fa-regular fa-user fa-2xl"></i>
                    <button type="button" class="btn btn-primary edit-pic-btn" data-bs-toggle="modal"
                        data-bs-target="#profilePicChangeModal">
                        <i class="fa-solid fa-pen fa-lg" style="color: #ffffff"></i>
                    </button>
                    <!-- modal -->
                    <!-- modal -->
                    <!-- modal -->
                    <!-- Modal -->
                    <!-- Modal for profile pic change -->
                    <div class="modal fade" id="profilePicChangeModal" data-bs-backdrop="static"
                        data-bs-keyboard="false" tabindex="-1" aria-labelledby="profilePicChangeModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="profilePicChangeModalLabel">
                                        Change Profile Picture
                                    </h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <!-- preview img -->
                                    <img id="imagePreview" src="#" alt="Image Preview"
                                        style="max-width: 200px; display: none" />
                                    <!-- preview img -->
                                    <div class="input-group mb-3">
                                        <input type="file" class="form-control" id="imageUpload" accept="image/*" />
                                        <input type="hidden" id="croppedImageData" name="croppedImage" />
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" class="btn btn-primary" id="saveCropedPic">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- modal -->
                    <!-- modal -->
                    <!-- modal -->
                </div>

                <div class="ps-3 profile-details">
                    <div class="row">
                        <b class="name"></b>
                        <i class="username"></i>
                        <p class="role align-bottom my-color"></p>
                    </div>
                </div>

                <div class="ms-auto">
                    {% if user.role == "Student" or user.role == "Freelancer" %}
                    <button type="button" class="btn btn-outline-primary ms-auto me-0">
                        Download CV
                    </button>
                    {% endif %}
                </div>
            </div>
        </div>
        <!-- profile -->
        <div class="row my-color mybg my-row" id="profile">
            <div class="d-flex">
                <b class="flex-grow-1">Profile details</b>
                <div>
                    <button type="button" class="btn btn-outline-primary btn-edit-p" id="btn-edit-profile">
                        <i class="fa-solid fa-pen pe-1"> </i>Edit
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-save-p d-none" id="btn-save">
                        Save
                    </button>
                </div>
            </div>
            <div class="col-11"></div>
            <div class="col-1"></div>
            <hr class="profile-hr" />
            <div class="col-12">
                <div class="row profile-details2"></div>
            </div>
        </div>
        <!-- personal details -->
        <div class="row my-color mybg my-row" id="personal">
            <div class="d-flex">
                <b class="flex-grow-1">Personal details</b>
                <div>
                    <button type="button" class="btn btn-outline-primary btn-edit-p" id="btn-edit-personal">
                        <i class="fa-solid fa-pen pe-1"> </i>Edit
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-save-p d-none" id="btn-save-personal">
                        Save
                    </button>
                </div>
            </div>
            <div class="col-11"></div>
            <div class="col-1"></div>
            <hr class="profile-hr" />
            <div class="col-12">
                <div class="row personal-details"></div>
            </div>
        </div>
        <!-- company details -->
        <div class="row my-color mybg my-row company">
            <div class="d-flex">
                <b class="flex-grow-1">Company Details</b>
                <div>
                    <button type="button" class="btn btn-outline-primary btn-edit">
                        <i class="fa-solid fa-pen pe-1"> </i>Edit
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-save d-none">
                        Save
                    </button>
                </div>
            </div>
            <div class="col-11"></div>
            <div class="col-1"></div>
            <hr class="profile-hr" />
            <div class="col-12">
                <div class="row details">
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Company Name </span>
                            <input type="text" name="name" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Industry </span>
                            <input type="text" name="industry" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Description </span>
                            <textarea type="text" name="description" value="" class="form-control per-name"
                                disabled=""></textarea>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Address </span>
                            <input type="text" name="address" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Website </span>
                            <input type="text" name="url" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>




                </div>
            </div>
        </div>
        <!-- university details  -->
        <div class="row my-color mybg my-row university">
            <div class="d-flex">
                <b class="flex-grow-1">University Details</b>
                <div>
                    <button type="button" class="btn btn-outline-primary btn-edit">
                        <i class="fa-solid fa-pen pe-1"> </i>Edit
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-save d-none">
                        Save
                    </button>
                </div>
            </div>
            <div class="col-11"></div>
            <div class="col-1"></div>
            <hr class="profile-hr" />
            <div class="col-12">
                <div class="row details">
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">University Name </span>
                            <input type="text" name="name" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Description </span>
                            <textarea type="text" name="description" value="" class="form-control per-name"
                                disabled=""></textarea>
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Address </span>
                            <input type="text" name="address" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Website </span>
                            <input type="text" name="url" value="" class="form-control per-name" disabled="">
                        </div>
                    </div>




                </div>
            </div>
        </div>
        <!--_________________________________________-->
        <!--_________________________________________-->
        <!--_________________________________________-->
        <!--_________________________________________-->
        <!-- skills -->
        <!-- skills -->
        <!-- skills -->
        <!-- skills -->
        <!-- skills -->
        <!-- skills -->
        <!-- skills -->
        <!-- ________________________________________ -->
        <!-- ________________________________________ -->
        <!-- ________________________________________ -->
        <!-- ________________________________________ -->
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
    <script src="{% static 'js/cropper.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/profile.js' %}"></script>
    <script>
    $(document).ready(function() {
        on_page_load();
    });
    </script>
</body>

</html>