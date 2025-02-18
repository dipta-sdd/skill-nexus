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
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <style>
        /* Define CSS variables to match course_detail.php */
        :root {
            --bg-color: inherit;
            --border-color: rgba(108, 117, 125, 0.2);
        }

        /* Discussion Post Styles - Exact match from course_detail.php */
        .discussion-post {
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }

        .discussion-post:hover {
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .discussion-main {
            position: relative;
        }

        .discussion-avatar img {
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .discussion-content {
            width: 100%;
        }

        .discussion-header {
            margin-bottom: 0.5rem;
        }

        .discussion-body {
            color: inherit;
        }

        .discussion-actions button {
            color: #6c757d;
            text-decoration: none;
            transition: color 0.2s;
        }

        .discussion-actions button:hover {
            color: #0056b3;
        }

        .discussion-replies {
            border-left: 3px solid var(--border-color);
            padding-left: 1.5rem;
            margin-left: 2rem;
            margin-top: 1rem;
        }

        .comment-actions {
            opacity: 1;
            transition: opacity 0.2s;
        }

        .discussion-post:hover .comment-actions {
            opacity: 1;
        }

        /* Comment list container - Exact match */
        .comment-list-container {
            max-height: 600px;
            overflow-y: auto;
            padding: 1rem;
            background: var(--bg-color);
            border-radius: 8px;
        }

        /* Scrollbar styling - Exact match */
        .comment-list-container::-webkit-scrollbar {
            width: 8px;
        }

        .comment-list-container::-webkit-scrollbar-track {
            background: var(--bg-color);
        }

        .comment-list-container::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        /* Override any bootstrap hover effects */
        .comment,
        .comment:hover,
        .comment:focus,
        .comment:active {
            background: var(--bg-color) !important;
            border: 1px solid var(--border-color) !important;
        }

        /* Fix nested replies */
        .nested-replies {
            border-left: 3px solid var(--border-color) !important;
            padding-left: 1.5rem;
            margin-left: 2rem;
            margin-top: 1rem;
        }

        /* Fix textarea and form controls */
        textarea.form-control,
        .form-control {
            background: var(--bg-color) !important;
            border: 1px solid var(--border-color) !important;
            color: inherit !important;
        }

        textarea.form-control:focus,
        .form-control:focus {
            border-color: #0056b3 !important;
            box-shadow: none !important;
        }

        /* Fix button colors */
        .btn {
            background: var(--bg-color);
            color: inherit;
        }

        .btn:hover {
            color: #0056b3;
        }

        .btn-primary {
            background: #0056b3;
            color: white;
        }

        .btn-primary:hover {
            background: #004494;
            color: white;
        }

        /* Enrollment Button Styles */
        .btn-sm.rounded-pill {
            padding: 0.6rem 1.8rem;
            font-size: 0.95rem;
            line-height: 1.5;
            border-radius: 50rem;
            transition: all 0.3s ease;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Primary Button (Enroll Now) */
        .btn-primary.rounded-pill {
            background: linear-gradient(45deg, #2196F3, #1976D2);
            border: none;
            color: white !important;
        }

        .btn-primary.rounded-pill:hover {
            background: linear-gradient(45deg, #1976D2, #1565C0);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }

        /* Info Button (See Progress) */
        .btn-info.rounded-pill {
            background: linear-gradient(45deg, #00BCD4, #00ACC1);
            border: none;
            color: white !important;
        }

        .btn-info.rounded-pill:hover {
            background: linear-gradient(45deg, #00ACC1, #0097A7);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
        }

        /* Success Button (Completed) */
        .btn-success.rounded-pill {
            background: linear-gradient(45deg, #4CAF50, #43A047);
            border: none;
            color: white !important;
        }

        .btn-success.rounded-pill:hover {
            background: linear-gradient(45deg, #43A047, #388E3C);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        /* Certificate Button */
        .btn-certificate {
            background: linear-gradient(45deg, #FF9800, #F57C00);
            border: none;
            color: white !important;
        }

        .btn-certificate:hover {
            background: linear-gradient(45deg, #F57C00, #EF6C00);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
        }

        /* Button Icon Styling */
        .btn-sm.rounded-pill i {
            margin-right: 0.5rem;
            font-size: 1rem;
            vertical-align: middle;
        }

        /* Disabled state with style */
        .btn-sm.rounded-pill:disabled {
            opacity: 0.7;
            background: #e0e0e0;
            color: #9e9e9e !important;
            transform: none;
            box-shadow: none;
        }

        /* Hover effect for all buttons */
        .btn-sm.rounded-pill:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Price styling */
        .course-price {
            font-size: 1.1rem;
            font-weight: 600;
        }

        .course-price.text-success {
            color: #198754 !important;
        }

        .course-price.text-primary {
            color: #0d6efd !important;
        }

        /* Update profile picture styles */
        .user-avatar-text,
        .rounded-circle {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            overflow: hidden;
        }

        /* Add specific class for instructor profile image */
        .instructor-profile .rounded-circle {
            width: 200px !important;
            height: 200px !important;
        }

        .user-avatar-text,
        .rounded-circle[style*="background-color"] {
            background-color: #007bff !important;
            color: white !important;
            font-weight: bold !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        img.rounded-circle {
            object-fit: cover !important;
            border: 1px solid rgba(0,0,0,0.1);
        }

        /* Ensure proper spacing in comment form */
        .comment-form .d-flex.gap-3 {
            gap: 0.75rem !important;
            align-items: flex-start !important;
        }

        /* Adjust textarea vertical alignment */
        .comment-form textarea {
            margin-top: 0 !important;
        }

        /* Update the gap between avatar and content */
        .d-flex.gap-3 {
            gap: 0.75rem !important;  /* Reduced from 1rem (16px) to 12px */
        }

        /* Adjust the nested replies margin to match new avatar size */
        .nested-replies {
            margin-left: 44px !important;  /* Adjusted from 56px */
        }

        /* Make sure the comment content has proper spacing */
        .comment-content {
            padding-top: 2px;  /* Add slight top padding to align with smaller avatar */
        }

        /* Star Rating Styles */
        .star-rating {
            display: inline-flex;
            flex-direction: row-reverse;
            gap: 0.2rem;
            margin: 1rem 0;
        }

        .star-rating input[type="radio"] {
            display: none;
        }

        .star-rating label {
            font-size: 1.5rem;
            color: #ddd;
            cursor: pointer;
            transition: color 0.2s;
        }

        .star-rating label:hover,
        .star-rating label:hover ~ label,
        .star-rating input[type="radio"]:checked ~ label {
            color: #ffd700;
        }

        .star-rating label:hover:before,
        .star-rating label:hover ~ label:before,
        .star-rating input[type="radio"]:checked ~ label:before {
            content: '★';
            position: absolute;
        }

        .review-form {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .review-form textarea {
            resize: vertical;
            min-height: 100px;
        }

        .review-item {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .review-stars {
            color: #ffd700;
            font-size: 1.2rem;
            margin-right: 0.5rem;
        }

        .review-meta {
            font-size: 0.875rem;
            color: #6c757d;
        }

        .review-actions {
            margin-top: 0.5rem;
        }

        .review-text {
            margin: 0.5rem 0;
        }

        /* Star Rating Tooltip */
        .star-rating label {
            position: relative;
        }

        .star-rating label:after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.25rem 0.5rem;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s;
        }

        .star-rating label:hover:after {
            opacity: 1;
            visibility: visible;
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
                <li class="breadcrumb-item" aria-current="page">Login</li>
            </ol>
        </nav>

        <!-- main body-->
        <div class="row my-color mybg my-row" id="course" style="font-family: cursive;">
        </div>
        <!-- Modal -->

        <!-- Payment Modal -->
        <div class="modal fade" id="addTrainModel" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content mybg" style=" background:white";>
                    <div class="modal-header">
                        <h5 class="modal-title" id="paymentModalLabel">Course Payment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Payment form will be injected here -->
                    </div>
                    <div class="modal-footer">
                        <!-- Payment buttons will be injected here -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <!-- main body-->
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/course_list_single.js' %}"></script>
    <script>
        $(document).ready(function() {
            console.log("Document ready");
            on_page_load([]);

            // Initialize Bootstrap modal
            var paymentModal = new bootstrap.Modal(document.getElementById('addTrainModel'), {
                keyboard: false,
                backdrop: 'static'
            });

            // Debug click handler
            $(document).on("click", ".enroll-btn", function(e) {
                e.preventDefault();
                console.log("Enroll button clicked");
                console.log("Course ID:", $(this).data("course-id"));
                console.log("Course Fee:", $(this).data("course-fee"));
                
                // Show the modal
                paymentModal.show();
            });
        });
    </script>
</body>

</html>