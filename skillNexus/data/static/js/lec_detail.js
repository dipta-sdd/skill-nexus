$(document).ready(function () {
    const url = window.location.href;
    const courseId = url.split('?')[1]; // Extract the course ID from the URL

    // Fetch course lecture details based on the course ID
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_video/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId,
        },
        success: function (res) {
            $("#course").html(""); // Clear previous content
            res.forEach(function (courseLecture) {
                showCourseLecture(courseLecture);
            });
        },
        error: function (err) {
            console.error('Failed to fetch course lectures:', err);
        },
    });

    // Function to display course lecture details
    function showCourseLecture(courseLecture) {
        $("#course").append(`
            <div class="col-12 mb-4">
                <div class="video-card">
                    <div class="video-thumbnail">
                        <img src="${apiLink + courseLecture.video}" alt="Video Thumbnail" class="img-fluid">
                    </div>
                    <div class="video-details mt-3">
                        <h3 class="video-title">${courseLecture.title}</h3>
                        <p class="video-description">${courseLecture.lecture_description}</p>
                        ${courseLecture.material ? `
                            <div class="mt-3">
                                <a href="${apiLink + courseLecture.material}" target="_blank" class="btn btn-primary">Download PDF</a>
                            </div>` : ``}
                        <div class="btn-group mt-3" role="group">
                            <button type="button" class="btn btn-primary btn-sm" style="width: 60px; font-size: 12px;" onclick="openEditModal(${courseLecture.id}, '${courseLecture.title}', '${courseLecture.lecture_description}', '${apiLink + courseLecture.material}', '${apiLink + courseLecture.video}')">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm ms-2" style="width: 60px; font-size: 12px;" onclick="deleteVideo(${courseLecture.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    // Function to open edit modal and populate with data
    window.openEditModal = function (id, title, description, material, video) {
        $('#lectureTitle').val(title);
        $('#lectureDescription').val(description);
        $('#lectureMaterial').val(''); // Clear file input
        $('#lectureVideo').val(''); // Clear file input
        $('#editModal').modal('show');

        $('#saveChanges').off('click').on('click', function () {
            saveChanges(id);
        });
    }

    // Function to handle save changes
    function saveChanges(id) {
        const formData = new FormData($('#editForm')[0]);
        formData.append('id', id);
        
        $.ajax({
            type: "POST",
            url: apiLink + "/api/course_video/edit",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                $('#editModal').modal('hide');
                location.reload(); // Reload the page to reflect changes
            },
            error: function (err) {
                console.error('Failed to save changes:', err);
            },
        });
    }

    // Function to handle delete video (adjust this as per your backend logic)
    window.deleteVideo = function (courseId) {
        if (confirm("Are you sure you want to delete this video?")) {
            // Perform delete operation via AJAX or redirect to delete endpoint
            // Example:
            // $.ajax({
            //     type: "DELETE",
            //     url: apiLink + "/api/course_video/delete/" + courseId,
            //     headers: {
            //         Authorization: "Bearer " + getCookie("token"),
            //     },
            //     success: function (res) {
            //         location.reload(); // Reload the page to reflect changes
            //     },
            //     error: function (err) {
            //         console.error('Failed to delete video:', err);
            //     },
            // });
        }
    }
});

$(document).ready(function() {
    const url = window.location.href;
    const lectureId = url.split('?')[1];

    function fetchComments() {
        $.ajax({
            type: "GET",
            url: apiLink + "/api/lecture_comments/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                lecture_id: lectureId,
            },
            success: function(comments) {
                $(".comments-section").empty();
                comments.forEach(comment => {
                    showComment(comment);
                });
            },
            error: function(err) {
                console.error("Failed to fetch comments:", err);
                showToast("Failed to load comments", "danger");
            },
        });
    }

    // Initial comment form
    $(".comments-section").before(`
        <div class="add-comment-form mb-4">
            <textarea class="form-control mb-2" rows="3" placeholder="Write a comment..."></textarea>
            <button class="btn btn-primary submit-comment">Post Comment</button>
        </div>
    `);

    // Add new comment
    $(document).on("click", ".submit-comment", function() {
        const content = $(this).siblings("textarea").val().trim();
        
        if (!content) {
            showToast("Please write a comment first", "warning");
            return;
        }
        
        $.ajax({
            type: "POST",
            url: apiLink + "/api/lecture_comments/add",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                lecture_id: lectureId,
                content: content
            }),
            success: function(response) {
                fetchComments();
                $(".add-comment-form textarea").val("");
                showToast("Comment added successfully", "success");
            },
            error: function(err) {
                console.error("Failed to add comment:", err);
                showToast("Failed to add comment", "danger");
            }
        });
    });

    // Reply to comment
    $(document).on("click", ".reply-comment", function() {
        const commentId = $(this).data("comment-id");
        
        // Toggle reply form
        const replyForm = $(`.reply-form-${commentId}`);
        replyForm.toggle();
        
        if (!replyForm.find('textarea').length) {
            replyForm.html(`
                <div class="ms-5 mt-2">
                    <textarea class="form-control mb-2" rows="2" placeholder="Write your reply..."></textarea>
                    <button class="btn btn-sm btn-primary submit-reply" data-parent-id="${commentId}">Submit Reply</button>
                </div>
            `);
        }
    });

    // Submit reply
    $(document).on("click", ".submit-reply", function() {
        const parentId = $(this).data("parent-id");
        const content = $(this).siblings("textarea").val().trim();
        
        if (!content) {
            showToast("Please write a reply first", "warning");
            return;
        }
        
        $.ajax({
            type: "POST",
            url: apiLink + "/api/lecture_comments/add",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                lecture_id: lectureId,
                content: content,
                parent: parentId
            }),
            success: function(response) {
                fetchComments();
                $(`.reply-form-${parentId}`).hide();
                showToast("Reply added successfully", "success");
            },
            error: function(err) {
                console.error("Failed to add reply:", err);
                showToast("Failed to add reply", "danger");
            }
        });
    });

    // Edit comment
    $(document).on("click", ".edit-comment", function() {
        const commentId = $(this).data("comment-id");
        const commentContent = $(this).closest('.comment').find('.comment-content').text().trim();
        
        $(this).closest('.comment').find('.comment-content').hide();
        $(this).closest('.comment').find('.comment-actions').hide();
        
        $(this).closest('.comment').append(`
            <div class="edit-form-${commentId} mt-2">
                <textarea class="form-control mb-2">${commentContent}</textarea>
                <button class="btn btn-sm btn-primary save-edit" data-comment-id="${commentId}">Save</button>
                <button class="btn btn-sm btn-secondary cancel-edit">Cancel</button>
            </div>
        `);
    });

    // Save edited comment
    $(document).on("click", ".save-edit", function() {
        const commentId = $(this).data("comment-id");
        const content = $(this).siblings("textarea").val().trim();
        
        $.ajax({
            type: "PUT",
            url: apiLink + "/api/lecture_comments/edit",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                comment_id: commentId,
                content: content
            }),
            success: function(response) {
                fetchComments();
                showToast("Comment updated successfully", "success");
            },
            error: function(err) {
                console.error("Failed to update comment:", err);
                showToast("Failed to update comment", "danger");
            }
        });
    });

    // Cancel edit
    $(document).on("click", ".cancel-edit", function() {
        const comment = $(this).closest('.comment');
        comment.find('.comment-content').show();
        comment.find('.comment-actions').show();
        comment.find('[class^="edit-form-"]').remove();
    });

    // Delete comment
    $(document).on("click", ".delete-comment", function() {
        const commentId = $(this).data("comment-id");
        
        if (confirm("Are you sure you want to delete this comment?")) {
            $.ajax({
                type: "DELETE",
                url: apiLink + "/api/lecture_comments/delete",
                headers: {
                    Authorization: "Bearer " + getCookie("token"),
                },
                data: {
                    comment_id: commentId,
                },
                success: function() {
                    fetchComments();
                    showToast("Comment deleted successfully", "success");
                },
                error: function(err) {
                    console.error("Failed to delete comment:", err);
                    showToast("Failed to delete comment", "danger");
                },
            });
        }
    });

    function showComment(comment) {
        const commentHtml = `
            <div class="comment mb-3" id="comment-${comment.id}">
                <div class="d-flex align-items-start">
                    <img src="${apiLink}${comment.user_profile_picture || '/media/profile_pics/default.png'}" 
                         class="rounded-circle me-2" width="40" height="40" alt="User">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-1">${comment.username}</h6>
                            <small class="text-muted">${comment.timestamp}</small>
                        </div>
                        <p class="comment-content mb-1 text-dark">${comment.content}</p>
                        <div class="comment-actions d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-primary reply-comment" data-comment-id="${comment.id}">
                                Reply
                            </button>
                            ${comment.user_id === parseInt(getCookie('user_id')) ? `
                                <button class="btn btn-sm btn-outline-secondary edit-comment" data-comment-id="${comment.id}">
                                    Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-comment" data-comment-id="${comment.id}">
                                    Delete
                                </button>
                            ` : ''}
                        </div>
                        <div class="reply-form-${comment.id} mt-2" style="display: none;"></div>
                        ${comment.replies && comment.replies.length > 0 ? `
                            <div class="replies ms-5 mt-2">
                                ${comment.replies.map(reply => `
                                    <div class="comment mb-2" id="comment-${reply.id}">
                                        <div class="d-flex align-items-start">
                                            <img src="${apiLink}${reply.user_profile_picture || '/media/profile_pics/default.png'}" 
                                                 class="rounded-circle me-2" width="30" height="30" alt="User">
                                            <div class="flex-grow-1">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h6 class="mb-1">${reply.username}</h6>
                                                    <small class="text-muted">${reply.timestamp}</small>
                                                </div>
                                                <p class="comment-content mb-1 text-dark">${reply.content}</p>
                                                ${reply.user_id === parseInt(getCookie('user_id')) ? `
                                                    <div class="comment-actions">
                                                        <button class="btn btn-sm btn-outline-secondary edit-comment" data-comment-id="${reply.id}">
                                                            Edit
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-danger delete-comment" data-comment-id="${reply.id}">
                                                            Delete
                                                        </button>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        $(".comments-section").append(commentHtml);
    }

    // Initial load of comments
    fetchComments();
});
