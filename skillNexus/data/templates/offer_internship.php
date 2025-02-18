{% load static %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkilNexus - Offer Internship</title>
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
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <style>
      .form-section {
        background: var(--bg);
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      .select2-container--default .select2-selection--multiple {
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        min-height: 38px;
        background: var(--bg);
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
              <li class="breadcrumb-item"><a href="/view_internship_uni">Internships</a></li>
              <li class="breadcrumb-item active">Offer Internship</li>
            </ol>
          </nav>

          <!-- main body-->
          <div class="row mybg my-row">
            <div class="col-md-10 mx-auto">
              <div class="card shadow-lg">
                <div class="card-header bg-primary text-white py-4">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-university fa-2x me-3"></i>
                    <div>
                      <h3 class="card-title mb-0">Create Internship Offer</h3>
                      <p class="mb-0 mt-1 text-light">Create a new internship position for talented students</p>
                    </div>
                  </div>
                </div>
                <div class="card-body p-4">
                  <div class="alert alert-info mb-4">
                    <i class="fas fa-info-circle me-2"></i>
                    All fields marked with an asterisk (*) are required. Please ensure all information is accurate and complete.
                  </div>

                  <form id="internshipForm" class="needs-validation" novalidate>
                    <!-- Title Section -->
                    <div class="form-section">
                      <h5 class="mb-3">
                        <i class="fas fa-heading me-2"></i>Basic Information
                      </h5>
                      <div class="mb-3">
                        <label for="title" class="form-label fw-bold">
                          <i class="fas fa-briefcase me-2"></i>Position Title*
                        </label>
                        <input type="text" class="form-control" id="title" name="title" required 
                               placeholder="e.g., Research Assistant, Software Development Intern">
                        <div class="invalid-feedback">Please provide a position title.</div>
                      </div>
                    </div>

                    <!-- Description and Requirements Section -->
                    <div class="form-section">
                      <h5 class="mb-3">
                        <i class="fas fa-info-circle me-2"></i>Details
                      </h5>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label for="description" class="form-label fw-bold">
                            <i class="fas fa-file-alt me-2"></i>Position Description*
                          </label>
                          <textarea class="form-control" id="description" name="description" rows="6" required
                                    placeholder="• Key responsibilities&#10;• Learning opportunities&#10;• Department/team information&#10;• Project details"></textarea>
                          <div class="invalid-feedback">Please provide a detailed description.</div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label for="requirements" class="form-label fw-bold">
                            <i class="fas fa-check-circle me-2"></i>Eligibility Requirements*
                          </label>
                          <textarea class="form-control" id="requirements" name="requirements" rows="6" required
                                    placeholder="• Academic requirements&#10;• Required coursework&#10;• Technical skills&#10;• Other qualifications"></textarea>
                          <div class="invalid-feedback">Please specify the requirements.</div>
                        </div>
                      </div>
                    </div>

                    <!-- Skills Section -->
                    <div class="form-section">
                      <h5 class="mb-3">
                        <i class="fas fa-tools me-2"></i>Required Skills*
                      </h5>
                      <div class="mb-3">
                        <label class="form-label">Select Required Skills</label>
                        <select class="form-control" id="skills" name="skills[]" multiple="multiple">
                          <!-- Skills will be loaded dynamically -->
                        </select>
                        <div class="form-text">Select all skills that are required for this internship</div>
                      </div>
                    </div>

                    <!-- Duration and Stipend Section -->
                    <div class="form-section">
                      <h5 class="mb-3">
                        <i class="fas fa-file-contract me-2"></i>Terms
                      </h5>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label for="duration" class="form-label fw-bold">
                            <i class="fas fa-clock me-2"></i>Duration*
                          </label>
                          <div class="input-group"style="background: var(--bg);">
                            <input type="number" class="form-control" id="duration" name="duration_months" min="1" required>
                            <span class="input-group-text my bg my-color">months</span>
                          </div>
                          <div class="form-text">Minimum duration: 1 month</div>
                          <div class="invalid-feedback">Please specify the duration.</div>
                        </div>
                        <div class="col-md-6 mb-3" style="background: var(--bg);">
                          <label for="stipend" class="form-label fw-bold">
                            <i class="fas fa-money-bill-alt me-2"></i>Monthly Stipend
                          </label>
                          <div class="input-group">
                            <span class="input-group-text bg-light">$</span>
                            <input type="number" class="form-control" id="stipend" name="stipend" min="0" step="0.01">
                          </div>
                          <div class="form-text">Leave blank if unpaid position</div>
                        </div>
                      </div>
                    </div>

                    <!-- Location Section -->
                    <div class="form-section">
                      <h5 class="mb-3">
                        <i class="fas fa-map-marker-alt me-2"></i>Location*
                      </h5>
                      <div class="row">
                        <div class="col-md-12 mb-3">
                          <label for="location" class="form-label fw-bold">
                            <i class="fas fa-map-marker-alt me-2"></i>Location*
                          </label>
                          <input type="text" class="form-control" id="location" name="location" required
                                 placeholder="e.g., University Campus, Remote, or Hybrid">
                          <div class="invalid-feedback">Please specify the location.</div>
                        </div>
                      </div>
                    </div>

                    <!-- Positions and Dates Section -->
                    <div class="form-section">
                      <h5 class="mb-3">
                        <i class="fas fa-calendar-alt me-2"></i>Important Dates
                      </h5>
                      <div class="row">
                        <div class="col-md-4 mb-3">
                          <label for="positions" class="form-label fw-bold">
                            <i class="fas fa-users me-2"></i>Available Positions*
                          </label>
                          <input type="number" class="form-control" id="positions" name="positions_available" min="1" required>
                          <div class="invalid-feedback">Please specify the number of positions.</div>
                        </div>
                        <div class="col-md-4 mb-3">
                          <label for="startDate" class="form-label fw-bold">
                            <i class="fas fa-calendar-alt me-2"></i>Start Date*
                          </label>
                          <input type="date" class="form-control" id="startDate" name="start_date" required>
                          <div class="form-text">When the internship begins</div>
                          <div class="invalid-feedback">Please specify the start date.</div>
                        </div>
                        <div class="col-md-4 mb-3">
                          <label for="deadline" class="form-label fw-bold">
                            <i class="fas fa-hourglass-end me-2"></i>Application Deadline*
                          </label>
                          <input type="date" class="form-control" id="deadline" name="application_deadline" required>
                          <div class="form-text">Must be before start date</div>
                          <div class="invalid-feedback">Please specify a valid deadline.</div>
                        </div>
                      </div>
                    </div>

                    <hr class="my-4">

                    <div class="d-flex justify-content-end gap-3">
                      <button type="button" class="btn btn-light" onclick="resetForm()">
                        <i class="fas fa-undo me-2"></i>Reset Form
                      </button>
                      <button type="submit" class="btn btn-primary btn-lg">
                        <i class="fas fa-paper-plane me-2"></i>Publish Internship
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add CSS for skills -->
    <style>
      .skill-badge {
        display: inline-block;
        padding: 0.5em 1em;
        margin: 0.2em;
        border-radius: 20px;
        background-color: var(--bg);
        border: 1px solid #dee2e6;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
        background: var(--bg);
      }

      .skill-badge:hover {
        background-color: #e9ecef;
      }

      .skill-badge.selected {
        background-color: var(--bg);
        color: black;
        border-color: #0d6efd;
        
      }

      .selected-skills .skill-badge {
        background-color: var(--bg);
        color: white;
        border-color: #0d6efd;
      }

      .selected-skills .skill-badge i {
        margin-left: 0.5em;
        cursor: pointer;
      }

      .skills-container {
        max-height: 200px;
        overflow-y: auto;
      }

      .form-control:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
      }

      .card {
        border: none;
        border-radius: 0.5rem;
      }

      .card-header {
        border-radius: 0.5rem 0.5rem 0 0 !important;
      }

      .btn {
        border-radius: 0.25rem;
        padding: 0.5rem 1.5rem;
      }

      .btn-lg {
        padding: 0.75rem 2rem;
      }

      .form-text {
        color: #6c757d;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      textarea {
        resize: none;
      }
    </style>
    
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
        
        // Initialize Select2 for skills
        $('#skills').select2({
          placeholder: 'Select required skills',
          allowClear: true,
          width: '100%'
        });

        // Set minimum date for deadline and start date to today
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        $('#deadline').attr('min', todayStr);
        $('#startDate').attr('min', todayStr);

        // Add event listeners for date validation
        $('#deadline').on('change', function() {
            const deadlineDate = new Date(this.value);
            const startDate = new Date($('#startDate').val());
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

            if (deadlineDate < today) {
                showToast("Deadline cannot be in the past", "warning");
                this.value = '';
                return;
            }

            if (startDate && deadlineDate >= startDate) {
                showToast("Deadline must be before the start date", "warning");
                this.value = '';
                return;
            }

            // Update start date minimum to be after deadline
            $('#startDate').attr('min', this.value);
        });

        $('#startDate').on('change', function() {
            const startDate = new Date(this.value);
            const deadlineDate = new Date($('#deadline').val());
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

            if (startDate < today) {
                showToast("Start date cannot be in the past", "warning");
                this.value = '';
                return;
            }

            if (deadlineDate && startDate <= deadlineDate) {
                showToast("Start date must be after the deadline", "warning");
                this.value = '';
                return;
            }
        });
        
        // Load skills
        $.ajax({
          url: '/api/skills/all',
          method: 'GET',
          success: function(response) {
            const skills = response;
            const skillSelect = $('#skills');
            skills.forEach(skill => {
              skillSelect.append(new Option(skill.name, skill.id));
            });
          },
          error: function(xhr) {
            console.error('Error loading skills:', xhr);
          }
        });

        // Form submission with additional validation
        $('#internshipForm').on('submit', function(e) {
          e.preventDefault();
          
          // Additional date validation before submission
          const deadlineDate = new Date($('#deadline').val());
          const startDate = new Date($('#startDate').val());
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (deadlineDate < today) {
              showToast("Deadline cannot be in the past", "warning");
              return;
          }

          if (startDate < today) {
              showToast("Start date cannot be in the past", "warning");
              return;
          }

          if (deadlineDate >= startDate) {
              showToast("Deadline must be before the start date", "warning");
              return;
          }
          
          const formData = new FormData(this);
          
          // Add selected skills
          const selectedSkills = $('#skills').val();
          if (selectedSkills) {
            selectedSkills.forEach(skillId => {
              formData.append('skills[]', skillId);
            });
          }
          
          $.ajax({
            url: '/api/internship/create/',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
              'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function(response) {
              showToast("Internship offer created successfully!", "success");
              setTimeout(() => {
                window.location.href = '/view_internship';
              }, 2000);
            },
            error: function(xhr) {
              showToast(xhr.responseText || 'Error creating internship offer', "danger");
            }
          });
        });
      });

      // Helper function to show toast messages
      function showToast(message, type) {
        const toast = $(`
          <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
              <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
                ${message}
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
          </div>
        `);
        $('.toast-container').append(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
      }
    </script>
  </body>
</html>
 