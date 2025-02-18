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
    .course-thumbnail {
      width: 100%;
      max-width: 160px;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid var(--my-color);
      transition: all 0.3s ease;
    }

    .course-title {
      font-size: 1.1rem;
      margin-bottom: 5px;
    }

    .course-title a {
      color: var(--bs-emphasis-color);
      text-decoration: none;
    }

    .course-title a:hover {
      color: var(--my-color);
    }

    .course-outcome {
      font-size: 0.85rem;
      margin-bottom: 0;
      line-height: 1.4;
    }

    .course-actions {
      display: flex;
      align-items: center;
      margin-left: auto;
      gap: 10px;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    a {
      text-decoration: none;
    }
    /* Add these styles to your CSS file */
.course-card {
    transition: transform 0.2s, box-shadow 0.2s;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
}

.course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.course-image-wrapper {
    height: 200px;
    overflow: hidden;
}

.hover-primary:hover {
    color: #0d6efd !important;
}

/* Search and Filter Styling */
.search-wrapper {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 1px;
    margin-bottom: 2rem;
}

.form-control {
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    border: 1px solid #e9ecef;
    transition: all 0.3s;
}

.form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.15);
}

.per-name {
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    border: 2px solid #e9ecef;
    background: white;
    cursor: pointer;
}

.loading i {
    color: #0d6efd;
}

.search-container {
    background: var(--my-color);
}

.form-control, .form-select {
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    font-size: 1rem;
}

.input-group-text {
    border-radius: 8px;
}

.form-control:focus, .form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(13,110,253,0.1);
    border-color: #0d6efd;
}

.input-group:focus-within .input-group-text {
    border-color: #0d6efd;
}

.search-container {
    background-color: #f8f9fa;
}

.search-wrapper, .filter-wrapper {
    position: relative;
}

.search-icon, .filter-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    z-index: 10;
}

.search-input, .filter-select {
    height: 50px;
    padding-left: 65px;
    background-color: white;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

.search-input:focus, .filter-select:focus {
    border-color: #80bdff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-select {
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
}

.form-select option {
    background-color: var(--bs-dark);
    color: white;
}

.form-control::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.form-control:focus, .form-select:focus {
    background-color: var(--bs-dark);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
    .col-md-5, .col-md-7 {
        padding: 0 15px;
    }
    
    .search-container {
        padding: 10px;
    }
}

/* Dark Theme */
.dark-theme .form-select option {
    background-color: var(--bs-dark);
    color: white;
}

.dark-theme .form-control::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.dark-theme .form-control:focus,
.dark-theme .form-select:focus {
    background-color: var(--bs-dark);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
}

/* Light Theme */
.light-theme .form-select option {
    background-color: white;
    color: var(--bs-dark);
}

.light-theme .form-control::placeholder {
    color: rgba(0, 0, 0, 0.5);
}

.light-theme .form-control:focus,
.light-theme .form-select:focus {
    background-color: white;
    color: var(--bs-dark);
    border-color: rgba(0, 0, 0, 0.2);
}

.light-theme .text-light {
    color: var(--bs-dark) !important;
}

@media (max-width: 768px) {
    .col-md-5, .col-md-7 {
        padding: 0 15px;
    }
    
    .search-container {
        padding: 10px;
    }
}

.input-group {
    position: relative;
}

.input-group-text {
    padding: 0.5rem 1rem;
    border-radius: 8px 0 0 8px;
    border-right: none;
}

.form-control {
    border-radius: 0 !important;
    margin-left: -1px;
}

.form-select {
    border-radius: 0 8px 8px 0 !important;
    margin-left: -1px;
    border-left: 1px solid rgba(255,255,255,0.1);
}

.input-group .form-select:focus,
.input-group .form-control:focus {
    z-index: 3;
}

/* Adjust spacing between filter and search */
@media (min-width: 768px) {
    .col-lg-5:first-child {
        padding-right: 6rem;
    }
    .col-lg-5:last-child {
        padding-left: 6rem;
    }
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bs-dark);
    padding: 10px;
    border-radius: 0 0 8px 8px;
    margin-top: 2px;
    display: none;
}

.input-group:focus-within .search-suggestions {
    display: block;
}

.suggestion-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
}

.badge {
    cursor: pointer;
    transition: all 0.2s;
}

.badge:hover {
    background-color: var(--bs-primary) !important;
}

.form-control:focus {
    box-shadow: none;
    border-color: rgba(255,255,255,0.2);
}

.dropdown-menu {
    border: 1px solid rgba(255,255,255,0.1);
}

.dropdown-item {
    padding: 0.75rem 1.5rem;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background-color: var(--bs-primary) !important;
    color: white !important;
}

.input-group-text.dropdown-toggle::after {
    display: none;
}

/* Content Box Styling */
.content-box {
    /* background: var(--bs-body-bg); */
    background: whitesmoke;
    border: 3px solid var(--my-color);
    border-radius: 20px;
    padding: 5px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.2);
}

/* Search Input Styling */
.search-wrapper {
    position: relative;
    margin-top:0px;
    margin-bottom: 0px;
    border: 3px solid var(--my-color);
    border-radius: 15px;
    background: whitesmoke;
    box-shadow: 0 2px 8px rgba(var(--my-color-rgb), 0.15);
}

.search-input {
    width: 100%;
    padding: 12px 45px;
    border: 1px solid black;
    border-radius: 15px;
    background: transparent;
    color: var(--bs-emphasis-color);
    font-size: 1rem;
}

.search-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--my-color-rgb), 0.2);
}

