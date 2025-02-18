const url = window.location.href;
const value = url.split("?")[1];

// Move all functions outside of any other function and define them first
function addNewComment(courseId) {
    const content = $(`#newComment-${courseId}`).val();
    if (!content.trim()) {
        showToast("Please write a comment first", "Warning");
        return;
    }

    // Debug log to check courseId type and value
    console.log("Course ID type:", typeof courseId, "value:", courseId);

    const commentData = {
        course_id: courseId,  // Changed to course_id to match updated backend
        content: content.trim()
    };

    console.log("Attempting to post comment with data:", commentData);

    $.ajax({
        type: "POST",
        url: apiLink + "/api/comments/add",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(commentData),
        success: function(response) {
            console.log("Comment posted successfully:", response);
            showToast("Comment posted successfully", "Success");
            $(`#newComment-${courseId}`).val('');
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error posting comment. Status:", error.status);
            console.error("Error response:", error.responseText);
            console.error("Full error object:", error);
            showToast(error.responseJSON?.error || "Failed to post comment", "Danger");
        }
    });
}

function loadComments(courseId) {
    console.log("Loading comments for course:", courseId);
    $.ajax({
        type: "GET",
        url: apiLink + "/api/comments/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId,
        },
        success: function(response) {
            console.log("Received comments:", response);
            const container = $(`#comments-container-${courseId}`);
            container.empty();
            response.forEach(comment => {
                container.append(createCommentHTML(comment, courseId));
            });
        },
        error: function(error) {
            console.error("Error loading comments:", error);
            showToast("Failed to load comments", "Danger");
        }
    });
}

function createCommentHTML(comment, courseId) {
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
            <button class="btn btn-sm p-0 me-3" onclick="editComment(${courseId}, ${comment.id})"
                    style="color: #0d6efd;">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm p-0" onclick="deleteComment(${courseId}, ${comment.id})"
                    style="color: #dc3545;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    ` : '';

    // Also update the reply form profile image
    const replyFormProfileImage = comment.user_profile_picture ?
        `<img src="${comment.user_profile_picture}" 
              class="rounded-circle" 
              width="32" 
              height="32">` :
        `<div class="rounded-circle d-flex align-items-center justify-content-center" 
              style="width: 32px; 
                     height: 32px; 
                     background-color: #007bff; 
                     color: white; 
                     font-weight: bold;">${firstLetter}</div>`;

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
                            <small class="text-muted" style="font-size: 12px;">${formatTimestamp(comment.timestamp)}</small>
                            ${comment.edited ? '<small class="text-muted" style="font-size: 12px;">(edited)</small>' : ''}
                        </div>
                        <p class="mb-2 mt-1 my-color" 
                           id="comment-content-${comment.id}" 
                           style="font-size: 14px;">${comment.content}</p>
                        <div class="d-flex align-items-center gap-3" style="font-size: 13px;">
                            <button class="btn btn-sm p-0 like-button-${comment.id}" 
                                    onclick="likeComment(${comment.id})"
                                    style="font-size: 13px; color: ${comment.has_liked ? '#dc3545' : '#6c757d'};">
                                <i class="fas fa-heart ${comment.has_liked ? 'text-danger' : 'text-muted'}"></i>
                                <span class="like-count-${comment.id}" style="margin-left: 4px;">${comment.like_count}</span>
                            </button>
                            <button class="btn btn-sm p-0" 
                                    onclick="showReplyForm(${courseId}, ${comment.id})"
                                    style="font-size: 13px; color: #6c757d;">
                                <i class="fas fa-reply text-muted"></i>
                                <span style="margin-left: 4px;">Reply</span>
                            </button>
                            ${editDeleteButtons}
                        </div>
                        <div id="replyForm-${comment.id}" style="display: none;" class="mt-3">
                            <div class="d-flex gap-3">
                                ${replyFormProfileImage}
                                <div class="flex-grow-1">
                                    <textarea class="form-control mybg my-color" 
                                            id="replyText-${comment.id}" 
                                            rows="3" 
                                            placeholder="Add a reply..."
                                            style="border: none; 
                                                   border-bottom: 1px solid rgba(0,0,0,.125);
                                                   padding: 8px 0;
                                                   font-size: 14px;
                                                   resize: none;
                                                   min-height: 80px;"></textarea>
                                    <div class="d-flex justify-content-end gap-2 mt-2">
                                        <button class="btn btn-sm" onclick="hideReplyForm(${courseId}, ${comment.id})">Cancel</button>
                                        <button class="btn btn-sm btn-primary d-flex align-items-center gap-2" onclick="submitReply(${courseId}, ${comment.id})">
                                            <i class="fas fa-paper-plane"></i>
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nested-replies" style="margin-left: 56px;">
                ${comment.replies ? comment.replies.map(reply => createCommentHTML(reply, courseId)).join('') : ''}
            </div>
        </div>
    `;
}

// Updated timestamp formatting function with direct timezone conversion
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();  // This will format the date in the user's locale
}

function hideReplyForm(courseId, commentId) {
    $(`#replyForm-${commentId}`).hide();
    $(`#replyText-${commentId}`).val('');
}

function editComment(courseId, commentId) {
    const contentElement = $(`#comment-content-${commentId}`);
    const currentContent = contentElement.text().trim();
    
    // Hide the action buttons while editing
    const commentDiv = $(`#comment-${commentId}`);
    const actionButtons = commentDiv.find('.comment-actions');
    actionButtons.hide();
    
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
                <button class="btn btn-sm" onclick="loadComments(${courseId})">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="saveEdit(${courseId}, ${commentId})">Save</button>
            </div>
        </div>
    `);
}

function cancelEdit(courseId, commentId) {
    console.log("Cancel edit clicked for comment:", commentId, "in course:", courseId);
    // Simply reload all comments when cancel is clicked
    loadComments(courseId);
}

function deleteComment(courseId, commentId) {
    $.ajax({
        type: "DELETE",
        url: apiLink + "/api/comments/delete",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            comment_id: commentId
        },
        success: function(response) {
            showToast("Comment deleted successfully", "Success");
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error deleting comment:", error);
            showToast("Failed to delete comment", "Danger");
        }
    });
}

function likeComment(commentId) {
    $.ajax({
        type: "POST",
        url: apiLink + "/api/comments/like",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            comment_id: commentId
        }),
        success: function(response) {
            // Get the direct parent div of the like button that was clicked
            const commentDiv = $(`#comment-${commentId} > div.d-flex`);
            // Find the like button and count only within this specific div
            const likeButton = commentDiv.find(`.like-button-${commentId} .fa-heart`).first();
            const likeCount = commentDiv.find(`.like-count-${commentId}`).first();
            
            console.log("Updating like for comment:", commentId);
            console.log("Found like button:", likeButton.length);
            console.log("Found like count:", likeCount.length);
            
            if (response.liked) {
                likeButton.addClass('text-danger');
            } else {
                likeButton.removeClass('text-danger');
            }
            
            likeCount.text(response.like_count);
        },
        error: function(error) {
            console.error("Error liking comment:", error);
            showToast("Failed to like comment", "Danger");
        }
    });
}

