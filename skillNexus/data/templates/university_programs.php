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
    <link
      href="{% static 'css/bootstrap.min.css' %}"
      rel="stylesheet"
       
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <link rel="stylesheet" href="{%  static 'css/programs.css' %}" />
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
              <li class="breadcrumb-item" aria-current="page">Programs</li>
            </ol>
          </nav>
            <!-- Modal -->
            <div class="modal fade modal-lg" style="z-index: 6000" id="addProgram" tabindex="-1" aria-labelledby="myModel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5 my-color" id="myModel">Add Program/Course</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <p><small class="text-danger d-none">* Please state your all academic degrees</small></p>
                      
                      <div class=" mb-3 col-lg-12">
                        <label class="my-color"> Program or Course Title
                          <span class="text-danger">*</span></label>
                        <input class="form-control py-0 form-control-sm " name="name" placeholder="Program/Coures Title"/>
                      </div>
                      <div class=" mb-3 col-lg-12">
                        <label class="my-color">Description
                          <span class="text-danger">*</span></label>
                        <textarea class="form-control py-0 form-control-sm " name="description" placeholder="Description"></textarea>
                      </div>
                      <div class=" mb-3 col-lg-6">
                        <label class="my-color">Type
                          <span class="text-danger">*</span></label>
                        <select class="form-control py-0 form-control-sm " name="type" placeholder=" Please Select One">
                          <option value="">Please Select One</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Professional">Professional</option>
                          <option value="Certificate">Certificate</option>
                          <option value="Doctoral">Doctoral</option>
                        </select>
                      </div>
                      <div class=" mb-3 col-lg-6">
                        <label class="my-color ">Duration
                          <span class="text-danger">*</span></label>
                        <div class="form-control">
                          <div class="row">
                            <div class=" mb-3 col-lg-6">
                              <label class="my-color"> Year
                                <span class="text-danger">*</span></label>
                              <input type="number" class="form-control py-0 form-control-sm " name="duration_year" placeholder=" "/>
                            </div>
                            <div class=" mb-3 col-lg-6">
                              <label class="my-color">Month
                                <span class="text-danger">*</span></label>
                              <input number class="form-control py-0 form-control-sm " name="duration_month" placeholder=" "/>
                            </div>
                          </div>
                        </div>
                      </div>
                      


                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          <!-- Modal -->
          <!-- Modal -->
          <!-- Modal -->
          <!-- Modal -->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          
          <div class="row my-color mybg my-row">
            <div class="d-flex">
              <h2 class="flex-grow-1 mb-2 text-primary"><b>Programs & Courses</b></h2>
              <div class="mb-2">
                <button type="button" class="btn btn-outline-primary btn-add" data-bs-toggle="modal" data-bs-target="#addProgram">
                  <i class="fa-solid fa-plus me-2"> </i>Add New
                </button>
              </div>
            </div>
            <hr class="profile-hr" />
            <div class="col-12">
              <div class="row details">
                <div class="col ">
                  <div class="row px-5 program-con">
                    <div class="row" id="program22">
                      <div class="col-xl-9 ">
                        <span class="name">
                          Program
                        </span>
                        <br>
                        <span class="type">
                          type
                        </span>
                      </div>
                      <div class="col-xl-3 pt-1 ">
                        <div class="row">
                          <div class="col-xl-12 col-6 smaller_details-con">
                            <span class="smaller-details"><svg class="Icon_icon__2UXCa" width="14" height="14" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><title>86017104-411A-4112-AC71-935BCF9B16F1</title><path d="M9.691 10.881a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm7.208-2.978a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm10.641-3.544H.876v-1.31c0-.648.528-1.176 1.177-1.176h.84v.504a.439.439 0 0 0 .878 0v-.504h6.46v.504a.439.439 0 0 0 .875 0v-.504h.84c.65 0 1.178.528 1.178 1.176v1.31zm0 8.34c0 .65-.528 1.178-1.177 1.178H2.053c-.65 0-1.177-.528-1.177-1.177V5.235h12.248V12.7zM11.947.997h-.84V.438a.437.437 0 1 0-.877 0v.558H3.771V.438a.438.438 0 1 0-.877 0v.558h-.84A2.055 2.055 0 0 0 0 3.05v9.65c0 1.134.921 2.055 2.053 2.055h9.894A2.055 2.055 0 0 0 14 12.7V3.05c0-1.133-.92-2.054-2.053-2.054z" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
                            &nbsp; 0 Year 6 Months</span>
                          </div>
                          <div class="col-xl-12 col-6 mb-2">
                            <div class="smaller_details-con pt-3">
                                <i class="fa-solid fa-pen fa-xl my-color btn-edit" target="22"></i>
                                <i class="fa-solid fa-trash fa-xl my-color btn-del" target="22"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr class="mb-1">
                      <div class="col-12">
                        <strong>Dscription: </strong> description
                      </div>
                      
                    </div>
                    
                    <hr>
                    

                  </div>  




                  </div>
                </div>
              </div>
           
            </div>
          
          

            <div class="card my-row rounded-0 mybg m-0 border-0 mb-2">
              <div class="card-header" style="margin: -10px -10px 0 -10px">
                <div class="d-flex justify-content-between">
                  <h3 class="card-title mb-0">Applicant List</h3>
      
                </div>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="applicantSearch"
                    placeholder="Search applicants..."
                  />
                </div>
                <div class="table-responsive">
                  <table class="table table-striped table-bordered">
                    <thead>
                      <tr class="my-color">
                        <th>#</th>
                        <!-- <th></th> -->
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Country</th>
                        <th>Status</th>
                        <th>Program Name</th>
                        <th>Session Name</th>
                        <th>Comment</th>
                        <th>Submission Date</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody id="applicantsTable">
                      {% for applicant in applicants %}
                      <tr class="my-color">
                        <td>{{ forloop.counter }}</td>
                        <!-- <td><img src="/{{ applicant.profile_picture }}" alt=" Picture" width="50" height="50"></td> -->
                        <td>{{ applicant.student_name }}</td>
                        <td>{{ applicant.student_id }}</td>
                        <td style="text-transform: unset">{{ applicant.email }}</td>
                        <td>{{ applicant.mobile }}</td>
                        <td>{{ applicant.country }}</td>
                        <td>
                          <span
                            class="badge {% if applicant.status == 'Approved' %}bg-success{% elif applicant.status == 'Rejected' %}bg-danger{% else %}bg-warning{% endif %}"
                          >
                            {{ applicant.status }}
                          </span>
                        </td>
                        <td>{{ applicant.program_name }}</td>
                        <td>{{ applicant.session_name }}</td>
                        <td>{{ applicant.comment }}</td>
                        <td>{{ applicant.created_at|date:"Y-m-d h:i A" }}</td>
                        <td>{{ applicant.updated_at|date:"Y-m-d h:i A" }}</td>
                      </tr>
                      {% endfor %}
                    </tbody>
                  </table>
                </div>
                <!-- Pagination controls would go here -->
              </div>
            </div>



          <!-- end main body-->
          <!-- end main body-->
          <!-- end main body-->
          <!-- end main body-->
          </div> 
          <!-- end main body-->
          <!-- end main body-->
          <!-- end main body-->
          <!-- end main body-->
        </div>
      </div>
    </div>

   
<script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>

    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/programs.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load(['University']);
        $(document).on('keyup', '#applicantSearch', function (e) {
          var search = $(this).val().toLowerCase();
          const rows = $('#applicantsTable tr');
          $.each(rows, function (indexInArray, row) { 
             const cells = $(row).find('td');
             if (cells.eq(1).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(2).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(3).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(4).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(5).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(6).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(7).text().toLowerCase().includes(search)) $(row).show();
             else if (cells.eq(8).text().toLowerCase().includes(search)) $(row).show();
             else $(row).hide();
          });
        });
      });
    </script>
  </body>
</html>
 