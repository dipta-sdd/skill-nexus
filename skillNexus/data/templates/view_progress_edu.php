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
    <style>
      .progress-card {
        border: none;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        height: 100%;  /* Make all cards same height */
      }

      .progress-card .card-body {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1.5rem;
      }

      .metric-title {
        color: #333;
        font-size: 1.25rem;
        margin-bottom: 1rem;
        flex: 0 0 auto;  /* Don't allow title to grow */
      }

      .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #0d6efd;
        margin-bottom: 0.5rem;
        flex: 1 0 auto;  /* Allow value to grow but maintain size */
        display: flex;
        align-items: center;
      }

      .metric-label {
        color: #6c757d;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        flex: 0 0 auto;  /* Don't allow label to grow */
      }

      .progress-stats {
        margin-top: auto;  /* Push stats to bottom */
        flex: 0 0 auto;   /* Don't allow stats to grow */
      }

      .progress {
        height: 8px;
        margin: 10px 0;
        background-color: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-bar {
        transition: width 0.6s ease;
        background-color: #0d6efd;
      }

      /* Make the row of cards have equal height */
      .row.mb-4 {
        display: flex;
        flex-wrap: wrap;
      }

      .row.mb-4 > [class*='col-'] {
        display: flex;
        flex-direction: column;
      }

      /* Style adjustments for the modal cards */
      #progressModal .progress-card {
        margin-bottom: 0;  /* Remove bottom margin in modal */
      }

      #progressModal .card-body {
        padding: 1.25rem;  /* Slightly less padding in modal */
      }

      #progressModal .metric-value {
        font-size: 2rem;  /* Slightly smaller font in modal */
      }

      .student-card {
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        transition: transform 0.2s;
      }

      .student-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .student-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .student-name {
        font-weight: 600;
        color: #333;
      }

      .student-progress {
        font-size: 0.875rem;
        color: #6c757d;
      }

      .timeline {
        position: relative;
        padding-left: 30px;
      }

      .timeline-item {
        position: relative;
        padding-bottom: 1.5rem;
      }

      .timeline-item::before {
        content: '';
        position: absolute;
        left: -22px;
        top: 0;
        width: 2px;
        height: 100%;
        background-color: #e9ecef;
      }

      .timeline-item::after {
        content: '';
        position: absolute;
        left: -27px;
        top: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #0d6efd;
        border: 2px solid #fff;
      }

      .timeline-date {
        font-size: 0.75rem;
        color: #6c757d;
      }

      .timeline-content {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
      }

      .filter-buttons {
        margin-bottom: 1rem;
      }

      .filter-btn {
        border: none;
        background: none;
        padding: 0.5rem 1rem;
        margin-right: 0.5rem;
        border-radius: 20px;
        color: #6c757d;
        transition: all 0.2s;
      }

      .filter-btn:hover,
      .filter-btn.active {
        background-color: #0d6efd;
        color: white;
      }

      .submission-item {
        border: 1px solid #e9ecef;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .submission-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.25rem;
      }

      .submission-date {
        font-size: 0.75rem;
        color: #6c757d;
      }

      .submission-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
      }

      .status-pending {
        background-color: #ffc107;
        color: #000;
      }

      .status-graded {
        background-color: #198754;
        color: white;
      }

      .grade-badge {
        background-color: #0d6efd;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
      }

      .student-list {
        max-height: 600px;
        overflow-y: auto;
        border-right: 1px solid #dee2e6;
      }

      .student-item {
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .student-item:hover {
        background-color: rgba(13, 110, 253, 0.05);
      }

      .student-item.active {
        background-color: rgba(13, 110, 253, 0.1);
      }

      .progress-container {
        display: none;
      }

      .progress-container.active {
        display: block;
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
          <li class="breadcrumb-item"><a href="/course_detail">Course</a></li>
          <li class="breadcrumb-item active" aria-current="page">Student Progress</li>
        </ol>
      </nav>

      <div class="row mybg my-row">
        <div class="col-12">
          <div class="container py-4">
            <!-- Progress Overview Section -->
            <div id="progress-overview" class="mb-4 d-none">
              <div class="row">
                <div class="col-md-4">
                  <div class="card progress-card">
                    <div class="card-body">
                      <h5 class="metric-title">Overall Progress</h5>
                      <div class="metric-value" id="completion-percentage">0%</div>
                      <div class="metric-label">Course Completion</div>
                      <div class="progress-stats">
                        <div class="progress">
                          <div class="progress-bar" role="progressbar" style="width: 0%" id="progress-bar"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card progress-card">
                    <div class="card-body">
                      <h5 class="metric-title">Video Progress</h5>
                      <div class="metric-value" id="total-watch-time">0</div>
                      <div class="metric-label">Total Watch Time (mins)</div>
                      <div class="progress-stats">
                        <div class="d-flex justify-content-between">
                          <small><span id="completed-videos">0</span> / <span id="total-lectures">0</span> Videos</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card progress-card">
                    <div class="card-body">
                      <h5 class="metric-title">Assignment Progress</h5>
                      <div class="metric-value" id="avg-grade">0%</div>
                      <div class="metric-label">Average Grade</div>
                      <div class="progress-stats">
                        <div class="d-flex justify-content-between">
                          <small><span id="total-submissions">0</span> Submissions</small>
                          <small id="performance-level">N/A</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detailed Progress Section -->
              <div id="detailed-progress" class="mt-4 d-none">
                <div class="card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Detailed Progress</h5>
                    <button class="btn btn-sm btn-outline-secondary" onclick="toggleDetailedProgress()">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div class="card-body">
                    <!-- Video Progress List -->
                    <h6 class="mb-3">Video Progress</h6>
                    <div id="video-progress-list" class="mb-4">
                      <!-- Video progress items will be loaded here -->
                    </div>

                    <!-- Assignment Progress List -->
                    <h6 class="mb-3">Assignment Progress</h6>
                    <div id="assignment-list">
                      <!-- Assignment items will be loaded here -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enrolled Students Table -->
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Enrolled Students</h5>
                <div class="input-group" style="width: 300px;">
                  <input type="text" class="form-control" id="student-search" placeholder="Search students...">
                  <span class="input-group-text"><i class="fas fa-search"></i></span>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Username</th>
                        <th>Enrollment Date</th>
                        <th>Progress</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="student-list">
                      <!-- Students will be loaded here -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Progress Details Modal -->
            <div class="modal fade" id="progressModal" tabindex="-1" aria-labelledby="progressModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="progressModalLabel">Student Progress Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <!-- Progress Overview Cards -->
                    <div class="row mb-4">
                      <div class="col-md-4">
                        <div class="card progress-card">
                          <div class="card-body">
                            <h5 class="metric-title">Overall Progress</h5>
                            <div class="metric-value" id="modal-completion-percentage">0%</div>
                            <div class="metric-label">Course Completion</div>
                            <div class="progress-stats">
                              <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: 0%" id="modal-progress-bar"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="card progress-card">
                          <div class="card-body">
                            <h5 class="metric-title">Video Progress</h5>
                            <div class="metric-value" id="modal-total-watch-time">0</div>
                            <div class="metric-label">Total Watch Time (mins)</div>
                            <div class="progress-stats">
                              <div class="d-flex justify-content-between">
                                <small><span id="modal-completed-videos">0</span> / <span id="modal-total-lectures">0</span> Videos</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="card progress-card">
                          <div class="card-body">
                            <h5 class="metric-title">Assignment Progress</h5>
                            <div class="metric-value" id="modal-avg-grade">0%</div>
                            <div class="metric-label">Average Grade</div>
                            <div class="progress-stats">
                              <div class="d-flex justify-content-between">
                                <small><span id="modal-total-submissions">0</span> Submissions</small>
                                <small id="modal-performance-level">N/A</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Detailed Progress Tabs -->
                    <ul class="nav nav-tabs" id="progressTabs" role="tablist">
                      <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="videos-tab" data-bs-toggle="tab" data-bs-target="#videos" type="button" role="tab">
                          Video Progress
                        </button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="assignments-tab" data-bs-toggle="tab" data-bs-target="#assignments" type="button" role="tab">
                          Assignment Progress
                        </button>
                      </li>
                    </ul>
                    <div class="tab-content pt-3" id="progressTabContent">
                      <div class="tab-pane fade show active" id="videos" role="tabpanel">
                        <div id="modal-video-progress-list">
                          <!-- Video progress items will be loaded here -->
                        </div>
                      </div>
                      <div class="tab-pane fade" id="assignments" role="tabpanel">
                        <div id="modal-assignment-list">
                          <!-- Assignment items will be loaded here -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script>
      $(document).ready(function() {
        on_page_load([]);
        
        const courseId = window.location.href.split('?')[1];
        loadEnrolledStudents(courseId);

        // Search functionality
        $('#student-search').on('input', function() {
          const searchTerm = $(this).val().toLowerCase();
          $('#student-list tr').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchTerm));
          });
        });
      });

      let progressModal;

      function loadEnrolledStudents(courseId) {
        $.ajax({
          url: apiLink + '/api/educator/enrolled_students',
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + getCookie("token")
          },
          data: { course_id: courseId },
          success: function(response) {
            const studentList = $('#student-list');
            studentList.empty();
            
            if (response.length === 0) {
              studentList.append(`
                <tr>
                  <td colspan="5" class="text-center py-4">
                    <i class="fas fa-users mb-3 fa-2x text-muted"></i>
                    <p class="mb-0">No students enrolled yet</p>
                  </td>
                </tr>
              `);
              return;
            }
            
            response.forEach(student => {
              studentList.append(`
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      ${student.profile_picture ? 
                        `<img src="${apiLink}${student.profile_picture}" class="rounded-circle me-3" width="40" height="40" alt="${student.username}">` :
                        `<div class="rounded-circle me-3 d-flex align-items-center justify-content-center bg-primary text-white" style="width: 40px; height: 40px;">
                          ${student.username.charAt(0).toUpperCase()}
                        </div>`
                      }
                      <div>
                        <h6 class="mb-0">${student.first_name} ${student.last_name}</h6>
                        <small class="text-muted">${student.email || 'N/A'}</small>
                      </div>
                    </div>
                  </td>
                  <td>@${student.username}</td>
                  <td>${new Date().toLocaleDateString()}</td>
                  <td>
                    <div class="progress" style="height: 6px; width: 120px;">
                      <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm" onclick="loadStudentProgress('${courseId}', '${student.id}', '${student.first_name} ${student.last_name}')">
                      View Details
                    </button>
                  </td>
                </tr>
              `);
            });

            // Initialize the modal
            progressModal = new bootstrap.Modal(document.getElementById('progressModal'));
          },
          error: function(error) {
            console.error('Error loading enrolled students:', error);
            showToast("Failed to load enrolled students", "danger");
          }
        });
      }

      function loadStudentProgress(courseId, studentId, studentName) {
        // Update modal title with student name
        $('#progressModalLabel').text(`Progress Details - ${studentName}`);
        
        // Show the modal
        progressModal.show();
        
        // Load video progress
        $.ajax({
          url: apiLink + '/api/educator/student/progress/video',
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + getCookie("token")
          },
          data: { 
            course_id: courseId,
            student_id: studentId 
          },
          success: function(response) {
            updateVideoProgress(response);
          },
          error: function(error) {
            console.error('Error loading video progress:', error);
            showToast("Failed to load video progress", "danger");
          }
        });

        // Load assignment progress
        $.ajax({
          url: apiLink + '/api/educator/student/progress/assignment',
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + getCookie("token")
          },
          data: { 
            course_id: courseId,
            student_id: studentId 
          },
          success: function(response) {
            updateAssignmentProgress(response);
          },
          error: function(error) {
            console.error('Error loading assignment progress:', error);
            showToast("Failed to load assignment progress", "danger");
          }
        });
      }

      function updateVideoProgress(data) {
        if (!data) {
          showToast("No video progress data available", "warning");
          return;
        }

        // Update completion percentage
        $('#modal-completion-percentage').text(Math.round(data.completion_percentage || 0) + '%');
        $('#modal-progress-bar').css('width', (data.completion_percentage || 0) + '%');
        
        // Update watch time
        $('#modal-total-watch-time').text(Math.round(data.total_watch_time || 0));
        
        // Update video counts
        $('#modal-completed-videos').text(data.completed_videos || 0);
        $('#modal-total-lectures').text(data.total_lectures || 0);
        
        // Update video progress list
        const videoList = $('#modal-video-progress-list');
        videoList.empty();
        
        if (!data.video_progress || data.video_progress.length === 0) {
          videoList.append('<p class="text-muted">No video progress data available.</p>');
          return;
        }
        
        data.video_progress.forEach(video => {
          const progressPercent = Math.round((video.watched_time / video.video_duration) * 100);
          videoList.append(`
            <div class="card mb-3">
              <div class="card-body">
                <h6 class="mb-2">${video.lecture_title}</h6>
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-muted">Progress</span>
                  <span class="badge bg-${progressPercent >= 90 ? 'success' : 'warning'}">${progressPercent || 0}%</span>
                </div>
                <div class="progress" style="height: 5px;">
                  <div class="progress-bar" role="progressbar" style="width: ${progressPercent ? progressPercent : 0}%"></div>
                </div>
                
              </div>
            </div>
          `);
        });
      }

      function updateAssignmentProgress(data) {
        if (!data) {
          showToast("No assignment progress data available", "warning");
          return;
        }

        // Update metrics
        $('#modal-total-submissions').text(data.total_submissions || 0);
        $('#modal-avg-grade').text(Math.round(data.avg_grade || 0) + '%');
        $('#modal-performance-level').text(data.performance_level || 'N/A');
        
        // Update assignment list
        const assignmentList = $('#modal-assignment-list');
        assignmentList.empty();
        
        if (!data.submissions || data.submissions.length === 0) {
          assignmentList.append('<p class="text-muted">No assignment submissions found.</p>');
          return;
        }
        
        data.submissions.forEach(submission => {
          const isGraded = submission.status === 1;
          assignmentList.append(`
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1">${submission.lecture_title}</h6>
                    <p class="text-muted mb-0">Submitted on ${new Date(submission.submission_date).toLocaleDateString()}</p>
                  </div>
                  <span class="badge bg-${isGraded ? 'success' : 'warning'} ms-2">
                    ${isGraded ? 'Graded' : 'Pending Review'}
                  </span>
                </div>
                ${isGraded ? `
                  <div class="mt-3">
                    <div class="d-flex align-items-center mb-2">
                      <strong class="me-2">Grade:</strong>
                      <span class="badge bg-primary">${submission.grade}%</span>
                    </div>
                    <div>
                      <strong>Feedback:</strong>
                      <p class="mb-0" style="font-size: 12px; color: black;">${submission.feedback || 'No feedback provided'}</p>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `);
        });
      }
    </script>
  </body>
</html>
 