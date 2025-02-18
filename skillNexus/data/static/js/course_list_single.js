// Helper function to get educator display name
function getEducatorDisplayName(user) {
    if (!user) return 'Educator';
    
    // If user has a full name, use it
    if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
    }
    
    // If only username is available
    if (user.username) {
        return user.username;
    }
    
    // If user object exists but no name info
    if (user.id) {
        return `Educator #${user.id}`;
    }
    
    // Fallback
    return 'Educator';
}

// Keep these declarations at the top of the file
const url = window.location.href;
const value = url.split("?")[1];

// Initialize everything when document is ready
$(document).ready(function() {
    console.log("Document ready - initializing course list single");
    fetchCourseDetails();
    $('<style>')
        .text(`
            /* Comment Container Styles */
            .comments-section {
                padding: 20px 0;
            }

            .comment {
                background-color: var(--bs-body-bg);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                border: 1px solid var(--bs-border-color);
                transition: all 0.2s ease;
            }

            .comment:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.08);
                transform: translateY(-1px);
            }

            /* User Info Styles */
            .comment .rounded-circle {
                border: 2px solid var(--bs-body-bg);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .comment-header a {
                color: inherit !important;
                font-weight: 600;
                text-decoration: none !important;
            }

            .comment-header a:hover {
                color: var(--bs-primary) !important;
            }

            /* Comment Content Styles */
            .comment-content {
                font-size: 0.95rem;
                line-height: 1.6;
            }

            .comment-body p {
                margin: 12px 0;
                white-space: pre-wrap;
            }

            /* Action Buttons Styles */
            .comment-footer {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid var(--bs-border-color);
            }

            .comment-footer button {
                background: transparent;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .comment-footer button:hover {
                background-color: var(--bs-light);
            }

            .comment-actions button {
                font-size: 0.85rem;
                padding: 4px 8px;
            }

            .comment-actions button:hover {
                opacity: 0.8;
            }

            /* Like Button Styles */
            .fa-heart.text-danger {
                color: #dc3545 !important;
            }

            /* Reply Section Styles */
            .replies {
                margin-left: 48px !important;
                padding-left: 16px;
                border-left: 2px solid var(--bs-border-color);
            }

            /* Form Controls */
            textarea.form-control {
                border: 1px solid var(--bs-border-color);
                border-radius: 8px;
                padding: 12px;
                font-size: 0.95rem;
                transition: all 0.2s ease;
                background-color: var(--bs-body-bg) !important;
            }

            textarea.form-control:focus {
                border-color: var(--bs-primary);
                box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.15);
                outline: none;
            }

            /* Edit/Delete Buttons */
            .edit-comment-btn,
            .delete-comment-btn {
                padding: 4px 8px !important;
                font-size: 0.85rem !important;
                border-radius: 4px;
            }

            .edit-comment-btn:hover {
                background-color: var(--bs-light) !important;
            }

            .delete-comment-btn:hover {
                background-color: #fff5f5 !important;
            }

            /* Timestamps */
            .text-muted {
                font-size: 0.8rem;
            }

            /* Like and Reply Icons */
            .fa-heart,
            .fa-reply {
                margin-right: 4px;
            }

            /* New Comment Form */
            #newComment {
                border-radius: 8px;
                margin-bottom: 20px;
                padding: 12px;
            }

            /* Custom scrollbar for comments */
            .comments-section::-webkit-scrollbar {
                width: 6px;
            }

            .comments-section::-webkit-scrollbar-track {
                background: transparent;
            }

            .comments-section::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,0.1);
                border-radius: 3px;
            }

            .comments-section::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0,0,0,0.2);
            }

            /* Star Rating Styles */
            .star-rating {
                display: inline-block;
                direction: rtl;
                unicode-bidi: bidi-override;
            }

            .stars {
                display: inline-block;
            }

            .stars input[type="radio"] {
                display: none;
            }

            .stars label {
                color: #ddd;
                font-size: 24px;
                padding: 0 2px;
                cursor: pointer;
                float: right;
            }

            .stars label:before {
                content: '★';
            }

            .stars input[type="radio"]:checked ~ label,
            .stars:not(:checked) > label:hover,
            .stars:not(:checked) > label:hover ~ label {
                color: #ffd700;
            }

            .stars input[type="radio"]:checked + label:hover,
            .stars input[type="radio"]:checked ~ label:hover,
            .stars label:hover ~ input[type="radio"]:checked ~ label,
            .stars input[type="radio"]:checked ~ label:hover ~ label {
                color: #ffed4a;
            }

            /* Review Form Styles */
            .review-form {
                background-color: var(--bs-body-bg);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }

            .review-form textarea {
                resize: vertical;
                min-height: 100px;
            }

            .review-form .btn-primary {
                min-width: 120px;
            }

            /* Edit Form Styles */
            .edit-form {
                background-color: var(--bs-body-bg);
                border-radius: 8px;
                padding: 15px;
                margin-top: 10px;
                border: 1px solid var(--bs-border-color);
            }

            .edit-form textarea {
                resize: vertical;
                min-height: 80px;
            }

            .edit-form .btn {
                min-width: 80px;
            }
        `)
        .appendTo('head');
});

// Function to fetch course details and update UI
function fetchCourseDetails() {
    console.log("Fetching course details for ID:", value);
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
            console.log("Course details received:", res);
            $("#course").html("");
            res.forEach(function (course) {
                showCourse(course);
            });
        },
        error: function (err) {
            console.error("Failed to fetch courses:", err);
            showToast("Failed to load course details", "danger");
        }
    });
}

// Add this function at the top with other helper functions
function isValidExpiryDate(expiryDate) {
    // Expected format: MM/YY
    const [month, year] = expiryDate.split('/');
    if (!month || !year) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

    // Convert to numbers
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    // Basic validation
    if (expMonth < 1 || expMonth > 12) return false;
    
    // Check if card is expired
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return false;
    }

    return true;
}

// Function to properly cleanup modal
function cleanupModalCompletely() {
    // Hide the modal
    const modalElement = document.getElementById('addTrainModel');
    if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.dispose();
        }
    }
    
    // Remove all modal-related elements and classes
    $('.modal-backdrop').remove();
    $('.modal').remove();
    
    // Reset body
    $('body')
        .removeClass('modal-open')
        .css({
            'overflow': '',
            'padding-right': '',
            'position': '',
            'height': ''
        });
    
    // Remove any inline styles that might have been added
    document.body.removeAttribute('style');
    
    // Force scroll restoration
    window.scrollTo(0, window.scrollY);
}