function showReplyForm(courseId, commentId) {
    $(`#replyForm-${commentId}`).toggle();
}

function submitReply(courseId, parentId) {
    const content = $(`#replyText-${parentId}`).val();
    if (!content.trim()) {
        showToast("Please write a reply first", "Warning");
        return;
    }

    $.ajax({
        type: "POST",
        url: apiLink + "/api/comments/add",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            course_id: courseId,
            content: content.trim(),
            parent: parentId
        }),
        success: function(response) {
            showToast("Reply posted successfully", "Success");
            $(`#replyForm-${parentId}`).hide();
            $(`#replyText-${parentId}`).val('');
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error posting reply:", error);
            showToast("Failed to post reply", "Danger");
        }
    });
}

function saveEdit(courseId, commentId) {
    const content = $(`#edit-${commentId}`).val();
    if (!content.trim()) {
        showToast("Comment cannot be empty", "Warning");
        return;
    }

    $.ajax({
        type: "PUT",
        url: apiLink + "/api/comments/edit",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            comment_id: commentId,
            content: content.trim()
        }),
        success: function(response) {
            showToast("Comment updated successfully", "Success");
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error updating comment:", error);
            showToast("Failed to update comment", "Danger");
        }
    });
}

function loadMessages(courseId) {
    console.log("Loading messages for course:", courseId);
    const currentUserId = getCurrentUserId();

    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_messages/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId
        },
        success: function(response) {
            console.log("Messages loaded successfully:", response);
            
            // Group messages by student
            const messagesByStudent = {};
            response.forEach(message => {
                const studentId = message.sender === currentUserId ? message.receiver : message.sender;
                if (studentId !== currentUserId) {
                    if (!messagesByStudent[studentId]) {
                        messagesByStudent[studentId] = {
                            student: {
                                id: studentId,
                                name: message.sender === currentUserId ? message.receiver_name : message.sender_name,
                                profile_picture: message.sender === currentUserId ? message.receiver_profile_picture : message.sender_profile_picture
                            },
                            lastMessage: message
                        };
                    } else if (new Date(message.timestamp) > new Date(messagesByStudent[studentId].lastMessage.timestamp)) {
                        messagesByStudent[studentId].lastMessage = message;
                    }
                }
            });

            // Render student list
            const studentList = $(`#students-list-${courseId}`);
            studentList.empty();

            Object.values(messagesByStudent).sort((a, b) => 
                new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
            ).forEach(data => {
                const student = data.student;
                const lastMessage = data.lastMessage;
                
                studentList.append(`
                    <div class="student-item p-3 border-bottom" 
                         style="cursor: pointer;" 
                         onclick="showConversation(${courseId}, ${student.id})">
                        <div class="d-flex align-items-center gap-3">
                            ${student.profile_picture ? 
                                `<img src="${student.profile_picture}" 
                                      class="rounded-circle" 
                                      width="40" 
                                      height="40" 
                                      alt="${student.name}">` :
                                `<div class="rounded-circle bg-primary text-black d-flex align-items-center justify-content-center" 
                                      style="width: 40px; height: 40px;background-color: var(--bg);">
                                    ${student.name.charAt(0).toUpperCase()}
                                </div>`
                            }
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${student.name}</h6>
                                <p class="mb-0 text-muted small text-truncate" style="max-width: 150px;">
                                    ${lastMessage.content}
                                </p>
                            </div>
                            <small class="text-muted" style="font-size: 11px;">
                                ${formatTimestamp(lastMessage.timestamp)}
                                            </small>
                    </div>
                </div>
            `);
            });
        },
        error: function(error) {
            console.error("Error loading messages:", error);
            showToast("Failed to load messages", "Danger");
        }
    });
}

function showConversation(courseId, studentId) {
    const container = $(`#messageThread-${courseId}`);
    const header = $(`#conversation-header-${courseId}`);
    const inputContainer = $(`#message-input-${courseId}`);
    
    // Show header and input
    header.removeClass('d-none');
    inputContainer.removeClass('d-none');

    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_messages/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId,
            receiver: studentId
        },
        success: function(response) {
            console.log('Conversation loaded:', response);
            
            // Update header with student info
            const studentInfo = response.find(m => m.sender === studentId || m.receiver === studentId);
            if (studentInfo) {
                const studentName = studentInfo.sender === studentId ? studentInfo.sender_name : studentInfo.receiver_name;
                const profilePic = studentInfo.sender === studentId ? studentInfo.sender_profile_picture : studentInfo.receiver_profile_picture;
                
                header.html(`
                    <div class="d-flex align-items-center gap-3">
                        ${profilePic ? 
                            `<img src="${profilePic}" class="rounded-circle" width="40" height="40" alt="${studentName}">` :
                            `<div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                                  style="width: 40px; height: 40px;background-color: var(--bg);color: black;">
                                ${studentName.charAt(0).toUpperCase()}
                            </div>`
                        }
                        <h6 class="mb-0" style="color: black;">${studentName}</h6>
                    </div>
                `);
            }
            
            // Sort messages by timestamp
            response.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            // Display messages
            container.empty();
                response.forEach(message => {
                    container.append(createMessageHTML(message));
                });
            
            // Scroll to bottom
                container.scrollTop(container[0].scrollHeight);
            
            // Set up send button handler for this conversation
            $(`#send-button-${courseId}`).off('click').on('click', function() {
                sendMessage(courseId, studentId);
            });
        },
        error: function(error) {
            console.error("Error loading conversation:", error);
            showToast("Failed to load conversation", "Danger");
        }
    });
}

