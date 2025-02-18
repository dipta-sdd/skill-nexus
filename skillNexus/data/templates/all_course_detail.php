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
        gap: 10px;
      }

      .course-title {
        font-size: 1.1rem;
        margin: 0;
        color: var(--bs-emphasis-color);
      }

      .course-outcome {
        font-size: 0.85rem;
        margin: 0;
        line-height: 3;
        color: var(--bs-emphasis-color);
        opacity: 0.8;
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

      /* Content Box Styling */
      .content-box {
        /* background: var(--bs-body-bg); */
        border: 3px solid var(--my-color);
        border-radius: 20px;
        padding: 5px;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.2);
      }

      /* Search Input Styling */
      .search-wrapper {
        position: relative;
        margin-top: 0px;
        margin-bottom: 20px;
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
        background: var(--bs-body-bg);
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
        margin-left: 10px;
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
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(var(--my-color-rgb), 0.2);
      }

      .filter-chip.active {
        background: var(--my-color);
        color: blue;
        font-weight: 600;
        box-shadow: 0 4px 8px rgba(var(--my-color-rgb), 0.2);
      }

      /* Hide the original select element */
      .per-name {
        display: none !important;
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
          <li class="breadcrumb-item" aria-current="page">My Courses</li>
        </ol>
      </nav>

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
      <!-- main body-->
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/all_course_detail.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
  </body>
</html>
