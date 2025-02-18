{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <title>Lecture Detail Educator- SkillNexus</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{% static 'css/style.css' %}" />
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
        $(document).ready(function () {
            on_page_load([]);
            
            const url = window.location.href;
            const lectureId = url.split('?')[1];

            // Fetch lecture video and details
            $.ajax({
                type: "GET",
                url: `${apiLink}/api/course_video/get`,
                headers: {
                    Authorization: "Bearer " + getCookie("token"),
                },
                data: {
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
            $("#lecture-container").append(`
                <div class="col-12 mb-4">
                    <div class="video-card">
                        <div class="video-thumbnail">
                            <video controls class="w-100">
                                <source src="${apiLink}${lecture.video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="video-details mt-3">
                            <h3 class="video-title">${lecture.title}</h3>
                            <p class="video-description">${lecture.lecture_description || ''}</p>
                            ${lecture.material ? `
                                <div class="mt-3">
                                    <a href="${apiLink}${lecture.material}" target="_blank" class="btn btn-primary">
                                        <i class="fas fa-download"></i> Download Materials
                                    </a>
                                </div>` : ``}
                        </div>
                    </div>
                    
                    <!-- Comments Section -->
                    <div class="comments-section mt-4">
                        <h4>Comments</h4>
                        <div class="comment-form mb-3">
                            <textarea class="form-control mb-2" rows="2" placeholder="Write a comment..."></textarea>
                            <button class="btn btn-primary" onclick="postComment('${lecture.id}')">Post Comment</button>
                        </div>
                        <div class="comments-list">
                            <!-- Comments will be loaded here -->
                        </div>
                    </div>
                </div>
            `);
        }

        function loadLectureComments(lectureId) {
            console.log("%c Loading comments for lecture ID: " + lectureId, "background: #222; color: #bada55");
            
            $.ajax({
                type: "GET",
                url: `${apiLink}/api/lecture_comments/get`,
                headers: {
                    "Authorization": "Bearer " + getCookie("token")
                },
                data: { lecture_id: lectureId },
                success: function(response) {
                    console.log("=== COMMENT LOADING SUCCESS ===");
                    console.log("Raw response:", response);
                    console.log("Response type:", typeof response);
                    console.log("Is array?", Array.isArray(response));
                    console.log("Length:", response.length);
                    
                    if (response && Array.isArray(response)) {
                        displayComments(response);
                    } else if (typeof response === 'string') {
                        // Try to parse if it's a string
                        try {
                            const parsedResponse = JSON.parse(response);
                            displayComments(parsedResponse);
                        } catch (e) {
                            console.error("Failed to parse response:", e);
                        }
                    } else {
                        console.warn("Invalid response format:", response);
                        $(".comments-list").html('<p class="text-muted">No comments yet. Be the first to comment!</p>');
                    }
                },
                error: function(err) {
                    console.error("Failed to load comments:", err);
                    showToast("Failed to load comments", "danger");
                }
            });
        }

        function displayComments(comments) {
            const commentsList = $(".comments-list");
            commentsList.empty();
            
            console.log("=== DISPLAY COMMENTS ===");
            console.log("Comments received:", comments);
            
            if (!comments || !Array.isArray(comments) || comments.length === 0) {
                console.log("No comments to display - empty array or invalid data");
                commentsList.html('<p class="text-muted">No comments yet. Be the first to comment!</p>');
                return;
            }
            
            // First, let's see what we're working with
            comments.forEach((comment, index) => {
                console.log(`Comment ${index}:`, {
                    id: comment.id,
                    content: comment.content,
                    is_reply: comment.is_reply,
                    parent_id: comment.parent_id
                });
            });
            
            // Filter for parent comments (comments with no parent_id)
            const parentComments = comments.filter(comment => !comment.parent_id);
            console.log("Parent comments found:", parentComments.length);
            
            parentComments.forEach(comment => {
                // Get replies for this comment
                const replies = comments.filter(reply => reply.parent_id === comment.id);
                console.log(`Found ${replies.length} replies for comment ${comment.id}`);
                
                comment.replies = replies;
                const commentHTML = createCommentHTML(comment);
                console.log(`Generated HTML for comment ${comment.id}:`, commentHTML);
                commentsList.append(commentHTML);
            });
        }

        function createCommentHTML(comment) {
            return `
                <div class="comment mb-3" id="comment-${comment.id}">
                    <div class="d-flex">
                        <div class="profile-circle me-2">
                            ${comment.username.charAt(0).toUpperCase()}
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0 text-dark">${comment.username}</h6>
                                <small class="text-dark">${comment.timestamp}</small>
                            </div>
                            <p class="comment-content mb-2 text-dark">${comment.content}</p>
                            
                            <div class="comment-actions">
                                <button class="btn btn-sm btn-link text-dark" onclick="toggleReplyForm(${comment.id})">
                                    <i class="fas fa-reply"></i> Reply
                                </button>
                                <button class="btn btn-sm btn-link text-dark" onclick="toggleLike(${comment.id})">
                                    <i class="fas fa-heart ${comment.has_liked ? 'text-danger' : ''}"></i>
                                    <span class="like-count">${comment.like_count || 0}</span>
                                </button>
                                ${comment.is_owner ? `
                                    <button class="btn btn-sm btn-link text-dark" onclick="editComment(${comment.id})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-link text-danger" onclick="deleteComment(${comment.id})">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                ` : ''}
                            </div>
                            
                            <div class="reply-form-container-${comment.id} d-none mt-2">
                                <div class="input-group">
                                    <textarea class="form-control" rows="1" placeholder="Write a reply..."></textarea>
                                    <button class="btn btn-primary" onclick="submitReply(${comment.id})">Reply</button>
                                </div>
                            </div>
                            
                            ${comment.replies && comment.replies.length > 0 ? `
                                <div class="replies ms-4 mt-2">
                                    ${comment.replies.map(reply => createCommentHTML(reply)).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        function postComment(lectureId) {
            const content = $(".comment-form textarea").val().trim();
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
                    $(".comment-form textarea").val('');
                    showToast("Comment posted successfully", "success");
                    loadLectureComments(lectureId); // Reload comments after posting
                },
                error: function(err) {
                    showToast("Failed to post comment", "danger");
                }
            });
        }

        function toggleReplyForm(commentId) {
            $(`.reply-form-container-${commentId}`).toggleClass('d-none');
        }

        function submitReply(commentId) {
            const content = $(`.reply-form-container-${commentId} textarea`).val().trim();
            const lectureId = window.location.href.split('?')[1];
            
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
                    lecture_id: lectureId,
                    content: content,
                    parent: parentId
                },
                success: function(response) {
                    showToast("Reply posted successfully", "success");
                    loadLectureComments(lectureId);
                    $(`.reply-form-container-${commentId} textarea`).val('');
                    $(`.reply-form-container-${commentId}`).addClass('d-none');
                },
                error: function(err) {
                    showToast("Failed to post reply", "danger");
                }
            });
        }

        function editComment(commentId) {
            const commentElement = $(`#comment-${commentId}`);
            const currentContent = commentElement.find('.comment-content').text();
            
            commentElement.find('.comment-content').html(`
                <textarea class="form-control mb-2">${currentContent}</textarea>
                <button class="btn btn-sm btn-primary me-2" onclick="saveEdit(${commentId})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEdit(${commentId}, '${currentContent}')">Cancel</button>
            `);
        }

        function saveEdit(commentId) {
            const newContent = $(`#comment-${commentId} textarea`).val().trim();
            
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
                    loadLectureComments(window.location.href.split('?')[1]);
                },
                error: function(err) {
                    showToast("Failed to update comment", "danger");
                }
            });
        }

        function deleteComment(commentId) {
            if (!confirm("Are you sure you want to delete this comment?")) return;

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
                    loadLectureComments(window.location.href.split('?')[1]);
                },
                error: function(err) {
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
                    // Update only the specific comment's like status
                    const likeButton = $(`#comment-${commentId} .fa-heart`).first();
                    const likeCount = $(`#comment-${commentId} .like-count`).first();
                    
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
    </script>
</body>
</html>
