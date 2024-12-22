{% load static %}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkilNexus | Education</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <link rel="stylesheet" href="{%  static 'css/education.css' %}" />
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
                <li class="breadcrumb-item"><a href="/profile">Profile</a></li>
                <li class="breadcrumb-item" aria-current="page">Education</li>
            </ol>
        </nav>
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- Modal -->
        <!-- Modal -->
        <!-- Modal -->
        <!-- Modal -->
        <!-- Button trigger modal -->
        <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEduModel">
              Launch demo modal
            </button> -->

        <!-- Modal -->
        <div class="modal fade modal-lg" style="z-index: 6000" id="addEduModel" tabindex="-1" aria-labelledby="myModel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 my-color" id="myModel">Add Education</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <p><small class="text-danger d-none">* Please state your all academic degrees</small></p>
                            <div class=" mb-3 col-lg-6">
                                <label class="my-color" for="floatingInput">Education Level
                                    <span class="text-danger">*</span></label>
                                <select class="form-control form-select py-0 form-control-sm   level" name="level"
                                    aria-label="Default select example">
                                    <option class="default" selected value="">Please select education level</option>
                                </select>
                            </div>

                            <div class=" mb-3 col-lg-6">
                                <label class="my-color" for="floatingInput">Degree
                                    <span class="text-danger">*</span></label>
                                <select class="form-control form-select py-0 form-control-sm   degree dis" name="degree"
                                    aria-label="Default select example">
                                    <option class="default" selected value="">Please select degree</option>
                                </select>
                            </div>

                            <div class=" mb-3 col-lg-6">
                                <label class="my-color" for="floatingInput">Subject/Group
                                    <span class="text-danger">*</span></label>
                                <select class="form-control form-select py-0 form-control-sm   group" name="group"
                                    aria-label="Default select example">
                                    <option class="default" selected value="">Please select subject/group</option>
                                </select>
                            </div>

                            <div class=" mb-3 col-lg-6">
                                <label class="my-color" for="floatingInput">Division/Class/Grade
                                    <span class="text-danger">*</span></label>
                                <select class="form-control form-select py-0 form-control-sm   result_type"
                                    name="result_type" aria-label="Default select example">
                                    <option class="default" selected value="">Please select result type</option>
                                    <option value="Class">Class </option>
                                    <option value="Grade">Grade </option>
                                    <option value="Division">Division </option>
                                </select>
                            </div>

                            <div class=" mb-3 col-lg-6 con_result d-none">
                                <label class="my-color" for="floatingInput">Result
                                    <span class="text-danger">*</span></label>
                                <select class="form-control form-select py-0 form-control-sm result" name="result"
                                    aria-label="Default select example">
                                    <option class="default" selected value="">Select result</option>
                                    <option value="1">1st </option>
                                    <option value="2">2nd </option>
                                    <option value="3">3rd </option>
                                </select>
                            </div>

                            <div class=" mb-3 col-lg-6 con_gpa d-none">
                                <label class="my-color" for="floatingInput">GPA/CGPA
                                    <span class="text-danger">*</span></label>
                                <input type="number" class="form-control py-1 gpa" name="gpa">
                            </div>

                            <div class=" mb-3 col-lg-6 con_range d-none">
                                <label class="my-color" for="floatingInput">GPA/CGPA Scale
                                    <span class="text-danger">*</span></label>
                                <input type="number" class="form-control py-1 gpa_range" name="gpa_scale">
                            </div>

                            <div class=" mb-3 col-lg-6">
                                <label class="my-color" for="floatingInput">Passing Year
                                    <span class="text-danger">*</span></label>
                                <input type="number" class="form-control py-1 passing_year" name="passing_year">
                            </div>

                            <div class=" mb-3 col-lg-6">
                                <label class="my-color" for="floatingInput">Institute
                                    <span class="text-danger">*</span></label>
                                <input type="text" class="form-control py-1 institute" name="institute">
                            </div>

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <!-- Modal -->
        <!-- Modal -->
        <!-- Modal -->

        <!-- Education -->
        <div class="row my-color mybg my-row" id="education">
            <div class="d-flex">
                <h2 class="flex-grow-1 mb-2"><b>Education</b></h2>
                <div class="mb-2">
                    <button type="button" class="btn btn-outline-primary btn-add" data-bs-toggle="modal"
                        data-bs-target="#addEduModel">
                        <i class="fa-solid fa-plus me-2"> </i>Add Education
                    </button>
                </div>
            </div>
            <hr class="profile-hr" />
            <div class="col-12">
                <div class="row details">
                    <div class="col ">
                        <div class="row px-5 result-con">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

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
    <script src="{% static 'js/education.js' %}"></script>
    <script>
    $(document).ready(function() {
        on_page_load(["Student"]);
    });
    </script>
</body>

</html>