.search-icon {
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    color: black;
    font-size: 1.2em;
}

/* Filter Section */
.filter-section {
    /* padding-top: 5px; */
    margin-left:10px;
    border-top: 3px solid var(--my-color);
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-chip {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid black;
    background: var(--bs-body-bg);
    color: black;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(var(--my-color-rgb), 0.15);
}

.filter-chip:hover {
    background: var(--my-color);
    color: blue;
    font-color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(var(--my-color-rgb), 0.2);
}

.filter-chip.active {
    background: var(--my-color);
    color: blue;
    font-weight: 600;
    box-shadow: 0 4px 8px rgba(var(--my-color-rgb), 0.2);
}

/* Dark mode adjustments */
[data-bs-theme="dark"] .content-box,
[data-bs-theme="dark"] .search-wrapper,
[data-bs-theme="dark"] .filter-chip {
    background: var(--bs-tertiary-bg);
    border-color: var(--my-color);
}

[data-bs-theme="dark"] .search-input {
    color: var(--bs-body-color);
}

[data-bs-theme="dark"] .search-input::placeholder {
    color: var(--bs-body-color);
    opacity: 0.7;
}

/* Hide the original select element */
.per-name {
    display: none !important;
}

/* Update the top spacing */
.container {
    margin-top: 0 !important;
}

.content-box:first-child {
    margin-top: 0;
    margin-bottom: 20px;
}

/* Responsive Grid Adjustments */
@media (max-width: 1200px) {
    .course-thumbnail {
        max-width: 180px;
        height: 135px;
    }
}

@media (max-width: 992px) {
    .course-thumbnail {
        max-width: 160px;
        height: 120px;
    }
}

@media (max-width: 768px) {
    .course-thumbnail {
        max-width: 140px;
        height: 105px;
    }
    
    .course-title {
        font-size: 1.1rem;
    }
    
    .course-outcome {
        font-size: 0.85rem;
    }
}

@media (max-width: 576px) {
    .course-thumbnail {
        max-width: 120px;
        height: 90px;
    }
}

/* Course item container */
.course-item {
    display: flex;
    align-items: flex-start;
    padding: 6px 20px;
    position: relative;
    transition: all 0.3s ease;
    background: var(--bs-body-bg);
    gap: 15px;
    margin-bottom: 6px;
    border-radius: 12px;
}

/* Course thumbnail styling */
.course-image-wrapper {
    flex: 0 0 160px;
}

.course-thumbnail {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid var(--my-color);
    transition: all 0.3s ease;
}

/* Content styling */
.course-content {
    margin-top: 10px;
    flex: 1;
    height: 120px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    gap: 10px; /* Small gap between title and outcome */
}

.course-title {
    font-size: 1.1rem;
    margin: 0; /* Remove margin */
    color: var(--bs-emphasis-color);
}

.course-outcome {
    font-size: 0.85rem;
    margin: 0;
    line-height: 3;
    color: var(--bs-emphasis-color);
    opacity: 0.8; /* Slightly dimmed */
}

/* Price section */
.course-price {
    flex: 0 0 auto;
    padding-right: 10px;
    margin-top: 0;
}

/* Hover effects */
.course-item:hover {
    transform: translateX(5px);
}

.course-item:hover .course-thumbnail {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.2);
}

/* Dark mode adjustments */
[data-bs-theme="dark"] .course-item:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 98%;
    height: 1px;
    background: linear-gradient(
        to right,
        transparent,
        var(--my-color),
        var(--my-color),
        var(--my-color),
        transparent
    );
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
              <li class="breadcrumb-item" aria-current="page">Course List</li>
            </ol>
          </nav>

          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
          <!-- main body-->
           
          <div class="row text-light mybg my-row">
            <div class="container">
                <!-- Combined Search and Filter Box -->
                <div class="content-box">
                    <!-- Search Section -->
                    <div class="search-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Search for courses..."
                        >
                    </div>

                    <!-- Filter Section -->
                    <div class="filter-section">
                        <span class="filter-chip active" data-value="name_a_z">
                            <i class="fas fa-sort-alpha-down"></i> Sort: A to Z
                        </span>
                        <span class="filter-chip" data-value="name_z_a">
                            <i class="fas fa-sort-alpha-up"></i> Sort: Z to A
                        </span>
                        <span class="filter-chip" data-value="price_low_high">
                            <i class="fas fa-sort-numeric-down"></i> Price: Low to High
                        </span>
                        <span class="filter-chip" data-value="price_high_low">
                            <i class="fas fa-sort-numeric-up"></i> Price: High to Low
                        </span>
                        <span class="filter-chip" data-value="free">
                            <i class="fas fa-gift"></i> Free Courses
                        </span>
                    </div>

                    <!-- Hidden select for backend -->
                    <select class="per-name" style="display: none;">
                        <option value="name_a_z">A to Z</option>
                        <option value="name_z_a">Z to A</option>
                        <option value="price_low_high">Price Low to High</option>
                        <option value="price_high_low">Price High to Low</option>
                        <option value="free">Free Courses</option>
                    </select>
                </div>

                <!-- Course Container -->
                <div class="content-box">
                    <div class="row" id="course">
                        <!-- Courses will be loaded here -->
                    </div>
                </div>
            </div>
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

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>

    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/course_list.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
    <script>
    $(document).ready(function() {
        // Handle filter chip clicks
        $('.filter-chip').click(function() {
            $('.filter-chip').removeClass('active');
            $(this).addClass('active');
            const value = $(this).data('value');
            $('.per-name').val(value).trigger('change');
        });
    });
    </script>
  </body>
</html>
 