function sendMessage(courseId, studentId) {
    const content = $(`#newMessage-${courseId}`).val();
    if (!content || !content.trim()) {
        showToast("Please write a message first", "Warning");
        return;
    }

    const currentUserId = getCurrentUserId();
    console.log('Sending message:', {
        courseId,
        studentId,
        content: content.trim()
    });

    $.ajax({
        type: "POST",
        url: apiLink + "/api/course_messages/send",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            course_id: courseId,
            content: content.trim(),
            receiver: studentId
        }),
        success: function(response) {
            console.log('Message sent successfully:', response);
            showToast("Message sent successfully", "Success");
            $(`#newMessage-${courseId}`).val('');
            showConversation(courseId, studentId);
            // Reload student list to update last message
            loadMessages(courseId);
        },
        error: function(error) {
            console.error("Error sending message:", error);
            showToast("Failed to send message", "Danger");
        }
    });
}

$(document).ready(function () {
    console.log("Document ready");
    
    // Add this after the discussion tab HTML is created
    $('body').on('shown.bs.tab', 'button[data-bs-target^="#discussion-"]', function (e) {
        const courseId = $(this).attr('data-bs-target').split('-')[1];
        console.log("Discussion tab shown for course:", courseId);
        loadComments(courseId);
    });

    // Add handler for messages tab
    $('body').on('shown.bs.tab', 'button[data-bs-target^="#messages-"]', function (e) {
        const courseId = $(this).attr('data-bs-target').split('-')[1];
        console.log("Messages tab shown for course:", courseId);
        loadMessages(courseId);
    });
    
    // Function to fetch course details and update UI
    function fetchCourseDetails() {
        $.ajax({
            type: "GET",
            url: apiLink + "/api/course_list_single/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: value,
            },
            success: function (res) {
                $("#course").html("");
                res.forEach(function (course) {
                    showCourse(course);
                    checkEnrollmentStatus(course.id, function (isEnrolled) {
                        updateEnrollmentButton(course.id, isEnrolled);
                    });
                });
            },
            error: function (err) {
                console.error("Failed to fetch courses:", err);
            },
        });
    }

    // Function to check enrollment status and update UI
    function checkEnrollmentStatus(courseId, callback) {
        $.ajax({
            type: "GET",
            url: apiLink + `/api/course_enroll/check`,
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
            },
            success: function (response) {
                callback(response.enrolled);
            },
            error: function (error) {
                console.error("Error checking enrollment:", error);
                callback(false); // Default to not enrolled
            },
        });
    }

    // Event handler for clicking "Enroll Now"
    $(document).on("click", ".enroll-btn", function (e) {
        e.preventDefault();
        const courseId = $(this).data("course-id");

        // Show enrollment confirmation modal
        $("#addTrainModel").modal("show");

        // Confirm enrollment
        $("#addTrainModel .btn-secondary").on("click", function () {
            $.ajax({
                type: "POST",
                url: apiLink + "/api/course_enroll/add",
                headers: {
                    Authorization: "Bearer " + getCookie("token"),
                },
                data: {
                    course_id: courseId,
                },
                success: function (response) {
                    showToast("Successfully Enrolled", "Primary");
                    $("#addTrainModel").modal("hide");
                    // Update the button text to "Already Enrolled"
                    updateEnrollmentButton(courseId, true);
                },
                error: function (error) {
                    console.error("Enrollment failed:", error);
                    $("#addTrainModel").modal("hide");
                },
            });
        });
    });

    // Function to render each course on the page
    function showCourse(course) {
        // Get user info from current_user endpoint instead of cookies
        $.ajax({
            type: "GET",
            url: apiLink + "/api/current_user",
            headers: {
                Authorization: "Bearer " + getCookie("token")
            },
            async: false,
            success: function(response) {
                const currentUserId = response.id;
                const currentUserRole = response.role;
                const isEducator = currentUserRole === "Educator";
                const isCourseOwner = course.user === currentUserId;
                
                console.log("Debug info:", {
                    currentUserRole,
                    currentUserId,
                    courseUserId: course.user,
                    isEducator,
                    isCourseOwner
                });
                
                // Create course actions HTML based on ownership with updated styling
                const courseActionsHTML = isCourseOwner ? `
                    <div id="courseActions-${course.id}" class="mb-3 d-flex gap-2">
                        <a href="/edit_detail?${course.id}" 
                           class="btn btn-outline-primary d-flex align-items-center gap-2">
                            <i class="fas fa-edit"></i>
                            <span>Edit Course</span>
                        </a>
                        <a href="/view_progress_edu?${course.id}" 
                           class="btn btn-outline-info d-flex align-items-center gap-2">
                            <i class="fas fa-chart-line"></i>
                            <span>View Progress</span>
                        </a>
                        <button class="btn btn-outline-danger d-flex align-items-center gap-2" 
                                onclick="deleteCourse(${course.id})">
                            <i class="fas fa-trash-alt"></i>
                            <span>Delete Course</span>
                        </button>
                    </div>
                ` : (!isEducator ? `
                    <div id="enrollBtnContainer-${course.id}">
                        <a href="#" class="btn btn-primary enroll-btn" data-course-id="${course.id}">
                            <i class="fas fa-user-plus me-2"></i>Enroll Now
                        </a>
                    </div>
                ` : '');

                $("#course").append(`
                    <div class="col-12 col-md-12 mx-auto my-2">
                        <div class="card mb-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="${
                                        apiLink + course.course_thumbnil
                                    }" class="img-fluid rounded-start" alt="Course Thumbnail" style="width: 100%; height: 180px; object-fit: cover;">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${course.title}</h5>
                                        <p class="card-text my-color">${
                                            course.course_outcome
                                        }</p>
                                        <p class="card-text">
                                            <small class="text-muted">
                                                <i class="fas fa-tag me-1"></i>Course Fee: ${
                                                    course.course_fee
                                                } $
                                            </small>
                                        </p>
                                        ${courseActionsHTML}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ul class="nav nav-tabs my-color" id="myTab-${
                            course.id
                        }" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="learn-tab-${
                                    course.id
                                }" data-bs-toggle="tab" data-bs-target="#learn-${course.id}" type="button" role="tab" aria-controls="learn-${course.id}" aria-selected="true">What you'll learn</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="content-tab-${
                                    course.id
                                }" data-bs-toggle="tab" data-bs-target="#content-${course.id}" type="button" role="tab" aria-controls="content-${course.id}" aria-selected="false">Course content</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="reviews-tab-${
                                    course.id
                                }" data-bs-toggle="tab" data-bs-target="#reviews-${course.id}" type="button" role="tab" aria-controls="reviews-${course.id}" aria-selected="false">Reviews</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="instructors-tab-${
                                    course.id
                                }" data-bs-toggle="tab" data-bs-target="#instructors-${course.id}" type="button" role="tab" aria-controls="instructors-${course.id}" aria-selected="false">Instructors</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="lectures-tab-${
                                    course.id
                                }" data-bs-toggle="tab" data-bs-target="#lectures-${course.id}" type="button" role="tab" aria-controls="lectures-${course.id}" aria-selected="false">Lectures</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="discussion-tab-${
                                    course.id
                                }" data-bs-toggle="tab" data-bs-target="#discussion-${course.id}" type="button" role="tab" aria-controls="lectures-${course.id}" aria-selected="false">Discussion</button>
                            </li>
                            ${isCourseOwner ? `
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="messages-tab-${course.id}" 
                                            data-bs-toggle="tab" data-bs-target="#messages-${course.id}" 
                                            type="button" role="tab">Messages</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="enrolled-users-tab-${course.id}" 
                                            data-bs-toggle="tab" data-bs-target="#enrolled-users-${course.id}" 
                                            type="button" role="tab">Enrolled Users</button>
                                </li>
                            ` : ''}
                        </ul>
                        <div class="tab-content" id="myTabContent-${course.id}">
                            <div class="tab-pane fade show active" id="learn-${
                                course.id
                            }" role="tabpanel" aria-labelledby="learn-tab-${course.id}">
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <p class="card-text my-color">${
                                            course.course_outcome
                                        }</p>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="content-${
                                course.id
                            }" role="tabpanel" aria-labelledby="content-tab-${course.id}">
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <p class="card-text my-color">${
                                            course.course_contain
                                        }</p>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="reviews-${course.id}" role="tabpanel" aria-labelledby="reviews-tab-${course.id}">
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <div id="reviews-content-${course.id}">
                                            <div class="text-center">
                                                <div class="spinner-border text-primary" role="status">
                                                    <span class="visually-hidden">Loading reviews...</span>
                                                </div>
                                                <p class="mt-2">Loading reviews...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="instructors-${
                                course.id
                            }" role="tabpanel" aria-labelledby="instructors-tab-${course.id}">
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <p class="card-text my-color">Instructor info coming soon.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="lectures-${course.id}" role="tabpanel" aria-labelledby="lectures-tab-${course.id}">
                                <div class="card mt-3">
                                    <div class="card-body">
                                        ${isCourseOwner ? `
                                            <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                                                <p class="text-muted mb-0" style="color: var(--my-color); font-family: cursive; font-size: 20px;">Enhance your course by adding new lectures</p>
                                                <div class="d-inline-block position-relative">
                                                    <a href="/lecture_up?${course.id}" 
                                                       class="btn btn-primary btn-lg rounded-circle p-3"
                                                       style="width: 60px; height: 60px;">
                                                        <i class="fas fa-plus fa-lg"></i>
                                                    </a>
                                                  
                                                </div>
                                            </div>
                                        ` : ''}
                                        <div id="lectures-content-${course.id}">
                                            <!-- Lectures will be appended here -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="discussion-${course.id}" role="tabpanel" aria-labelledby="discussion-tab-${course.id}">
                                <div class="card mt-3">
                                    <div class="card-body mybg">
                                        <div class="mb-4">
                                            <div class="d-flex gap-3">
                                                ${response.profile_picture ? 
                                                    `<img src="${response.profile_picture}" 
                                                          class="rounded-circle" 
                                                          width="40" 
                                                          height="40"
                                                          alt="${response.username}"
                                                          onerror="this.onerror=null; this.src='${apiLink}/static/default-profile.png';">` :
                                                    `<div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                                                          style="width: 40px; height: 40px; font-size: 20px;">
                                                        ${response.username.charAt(0).toUpperCase()}
                                                    </div>`
                                                }
                                                <div class="flex-grow-1">
                                                    <textarea class="form-control mybg my-color" 
                                                            id="newComment-${course.id}" 
                                                            rows="3" 
                                                            placeholder="Add a comment..."
                                                            style="border: none;
                                                                   border-bottom: 1px solid rgba(0,0,0,.125);
                                                                   padding: 8px 0;
                                                                   font-size: 14px;
                                                                   resize: none;
                                                                   min-height: 80px;"></textarea>
                                                    <div class="d-flex justify-content-end gap-2 mt-2">
                                                        <button class="btn btn-sm btn-primary" id="postComment-${course.id}">
                                                            <i class="fas fa-paper-plane"></i>Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="comments-container-${course.id}" 
                                             style="max-height: 600px; 
                                                    overflow-y: auto;">
                                            <!-- Comments will be loaded here -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            ${isCourseOwner ? `
                                <div class="tab-pane fade" id="messages-${course.id}" 
                                     role="tabpanel" aria-labelledby="messages-tab-${course.id}">
                                    <div class="card mt-3">
                                        <div class="card-body p-0">
                                            <div class="row g-0" style="height: 800px;">
                                                <!-- Student List Sidebar -->
                                                <div class="col-md-4 border-end">
                                                    <div class="p-3 border-bottom" style="background: var(--bg);">
                                                        <h6 class="mb-0" style="color: black;">Students</h6>
                                                    </div>
                                                    <div id="students-list-${course.id}" 
                                                         class="student-list"
                                                         style="height: calc(100% - 57px); overflow-y: auto;">
                                                        <!-- Student list will be loaded here -->
                                                    </div>
                                                </div>
                                                
                                                <!-- Message Area -->
                                                <div class="col-md-8 d-flex flex-column" style="height: 100%;">
                                                    <div id="conversation-header-${course.id}" 
                                                         class="p-3 border-bottom d-none"
                                                         style="background: var(--bg);">
                                                        <!-- Selected student info will appear here -->
                                                    </div>
                                                    
                                                    <!-- Messages Container -->
                                                    <div id="messageThread-${course.id}" 
                                                         class="message-thread flex-grow-1 p-3" 
                                                         style="height: calc(100% - 180px); 
                                                                overflow-y: auto;
                                                                background: var(--bg);">
                                                        <div class="d-flex h-100 align-items-center justify-content-center">
                                                            <p class="text-muted">Select a student to view conversation</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <!-- Message Input -->
                                                    <div id="message-input-${course.id}" 
                                                         class="message-input-container p-3 border-top mt-auto d-none"
                                                         style="background: var(--bg); height: 180px;">
                                                        <div class="d-flex gap-3 h-100">
                                                            <div class="flex-grow-1">
                                                                <textarea class="form-control" 
                                                                        id="newMessage-${course.id}" 
                                                                        rows="4" 
                                                                        placeholder="Type your message..."
                                                                        style="border: 1px solid #dee2e6;
                                                                               border-radius: 20px;
                                                                               padding: 12px 15px;
                                                                               font-size: 14px;
                                                                               height: 140px;
                                                                               resize: none;
                                                                               background-color: white;
                                                                               color: black;
                                                                               box-shadow: 0 2px 4px rgba(0,0,0,0.04);
                                                                               width: 100%;"></textarea>
                                                            </div>
                                                            <button class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" 
                                                                    id="send-button-${course.id}"
                                                                    style="width: 46px; 
                                                                           height: 46px;
                                                                           margin-top: auto;
                                                                           margin-bottom: 8px;
                                                                           box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                                <i class="fas fa-paper-plane"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}

                            ${isCourseOwner ? `
                                <div class="tab-pane fade" id="enrolled-users-${course.id}" 
                                     role="tabpanel" aria-labelledby="enrolled-users-tab-${course.id}">
                                    <div class="card mt-3">
                                        <div class="card-body">
                                            <div id="enrolled-users-list-${course.id}">
                                                <!-- Enrolled users will be loaded here -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `);

                // If course owner, load enrolled users when tab is clicked
                if (isCourseOwner) {
                    $(`#enrolled-users-tab-${course.id}`).on('click', function() {
                        viewEnrolledUsers(course.id);
                    });
                }
            },
            error: function(error) {
                console.error("Error getting current user:", error);
            }
        });

        fetchLectures(course.id);

        // Add event listeners after creating the elements
        $(`#postComment-${course.id}`).on('click', function() {
            console.log("Post comment clicked for course:", course.id);
            addNewComment(course.id);
        });
    }

    function fetchLectures(courseId) {
        $.ajax({
            type: "GET",
            url: apiLink + "/api/lecture/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
            },
            success: function (res) {
                res.forEach(function (lecture) {
                    showLecture(courseId, lecture);
                });
            },
            error: function (err) {
                console.error("Failed to fetch lectures:", err);
            },
        });
    }

    function showLecture(courseId, lecture) {
        // Check enrollment status before showing lecture details
        checkEnrollmentStatus(courseId, function (isEnrolled) {
            // Get current user role
            $.ajax({
                type: "GET",
                url: apiLink + "/api/current_user",
                headers: {
                    Authorization: "Bearer " + getCookie("token")
                },
                async: false,
                success: function(response) {
                    const isEducator = response.role === "Educator";
                    const isCourseOwner = lecture.user === response.id;
                    
                    // Show full content if user is enrolled OR is an educator
                    if (isEnrolled || isEducator) {
                        const lectureContent = `
                            <div class="col-12">
                                <div class="card mb-3">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <video class="rounded-start" 
                                                   style="width: 100%; 
                                                          height: 180px; 
                                                          object-fit: cover;"
                                                   controls>
                                                <source src="${apiLink + lecture.video}" type="video/mp4">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">${lecture.title}</h5>
                                                <p class="card-text my-color">${lecture.lecture_description}</p>
                                                <div class="lecture-links mb-2">
                                                    <a href="/educator_view_lec_detail?${courseId}&${lecture.id}" 
                                                       class="btn btn-sm btn-outline-secondary">View Lecture</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        $(`#lectures-content-${courseId}`).append(lectureContent);
                    } else {
                        // Show blurred content for non-enrolled students
                        $(`#lectures-content-${courseId}`).append(`
                            <div class="col-12">
                                <div class="card mb-3">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <div class="blurred-video"></div>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">Lecture Title (Locked)</h5>
                                                <p class="card-text my-color" style="font-family: cursive">This lecture is locked. Please enroll to access.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    }
                },
                error: function(error) {
                    console.error("Error getting user role:", error);
                }
            });
        });
    }

    // Function to update enrollment button
    function updateEnrollmentButton(courseId, enrolled) {
        const container = $(`#enrollBtnContainer-${courseId}`);
        if (enrolled) {
            container.html(
                '<button class="btn btn-secondary" disabled>Already Enrolled</button>'
            );
        } else {
            container.html(
                `<a href="#" class="btn btn-primary enroll-btn" data-course-id="${courseId}">Enroll Now</a>`
            );
        }
    }

    // Fetch course details on page load
    fetchCourseDetails();
});

// Helper function to get current user ID
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
                url: apiLink + "/api/current_user",
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

    console.log("Retrieved user ID:", userId);
    return userId ? parseInt(userId) : null;
}

function viewEnrolledUsers(courseId) {
    console.log("Viewing enrolled users for course:", courseId);
    
    // Clear existing content first
    const container = $(`#enrolled-users-list-${courseId}`);
    container.empty();
    
    $.ajax({
        type: "GET",
        url: apiLink + "/api/enrollment/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: { course_id: courseId },
        success: function(response) {
            if (response.length === 0) {
                container.html('<p>No users enrolled yet.</p>');
                return;
            }

            const table = $(`
                <table class="table" style="color: black; background-color: var(--bg);">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);

            response.forEach(user => {
                table.find('tbody').append(`
                    <tr id="user-row-${user.id}">
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" 
                                    onclick="banUser(${courseId}, ${user.id})">
                                Ban User
                            </button>
                        </td>
                    </tr>
                `);
            });

            container.html(table);
        },
        error: function(error) {
            console.error("Error loading enrolled users:", error);
            showToast("Failed to load enrolled users", "Danger");
            container.html('<p class="text-danger">Failed to load enrolled users</p>');
        }
    });
}

function banUser(courseId, userId) {
    if (!confirm("Are you sure you want to ban this user from the course?")) {
        return;
    }

    $.ajax({
        type: "DELETE",
        url: apiLink + "/api/enrollment/delete",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId,
            user_id: userId
        },
        success: function(response) {
            showToast("User has been banned from the course", "Success");
            $(`#user-row-${userId}`).remove();
        },
        error: function(error) {
            console.error("Error banning user:", error);
            showToast("Failed to ban user", "Danger");
        }
    });
}

function deleteCourse(courseId) {
    if (confirm("Are you sure you want to delete this course?")) {
        $.ajax({
            type: "DELETE",
            url: apiLink + "/api/course/delete",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                id: courseId
            },
            success: function(response) {
                showToast("Course deleted successfully", "Success");
                // Redirect to all courses page
                window.location.href = "/all_course_detail";
            },
            error: function(error) {
                console.error("Error deleting course:", error);
                showToast("Failed to delete course", "Danger");
            }
        });
    }
}

function createMessageHTML(message) {
    const currentUserId = getCurrentUserId();
    const isOwnMessage = String(message.sender) === String(currentUserId);
    const isCourseCreator = message.is_course_creator;
    
    // Always use sender's information for the message display
    let displayName = message.sender_name;
    let profilePicture = message.sender_profile_picture;
    let firstLetter = displayName ? displayName.charAt(0).toUpperCase() : '?';
    
    const profileImageOrLetter = profilePicture ? 
        `<img src="${profilePicture}" 
              class="rounded-circle" 
              width="40" 
              height="40" 
              alt="${displayName}"
              onerror="this.onerror=null; this.src='/static/images/default-profile.png';">` :
        `<div class="rounded-circle d-flex align-items-center justify-content-center" 
              style="width: 40px; 
                     height: 40px; 
                     background-color: ${isCourseCreator ? '#198754' : '#007bff'}; 
                     color: white; 
                     font-size: 18px;
                     font-weight: bold;">${firstLetter}</div>`;

    return `
        <div class="message ${isOwnMessage ? 'message-own' : 'message-other'} mb-4">
            <div class="d-flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}" 
                 style="margin: ${isOwnMessage ? '0 0 0 15%' : '0 15% 0 0'}">
                ${profileImageOrLetter}
                <div class="message-content flex-grow-1">
                    <div class="d-flex align-items-center gap-2 ${isOwnMessage ? 'justify-content-end' : ''} mb-1">
                        <span class="fw-bold" 
                              style="font-size: 13px; 
                                     color: ${isCourseCreator ? '#198754' : '#007bff'}">
                            ${displayName}
                            ${isCourseCreator ? 
                              '<span class="badge bg-success ms-2" style="font-size: 10px;">Educator</span>' : 
                              ''}
                        </span>
                    </div>
                    <div class="message-bubble p-3 rounded-4 shadow-sm"
                         style="background-color: ${isOwnMessage ? '#e3f2fd' : '#f8f9fa'};
                                border: 1px solid ${isOwnMessage ? '#bbdefb' : '#e9ecef'};
                                word-wrap: break-word;
                                max-width: 100%;
                                position: relative;">
                        <div class="message-text" 
                             style="font-size: 14px;
                                    line-height: 1.5;
                                    color: var(--bs-body-color);">
                            ${message.content}
                        </div>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <small class="text-muted" style="font-size: 11px;">
                                ${formatTimestamp(message.timestamp)}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Review Functions
function loadReviews(courseId) {
    // Get both user info and course info in parallel
    Promise.all([
        // Get current user
        $.ajax({
            type: "GET",
            url: apiLink + "/api/current_user",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            }
        }),
        // Get course details
        $.ajax({
            type: "GET",
            url: apiLink + "/api/course_list_single/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
            }
        })
    ]).then(([userResponse, courseResponse]) => {
        const isEducator = userResponse.role === "Educator";
        const course = courseResponse[0];
        const isCourseOwner = course.user === userResponse.id;
        
        // Then load reviews
        return $.ajax({
            type: "GET",
            url: apiLink + "/api/course_reviews/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
                is_educator: isEducator,
                is_course_owner: isCourseOwner
            }
        }).then(response => {
            const container = $(`#reviews-content-${courseId}`);
            container.empty();

            // Create review summary section first
            const summaryHtml = createReviewSummary(response);
            container.append(summaryHtml);

            // Add reviews list next
            const reviewsListHtml = createReviewsList(response.reviews);
            container.append(reviewsListHtml);

            // Add review form only if:
            // 1. User is not the course owner
            // 2. User is either enrolled OR is an educator (but not for their own course)
            if (!isCourseOwner && (response.is_enrolled || (isEducator && !isCourseOwner))) {
                container.append(createReviewForm(courseId, isEducator));
            } else if (!response.is_enrolled && !isEducator && !isCourseOwner) {
                // Show enrollment message for regular users
                container.append(`
                    <div class="card mt-3">
                        <div class="card-body text-center">
                            <p class="text-muted mb-0">
                                <i class="fas fa-info-circle me-2"></i>
                                You need to be enrolled in this course to write a review
                            </p>
                        </div>
                    </div>
                `);
            }
        });
    }).catch(error => {
        console.error("Error loading reviews:", error);
        showToast("Failed to load reviews", "Error");
    });
}