// Function to process payment
function processPayment(courseId, courseFee) {
    const cardNumber = $('#cardNumber').val();
    const cardExpiry = $('#cardExpiry').val();
    const cardCvv = $('#cardCvv').val();

    if (!cardNumber || !cardExpiry || !cardCvv) {
        showErrorToast('Please fill in all payment details');
        return;
    }

    // First get course details
    $.ajax({
        url: apiLink + "/api/course_list_single/get",
        type: 'GET',
        headers: {
            Authorization: "Bearer " + getCookie("token")
        },
        data: {
            course_id: courseId
        },
        success: function(courseResponse) {
            if (!courseResponse || courseResponse.length === 0) {
                showErrorToast('Could not fetch course details');
                return;
            }

            const course = courseResponse[0];
            const receiverId = course.user;

            // Process payment directly
            $.ajax({
                type: "POST",
                url: apiLink + "/api/payment/process",
                headers: {
                    Authorization: "Bearer " + getCookie("token"),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    course_id: parseInt(courseId),
                    card_number: cardNumber.replace(/\s/g, ''),
                    card_expiry: cardExpiry.trim(),
                    card_cvv: cardCvv.trim(),
                    amount: parseFloat(courseFee).toFixed(2),
                    sender: getCurrentUserId(),
                    receiver: receiverId
                }),
                success: function(response) {
                    console.log("Payment successful:", response);
                    showToast("Payment successful! You are now enrolled in the course.", "Success");
                    window.location.reload();
                },
                error: function(xhr, status, error) {
                    console.error("Payment failed:", xhr.responseText);
                    let errorMessage = "Payment failed. Please try again.";
                    
                    if (xhr.responseJSON && xhr.responseJSON.error) {
                        errorMessage = xhr.responseJSON.error;
                    }
                    
                    showToast(errorMessage, "Error");
                    $("#confirmPayment")
                        .prop('disabled', false)
                        .html(`<i class="fas fa-lock me-2"></i>Pay Now $${courseFee}`);
                }
            });
        },
        error: function(xhr, status, error) {
            console.error("Failed to get course details:", error);
            showErrorToast("Could not fetch course details. Please try again.");
            $("#confirmPayment")
                .prop('disabled', false)
                .html(`<i class="fas fa-lock me-2"></i>Pay Now $${courseFee}`);
        }
    });
}

// Helper function to get current user ID
function getCurrentUserId() {
    let userId = getCookie("user_id");
    
    if (!userId) {
        const token = getCookie("token");
        if (token) {
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
            showToast("Comment posted successfully", "primary");
            $(`#newComment-${courseId}`).val('');
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error posting comment. Status:", error.status);
            console.error("Error response:", error.responseText);
            console.error("Full error object:", error);
            showToast(error.responseJSON?.error || "Failed to post comment", "danger");
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
            showToast("Failed to load comments", "danger");
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
        <div class="comment-actions" style="opacity: 0; transition: opacity 0.2s;">
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
                        border-bottom: 1px solid rgba(0,0,0,.125);"
                 onmouseover="this.querySelector('.comment-actions').style.opacity = '1'"
                 onmouseout="this.querySelector('.comment-actions').style.opacity = '0'">
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

function editComment(courseId, commentId) {
    const contentElement = $(`#comment-content-${commentId}`);
    const currentContent = contentElement.text().trim();
    
    contentElement.html(`
        <div class="edit-form">
            <textarea class="form-control mybg my-color" 
                      id="edit-${commentId}" 
                      rows="3" 
                      style="border: none; 
                             border-bottom: 1px solid rgba(var(--bs-light-rgb), 0.125);
                             padding: 8px 0;
                             font-size: 14px;
                             resize: none;
                             min-height: 80px;">${currentContent}</textarea>
            <div class="d-flex justify-content-end gap-2 mt-2">
                <button class="btn btn-sm" 
                        onclick="cancelEdit(${courseId}, ${commentId}, '${currentContent.replace(/'/g, "\\'")}')">
                    Cancel
                </button>
                <button class="btn btn-sm btn-primary d-flex align-items-center gap-2" 
                        onclick="saveEdit(${courseId}, ${commentId})">
                    <i class="fas fa-check"></i>
                    Save
                </button>
            </div>
        </div>
    `);
}

function saveEdit(courseId, commentId) {
    const newContent = $(`#edit-${commentId}`).val();
    
    $.ajax({
        type: "PUT",
        url: apiLink + "/api/comments/edit",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            comment_id: commentId,
            content: newContent
        },
        success: function(response) {
            showToast("Comment updated successfully", "primary");
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error updating comment:", error);
            showToast("Failed to update comment", "danger");
        }
    });
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
            showToast("Comment deleted", "Success");
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error deleting comment:", error);
            showToast("Failed to delete comment", "danger");
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
            // Update only the specific comment's like button and count using unique classes
            const likeIcon = $(`.like-icon-${commentId}`);
            const likeCount = $(`.like-count-${commentId}`);
            
            if (response.liked) {
                likeIcon.addClass('text-danger');
            } else {
                likeIcon.removeClass('text-danger');
            }
            
            likeCount.text(response.like_count);
        },
        error: function(error) {
            console.error("Error liking comment:", error);
            showToast("Failed to like comment", "danger");
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
            showToast("Reply posted successfully", "primary");
            $(`#replyForm-${parentId}`).hide();
            $(`#replyText-${parentId}`).val('');
            loadComments(courseId);
        },
        error: function(error) {
            console.error("Error posting reply:", error);
            showToast("Failed to post reply", "danger");
        }
    });
}

// Add this helper function for timestamp formatting
function formatTimestamp(timestamp) {
    if (!timestamp) {
        console.log("No timestamp provided");
        return '';
    }
    
    try {
        // Parse the ISO timestamp
        const date = new Date(timestamp);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.log("Invalid date from timestamp:", timestamp);
            return '';
        }
        
        // Get current date for comparison
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        // Different format based on how old the message is
        if (messageDate.getTime() === today.getTime()) {
            // Today - show time only
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else if (messageDate.getTime() === today.getTime() - 86400000) {
            // Yesterday
            return 'Yesterday ' + date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else {
            // Other dates - show full date and time
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    } catch (e) {
        console.error("Error formatting timestamp:", e, "Timestamp:", timestamp);
        return '';
    }
}

// Add this helper function to hide reply form
function hideReplyForm(courseId, commentId) {
    $(`#replyForm-${commentId}`).hide();
    $(`#replyText-${commentId}`).val('');
}

// Add this helper function at the top level of your file
function getCurrentUserProfileImage() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return `<div class="rounded-circle d-flex align-items-center justify-content-center" 
                     style="width: 32px; 
                            height: 32px; 
                            background-color: #007bff; 
                            color: white; 
                            font-size: 14px;
                            font-weight: bold;">?</div>`;
    }

    const firstLetter = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : '?';
    return currentUser.profile_picture ? 
        `<img src="${currentUser.profile_picture}" 
              class="rounded-circle" 
              width="32" 
              height="32" 
              style="object-fit: cover;"
              alt="${currentUser.username}">` :
        `<div class="rounded-circle d-flex align-items-center justify-content-center" 
              style="width: 32px; 
                     height: 32px; 
                     background-color: #007bff; 
                     color: white; 
                     font-size: 14px;
                     font-weight: bold;">${firstLetter}</div>`;
}

// Add this helper function to get current user info
function getCurrentUser() {
    let currentUser = null;
    const token = getCookie("token");
    
    if (token) {
        $.ajax({
            type: "GET",
            url: apiLink + "/api/current_user",
            headers: {
                Authorization: "Bearer " + token
            },
            async: false,
            success: function(response) {
                currentUser = response;
            },
            error: function(error) {
                console.error("Error getting current user:", error);
            }
        });
    }
    
    return currentUser;
}

// Function to check enrollment status and update UI
function checkEnrollmentStatus(courseId, callback) {
    console.log("Checking enrollment for course:", courseId); // Debug log
    
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
            console.log("Enrollment check response:", response); // Debug log
            callback(response.enrolled);
        },
        error: function (error) {
            console.error("Error checking enrollment:", error);
            callback(false);
        },
    });
}

