{% load static %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    {% csrf_token %}
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
    <style>
      .submission-stats {
        background: var(--bg);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .stat-card {
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background: var(--bg);
      }
      .stat-number {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
      }
      .expanded-row {
        background-color: #f8f9fa;
      }
      .filter-section {
        margin-bottom: 20px;
      }
      .submission-table th {
        background-color: #f1f1f1;
      }
      .clickable {
        cursor: pointer;
      }
      .clickable:hover {
        background-color: #f5f5f5;
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
              <li class="breadcrumb-item"><a href="/courses">Course</a></li>
              <li class="breadcrumb-item"><a href="/courses">Course Lecture</a></li>
              
              
              <li class="breadcrumb-item active" aria-current="page">Assignment Submissions</li>
            </ol>
          </nav>

          <div class="row my-color mybg my-row">
            <!-- <div class="d-flex">
              <h2 class="flex-grow-1 mb-2 text-primary"><b>Assignment Submissions</b></h2>
            </div> -->
            <hr class="profile-hr" />

            <!-- Stats Section -->
            <div class="submission-stats">
              <div class="row">
                <div class="col-md-4">
                  <div class="stat-card">
                    <i class="fas fa-file-alt text-primary"></i>
                    <div class="stat-number" id="total-submissions">0</div>
                    <div>Total Submissions</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card">
                    <i class="fas fa-clock text-warning"></i>
                    <div class="stat-number" id="pending-submissions">0</div>
                    <div>Pending Review</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card">
                    <i class="fas fa-check-circle text-success"></i>
                    <div class="stat-number" id="reviewed-submissions">0</div>
                    <div>Reviewed</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter Section -->
            <div class="filter-section">
              <div class="row">
                <div class="col-md-4">
                  <select class="form-select" id="status-filter">
                    <option value="all">All Submissions</option>
                    <option value="pending">Pending Review</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Table Section -->
            <div class="table-responsive">
              <table class="table table-hover submission-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="submissions-container">
                  <!-- Submissions will be loaded here -->
                </tbody>
              </table>
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

    <!-- Feedback Modal -->
    <div class="modal fade" id="feedbackModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content" style="background: var(--bg);">
          <div class="modal-header">
            <h5 class="modal-title" style="color: black;">Provide Feedback</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="feedbackForm">
              <input type="hidden" id="submissionId">
              <div class="mb-3" style="background: var(--bg);">
                <label for="grade" class="form-label" style="color: black;">Grade (0-10)</label>
                <input type="number" class="form-control" id="grade" min="0" max="10" required>
              </div>
              <div class="mb-3">
                <label for="feedback" class="form-label" style="color: black;">Feedback</label>
                <textarea class="form-control" id="feedback" rows="3" required></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer" style="background: var(--bg);">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="submitFeedback()">Submit Feedback</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Scripts -->
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script>
      $(document).ready(function () {
        setupCSRF();
        on_page_load([]);
        loadSubmissions();

        // Add filter change handler
        $('#status-filter').change(function() {
          filterSubmissions($(this).val());
        });
      });

      function loadSubmissions() {
        const params = window.location.href.split('?')[1];
        const [courseId, lectureId] = params.split('&');

        $.ajax({
          url: `${apiLink}/api/assignment/get`,
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + getCookie("token")
          },
          data: {
            course_id: courseId,
            lecture_id: lectureId
          },
          success: function(submissions) {
            if (submissions.length === 0) {
              $("#submissions-container").html('<tr><td colspan="5" class="text-center text-danger">No submissions found.</td></tr>');
              updateStats(submissions);
              return;
            }

            const submissionsHtml = submissions.map(sub => `
              <tr class="clickable" data-submission-id="${sub.id}">
                <td>${sub.user_name || 'Unknown User'}</td>
                <td>${new Date(sub.submission_date).toLocaleString()}</td>
                <td>
                  <span class="badge ${sub.status === 0 ? 'bg-warning' : 'bg-success'}">
                    ${sub.status === 0 ? 'Pending Review' : 'Reviewed'}
                  </span>
                </td>
                <td>${sub.status === 1 ? `${sub.grade}/10` : '-'}</td>
                <td>
                  <a href="${sub.file_url || sub.assignment_file}" class="btn btn-sm btn-primary" target="_blank">
                    <i class="fas fa-download"></i> View
                  </a>
                  <button class="btn btn-sm btn-info ms-2" onclick="openFeedbackModal(${sub.id}, ${courseId}, ${lectureId})">
                    <i class="fas fa-comment"></i> ${sub.status === 0 ? 'Grade' : 'Edit'}
                  </button>
                </td>
              </tr>
              ${sub.feedback ? `
                <tr class="expanded-row d-none" id="feedback-${sub.id}">
                  <td colspan="5">
                    <div class="p-3">
                      <strong>Feedback:</strong>
                      <p class="mb-0">${sub.feedback}</p>
                    </div>
                  </td>
                </tr>
              ` : ''}
            `).join('');

            $("#submissions-container").html(submissionsHtml);
            updateStats(submissions);

            // Add click handler for expanding feedback
            $('.clickable').click(function() {
              const submissionId = $(this).data('submission-id');
              $(`#feedback-${submissionId}`).toggleClass('d-none');
            });
          },
          error: function(err) {
            console.error('Failed to load submissions:', err);
            showToast("Failed to load submissions", "danger");
          }
        });
      }

      function updateStats(submissions) {
        const total = submissions.length;
        const pending = submissions.filter(s => s.status === 0).length;
        const reviewed = submissions.filter(s => s.status === 1).length;

        $('#total-submissions').text(total);
        $('#pending-submissions').text(pending);
        $('#reviewed-submissions').text(reviewed);
      }

      function filterSubmissions(status) {
        const rows = $('#submissions-container tr');
        if (status === 'all') {
          rows.show();
        } else if (status === 'pending') {
          rows.each(function() {
            const badge = $(this).find('.badge');
            $(this).toggle(badge.hasClass('bg-warning'));
          });
        } else if (status === 'reviewed') {
          rows.each(function() {
            const badge = $(this).find('.badge');
            $(this).toggle(badge.hasClass('bg-success'));
          });
        }
      }

      function openFeedbackModal(submissionId, courseId, lectureId) {
        $("#submissionId").val(submissionId);
        
        // Get the submission details from the current page
        const submissionRow = $(`tr[data-submission-id="${submissionId}"]`);
        const existingGrade = submissionRow.find('td:eq(3)').text();
        const existingFeedback = $(`#feedback-${submissionId}`).find('p').text();
        
        if (existingGrade !== '-') {
            // Remove "/100" from grade and convert to number
            $("#grade").val(parseInt(existingGrade));
        } else {
            $("#grade").val('');
        }
        
        $("#feedback").val(existingFeedback || '');
        $("#feedbackModal").modal('show');
    }

    function submitFeedback() {
        const params = window.location.href.split('?')[1];
        const [courseId, lectureId] = params.split('&');
        const submissionId = $("#submissionId").val();
        const grade = $("#grade").val();
        const feedback = $("#feedback").val();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (!grade || !feedback) {
            showToast("Please fill in both grade and feedback", "warning");
            return;
        }

        if (grade < 0 || grade > 10) {
            showToast("Grade must be between 0 and 10", "warning");
            return;
        }

        const requestData = {
            id: submissionId,
            course_id: courseId,
            lecture_id: lectureId,
            grade: parseFloat(grade),
            feedback: feedback,
            status: 1
        };

        console.log('Submitting feedback with data:', requestData);

        // Show loading state
        const submitButton = $("#feedbackModal .btn-primary");
        submitButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...');

        $.ajax({
            url: `${apiLink}/api/assignment/update`,
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + getCookie("token"),
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log('Server response:', response);
                
                // Check if response contains data property or success status
                if (response && (response.data || response.status === "success" || response.message)) {
                    const submissionRow = $(`tr[data-submission-id="${submissionId}"]`);
                    const oldStatus = submissionRow.find('.badge').hasClass('bg-warning');
                    
                    // Update the submission row
                    submissionRow.find('td:eq(2)').html('<span class="badge bg-success">Reviewed</span>');
                    submissionRow.find('td:eq(3)').text(`${grade}/100`);
                    
                    // Update or add feedback row
                    let feedbackRow = $(`#feedback-${submissionId}`);
                    if (feedbackRow.length === 0) {
                        submissionRow.after(`
                            <tr class="expanded-row" id="feedback-${submissionId}">
                                <td colspan="5">
                                    <div class="p-3">
                                        <strong>Feedback:</strong>
                                        <p class="mb-0">${feedback}</p>
                                    </div>
                                </td>
                            </tr>
                        `);
                    } else {
                        feedbackRow.find('p').text(feedback);
                        feedbackRow.removeClass('d-none');
                    }

                    // Update button text
                    submissionRow.find('.btn-info').html('<i class="fas fa-comment"></i> Edit');

                    // Update statistics only if status changed from pending to reviewed
                    if (oldStatus) {
                        const currentPending = parseInt($('#pending-submissions').text());
                        const currentReviewed = parseInt($('#reviewed-submissions').text());
                        $('#pending-submissions').text(currentPending - 1);
                        $('#reviewed-submissions').text(currentReviewed + 1);
                    }

                    $("#feedbackModal").modal('hide');
                    showToast("Feedback submitted successfully", "success");
                } else {
                    console.error('Invalid response format:', response);
                    showToast("Failed to submit feedback: Invalid response format", "danger");
                }
            },
            error: function(err) {
                console.error('Error response:', err);
                let errorMessage;
                try {
                    const responseJSON = err.responseJSON || JSON.parse(err.responseText);
                    errorMessage = responseJSON.message || responseJSON.error || "Failed to submit feedback";
                } catch (e) {
                    errorMessage = "Failed to submit feedback";
                    console.error('Error parsing error response:', e);
                }
                showToast(errorMessage, "danger");
            },
            complete: function() {
                // Reset button state
                submitButton.prop('disabled', false).html('Submit Feedback');
            }
        });
    }

    // Add this function to ensure CSRF token is included in all AJAX requests
    function setupCSRF() {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    }
    </script>
  </body>
</html>
 