function createReviewSummary(data) {
    const { average_rating, total_reviews, rating_distribution } = data;
    
    // Calculate percentage for each star rating
    const percentages = {};
    for (let i = 5; i >= 1; i--) {
        percentages[i] = total_reviews > 0 ? 
            (rating_distribution[i] / total_reviews) * 100 : 0;
    }

    return `
        <div class="card mt-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-4 text-center">
                        <h2 class="display-4 mb-0">${average_rating.toFixed(1) || 0}</h2>
                        <div class="mb-2">
                            ${createStarRating(average_rating)}
                        </div>
                        <p class="text-muted">${total_reviews} reviews</p>
                    </div>
                    <div class="col-md-8">
                        ${Object.entries(percentages).reverse().map(([stars, percentage]) => `
                            <div class="d-flex align-items-center mb-2">
                                <div class="text-muted me-3" style="width: 60px;">
                                    ${stars} stars
                                </div>
                                <div class="progress flex-grow-1" style="height: 8px;">
                                    <div class="progress-bar bg-warning" 
                                         role="progressbar" 
                                         style="width: ${percentage}%" 
                                         aria-valuenow="${percentage}" 
                                         aria-valuemin="0" 
                                         aria-valuemax="100"></div>
                                </div>
                                <div class="text-muted ms-3" style="width: 40px;">
                                    ${rating_distribution[stars]}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createReviewForm(courseId, isEducator) {
    return `
        <div class="card mt-3">
            <div class="card-body">
                <h5 class="card-title">Write a Review ${isEducator ? '<span class="badge bg-success ms-2">as Educator</span>' : ''}</h5>
                <form id="reviewForm-${courseId}" onsubmit="${isEducator ? 'submitEducatorReview' : 'submitReview'}(event, ${courseId})">
                    <div class="mb-3">
                        <label class="form-label">Rating</label>
                        <div class="star-rating">
                            ${[5,4,3,2,1].map(num => `
                                <input type="radio" id="star${num}-${courseId}" name="rating" value="${num}" required>
                                <label for="star${num}-${courseId}">
                                    <i class="fas fa-star"></i>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="reviewText-${courseId}" class="form-label">Your Review</label>
                        <textarea class="form-control" 
                                id="reviewText-${courseId}" 
                                rows="3" 
                                required 
                                placeholder="Share your experience with this course..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    `;
}

function createReviewsList(reviews) {
    if (!reviews.length) {
        return `
            <div class="card mt-3">
                <div class="card-body text-center text-muted">
                    <i class="fas fa-star-half-alt fa-3x mb-3"></i>
                    <p style="color: black;">No reviews yet. Be the first to review this course!</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="card mt-3">
            <div class="card-body">
                <div class="reviews-list">
                    ${reviews.map(review => createReviewItem(review)).join('')}
                </div>
            </div>
        </div>
    `;
}

function createReviewItem(review) {
    return `
        <div class="review-item mb-4 pb-4 border-bottom" id="review-${review.id}">
            <div class="d-flex gap-3">
                ${review.user_profile_picture ? 
                    `<img src="${review.user_profile_picture}" 
                          class="rounded-circle" 
                          width="48" 
                          height="48" 
                          alt="${review.user_name}"
                          onerror="this.onerror=null; this.src='${apiLink}/static/default-profile.png';">` :
                    `<div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                          style="width: 48px; height: 48px; font-size: 20px;">
                        ${review.user_name.charAt(0).toUpperCase()}
                    </div>`
                }
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">
                                ${review.user_name}
                                ${review.is_educator ? 
                                    '<span class="badge bg-success ms-2" style="font-size: 10px;">Educator</span>' : 
                                    ''}
                            </h6>
                            <div class="text-warning mb-2">
                                ${createStarRating(review.rating)}
                            </div>
                        </div>
                        ${review.is_owner ? `
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary" onclick="editReview(${review.id})">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteReview(${review.id})">
                                    <i class="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <p class="review-text mb-1" style="color: var(--bs-body-color);">${review.review_text}</p>
                    <small class="text-muted">
                        ${review.formatted_date}
                        ${review.is_edited ? ' (edited)' : ''}
                    </small>
                </div>
            </div>
        </div>
    `;
}

function createStarRating(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            html += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            html += '<i class="far fa-star text-warning"></i>';
        }
    }
    return html;
}

function submitReview(event, courseId) {
    event.preventDefault();
    
    const rating = $(`#reviewForm-${courseId} input[name="rating"]:checked`).val();
    const reviewText = $(`#reviewText-${courseId}`).val().trim();

    if (!rating || !reviewText) {
        showToast("Please provide both rating and review text", "Warning");
        return;
    }

    $.ajax({
        type: "POST",
        url: apiLink + "/api/course_reviews/add",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            course_id: courseId,
            rating: parseInt(rating),
            review_text: reviewText
        }),
        success: function(response) {
            showToast("Review submitted successfully", "Success");
            loadReviews(courseId);
            // Clear the form
            $(`#reviewForm-${courseId}`)[0].reset();
        },
        error: function(error) {
            console.error("Error submitting review:", error);
            showToast(error.responseJSON?.error || "Failed to submit review", "Error");
        }
    });
}