// Event handler for clicking "Enroll Now"
$(document).on("click", ".enroll-btn", function (e) {
    e.preventDefault();
    console.log("Enroll button clicked");
    
    const courseId = $(this).data("course-id");
    const courseFee = $(this).data("course-fee");
    
    console.log("Course ID:", courseId);
    console.log("Course Fee from data attribute:", courseFee);

    try {
        // Show payment modal
        const modal = new bootstrap.Modal(document.getElementById('addTrainModel'), {
            backdrop: 'static',
            keyboard: false
        });

        // Function to clean up modal
        function cleanupModal() {
            // Hide the modal properly
            modal.hide();
            
            // Clean up modal elements and restore body state
            setTimeout(() => {
                // Remove modal backdrop
                $('.modal-backdrop').remove();
                
                // Reset form
                $("#paymentForm")[0].reset();
                $(".form-control").removeClass("is-invalid");
                
                // Remove modal-specific classes and styles from body
                $('body').removeClass('modal-open');
                $('body').css({
                    'overflow': '',
                    'padding-right': ''
                });
                
                // Remove any remaining modal-related classes
                $('.modal').removeClass('show');
                $('body').removeAttr('style');
                
                // Dispose the modal instance to prevent memory leaks
                modal.dispose();
            }, 150);
        }

        // Format course fee with proper validation
        const formattedFee = courseFee ? parseFloat(courseFee).toFixed(2) : "0.00";
        console.log("Formatted Course Fee:", formattedFee);

        // Update modal content
        $("#addTrainModel .modal-body").html(`
            <div class="payment-form">
                <h4 class="mb-4">Enter Payment Details</h4>
                <form id="paymentForm">
                    <div class="mb-3">
                        <label for="cardNumber" class="form-label">Card Number</label>
                        <input type="text" class="form-control" id="cardNumber" required 
                               placeholder="1234 5678 9012 3456" maxlength="16">
                        <div id="cardNumberError" class="invalid-feedback">Please enter a valid 16-digit card number.</div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label for="cardExpiry" class="form-label">Expiry Date</label>
                            <input type="text" class="form-control" id="cardExpiry" required 
                                   placeholder="MM/YY" maxlength="5">
                            <div id="cardExpiryError" class="invalid-feedback">Please enter a valid expiry date (MM/YY).</div>
                        </div>
                        <div class="col">
                            <label for="cardCvv" class="form-label">CVV</label>
                            <input type="password" class="form-control" id="cardCvv" required 
                                   placeholder="123" maxlength="4">
                            <div id="cardCvvError" class="invalid-feedback">Please enter a valid CVV (3-4 digits).</div>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <strong>Total Amount:</strong> $${formattedFee}
                    </div>
                </form>
            </div>
        `);

        // Update modal footer with the payment button
        $("#addTrainModel .modal-footer").html(`
            <button type="button" class="btn btn-primary" id="confirmPayment">
                <i class="fas fa-lock me-2"></i>Pay Now $${formattedFee}
            </button>
            <button type="button" class="btn btn-secondary" id="cancelPayment">Cancel</button>
        `);

        // Add close button handler
        $("#addTrainModel .btn-close").on("click", function() {
            cleanupModal();
        });

        // Add cancel button handler
        $("#cancelPayment").on("click", function() {
            cleanupModal();
        });

        // Show the modal
        modal.show();

        // Add input validation handlers
        $("#cardNumber").on("input", function() {
            $(this).val($(this).val().replace(/\D/g, ''));
        });

        $("#cardExpiry").on("input", function() {
            let value = $(this).val().replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            $(this).val(value);
        });

        $("#cardCvv").on("input", function() {
            $(this).val($(this).val().replace(/\D/g, ''));
        });

        // Handle payment form submission
        $("#confirmPayment").on("click", function() {
            console.log("Confirm payment clicked");
            
            // Reset validation states
            $(".form-control").removeClass("is-invalid");
            let isValid = true;

            // Validate card number
            const cardNumber = $("#cardNumber").val().trim();
            if (!cardNumber || cardNumber.length !== 16) {
                $("#cardNumber").addClass("is-invalid");
                $("#cardNumberError").text("Please enter a valid 16-digit card number.");
                isValid = false;
            }

            // Validate expiry date
            const cardExpiry = $("#cardExpiry").val().trim();
            if (!cardExpiry || !cardExpiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
                $("#cardExpiry").addClass("is-invalid");
                $("#cardExpiryError").text("Please enter a valid expiry date (MM/YY).");
                isValid = false;
            } else if (!isValidExpiryDate(cardExpiry)) {
                $("#cardExpiry").addClass("is-invalid");
                $("#cardExpiryError").text("Card is expired or expiry date is invalid.");
                isValid = false;
            }

            // Validate CVV
            const cardCvv = $("#cardCvv").val().trim();
            if (!cardCvv || cardCvv.length < 3 || cardCvv.length > 4) {
                $("#cardCvv").addClass("is-invalid");
                $("#cardCvvError").text("Please enter a valid CVV (3-4 digits).");
                isValid = false;
            }

            if (!isValid) {
                showToast("Please fill in all required fields correctly", "Warning");
                return;
            }

            // Disable the button and show loading state
            $("#confirmPayment")
                .prop('disabled', true)
                .html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');

            // Get course details first
            $.ajax({
                type: "GET",
                url: apiLink + "/api/course_list_single/get",
                headers: {
                    Authorization: "Bearer " + getCookie("token"),
                },
                data: {
                    course_id: courseId,
                },
                success: function(courseResponse) {
                    if (!courseResponse || !courseResponse.length) {
                        showToast("Course details not found", "danger");
                        return;
                    }

                    const course = courseResponse[0];
                    const receiverId = course.user;

                    // Prepare payment data
                    const paymentData = {
                        course_id: parseInt(courseId),
                        card_number: cardNumber.replace(/\s/g, ''),
                        card_expiry: cardExpiry.trim(),
                        card_cvv: cardCvv.trim(),
                        amount: parseFloat(courseFee).toFixed(2),
                        sender: getCurrentUserId(),
                        receiver: receiverId
                    };

                    // Log masked data for debugging
                    console.log("Sending payment data:", {
                        ...paymentData,
                        card_number: "****" + paymentData.card_number.slice(-4),
                        card_cvv: "***"
                    });

                    // Process payment directly
                    processPayment(courseId, courseFee);
                },
                error: function(error) {
                    console.error("Failed to get course details:", error);
                    showToast("Failed to process payment. Please try again.", "danger");
                    $("#confirmPayment")
                        .prop('disabled', false)
                        .html(`<i class="fas fa-lock me-2"></i>Pay Now $${formattedFee}`);
                }
            });
        });
    } catch (error) {
        console.error("Error showing payment modal:", error);
        showToast("Failed to show payment form", "danger");
    }
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
            
            let courseActionsHTML = '';
            
            if (isCourseOwner) {
                courseActionsHTML = `
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
                `;
            } else if (!isEducator) {
                courseActionsHTML = `
                    <div id="enrollBtnContainer-${course.id}">
                        <a href="#" class="btn btn-primary enroll-btn" data-course-id="${course.id}">
                            <i class="fas fa-user-plus me-2"></i>Enroll Now
                        </a>
                    </div>
                `;
            }

            console.log("Showing course:", course.id);
            console.log("Course Fee:", course.course_fee);
            
            // Get educator name using the helper function
            const educatorName = getEducatorDisplayName(course.user);
            
            $("#course").append(`
                <div class="col-12 col-md-12 mx-auto my-2">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${apiLink + course.course_thumbnil}" class="img-fluid rounded-start" alt="Course Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${course.title}</h5>
                                    <p class="card-text my-color">${course.course_outcome}</p>
                                    <p class="card-text"><small class="text-muted">Course Fee: $${course.course_fee}</small></p>
                                    ${courseActionsHTML}
                                </div>
                            </div>
                        </div>
                    </div>

                    <ul class="nav nav-tabs my-color" id="myTab-${course.id}" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="learn-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#learn-${course.id}" type="button" role="tab" aria-controls="learn-${course.id}" aria-selected="true">What you'll learn</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="content-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#content-${course.id}" type="button" role="tab" aria-controls="content-${course.id}" aria-selected="false">Course content</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="reviews-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#reviews-${course.id}" type="button" role="tab" aria-controls="reviews-${course.id}" aria-selected="false">Reviews</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="instructors-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#instructors-${course.id}" type="button" role="tab" aria-controls="instructors-${course.id}" aria-selected="false">Instructors</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="lectures-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#lectures-${course.id}" type="button" role="tab" aria-controls="lectures-${course.id}" aria-selected="false">Lectures</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="discussion-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#discussion-${course.id}" type="button" role="tab" aria-controls="discussion-${course.id}" aria-selected="false">Discussion</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="messages-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#messages-${course.id}" type="button" role="tab" aria-controls="messages-${course.id}" aria-selected="false">Messages</button>
                        </li>
                    </ul>

                    <div class="tab-content" id="myTabContent-${course.id}">
                        <div class="tab-pane fade show active" id="learn-${course.id}" role="tabpanel" aria-labelledby="learn-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body">
                                    <p class="card-text my-color">${course.course_outcome}</p>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="content-${course.id}" role="tabpanel" aria-labelledby="content-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body">
                                    <p class="card-text my-color">${course.course_contain}</p>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="reviews-${course.id}" role="tabpanel" aria-labelledby="reviews-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body">
                                    <div class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <p class="mt-2">Loading reviews...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="instructors-${course.id}" role="tabpanel" aria-labelledby="instructors-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body">
                                    <p class="card-text my-color">Instructor info coming soon.</p>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="lectures-${course.id}" role="tabpanel" aria-labelledby="lectures-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body" id="lectures-content-${course.id}">
                                    <!-- Lectures will be appended here -->
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="discussion-${course.id}" role="tabpanel" aria-labelledby="discussion-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body mybg">
                                    <div class="mb-4">
                                        <div class="d-flex gap-3">
                                            ${getCurrentUserProfileImage()}
                                            <div class="flex-grow-1">
                                                <textarea class="form-control mybg my-color" 
                                                        id="newComment-${course.id}" 
                                                        rows="3" 
                                                        placeholder="Add a comment..."
                                                        style="border: none; 
                                                               border-bottom: 1px solid var(--bs-border-color);
                                                               padding: 8px 0;
                                                               font-size: 14px;
                                                               resize: none;
                                                               min-height: 80px;
                                                               background-color: inherit !important;"></textarea>
                                                <div class="d-flex justify-content-end gap-2 mt-2">
                                                    <button class="btn btn-sm btn-primary d-flex align-items-center gap-2" 
                                                            id="postComment-${course.id}">
                                                        <i class="fas fa-paper-plane"></i>
                                                        Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="comments-container-${course.id}" 
                                         class="comments-section"
                                         style="max-height: 600px; 
                                                overflow-y: auto;">
                                        <!-- Comments will be loaded here -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="messages-${course.id}" role="tabpanel" aria-labelledby="messages-tab-${course.id}">
                            <div class="card mt-3">
                                <div class="card-body p-0">
                                    <div class="row g-0" style="height: 600px;">
                                        <!-- Educator Sidebar -->
                                        <div class="col-md-4 border-end">
                                            <div class="p-3 bg-light">
                                                <h6 class="mb-0">Course Educator</h6>
                                            </div>
                                            <div class="educator-info p-3 border-bottom d-flex align-items-center gap-3" 
                                                 style="cursor: pointer;"
                                                 onclick="loadMessages(${course.id})">
                                                ${course.user.profile_picture ? 
                                                    `<img src="${course.user.profile_picture}" 
                                                          class="rounded-circle" 
                                                          width="48" 
                                                          height="48" 
                                                          alt="${educatorName}">` :
                                                    `<div class="rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                                                          style="width: 48px; height: 48px; font-size: 20px; font-weight: bold;">
                                                            ${course.user.first_name ? course.user.first_name[0].toUpperCase() : 'E'}
                                                         </div>`
                                                }
                                                <div>
                                                    <h6 class="mb-1 text-success">
                                                        ${educatorName}
                                                        <span class="badge bg-success ms-2" style="font-size: 10px;">Educator</span>
                                                    </h6>
                                                    <small class="text-muted">Course Creator</small>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Message Area -->
                                        <div class="col-md-8 d-flex flex-column">
                                            <!-- Messages Container -->
                                            <div id="messageThread-${course.id}" 
                                                 class="message-thread flex-grow-1 p-3" 
                                                 style="height: 500px; overflow-y: auto;">
                                                <!-- Messages will be loaded here -->
                                            </div>
                                            
                                            <!-- Message Input -->
                                            <div class="message-input-container p-3 border-top mt-auto">
                                                <div class="d-flex gap-3">
                                                    <div class="flex-grow-1">
                                                        <textarea class="form-control mybg my-color" 
                                                                id="newMessage-${course.id}" 
                                                                rows="3" 
                                                                placeholder="Type your message..."
                                                                style="border: 1px solid var(--bs-border-color);
                                                                       border-radius: 20px;
                                                                       padding: 12px 20px;
                                                                       font-size: 14px;
                                                                       resize: none;
                                                                       min-height: 100px;
                                                                       max-height: 100px;
                                                                       background-color: inherit !important;"></textarea>
                                                    </div>
                                                    <button class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" 
                                                            onclick="sendMessage(${course.id})"
                                                            style="width: 46px; height: 46px;">
                                                        <i class="fas fa-paper-plane"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            fetchLectures(course.id);

            // Add event listeners after creating the elements
            $(`#postComment-${course.id}`).on('click', function() {
                console.log("Post comment clicked for course:", course.id);
                addNewComment(course.id);
            });

            // Load comments when discussion tab is clicked
            $(`#discussion-tab-${course.id}`).on('click', function() {
                console.log("Discussion tab clicked for course:", course.id);
                loadComments(course.id);
            });

            // Add message tab click handler
            $(`#messages-tab-${course.id}`).on('click', function() {
                checkEnrollmentStatus(course.id, function(isEnrolled) {
                    if (isEnrolled) {
                        loadMessages(course.id);
                    } else {
                        $(`#messageThread-${course.id}`).html(`
                            <div class="alert alert-info">
                                Please enroll in this course to message the educator.
                            </div>
                        `);
                    }
                });
            });

            // Check enrollment status
            checkEnrollmentStatus(course.id, function(isEnrolled) {
                updateEnrollmentButton(course.id, isEnrolled, course.course_fee);
            });

            // Get educator details first
            getEducatorDetails(course.user, function(educator) {
                const educatorName = getEducatorDisplayName(educator);

                const educatorInitial = educator && educator.first_name ? 
                    educator.first_name[0].toUpperCase() : 'E';

                // Update the messages tab content
                $(`#messages-${course.id}`).html(`
                    <div class="card mt-3">
                        <div class="card-body p-0">
                            <div class="row g-0" style="height: 600px;">
                                <!-- Educator Sidebar -->
                                <div class="col-md-4 border-end">
                                    <div class="p-3 bg-light">
                                        <h6 class="mb-0">Course Educator</h6>
                                    </div>
                                    <div class="educator-info p-3 border-bottom d-flex align-items-center gap-3" 
                                         style="cursor: pointer;"
                                         onclick="loadMessages(${course.id})">
                                        ${educator && educator.profile_picture ? 
                                            `<img src="${educator.profile_picture}" 
                                                  class="rounded-circle" 
                                                  width="48px" 
                                                  height="48px" 
                                                  alt="${educatorName}">` :
                                            `<div class="rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                                                  style="width: 48px; height: 48px; font-size: 20px; font-weight: bold;">
                                                ${educatorInitial}
                                             </div>`
                                        }
                                        <div>
                                            <h6 class="mb-1 text-success">
                                                ${educatorName}
                                                <span class="badge bg-success ms-2" style="font-size: 10px;">Educator</span>
                                            </h6>
                                            <small class="text-muted">Course Creator</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Message Area -->
                                <div class="col-md-8 d-flex flex-column">
                                    <!-- Messages Container -->
                                    <div id="messageThread-${course.id}" 
                                         class="message-thread flex-grow-1 p-3" 
                                         style="height: 500px; overflow-y: auto;">
                                        <!-- Messages will be loaded here -->
                                    </div>
                                    
                                    <!-- Message Input -->
                                    <div class="message-input-container p-3 border-top mt-auto">
                                        <div class="d-flex gap-3">
                                            <div class="flex-grow-1">
                                                <textarea class="form-control mybg my-color" 
                                                        id="newMessage-${course.id}" 
                                                        rows="3" 
                                                        placeholder="Type your message..."
                                                        style="border: 1px solid var(--bs-border-color);
                                                               border-radius: 20px;
                                                               padding: 12px 20px;
                                                               font-size: 14px;
                                                               resize: none;
                                                               min-height: 100px;
                                                               max-height: 100px;
                                                               background-color: inherit !important;"></textarea>
                                            </div>
                                            <button class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" 
                                                    onclick="sendMessage(${course.id})"
                                                    style="width: 46px; height: 46px;">
                                                <i class="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });

            // Initialize reviews tab
            updateReviewsTab(course.id);
        },
        error: function(error) {
            console.error("Error fetching course details:", error);
        }
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
        }
    });
}

function showLecture(courseId, lecture) {
    checkEnrollmentStatus(courseId, function (isEnrolled) {
        const lectureContent = `
            <div class="col-12">
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4 lecture-video-container">
                            <video class="lecture-thumbnail" style="width: 100%; height: 180px; object-fit: cover;">
                                <source src="${apiLink + lecture.video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${lecture.title}</h5>
                                <p class="card-text my-color">${lecture.lecture_description}</p>
                                <div class="lecture-links mb-2">
                                    <a href="/student_view_lec_detail?${courseId}&${lecture.id}" 
                                       class="btn btn-sm btn-outline-secondary">View Lecture</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (isEnrolled) {
            $(`#lectures-content-${courseId}`).append(lectureContent);
        } else {
            $(`#lectures-content-${courseId}`).append(`
                <div class="col-12">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <div class="blurred-video" style="height: 180px; background: #f0f0f0;"></div>
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
    });
}

// Function to update enrollment button
function updateEnrollmentButton(courseId, enrolled, courseFee) {
    console.log("Updating enrollment button for course:", courseId, "Enrolled:", enrolled, "Fee:", courseFee);
        
    const container = $(`#enrollBtnContainer-${courseId}`);
    if (enrolled) {
        // First check certificate eligibility
        $.ajax({
            type: "GET",
            url: apiLink + `/api/certificate/check-eligibility/${courseId}/`,
            headers: {
                Authorization: "Bearer " + getCookie("token")
            },
            success: function(response) {
                console.log("Certificate eligibility response:", response);
                const isEligible = response.eligible;
                container.html(`
                    <div class="d-flex gap-2">
                        <button class="btn btn-secondary" disabled>Already Enrolled</button>
                        <a href="/see_progress?${courseId}" class="btn btn-info">
                            <i class="fas fa-chart-line"></i> See Progress
                        </a>
                        <button class="btn ${isEligible ? 'btn-success' : 'btn-secondary'}" 
                                onclick="handleCertificate(${courseId})"
                                ${!isEligible ? 'disabled' : ''}>
                            <i class="fas fa-certificate"></i> 
                            ${isEligible ? 'Get Certificate' : 'Complete All Assignments'}
                        </button>
                    </div>
                `);
            },
            error: function(xhr, status, error) {
                console.error("Error checking certificate eligibility:", {
                    xhr: xhr,
                    status: status,
                    error: error
                });
                // Show a simpler UI when eligibility check fails
                container.html(`
                    <div class="d-flex gap-2">
                        <button class="btn btn-secondary" disabled>Already Enrolled</button>
                        <a href="/see_progress?${courseId}" class="btn btn-info">
                            <i class="fas fa-chart-line"></i> See Progress
                        </a>
                    </div>
                `);
            }
        });
    } else {
        container.html(`
        <a href="#" class="btn btn-primary enroll-btn" 
           data-course-id="${courseId}" 
           data-course-fee="${parseFloat(courseFee).toFixed(2)}">
            Enroll Now
        </a>
        `);
    }
}

// Add the handleCertificate function
function handleCertificate(courseId) {
    console.log("Handling certificate for course:", courseId);
    
    // First check eligibility again
    $.ajax({
        type: "GET",
        url: apiLink + `/api/certificate/check-eligibility/${courseId}/`,
        headers: {
            Authorization: "Bearer " + getCookie("token")
        },
        success: function(eligibilityResponse) {
            console.log("Eligibility check response:", eligibilityResponse);
            
            if (eligibilityResponse.eligible) {
                // If eligible, generate certificate
                $.ajax({
                    type: "GET",
                    url: apiLink + `/api/certificate/generate/${courseId}/`,
                    headers: {
                        Authorization: "Bearer " + getCookie("token")
                    },
                    success: function(certificateData) {
                        console.log("Certificate data:", certificateData);
                        // Open certificate in new window with the correct URL
                        window.open(`/certificate/${courseId}/`, '_blank');
                    },
                    error: function(xhr, status, error) {
                        console.error("Error generating certificate:", xhr, status, error);
                        showToast("Failed to generate certificate. Please try again later.", "danger");
                    }
                });
            } else {
                showToast("You are not eligible for the certificate yet. Please complete all requirements.", "warning");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error checking eligibility:", xhr, status, error);
            showToast("Failed to check certificate eligibility. Please try again later.", "danger");
        }
    });
}

// Add this CSS to your page
$(document).ready(function() {
    $('<style>')
        .text(`
            .lecture-video-container {
                height: 180px;
                overflow: hidden;
            }
            .lecture-thumbnail {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .blurred-video {
                width: 100%;
                height: 100%;
                background: #f0f0f0;
            }
            .comment {
                transition: background-color 0.2s;
            }
            .comment:hover {
                background-color: #f8f9fa;
                border-radius: 8px;
            }
            .comment-actions button {
                transition: opacity 0.2s;
                opacity: 0.7;
            }
            .comment-actions button:hover {
                opacity: 1;
            }
            .comment .btn {
                transition: all 0.2s;
            }
            .comment .btn:hover {
                transform: translateY(-1px);
            }
            .form-control:focus {
                box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
            }

            /* Comment Container Styles */
            .comments-section {
                padding: 20px 0;
            }

            .comment {
                background-color: #ffffff;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                border: 1px solid #e9ecef;
                transition: all 0.2s ease;
            }

            .comment:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.08);
                transform: translateY(-1px);
            }

            /* User Info Styles */
            .comment .rounded-circle {
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .comment-header a {
                color: #2d3748 !important;
                font-weight: 600;
                text-decoration: none !important;
            }

            .comment-header a:hover {
                color: #4299e1 !important;
            }

            /* Comment Content Styles */
            .comment-content {
                font-size: 0.95rem;
                color: #4a5568;
                line-height: 1.6;
            }

            .comment-body p {
                margin: 12px 0;
                white-space: pre-wrap;
            }

            /* Action Buttons Styles */
            .comment-footer {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #edf2f7;
            }

            .comment-footer button {
                background: transparent;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 500;
                color: #718096;
                transition: all 0.2s ease;
            }

            .comment-footer button:hover {
                background-color: #f7fafc;
                color: #4a5568;
            }

            .comment-actions button {
                font-size: 0.85rem;
                padding: 4px 8px;
                color: #718096;
            }

            .comment-actions button:hover {
                color: #2d3748;
            }

            /* Like Button Styles */
            .fa-heart.text-danger {
                color: #e53e3e !important;
            }

            /* Reply Section Styles */
            .replies {
                margin-left: 48px !important;
                padding-left: 16px;
                border-left: 2px solid #edf2f7;
            }

            /* Form Controls */
            textarea.form-control {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px;
                font-size: 0.95rem;
                transition: all 0.2s ease;
            }

            textarea.form-control:focus {
                border-color: #4299e1;
                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
                outline: none;
            }

            /* Edit/Delete Buttons */
            .edit-comment-btn,
            .delete-comment-btn {
                padding: 4px 8px !important;
                font-size: 0.85rem !important;
                border-radius: 4px;
            }

            .edit-comment-btn:hover {
                background-color: #edf2f7 !important;
            }

            .delete-comment-btn:hover {
                background-color: #fff5f5 !important;
            }

            /* Timestamps */
            .text-muted {
                color: #a0aec0 !important;
                font-size: 0.8rem;
            }

            /* Like and Reply Icons */
            .fa-heart,
            .fa-reply {
                margin-right: 4px;
            }

            /* New Comment Form */
            #newComment {
                border-radius: 8px;
                margin-bottom: 20px;
                padding: 12px;
            }

            /* Message Styles */
            .message-thread {
                padding: 20px;
                background-color: var(--bs-body-bg);
                border-radius: 8px;
                height: 500px !important;  /* Increased height */
                overflow-y: auto;
            }

            .message {
                margin-bottom: 24px;
                animation: fadeIn 0.3s ease-in-out;
            }

            .message-bubble {
                border-radius: 16px !important;
                padding: 16px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
                transition: all 0.2s ease-in-out;
            }

            .message-bubble:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
            }

            .message-own .message-bubble {
                background-color: #e3f2fd !important;
                border-color: #bbdefb !important;
            }

            .message-other .message-bubble {
                background-color: #f8f9fa !important;
                border-color: #e9ecef !important;
            }

            .message-input-container {
                border-top: 1px solid var(--bs-border-color);
                padding: 20px;
                background-color: var(--bs-body-bg);
                border-radius: 0 0 8px 8px;
            }

            .message-input-container textarea {
                border: 1px solid var(--bs-border-color);
                border-radius: 8px;
                padding: 12px;
                font-size: 14px;
                resize: none;
                min-height: 100px;
                background-color: var(--bs-body-bg);
            }

            .message-input-container textarea:focus {
                border-color: #007bff;
                box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
                outline: none;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Custom scrollbar for message thread */
            .message-thread::-webkit-scrollbar {
                width: 6px;
            }

            .message-thread::-webkit-scrollbar-track {
                background: transparent;
            }

            .message-thread::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,0.1);
                border-radius: 3px;
            }

            .message-thread::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0,0,0,0.2);
            }
        `)
        .appendTo('head');
});

function cancelEdit(courseId, commentId, originalContent) {
    const contentElement = $(`#comment-content-${commentId}`);
    contentElement.html(originalContent);
    
    // Remove any edit forms
    contentElement.find('.edit-form').remove();
    
    // Show the original content
    contentElement.text(originalContent);
}

function getEnrollmentButton(course) {
    const currentUserId = getCurrentUserId();
    
    // If user is the course creator
    if (currentUserId === course.user.id) {
        return `
            <div class="d-flex gap-2">
                <a href="/view_progress_edu?${course.id}" class="btn btn-info btn-sm rounded-pill">
                    <i class="fas fa-chart-line"></i> Progress
                </a>
                <button class="btn btn-danger btn-sm rounded-pill" onclick="deleteCourse(${course.id})">
                    <i class="fas fa-trash"></i> Delete Course
                </button>
            </div>`;
    }
    
    if (course.is_enrolled) {
        if (course.is_completed) {
            return `
                <button class="btn btn-success btn-sm rounded-pill px-4" disabled>
                    <i class="fas fa-check-circle me-2"></i>Completed
                </button>`;
        } else {
            return `
                <button class="btn btn-info btn-sm rounded-pill px-4" 
                        onclick="window.location.href='/course_detail?${course.id}'">
                    <i class="fas fa-book-reader me-2"></i>See Progress
                </button>`;
        }
    } else if (course.is_creator) {
        return `
            <button class="btn btn-secondary btn-sm rounded-pill px-4" disabled>
                <i class="fas fa-crown me-2"></i>Course Creator
            </button>`;
    } else {
        return `
            <button class="btn btn-primary btn-sm rounded-pill px-4" 
                    onclick="enrollCourse(${course.id})" 
                    ${course.is_enrolled ? 'disabled' : ''}>
                <i class="fas fa-graduation-cap me-2"></i>Enroll Now
            </button>`;
    }
}

const courseCard = `
    <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
        <div class="course-price fw-bold ${course.price === 0 ? 'text-success' : 'text-primary'}">
            ${course.price === 0 ? 'Free' : '$' + course.price}
        </div>
        ${getEnrollmentButton(course)}
    </div>
`;

// Update loadMessages function
function loadMessages(courseId) {
    console.log("Loading messages for course:", courseId);
    
    if (!courseId) {
        console.error("No course ID provided");
        return;
    }

    // First get course details to get educator info
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_list_single/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId,
        },
        success: function(courseResponse) {
            if (courseResponse && courseResponse.length > 0) {
                const course = courseResponse[0];
                const educator = course.user;
                const educatorName = getEducatorDisplayName(educator);

                // Now get messages
                $.ajax({
                    type: "GET",
                    url: apiLink + "/api/course_messages/get",
                    headers: {
                        Authorization: "Bearer " + getCookie("token"),
                    },
                    data: {
                        course_id: courseId.toString()
                    },
                    success: function(response) {
                        console.log("Messages loaded successfully:", response);
                        const container = $(`#messageThread-${courseId}`);
                        container.empty();

                        // Add chat header
                        container.append(`
                            <div class="chat-header position-sticky top-0 bg-white border-bottom pb-3 mb-3" 
                                 style="z-index: 1000;">
                                <div class="d-flex align-items-center gap-3">
                                    ${educator.profile_picture ? 
                                        `<img src="${educator.profile_picture}" 
                                              class="rounded-circle" 
                                              width="40" 
                                              height="40" 
                                              alt="${educatorName}">` :
                                        `<div class="rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                                              style="width: 40px; height: 40px; font-size: 18px; font-weight: bold;">
                                                    ${educator.first_name ? educator.first_name[0].toUpperCase() : 'E'}
                                                 </div>`
                                    }
                                    <div>
                                        <h6 class="mb-1 text-success">
                                            ${educatorName}
                                            <span class="badge bg-success ms-2" style="font-size: 10px;">Educator</span>
                                        </h6>
                                        <small class="text-muted">Course: ${course.title}</small>
                                    </div>
                                </div>
                            </div>
                        `);
                        
                        // Display messages
                        if (Array.isArray(response) && response.length > 0) {
                            response.forEach(message => {
                                container.append(createMessageHTML(message));
                            });
                            container.scrollTop(container[0].scrollHeight);
                        } else {
                            container.append(`
                                <div class="text-center text-muted p-3">
                                    <i class="fas fa-comments mb-2" style="font-size: 24px;"></i>
                                    <p class="mb-0">No messages yet. Start the conversation with ${educatorName}!</p>
                                </div>
                            `);
                        }
                    },
                    error: function(error) {
                        console.error("Error loading messages:", error);
                        const container = $(`#messageThread-${courseId}`);
                        container.empty().append(`
                            <div class="alert alert-danger">
                                <i class="fas fa-exclamation-circle me-2"></i>
                                Failed to load messages. Please try again later.
                            </div>
                        `);
                    }
                });
            }
        },
        error: function(error) {
            console.error("Error fetching course details:", error);
        }
    });
}

// Update createMessageHTML function
function createMessageHTML(message) {
    const currentUserId = getCurrentUserId();
    const isOwnMessage = String(message.sender) === String(currentUserId);
    
    const displayName = message.sender_name || 'User';
    const firstLetter = displayName.charAt(0).toUpperCase();
    
    const profileImageOrLetter = message.sender_profile_picture ? 
        `<img src="${message.sender_profile_picture}" 
              class="rounded-circle" 
              width="40" 
              height="40" 
              alt="${displayName}">` :
        `<div class="rounded-circle d-flex align-items-center justify-content-center" 
              style="width: 40px; 
                     height: 40px; 
                     background-color: ${message.is_educator ? '#198754' : '#007bff'}; 
                     color: white; 
                     font-weight: bold;">${firstLetter}</div>`;

    return `
        <div class="message ${isOwnMessage ? 'message-own' : 'message-other'} mb-4">
            <div class="d-flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}" 
                 style="margin: ${isOwnMessage ? '0 0 0 15%' : '0 15% 0 0'}">
                ${profileImageOrLetter}
                <div class="message-content flex-grow-1">
                    <div class="d-flex align-items-center gap-2 ${isOwnMessage ? 'justify-content-end' : ''} mb-1">
                        <span class="fw-bold" style="font-size: 13px; color: ${message.is_educator ? '#198754' : '#007bff'}">
                            ${displayName}
                            ${message.is_educator ? 
                              '<span class="badge bg-success ms-2" style="font-size: 10px;">Educator</span>' : 
                              ''}
                        </span>
                    </div>
                    <div class="message-bubble p-3 rounded-4 shadow-sm"
                         style="background-color: ${isOwnMessage ? '#e3f2fd' : '#f8f9fa'};
                                border: 1px solid ${isOwnMessage ? '#bbdefb' : '#e9ecef'};
                                word-wrap: break-word;">
                        <div class="message-text" style="font-size: 14px; line-height: 1.5;">
                            ${message.content}
                        </div>
                        <small class="text-muted d-block mt-2" style="font-size: 11px;">
                            ${formatTimestamp(message.timestamp)}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Update sendMessage function
function sendMessage(courseId) {
    const messageInput = $(`#newMessage-${courseId}`);
    const content = messageInput.val().trim();
    
    if (!content) {
        showToast("Please enter a message", "danger");
        return;
    }
    
    $.ajax({
        type: "POST",
        url: apiLink + "/api/course_messages/send",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            course_id: courseId.toString(),
            content: content
        }),
        success: function(response) {
            messageInput.val('');
            loadMessages(courseId);
            showToast("Message sent successfully", "primary");
        },
        error: function(error) {
            console.error("Error sending message:", error);
            showToast("Failed to send message", "danger");
        }
    });
}

// Add this function at the top to get CSRF token from cookie
function getCsrfToken() {
    let name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Add CSRF token to all AJAX requests
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
        }
    }
});

