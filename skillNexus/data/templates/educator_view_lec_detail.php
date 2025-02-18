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

        /* Button Hover Effects */
        .btn-outline-primary:hover,
        .btn-outline-danger:hover,
        .btn-outline-info:hover,
        .btn-outline-success:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }

        .action-buttons .btn {
            padding: 8px 16px;
            font-size: 14px;
        }

        .video-card {
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 20px;
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
        function getCurrentUserId() {
            // First try to get from cookie
            let userId = getCookie("user_id");
            
            if (!userId) {
                // If not in cookie, try to get from JWT token
                const token = getCookie("token");
                if (token) {
                    // Make a synchronous request to get current user
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

        $(document).ready(function () {
            on_page_load([]);
            
            const url = window.location.href;
            const params = url.split('?')[1];
            const [courseId, lectureId] = params.split('&');

            // Store these as global variables
            window.courseId = courseId;
            window.lectureId = lectureId;

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

        function showCourseLecture(lecture) {
            // Get username with fallback
            const username = getCookie("username") || "User";
            const firstLetter = username.charAt(0).toUpperCase();

            $("#lecture-container").append(`
                <div class="col-12 mb-4">
                    <div class="video-card">
                        <div class="video-thumbnail">
                            <video controls style="max-height: 500px; width: 100%; object-fit: contain;">
                                <source src="${apiLink}${lecture.video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="video-details mt-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h3 class="video-title">${lecture.title}</h3>
                                <div class="action-buttons d-flex gap-2">
                                    <a href="/edit_video?${lecture.id}" 
                                       class="btn btn-outline-primary d-flex align-items-center gap-2">
                                        <i class="fas fa-pencil-alt"></i>
                                        Edit Lecture
                                    </a>
                                    <button class="btn btn-outline-danger d-flex align-items-center gap-2" 
                                            onclick="deleteLecture('${lecture.id}')">
                                        <i class="fas fa-trash-alt"></i>
                                        Delete Lecture
                                    </button>
                                </div>
                            </div>
                            <p class="video-description">${lecture.lecture_description || ''}</p>
                            ${lecture.material ? `
                                <div class="mt-3 d-flex gap-2">
                                    <a href="${apiLink}${lecture.material}" 
                                       target="_blank" 
                                       class="btn btn-outline-info d-flex align-items-center gap-2">
                                        <i class="fas fa-file-download"></i>
                                        Download Materials
                                    </a>
                                    <a href="/see_submission?${courseId}&${lecture.id}" 
                                       class="btn btn-outline-success d-flex align-items-center gap-2">
                                        <i class="fas fa-clipboard-list"></i>
                                        View Submissions
                                    </a>
                                </div>` : ``}
                        </div>
                        
                        <!-- Comments Section with Scrollbar -->
                        <div class="comments-section mt-4">
                            <div class="d-flex align-items-center gap-2 mb-4">
                                <i class="fas fa-comments fa-lg text-primary"></i>
                                <h4 class="mb-0">Comments</h4>
                            </div>
                            <div class="mb-4">
                                <div class="d-flex gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center" 
                                         style="width: 40px; 
                                                height: 40px; 
                                                background-color: #007bff; 
                                                color: white; 
                                                font-weight: bold;">
                                        ${firstLetter}
                                    </div>
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
        }

        function loadLectureComments(lectureId) {
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
            
            // Separate top-level comments and replies
            const parentComments = comments.filter(comment => !comment.parent_id);
            const replies = comments.filter(comment => comment.parent_id);
            
            console.log('Parent comments:', parentComments);
            console.log('Replies:', replies);
            
            // Group replies by parent
            parentComments.forEach(comment => {
                // Find all replies for this parent comment
                comment.replies = replies.filter(reply => reply.parent_id === comment.id);
                commentsList.append(createCommentHTML(comment));
            });
        }

        function createCommentHTML(comment) {
            const currentUserId = getCurrentUserId();
            const commentUserId = comment.user_id || (comment.user && comment.user.id);
            const isCommentOwner = String(commentUserId) === String(currentUserId);
            
            // Get first letter of username and create profile image or letter circle
            const firstLetter = comment.username ? comment.username.charAt(0).toUpperCase() : '?';
            const profileImageOrLetter = comment.user_profile_picture ? 
                `<img src="${comment.user_profile_picture}" 
                      class="rounded-circle" 
                      width="40" 
                      height="40" 
                      alt="${comment.username}">` :
                `<div class="rounded-circle d-flex align-items-center justify-content-center" 
                      style="width: 40px; 
                             height: 40px; 
                             background-color: #007bff; 
                             color: white; 
                             font-weight: bold;">${firstLetter}</div>`;

            const editDeleteButtons = isCommentOwner ? `
                <div class="comment-actions">
                    <button class="btn btn-sm btn-link edit-comment-btn" onclick="editComment(${comment.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-link text-danger delete-comment-btn" onclick="deleteComment(${comment.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : '';

            return `
                <div class="comment-thread">
                    <div class="comment mybg" id="comment-${comment.id}" 
                         style="padding: 16px 0;
                                border-bottom: 1px solid rgba(0,0,0,.125);">
                        <div class="d-flex gap-3">
                            ${profileImageOrLetter}
                            <div class="comment-content flex-grow-1">
                                <div class="d-flex align-items-center gap-2">
                                    <a href="/profile/${comment.user_id}" 
                                       class="fw-bold text-decoration-none my-color" 
                                       style="font-size: 13px;">${comment.username}</a>
                                    <small class="text-muted" style="font-size: 12px;">${comment.timestamp}</small>
                                    ${comment.edited ? '<small class="text-muted" style="font-size: 12px;">(edited)</small>' : ''}
                                </div>
                                <p class="mb-2 mt-1 my-color" 
                                   id="comment-content-${comment.id}" 
                                   style="font-size: 14px;">${comment.content}</p>
                                <div class="d-flex align-items-center gap-3" style="font-size: 13px;">
                                    <button class="btn btn-sm p-0 like-button-${comment.id}" 
                                            onclick="toggleLike(${comment.id})"
                                            style="font-size: 13px; color: ${comment.has_liked ? '#dc3545' : '#6c757d'};">
                                        <i class="fas fa-heart ${comment.has_liked ? 'text-danger' : 'text-muted'}"></i>
                                        <span class="like-count-${comment.id}" style="margin-left: 4px;">${comment.like_count || 0}</span>
                                    </button>
                                    <button class="btn btn-sm p-0" 
                                            onclick="toggleReplyForm('${comment.id}')"
                                            style="font-size: 13px; color: #6c757d;">
                                        <i class="fas fa-reply text-muted"></i>
                                        <span style="margin-left: 4px;">Reply</span>
                                    </button>
                                    ${editDeleteButtons}
                                </div>
                                <div class="reply-form-container-${comment.id} d-none mt-3">
                                    <div class="d-flex gap-3">
                                        ${profileImageOrLetter}
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
                                                <button class="btn btn-sm" onclick="toggleReplyForm('${comment.id}')">Cancel</button>
                                                <button class="btn btn-sm btn-primary" onclick="submitReply('${comment.id}')">Reply</button>
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

        function toggleReplyForm(commentId) {
            console.log('Toggling reply form for comment:', commentId);
            const commentElement = $(`#comment-${commentId}`);
            const parentId = commentElement.closest('.comment').data('parent-id') || commentId;
            console.log('Parent ID for reply:', parentId);
            
            const replyContainer = $(`.reply-form-container-${commentId}`);
            replyContainer.toggleClass('d-none');
            replyContainer.attr('data-parent-id', parentId);
        }

        function submitReply(commentId) {
            const content = $(`.reply-form-container-${commentId} textarea`).val().trim();
            const params = window.location.href.split('?')[1];
            const [courseId, lectureId] = params.split('&');
            
            // Find the parent comment ID
            let parentId = commentId;
            const commentElement = $(`#comment-${commentId}`);
            
            // If this is a reply to a reply, get the parent comment's ID
            if (commentElement.closest('.replies').length > 0) {
                parentId = commentElement.closest('.replies').closest('.comment').attr('id').split('-')[1];
                console.log("Replying to a reply. Original parent ID:", parentId);
            }

            if (!content) {
                showToast("Please enter a reply", "warning");
                return;
            }

            console.log(`Submitting reply to comment ${parentId}`);
            
            $.ajax({
                type: "POST",
                url: `${apiLink}/api/lecture_comments/add`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: {
                    course_id: courseId,
                    lecture_id: lectureId,
                    content: content,
                    parent: parentId  // Changed from parent_id to parent to match API
                },
                success: function(response) {
                    showToast("Reply posted successfully", "success");
                    loadLectureComments(lectureId);
                    $(`.reply-form-container-${commentId} textarea`).val('');
                    $(`.reply-form-container-${commentId}`).addClass('d-none');
                },
                error: function(err) {
                    console.error("Reply error:", err);
                    showToast("Failed to post reply", "danger");
                }
            });
        }

        function editComment(commentId) {
            const contentElement = $(`#comment-content-${commentId}`);
            const currentContent = contentElement.text().trim();
            
            contentElement.html(`
                <div class="edit-form">
                    <textarea class="form-control mybg my-color" 
                              id="edit-${commentId}" 
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
            $(`#comment-content-${commentId}`).html(originalContent);
        }

        function saveEdit(commentId) {
            const content = $(`#edit-${commentId}`).val().trim();
            if (!content) {
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
                    content: content
                },
                success: function(response) {
                    showToast("Comment updated successfully", "success");
                    loadLectureComments(window.lectureId);
                },
                error: function(err) {
                    console.error("Edit error:", err);
                    showToast("Failed to update comment", "danger");
                }
            });
        }

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
                    loadLectureComments(window.lectureId);
                },
                error: function(err) {
                    console.error("Delete error:", err);
                    showToast("Failed to delete comment", "danger");
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
                    const likeButton = $(`.like-button-${commentId} .fa-heart`);
                    const likeCount = $(`.like-count-${commentId}`);
                    
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

        function deleteLecture(lectureId) {
            if (confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
                // Get course ID from URL parameters
                const params = window.location.href.split('?')[1];
                const [courseId, _] = params.split('&');

                $.ajax({
                    type: "DELETE",
                    url: `${apiLink}/api/lecture/delete`,
                    headers: {
                        "Authorization": "Bearer " + getCookie("token")
                    },
                    data: {
                        id: lectureId
                    },
                    success: function(response) {
                        showToast("Lecture deleted successfully", "success");
                        // Redirect to course detail page with course ID
                        window.location.href = `/course_detail?${courseId}`;
                    },
                    error: function(err) {
                        console.error("Delete error:", err);
                        showToast("Failed to delete lecture", "danger");
                    }
                });
            }
        }
    </script>
</body>
</html>