function editReview(reviewId) {
    const reviewElement = $(`#review-${reviewId}`);
    const currentText = reviewElement.find('.review-text').text();
    const currentRating = reviewElement.find('.text-warning i.fas.fa-star').length;

    reviewElement.find('.review-text').html(`
        <form id="editReviewForm-${reviewId}" class="mt-3" onsubmit="submitEditReview(event, ${reviewId})">
            <div class="mb-3">
                <label class="form-label">Rating</label>
                <div class="star-rating">
                    ${[5,4,3,2,1].map(num => `
                        <input type="radio" 
                               id="editStar${num}-${reviewId}" 
                               name="rating" 
                               value="${num}" 
                               ${num === currentRating ? 'checked' : ''}>
                        <label for="editStar${num}-${reviewId}">
                            <i class="fas fa-star"></i>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="mb-3">
                <textarea class="form-control" rows="3" required>${currentText}</textarea>
            </div>
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary btn-sm">Save</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="cancelEdit(${reviewId}, '${currentText}')">
                    Cancel
                </button>
            </div>
        </form>
    `);
}

function submitEditReview(event, reviewId) {
    event.preventDefault();
    
    const form = $(`#editReviewForm-${reviewId}`);
    const rating = form.find('input[name="rating"]:checked').val();
    const reviewText = form.find('textarea').val().trim();

    if (!rating || !reviewText) {
        showToast("Please provide both rating and review text", "Warning");
        return;
    }

    $.ajax({
        type: "PUT",
        url: apiLink + "/api/course_reviews/edit",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            review_id: reviewId,
            rating: parseInt(rating),
            review_text: reviewText
        }),
        success: function(response) {
            showToast("Review updated successfully", "Success");
            const courseId = getCurrentCourseId();
            if (courseId) {
                setTimeout(() => loadReviews(courseId), 500);
            }
        },
        error: function(error) {
            console.error("Error updating review:", error);
            showToast(error.responseJSON?.error || "Failed to update review", "Error");
        }
    });
}