// Function to get educator details
function getEducatorDetails(user, callback) {
    if (!user || !user.id) {
        callback(null);
        return;
    }

    $.ajax({
        type: "GET",
        url: apiLink + "/api/user/get",
        headers: {
            Authorization: "Bearer " + getCookie("token")
        },
        data: {
            user_id: user.id
        },
        success: function(response) {
            callback(response);
        },
        error: function(error) {
            console.error("Error fetching educator details:", error);
            callback(null);
        }
    });
}

// Add these functions after the existing functions

function loadReviews(courseId) {
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_reviews/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId
        },
        success: function(response) {
            const container = $(`#reviews-${courseId}`);
            container.empty();

            // Create review summary section
            const summaryHtml = createReviewSummary(response);
            container.append(summaryHtml);

            // Add review form if user hasn't reviewed
            if (!response.has_reviewed) {
                container.append(createReviewForm(courseId));
            }

            // Add reviews list
            const reviewsListHtml = createReviewsList(response.reviews);
            container.append(reviewsListHtml);
        },
        error: function(error) {
            console.error("Error loading reviews:", error);
            showToast("Failed to load reviews", "danger");
        }
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
                        <h2 class="display-4 mb-0">${average_rating || 0}</h2>
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

function createReviewForm(courseId) {
    return `
        <div class="review-form card">
            <div class="card-body">
                <h5 class="mb-3">Write a Review</h5>
                <form id="reviewForm-${courseId}" onsubmit="submitReview(event, ${courseId})">
                    <div class="mb-3">
                        <label class="form-label">Rating</label>
                        <div class="star-rating">
                            <input type="radio" id="star5-${courseId}" name="rating" value="5" required />
                            <label for="star5-${courseId}" title="Excellent">★</label>
                            <input type="radio" id="star4-${courseId}" name="rating" value="4" />
                            <label for="star4-${courseId}" title="Very Good">★</label>
                            <input type="radio" id="star3-${courseId}" name="rating" value="3" />
                            <label for="star3-${courseId}" title="Good">★</label>
                            <input type="radio" id="star2-${courseId}" name="rating" value="2" />
                            <label for="star2-${courseId}" title="Fair">★</label>
                            <input type="radio" id="star1-${courseId}" name="rating" value="1" />
                            <label for="star1-${courseId}" title="Poor">★</label>
                        </div>
                        <small class="text-muted d-block mt-2">Click on a star to rate</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Your Review</label>
                        <textarea class="form-control" name="review_text" rows="3" required 
                                placeholder="Write your review here..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane me-2"></i>Submit Review
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
                    <p>No reviews yet. Be the first to review this course!</p>
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
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    return `
        <div class="review-item" id="review-${review.id}">
            <div class="d-flex gap-3">
                ${review.user_profile_picture ? 
                    `<img src="${review.user_profile_picture}" 
                          class="rounded-circle" 
                          width="48" 
                          height="48" 
                          alt="${review.user_name}">` :
                    `<div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                          style="width: 48px; height: 48px; font-size: 20px;">
                        ${review.user_name.charAt(0).toUpperCase()}
                    </div>`
                }
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${review.user_name}</h6>
                            <div class="review-stars">${stars}</div>
                            <small class="text-muted">${review.formatted_date}</small>
                        </div>
                        ${review.is_owner ? `
                            <div class="review-actions">
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="editReview(${review.id})">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteReview(${review.id})">
                                    <i class="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <p class="review-text mt-2">${review.review_text}</p>
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
    const form = event.target;
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const reviewText = form.querySelector('textarea[name="review_text"]').value;

    if (!rating) {
        showToast("Please select a rating", "warning");
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
            showToast("Review submitted successfully", "success");
            loadReviews(courseId);
        },
        error: function(error) {
            console.error("Error submitting review:", error);
            showToast("Failed to submit review", "danger");
        }
    });
}

function editReview(reviewId) {
    const reviewElement = $(`#review-${reviewId}`);
    const currentRating = reviewElement.find('.review-stars').text().split('★').length - 1;
    const currentText = reviewElement.find('.review-text').text();

    // Store original content
    reviewElement.data('original-content', reviewElement.html());

    reviewElement.html(`
        <div class="review-form">
            <form id="editForm-${reviewId}" onsubmit="submitEditReview(event, ${reviewId})">
                <div class="mb-3">
                    <label class="form-label">Rating</label>
                    <div class="star-rating">
                        <input type="radio" id="edit-star5-${reviewId}" name="edit-rating" value="5" ${currentRating === 5 ? 'checked' : ''} />
                        <label for="edit-star5-${reviewId}" title="Excellent">★</label>
                        <input type="radio" id="edit-star4-${reviewId}" name="edit-rating" value="4" ${currentRating === 4 ? 'checked' : ''} />
                        <label for="edit-star4-${reviewId}" title="Very Good">★</label>
                        <input type="radio" id="edit-star3-${reviewId}" name="edit-rating" value="3" ${currentRating === 3 ? 'checked' : ''} />
                        <label for="edit-star3-${reviewId}" title="Good">★</label>
                        <input type="radio" id="edit-star2-${reviewId}" name="edit-rating" value="2" ${currentRating === 2 ? 'checked' : ''} />
                        <label for="edit-star2-${reviewId}" title="Fair">★</label>
                        <input type="radio" id="edit-star1-${reviewId}" name="edit-rating" value="1" ${currentRating === 1 ? 'checked' : ''} />
                        <label for="edit-star1-${reviewId}" title="Poor">★</label>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Your Review</label>
                    <textarea class="form-control" name="edit-review-text" rows="3" required>${currentText}</textarea>
                </div>
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>Save Changes
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="cancelEdit(${reviewId})">
                        <i class="fas fa-times me-2"></i>Cancel
                    </button>
                </div>
            </form>
        </div>
    `);
}

function cancelEdit(reviewId) {
    const reviewElement = $(`#review-${reviewId}`);
    const originalContent = reviewElement.data('original-content');
    
    if (originalContent) {
        reviewElement.html(originalContent);
    } else {
        // Fallback: reload the reviews
        loadReviews(getCurrentCourseId());
    }
}

function submitEditReview(event, reviewId) {
    event.preventDefault();
    const form = event.target;
    const rating = form.querySelector('input[name="edit-rating"]:checked')?.value;
    const reviewText = form.querySelector('textarea[name="edit-review-text"]').value;

    if (!rating) {
        showToast("Please select a rating", "warning");
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
            showToast("Review updated successfully", "success");
            loadReviews(getCurrentCourseId());
        },
        error: function(error) {
            console.error("Error updating review:", error);
            showToast("Failed to update review", "danger");
        }
    });
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
            showToast("Review deleted successfully", "primary");
            // Get the course ID and reload reviews
            const courseId = getCurrentCourseId();
            if (courseId) {
                setTimeout(() => loadReviews(courseId), 500);
            }
        },
        error: function(error) {
            console.error("Error deleting review:", error);
            showToast(error.responseJSON?.error || "Failed to delete review", "danger");
        }
    });
}

