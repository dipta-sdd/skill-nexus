{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <title>SkillNexus</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{% static 'css/style.css' %}" />
    <style>
        /* Video Card and Common Border Properties */
        .video-card, .assignment-card, .comment, .video-details, .important-list li {
            border-radius: 12px;
            padding: 20px;
            background-color: inherit;
            border: 1px solid rgba(59, 130, 246, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        /* Assignment Section Layout */
        #assignment-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 25px;
        }

        .assignment-upload {
            width: 100%;
        }

        .assignment-history {
            width: 100%;
        }

        /* File Input Styling */
        .form-control[type="file"] {
            width: 100%;
            padding: 15px;
            background-color: inherit;
            color: var(--color);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 12px;
        }

        /* Important List Items */
        .important-list li {
            width: 100%;
            margin-bottom: 15px;
        }

        /* Custom Scrollbar */
        .comments-list::-webkit-scrollbar {
            width: 8px;
        }

        .comments-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .comments-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        .comments-list::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .transition-transform {
            transition: transform 0.3s ease;
        }
        .rotate-180 {
            transform: rotate(180deg);
        }
        .rotate-90 {
            transform: rotate(90deg);
        }
        .card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
        }
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <!-- Toast Container -->
    <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container top-0 end-0 p-3">
            <!-- Toasts will be added here -->
        </div>
    </div>

    {% include "sidebar.php" %}

    <div class="my-round" id="body">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Home</a></li>
                <li class="breadcrumb-item"><a href="/courses">Courses</a></li>
                <li class="breadcrumb-item active" aria-current="page">Lecture</li>
            </ol>
        </nav>

        <!-- Main Content -->
        <div class="row my-color mybg my-row">
            <!-- Loader -->
            <div class="loader-container bg-light">
                <div class="loader">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                    <div class="bar4"></div>
                    <div class="bar5"></div>
                    <div class="bar6"></div>
                    <div class="bar7"></div>
                    <div class="bar8"></div>
                    <div class="bar9"></div>
                    <div class="bar10"></div>
                    <div class="bar11"></div>
                    <div class="bar12"></div>
                </div>
            </div>

            <!-- Lecture Content -->
            <div class="col-12">
                <div class="row details">
                    <div class="col">
                        <div class="row px-5 details-con">
                            <div id="lecture-container" class="d-none">
                                <!-- Lecture content will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script>
        // Declare variables at the top level scope
        let courseId, lectureId;
        let serverWatchedTime = 0;  // Store the server's watch time

        $(document).ready(function () {
            on_page_load([]);
            
            const url = window.location.href;
            const params = url.split('?')[1];
            // Assign to our global variables
            [courseId, lectureId] = params.split('&').map(param => param.replace(/\D/g, ''));

            // Add validation
            if (!courseId || !lectureId) {
                console.error('Invalid URL format. Expected: ?course_id=X&lecture_id=Y');
                showToast("Invalid URL parameters", "danger");
                return;
            }

            // Fetch lecture video and details
            $.ajax({
                type: "GET",
                url: `${apiLink}/api/course_video/get`,
                headers: {
                    Authorization: "Bearer " + getCookie("token"),
                },
                data: {
                    course_id: courseId,
                    lecture_id: lectureId,
                },
                success: function (res) {
                    $("#lecture-container").removeClass("d-none");
                    $("#lecture-container").html("");
                    if (res && res.length > 0) {
                        showCourseLecture(res[0]);
                    }
                    $(".loader-container").hide();
                    loadLectureComments(lectureId);
                },
                error: function (err) {
                    console.error('Failed to fetch lecture:', err);
                    $(".loader-container").hide();
                    showToast("Failed to load lecture details", "danger");
                },
            });
        });

        function getCurrentUsername() {
            return getCookie("username") || "User";
        }

        function getCurrentUserProfilePicture() {
            return getCookie("profile_picture") || null;
        }

        function showCourseLecture(lecture) {
            const username = getCurrentUsername();
            const firstLetter = username.charAt(0).toUpperCase();
            const profilePicture = getCurrentUserProfilePicture();

            $("#lecture-container").append(`
                <div class="col-12 mb-4">
                    <div class="video-card">
                        <div class="video-thumbnail">
                            <video id="lecture-video" controls class="w-100" style="max-height: 70vh; object-fit: contain;">
                                <source src="${apiLink}${lecture.video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <!-- Add progress bar -->
                            <div class="progress mt-2" style="height: 5px;">
                                <div class="progress-bar bg-primary" role="progressbar" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="video-details mt-4">
                            <div class="d-flex align-items-center mb-4">
                                <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                    <i class="fas fa-play text-primary"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0">${lecture.title || 'Video Title'}</h3>
                                    <small class="text-muted">Lecture Material</small>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="card p-3 mb-3" onclick="toggleDescription()">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-book text-primary p-3 rounded-circle bg-primary bg-opacity-10"></i>
                                    <h5 class="mb-0 ms-3 flex-grow-1">Description</h5>
                                    <i class="fas fa-chevron-right text-primary transition-transform" id="description-toggle-icon"></i>
                                </div>
                                <p id="description-container" class="d-none mt-3 mb-0 bg-light bg-opacity-10 p-3 rounded">
                                    ${lecture.lecture_description || 'No description available.'}
                                </p>
                            </div>

                            <!-- Course Materials -->
                            ${lecture.material ? `
                            <a href="${apiLink}/media/${lecture.material}" target="_blank" class="card p-3 mb-3 text-decoration-none">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-file-pdf text-success p-3 rounded-circle bg-success bg-opacity-10"></i>
                                    <div class="ms-3 flex-grow-1">
                                        <h5 class="mb-0">Course Materials</h5>
                                        <small class="text-muted">Click to download or view</small>
                                    </div>
                                    <i class="fas fa-download text-success"></i>
                                </div>
                            </a>` : ''}

                            <!-- Assignment -->
                            <div class="card p-3">
                                <div class="d-flex align-items-center" onclick="toggleAssignment()">
                                    <i class="fas fa-tasks text-warning p-3 rounded-circle bg-warning bg-opacity-10"></i>
                                    <h5 class="mb-0 ms-3 flex-grow-1">Assignment</h5>
                                    <i class="fas fa-chevron-right text-warning transition-transform" id="assignment-toggle-icon"></i>
                                </div>
                                <div id="assignment-container" class="d-none mt-3">
                                    <form id="assignment-form" class="bg-light bg-opacity-10 p-3 rounded mb-3">
                                        <h6 class="mb-3"><i class="fas fa-upload text-warning me-2"></i>Upload Assignment</h6>
                                        <input type="file" class="form-control mb-2" id="assignment-file" name="assignment_file" accept=".pdf,.doc,.docx,.zip">
                                        <small class="text-muted d-block mb-3">
                                            <i class="fas fa-info-circle me-1"></i>Accepted formats: PDF, DOC, DOCX, ZIP
                                        </small>
                                        <button type="submit" class="btn btn-warning">
                                            <i class="fas fa-paper-plane me-2"></i>Submit Assignment
                                        </button>
                                    </form>

                                    <div class="bg-light bg-opacity-10 p-3 rounded">
                                        <h6 class="mb-3"><i class="fas fa-history text-warning me-2"></i>Submission History</h6>
                                        <div id="assignment-history"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Comments Section with Toggle -->
                        <div class="comments-section mt-4">
                            <div class="d-flex align-items-center gap-2 mb-4">
                                <i class="fas fa-comments fa-lg text-primary"></i>
                                <h4 class="mb-0">Comments</h4>
                            </div>
                            <div class="new-comment-form mb-4">
                                <div class="d-flex gap-3">
                                    ${profilePicture ? 
                                        `<img src="${profilePicture}" class="rounded-circle" width="32" height="32" alt="${username}">` :
                                        `<div class="rounded-circle d-flex align-items-center justify-content-center text-uppercase" 
                                              style="width: 32px; 
                                                     height: 32px; 
                                                     background-color: #0d6efd; 
                                                     color: white; 
                                                     font-size: 14px;
                                                     font-weight: 600;
                                                     box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${firstLetter}</div>`
                                    }
                                    <div class="flex-grow-1">
                                        <textarea class="form-control mybg my-color comment-form" 
                                                rows="3" 
                                                placeholder="Add a comment..."
                                                style="border: none;
                                                       border-bottom: 1px solid rgba(0,0,0,.125);
                                                       padding: 8px 0;
                                                       font-size: 14px;
                                                       resize: none;
                                                       min-height: 80px;"></textarea>
                                        <div class="d-flex justify-content-end gap-2 mt-2">
                                            <button class="btn btn-sm btn-primary d-flex align-items-center gap-2" 
                                                    onclick="postComment('${lecture.id}')">
                                                <i class="fas fa-paper-plane"></i>
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="comments-list" style="max-height: 600px; overflow-y: auto; padding-right: 10px;">
                                <!-- Comments will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            `);

            // Initialize video progress tracking
            initVideoProgress();
            // Load assignment history
            loadAssignments();
        }

        function initVideoProgress() {
            const video = document.getElementById('lecture-video');
            const progressBar = document.querySelector('.progress-bar');
            let progressUpdateTimeout;
            let isNewVideo = true;
            
            if (!video || !progressBar) {
                console.error('Video or progress bar element not found');
                return;
            }

            // Load existing progress first
            $.ajax({
                url: `${apiLink}/api/video/progress/get`,
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: { lecture_id: lectureId },
                success: function(response) {
                    console.log('Loaded video progress:', response);
                    if (response && response.watched_time) {
                        serverWatchedTime = response.watched_time;
                        video.currentTime = response.watched_time;
                        isNewVideo = false;
                        
                        if (response.progress_percentage) {
                            progressBar.style.width = `${response.progress_percentage}%`;
                        }
                    }
                }
            });

            // Update progress bar visually
            video.addEventListener('timeupdate', () => {
                if (video.duration > 0) {
                    const progress = (video.currentTime / video.duration) * 100;
                    progressBar.style.width = `${progress}%`;

                    clearTimeout(progressUpdateTimeout);

                    if (isNewVideo) {
                        progressUpdateTimeout = setTimeout(() => {
                            updateVideoProgress();
                        }, 5000);
                    }
                }
            });

            // Update progress when video ends
            video.addEventListener('ended', () => {
                updateVideoProgress();
            });

            // Update on pause
            video.addEventListener('pause', () => {
                if (isNewVideo) {
                    updateVideoProgress();
                }
            });

            // Update on page unload
            window.addEventListener('beforeunload', () => {
                if (isNewVideo) {
                    const watchedTime = Math.max(video.currentTime, serverWatchedTime || 0);
                    const data = {
                        lecture_id: parseInt(lectureId),
                        watched_time: parseFloat(watchedTime.toFixed(2)),
                        video_duration: parseFloat(video.duration.toFixed(2))
                    };
                    navigator.sendBeacon(
                        `${apiLink}/api/video/progress/update`,
                        JSON.stringify(data)
                    );
                }
            });

            // Helper function to update video progress
            function updateVideoProgress() {
                if (isNewVideo) {
                    // Always use the larger value between current time and server time
                    const watchedTime = Math.max(video.currentTime, serverWatchedTime || 0);
                    $.ajax({
                        url: `${apiLink}/api/video/progress/update`,
                        method: 'POST',
                        headers: {
                            "Authorization": "Bearer " + getCookie("token"),
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify({
                            lecture_id: parseInt(lectureId),
                            watched_time: parseFloat(watchedTime.toFixed(2)),
                            video_duration: parseFloat(video.duration.toFixed(2))
                        }),
                        success: function(response) {
                            console.log('Progress updated successfully:', response);
                            serverWatchedTime = watchedTime;
                        }
                    });
                }
            }
        }

        function loadAssignments() {
            if (!courseId || !lectureId) {
                console.error('Missing course_id or lecture_id');
                showToast("Unable to load assignments: Missing parameters", "danger");
                return;
            }

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
                success: function(response) {
                    displayAssignments(response);
                },
                error: function(err) {
                    console.error('Failed to load assignments:', err);
                    showToast("Failed to load assignments", "danger");
                }
            });
        }

        function displayAssignments(assignments) {
            const container = document.getElementById('assignment-history');
            
            if (!Array.isArray(assignments)) {
                console.error('Invalid assignments data:', assignments);
                container.innerHTML = '<p class="text-muted"><i class="fas fa-exclamation-circle me-2"></i>Error loading assignments.</p>';
                return;
            }

            if (assignments.length === 0) {
                $('#assignment-form').show();
                container.innerHTML = '<p class="text-muted"><i class="fas fa-info-circle me-2"></i>No assignments submitted yet.</p>';
                return;
            }

            const latestSubmission = assignments[0];
            
            if (latestSubmission.status === 0) {
                $('#assignment-form').show();
                $('#assignment-form').append('<small class="text-info"><i class="fas fa-info-circle me-2"></i>You can update your submission as it\'s still under review.</small>');
            } else {
                $('#assignment-form').hide();
                $('#assignment-form').after('<div class="alert alert-info"><i class="fas fa-check-circle me-2"></i>Your assignment has been reviewed. No further submissions allowed.</div>');
            }

            const html = assignments.map(assignment => `
                <div class="card mb-2">
                    <div class="card-body">
                        <h6 class="card-title">
                            <i class="fas fa-calendar-alt me-2"></i>
                            <span class="submission-date">Submitted: ${new Date(assignment.submission_date).toLocaleString()}</span>
                        </h6>
                        <p class="card-text">
                            <span class="status-text">
                                <i class="fas fa-info-circle me-2"></i>
                                Status: ${assignment.status === 0 ? 
                                    '<span class="badge bg-warning"><i class="fas fa-clock me-1"></i>Pending Review</span>' : 
                                    '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Reviewed</span>'}
                            </span>
                            ${assignment.feedback ? `
                                <br>
                                <span class="feedback-text">
                                    <i class="fas fa-comment me-2"></i>Feedback: ${assignment.feedback}
                                </span>
                            ` : ''}
                            ${assignment.grade ? `
                                <br>
                                <span class="grade-text">
                                    <i class="fas fa-star me-2"></i>Grade: ${assignment.grade}/100
                                </span>
                            ` : ''}
                        </p>
                        <div class="text-left">
                            <a href="${assignment.file_url}" class="btn btn-primary" target="_blank">
                                <i class="fas fa-download me-1"></i> View Submission
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = html;
        }

        // Add event listener for assignment submission
        $(document).on('submit', '#assignment-form', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            const assignmentFile = $('#assignment-file')[0].files[0];
            
            // Validate file
            if (!assignmentFile) {
                showToast("Please select a file to upload", "warning");
                return;
            }

            // First check if user has already submitted an assignment
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
                success: function(response) {
                    if (response && response.length > 0) {
                        const latestSubmission = response[0];
                        // If status is not 0 (not pending), prevent submission
                        if (latestSubmission.status !== 0) {
                            showToast("You cannot submit a new assignment as your previous submission has already been reviewed", "warning");
                            return;
                        }
                    }
                    
                    // Proceed with submission if no previous submission or status is 0
                    proceedWithSubmission(formData, assignmentFile);
                },
                error: function(err) {
                    console.error('Failed to check existing submissions:', err);
                    showToast("Failed to verify submission status", "danger");
                }
            });
        });

        function proceedWithSubmission(formData, assignmentFile) {
            // Add required data to FormData
            formData.append('course_id', courseId);
            formData.append('lecture_id', lectureId);
            formData.append('assignment_file', assignmentFile);

            // Show loading state
            const submitButton = $('#assignment-form').find('button[type="submit"]');
            submitButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...');

            $.ajax({
                url: `${apiLink}/api/assignment/submit`,
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    showToast("Assignment submitted successfully", "success");
                    loadAssignments();  // Reload the assignments list
                    $('#assignment-file').val('');  // Clear the file input
                },
                error: function(error) {
                    console.error('Assignment submission error:', error);
                    showToast(error.responseJSON?.error || "Failed to submit assignment", "danger");
                },
                complete: function() {
                    // Reset button state
                    submitButton.prop('disabled', false).html('<i class="fas fa-paper-plane me-2"></i> Submit Assignment');
                }
            });
        }

        function loadLectureComments(lectureId) {
            if ($('#comments-container').hasClass('d-none')) {
                return; // Don't load if comments are hidden
            }

            $.ajax({
                type: "GET",
                url: `${apiLink}/api/lecture_comments/get`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: { lecture_id: lectureId },
                success: function(response) {
                    if (response && Array.isArray(response)) {
                        displayComments(response);
                    } else if (typeof response === 'string') {
                        try {
                            const parsedResponse = JSON.parse(response);
                            displayComments(parsedResponse);
                        } catch (e) {
                            console.error("Failed to parse response:", e);
                            $(".comments-list").html('<p class="text-muted">No comments yet. Be the first to comment!</p>');
                        }
                    } else {
                        $(".comments-list").html('<p class="text-muted">No comments yet. Be the first to comment!</p>');
                    }
                },
                error: function(err) {
                    console.error("Failed to load comments:", err);
                    $(".comments-list").html('<p class="text-muted">Error loading comments. Please try again.</p>');
                    showToast("Failed to load comments", "danger");
                }
            });
        }

        function displayComments(comments) {
            console.log('Displaying comments:', comments);
            const commentsList = $(".comments-list");
            commentsList.empty();
            
            if (!comments || !Array.isArray(comments) || comments.length === 0) {
                commentsList.html('<p class="text-muted">No comments yet. Be the first to comment!</p>');
                return;
            }
            
            // Build comment hierarchy
            const commentMap = new Map();
            const rootComments = [];

            // First, map all comments by their ID
            comments.forEach(comment => {
                comment.replies = [];
                commentMap.set(comment.id, comment);
            });

            // Then, build the hierarchy
            comments.forEach(comment => {
                if (comment.parent_id) {
                    const parent = commentMap.get(comment.parent_id);
                    if (parent) {
                        parent.replies.push(comment);
                    }
                } else {
                    rootComments.push(comment);
                }
            });

            // Render root comments
            rootComments.forEach(comment => {
                commentsList.append(createCommentHTML(comment));
            });
        }

        function createCommentHTML(comment) {
            const currentUserId = getCurrentUserId();
            const commentUserId = comment.user_id || (comment.user && comment.user.id);
            const isCommentOwner = String(commentUserId) === String(currentUserId);
            
            // Get the first letter of username for avatar fallback
            const firstLetter = comment.username ? comment.username.charAt(0).toUpperCase() : '?';
            
            // Create avatar HTML based on whether user has a profile picture
            const avatarHTML = comment.user && comment.user.profile_picture ? 
                `<img src="${comment.user.profile_picture}" class="rounded-circle" width="40" height="40" alt="${comment.username}" style="object-fit: cover;">` :
                `<div class="rounded-circle d-flex align-items-center justify-content-center text-uppercase" 
                      style="width: 40px; 
                             height: 40px; 
                             background-color: #0d6efd; 
                             color: white; 
                             font-size: 18px;
                             font-weight: 600;
                             box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${firstLetter}</div>`;

            return `
                <div class="comment-thread">
                    <div class="comment mybg" id="comment${comment.id}" 
                         style="padding: 16px 0;
                                border-bottom: 1px solid rgba(0,0,0,.125);">
                        <div class="d-flex gap-3">
                            ${avatarHTML}
                            <div class="comment-content flex-grow-1">
                                <div class="d-flex align-items-center gap-2">
                                    <a href="/profile/${comment.user_id}" 
                                       class="fw-bold text-decoration-none my-color" 
                                       style="font-size: 13px;">${comment.username}</a>
                                    <small class="text-muted" style="font-size: 12px;">${comment.timestamp}</small>
                                    ${comment.edited ? '<small class="text-muted" style="font-size: 12px;">(edited)</small>' : ''}
                                </div>
                                <p class="mb-2 mt-1 my-color" 
                                   id="commentcontent${comment.id}" 
                                   style="font-size: 14px;">${comment.content}</p>
                                <div class="d-flex align-items-center gap-3" style="font-size: 13px;">
                                    <button class="btn btn-sm p-0 likebutton${comment.id}" 
                                            onclick="toggleLike(${comment.id})"
                                            style="font-size: 13px; color: ${comment.has_liked ? '#dc3545' : '#6c757d'};">
                                        <i class="fas fa-heart ${comment.has_liked ? 'text-danger' : 'text-muted'}"></i>
                                        <span class="likecount${comment.id}" style="margin-left: 4px;">${comment.like_count || 0}</span>
                                    </button>
                                    <button class="btn btn-sm p-0" 
                                            onclick="toggleReplyForm(${comment.id})"
                                            style="font-size: 13px; color: #6c757d;">
                                        <i class="fas fa-reply text-muted"></i>
                                        <span style="margin-left: 4px;">Reply</span>
                                    </button>
                                    ${isCommentOwner ? `
                                        <button class="btn btn-sm p-0" onclick="editComment(${comment.id})"
                                                style="font-size: 13px; color: #6c757d;">
                                            <i class="fas fa-edit text-muted"></i>
                                            <span style="margin-left: 4px;">Edit</span>
                                        </button>
                                        <button class="btn btn-sm p-0" onclick="deleteComment(${comment.id})"
                                                style="font-size: 13px; color: #dc3545;">
                                            <i class="fas fa-trash text-danger"></i>
                                            <span style="margin-left: 4px;">Delete</span>
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="replyformcontainer${comment.id} d-none mt-3">
                                    <div class="d-flex gap-3">
                                        ${getCurrentUserProfilePicture() ? 
                                            `<img src="${getCurrentUserProfilePicture()}" class="rounded-circle" width="40" height="40" alt="${getCurrentUsername()}" style="object-fit: cover;">` :
                                            `<div class="rounded-circle d-flex align-items-center justify-content-center text-uppercase" 
                                                  style="width: 40px; 
                                                         height: 40px; 
                                                         background-color: #0d6efd; 
                                                         color: white; 
                                                         font-size: 18px;
                                                         font-weight: 600;
                                                         box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${getCurrentUsername().charAt(0).toUpperCase()}</div>`
                                        }
                                        <div class="flex-grow-1">
                                            <textarea class="form-control mybg my-color" 
                                                    rows="3" 
                                                    placeholder="Write a reply..."
                                                    style="border: none; 
                                                           border-bottom: 1px solid rgba(0,0,0,.125);
                                                           padding: 8px 0;
                                                           font-size: 14px;
                                                           resize: none;
                                                           min-height: 80px;"></textarea>
                                            <div class="d-flex justify-content-end gap-2 mt-2">
                                                <button class="btn btn-sm" onclick="toggleReplyForm(${comment.id})">Cancel</button>
                                                <button class="btn btn-sm btn-primary" onclick="submitReply(${comment.id})">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ${comment.replies && comment.replies.length > 0 ? `
                                    <div class="nested-replies" style="margin-left: 56px;">
                                        ${comment.replies.map(reply => createCommentHTML(reply)).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function toggleReplyForm(commentId) {
            $(`.replyformcontainer${commentId}`).toggleClass('d-none');
        }

        function editComment(commentId) {
            const contentElement = $(`#commentcontent${commentId}`);
            const currentContent = contentElement.text().trim();
            
            contentElement.html(`
                <div class="edit-form">
                    <textarea class="form-control mybg my-color" 
                              id="edit${commentId}" 
                              rows="3" 
                              style="border: none; 
                                     border-bottom: 1px solid rgba(0,0,0,.125);
                                     padding: 8px 0;
                                     font-size: 14px;
                                     resize: none;
                                     min-height: 80px;">${currentContent}</textarea>
                    <div class="d-flex justify-content-end gap-2 mt-2">
                        <button class="btn btn-sm" onclick="cancelEdit(${commentId}, '${currentContent}')">Cancel</button>
                        <button class="btn btn-sm btn-primary" onclick="saveEdit(${commentId})">Save</button>
                    </div>
                </div>
            `);
        }

        function cancelEdit(commentId, originalContent) {
            $(`#commentcontent${commentId}`).html(originalContent);
        }

        function saveEdit(commentId) {
            const newContent = $(`#edit${commentId}`).val().trim();
            if (!newContent) {
                showToast("Comment cannot be empty", "warning");
                return;
            }

            $.ajax({
                type: "PUT",
                url: `${apiLink}/api/lecture_comments/edit`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: {
                    comment_id: commentId,
                    content: newContent
                },
                success: function(response) {
                    showToast("Comment updated successfully", "success");
                    // Get the lecture ID from the URL parameters
                    const params = window.location.href.split('?')[1];
                    const lectureId = params.split('&')[1];
                    loadLectureComments(lectureId);
                },
                error: function(err) {
                    console.error("Edit error:", err);
                    showToast("Failed to update comment", "danger");
                }
            });
        }

        // Add getCurrentUserId function if not already present
        function getCurrentUserId() {
            let userId = getCookie("user_id");
            
            if (!userId) {
                const token = getCookie("token");
                if (token) {
                    $.ajax({
                        type: "GET",
                        url: `${apiLink}/api/current_user`,
                        headers: {
                            Authorization: "Bearer " + token
                        },
                        async: false,
                        success: function(response) {
                            userId = response.id;
                        },
                        error: function(error) {
                            console.error("Error getting current user:", error);
                        }
                    });
                }
            }

            return userId ? parseInt(userId) : null;
        }

        function submitReply(commentId) {
            const content = $(`.replyformcontainer${commentId} textarea`).val().trim();
            if (!content) {
                showToast("Please enter a reply", "warning");
                return;
            }

            $.ajax({
                type: "POST",
                url: `${apiLink}/api/lecture_comments/add`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: {
                    lecture_id: lectureId,
                    content: content,
                    parent: commentId
                },
                success: function(response) {
                    showToast("Reply posted successfully", "success");
                    loadLectureComments(lectureId);
                    $(`.replyformcontainer${commentId} textarea`).val('');
                    $(`.replyformcontainer${commentId}`).addClass('d-none');
                },
                error: function(err) {
                    console.error("Reply error:", err);
                    showToast("Failed to post reply", "danger");
                }
            });
        }

        function toggleLike(commentId) {
            $.ajax({
                type: "POST",
                url: `${apiLink}/api/lecture_comments/like`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: {
                    comment_id: commentId
                },
                success: function(response) {
                    const likeButton = $(`.likebutton${commentId} .fa-heart`);
                    const likeCount = $(`.likecount${commentId}`);
                    
                    if (response.liked) {
                        likeButton.addClass('text-danger');
                    } else {
                        likeButton.removeClass('text-danger');
                    }
                    likeCount.text(response.like_count);
                },
                error: function(err) {
                    showToast("Failed to update like", "danger");
                }
            });
        }

        function toggleComments() {
            const container = $('#comments-container');
            const icon = $('#comments-toggle-icon');
            const text = $('#comments-toggle-text');
            
            if (container.hasClass('d-none')) {
                container.removeClass('d-none');
                icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                text.text('Hide Comments');
                loadLectureComments(lectureId); // Load comments when showing
            } else {
                container.addClass('d-none');
                icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                text.text('View Comments');
            }
        }

        function toggleAssignment() {
            const container = $('#assignment-container');
            const icon = $('#assignment-toggle-icon');
            const listItem = icon.closest('li');
            
            container.toggleClass('d-none');
            listItem.toggleClass('active');
            if (!container.hasClass('d-none')) {
                icon.css('transform', 'rotate(90deg)');
            } else {
                icon.css('transform', 'rotate(0deg)');
            }
        }

        function toggleDescription() {
            const container = $('#description-container');
            const icon = $('#description-toggle-icon');
            const listItem = icon.closest('li');
            
            container.toggleClass('d-none');
            listItem.toggleClass('active');
            if (!container.hasClass('d-none')) {
                icon.css('transform', 'rotate(90deg)');
            } else {
                icon.css('transform', 'rotate(0deg)');
            }
        }

        // Add this to your JavaScript to update button HTML
        document.querySelectorAll('.comment-actions button, .comment-footer button').forEach(button => {
            if (button.textContent.includes('Reply')) {
                button.innerHTML = '<i class="fas fa-reply"></i> Reply';
            } else if (button.textContent.includes('Edit')) {
                button.innerHTML = '<i class="fas fa-edit"></i> Edit';
            } else if (button.textContent.includes('Delete')) {
                button.innerHTML = '<i class="fas fa-trash"></i> Delete';
            }
        });

        function deleteComment(commentId) {
            $.ajax({
                type: "DELETE",
                url: `${apiLink}/api/lecture_comments/delete`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: {
                    comment_id: commentId
                },
                success: function(response) {
                    showToast("Comment deleted successfully", "success");
                    const params = window.location.href.split('?')[1];
                    const lectureId = params.split('&')[1];
                    loadLectureComments(lectureId);
                },
                error: function(err) {
                    console.error("Delete error:", err);
                    showToast("Failed to delete comment", "danger");
                }
            });
        }

        function postComment(lectureId) {
            const content = $(".comment-form").val().trim();
            if (!content) {
                showToast("Please enter a comment", "warning");
                return;
            }

            $.ajax({
                type: "POST",
                url: `${apiLink}/api/lecture_comments/add`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: {
                    lecture_id: lectureId,
                    content: content
                },
                success: function(response) {
                    $(".comment-form").val('');
                    showToast("Comment posted successfully", "success");
                    loadLectureComments(lectureId);
                },
                error: function(err) {
                    showToast("Failed to post comment", "danger");
                }
            });
        }
    </script>
</body>
</html>