function cancelEdit(reviewId, originalText) {
    const reviewElement = $(`#review-${reviewId}`);
    reviewElement.find('.review-text').text(originalText);
}

function deleteReview(reviewId) {
    $.ajax({
        type: "DELETE",
        url: apiLink + "/api/course_reviews/delete",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            review_id: reviewId
        }),
        success: function(response) {
            showToast("Review deleted successfully", "Success");
            const courseId = getCurrentCourseId();
            if (courseId) {
                setTimeout(() => loadReviews(courseId), 500);
            }
        },
        error: function(error) {
            console.error("Error deleting review:", error);
            showToast(error.responseJSON?.error || "Failed to delete review", "Error");
        }
    });
}

// New function for educator review submission
function submitEducatorReview(event, courseId) {
    event.preventDefault();
    
    const rating = $(`#reviewForm-${courseId} input[name="rating"]:checked`).val();
    const reviewText = $(`#reviewText-${courseId}`).val().trim();

    if (!rating || !reviewText) {
        showToast("Please provide both rating and review text", "Warning");
        return;
    }

    // Get both user info and course info in parallel
    Promise.all([
        // Get current user
        $.ajax({
            type: "GET",
            url: apiLink + "/api/current_user",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            }
        }),
        // Get course details
        $.ajax({
            type: "GET",
            url: apiLink + "/api/course_list_single/get",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: {
                course_id: courseId,
            }
        })
    ]).then(([userResponse, courseResponse]) => {
        const isEducator = userResponse.role === "Educator";
        const course = courseResponse[0];
        const isCourseOwner = course.user === userResponse.id;

        if (!isEducator && !isCourseOwner) {
            throw new Error("Only educators or course owners can submit educator reviews");
        }

        // Submit the educator review
        return $.ajax({
            type: "POST",
            url: apiLink + "/api/course_reviews/add",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                course_id: courseId,
                rating: parseInt(rating),
                review_text: reviewText,
                is_educator: true,
                role: userResponse.role,
                bypass_enrollment: true,
                user_id: userResponse.id,
                is_course_owner: isCourseOwner
            })
        });
    }).then(response => {
        showToast("Educator review submitted successfully", "Success");
        loadReviews(courseId);
        // Clear the form
        $(`#reviewForm-${courseId}`)[0].reset();
    }).catch(error => {
        console.error("Error in review submission process:", error);
        showToast(error.message || error.responseJSON?.error || "Failed to submit review", "Error");
    });
}