function getCurrentCourseId() {
    const url = window.location.href;
    const courseId = url.split("?")[1];
    return courseId;
}

// Add this to the existing showCourse function's reviews tab section
function updateReviewsTab(courseId) {
    $(`#reviews-${courseId}`).html(`
        <div class="card mt-3">
            <div class="card-body">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading reviews...</p>
                </div>
            </div>
        </div>
    `);
    
    // Load reviews when the reviews tab is clicked
    $(`#reviews-tab-${courseId}`).on('shown.bs.tab', function (e) {
        loadReviews(courseId);
    });
}

// Add CSS for star rating
$(document).ready(function() {
    $('<style>')
        .text(`
            .star-rating {
                direction: rtl;
                display: inline-block;
            }
            
            .stars {
                display: flex;
                flex-direction: row-reverse;
                gap: 0.5rem;
            }
            
            .star-input {
                display: none;
            }
            
            .star-label {
                cursor: pointer;
                padding: 5px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.2s ease;
            }
            
            .star-label .fa-star {
                font-size: 1.2rem;
                color: #ddd;
                transition: color 0.2s ease;
            }
            
            .star-label .rating-text {
                opacity: 0;
                font-size: 0.8rem;
                transition: opacity 0.2s ease;
            }
            
            .star-label:hover .rating-text,
            .star-label:hover ~ .star-label .rating-text {
                opacity: 1;
            }
            
            .star-label:hover .fa-star,
            .star-label:hover ~ .star-label .fa-star,
            .star-input:checked ~ .star-label .fa-star {
                color: #ffc107;
            }
            
            .rating-help-text {
                font-style: italic;
            }
        `)
        .appendTo('head');
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
                                  width="200" 
                                  height="200" 
                                  alt="${response.name}"
                                  style="object-fit: cover;">` :
                            `<div class="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                  style="width: 200px; height: 200px;">
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
            console.error("Error loading instructor details:", error);
            const container = $(`#instructors-${courseId} .card-body`);
            container.html(`
                <div class="text-center text-muted">
                    <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                    <p>Failed to load instructor details. Please try again later.</p>
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