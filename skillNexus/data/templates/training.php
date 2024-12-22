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
  <link rel="stylesheet" href="{%  static 'css/training.css' %}" />
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
        <li class="breadcrumb-item" aria-current="page">Training</li>
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
    <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTrainModel">
              Launch demo modal
            </button> -->

    <!-- Modal -->
    <div class="modal fade modal-lg" style="z-index: 6000" id="addTrainModel" tabindex="-1"
      aria-labelledby="myModel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 my-color" id="myModel">Add Training</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <p><small class="text-danger d-none">* Please state your all academic degrees</small></p>
              <div class=" mb-3 col-lg-6">
                <label class="my-color">Training Title
                  <span class="text-danger">*</span></label>
                <input class="form-control py-0 form-control-sm " name="title"
                  placeholder="Training Title" />
              </div>

              <div class=" mb-3 col-lg-6">
                <label class="my-color">Institution Name
                  <span class="text-danger">*</span></label>
                <input class="form-control py-0 form-control-sm" name="institution_name"
                  placeholder="Institution Name" />
              </div>

              <div class=" mb-3 col-lg-6">
                <label class="my-color">Country
                  <span class="text-danger">*</span></label>
                <input class="form-control py-0 form-control-sm " name="country" placeholder="Country"
                  list="country" />
                <datalist id="country">
                  <!-- <option value="Black">
                            <option value="Red">
                            <option value="Green">
                            <option value="Blue">
                            <option value="White"> -->
                </datalist>
              </div>

              <div class=" mb-3 col-lg-6">
                <label class="my-color">Duration
                  <span class="text-danger">*</span></label>
                <div class="form-control">
                  <div class="row">
                    <div class=" mb-3 col-4">
                      <label class="my-color">Year
                        <span class="text-danger">*</span></label>
                      <select class="form-control form-select py-0 form-control-sm "
                        name="duration_year">
                        <option value=""></option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                    <div class=" mb-3 col-4">
                      <label class="my-color">Month
                        <span class="text-danger">*</span></label>
                      <select class="form-control form-select py-0 form-control-sm"
                        name="duration_month">
                        <option value=""></option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                      </select>
                    </div>
                    <div class=" mb-3 col-4">
                      <label class="my-color">Day
                        <span class="text-danger">*</span></label>
                      <select class="form-control form-select py-0 form-control-sm"
                        name="duration_day">
                        <option value=""></option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
              <div class=" mb-3 col-lg-6">
                <label class="my-color">Start Date
                  <span class="text-danger">*</span></label>
                <input type="date" class="form-control py-0 form-control-sm " name="start_date" />
              </div>
              <div class=" mb-3 col-lg-6">
                <label class="my-color">End Date
                  <span class="text-danger">*</span></label>
                <input type="date" class="form-control py-0 form-control-sm " name="end_date" />
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
    <div class="row my-color mybg my-row" id="training">
      <div class="d-flex">
        <h2 class="flex-grow-1 mb-2"><b>Training</b></h2>
        <div class="mb-2">
          <button type="button" class="btn btn-outline-primary btn-add" data-bs-toggle="modal"
            data-bs-target="#addTrainModel">
            <i class="fa-solid fa-plus me-2"> </i>Add Training
          </button>
        </div>
      </div>
      <hr class="profile-hr" />
      <div class="col-12">
        <div class="row details">
          <div class="col ">
            <div class="row px-5 training-con">


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
  <script src="{% static 'js/training.js' %}"></script>
  <script>
    $(document).ready(function() {
      on_page_load(["Student"]);
    });
  </script>
</body>

</html>