// Add this to initialize reviews when the tab is shown
$(document).ready(function() {
    $('body').on('shown.bs.tab', 'button[data-bs-target^="#reviews-"]', function (e) {
        const courseId = $(this).attr('data-bs-target').split('-')[1];
        loadReviews(courseId);
    });
});

function loadInstructorDetails(courseId) {
    console.log("Loading instructor details for course:", courseId);
    
    $.ajax({
        type: "GET",
        url: apiLink + "/api/instructor_details/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId
        },
        beforeSend: function(xhr) {
            console.log("Making API request to:", this.url);
            console.log("With headers:", this.headers);
            console.log("With data:", this.data);
        },
        success: function(response) {
            console.log("Instructor details loaded successfully:", response);
            const container = $(`#instructors-${courseId} .card-body`);
            
            // Create HTML for instructor details
            const instructorHtml = `
                <div class="instructor-profile">
                    <div class="d-flex align-items-center gap-4 mb-4">
                        ${response.profile_picture ? 
                            `<img src="${response.profile_picture}" 
                                  class="rounded-circle" 
                                  width="120" 
                                  height="120" 
                                  alt="${response.name}"
                                  style="object-fit: cover;">` :
                            `<div class="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                  style="width: 120px; height: 120px;">
                                <span class="text-white" style="font-size: 48px;">
                                    ${response.first_name ? response.first_name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>`
                        }
                        <div>
                            <h3 class="mb-2">${response.first_name} ${response.last_name}</h3>
                            <p class="text-muted mb-1">
                                <i class="fas fa-user-tie me-2"></i>${response.role}
                            </p>
                            <p class="text-muted mb-1">
                                <i class="fas fa-envelope me-2"></i>${response.email}
                            </p>
                            ${response.mobile ? 
                                `<p class="text-muted mb-1">
                                    <i class="fas fa-phone me-2"></i>${response.mobile}
                                </p>` : ''
                            }
                        </div>
                    </div>

                    ${response.bio ? 
                        `<div class="mb-4">
                            <h5 class="mb-3">About</h5>
                            <p class="text-muted">${response.bio}</p>
                        </div>` : ''
                    }

                    ${response.experience && response.experience.length > 0 ? `
                        <div class="mb-4">
                            <h5 class="mb-3">Experience</h5>
                            ${response.experience.map(exp => `
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <h6 class="card-title">${exp.designation}</h6>
                                        <p class="text-muted mb-1">
                                            <i class="fas fa-building me-2"></i>${exp.organisation_name}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <i class="fas fa-map-marker-alt me-2"></i>${exp.location}
                                        </p>
                                        <p class="text-muted mb-0">
                                            <i class="fas fa-calendar me-2"></i>${exp.start_date} - ${exp.end_date}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${response.training && response.training.length > 0 ? `
                        <div class="mb-4">
                            <h5 class="mb-3">Training & Certifications</h5>
                            ${response.training.map(train => `
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <h6 class="card-title">${train.title}</h6>
                                        <p class="text-muted mb-1">
                                            <i class="fas fa-certificate me-2"></i>${train.institution_name}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <i class="fas fa-map-marker-alt me-2"></i>${train.country}
                                        </p>
                                        <p class="text-muted mb-0">
                                            <i class="fas fa-calendar me-2"></i>${train.start_date} - ${train.end_date}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
            
            container.html(instructorHtml);
        },
        error: function(error) {
            console.error("Error loading instructor details:", {
                status: error.status,
                statusText: error.statusText,
                responseText: error.responseText,
                error: error
            });
            const container = $(`#instructors-${courseId} .card-body`);
            container.html(`
                <div class="text-center text-muted">
                    <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                    <p>Failed to load instructor details. Please try again later.</p>
                    <small class="d-block text-danger">Error: ${error.status} - ${error.statusText}</small>
                </div>
            `);
        }
    });
}

// Add this to initialize instructor details when the tab is shown
$('body').on('shown.bs.tab', 'button[data-bs-target^="#instructors-"]', function (e) {
    const courseId = $(this).attr('data-bs-target').split('-')[1];
    loadInstructorDetails(courseId);
});
