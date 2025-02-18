$(document).ready(function () {
  // Initial load of courses
  loadCourses();

  // Handle search input with debounce
  let searchTimeout;
  $(".search-input").on('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadCourses();
    }, 500);
  });

  // Handle filter chip clicks
  $('.filter-chip').click(function() {
    $('.filter-chip').removeClass('active');
    $(this).addClass('active');
    const value = $(this).data('value');
    // Update the hidden select element
    $('.per-name').val(value).trigger('change');
    loadCourses();
  });

  function loadCourses() {
    // Get search query and filter value
    const searchQuery = $(".search-input").val() || '';
    const filterValue = $('.per-name').val() || 'name_a_z';

    console.log('Loading courses with:', { 
      search: searchQuery,
      filter: filterValue 
    });

    // Show loading state
    $("#course").html(`
      <div class="col-12 text-center py-5">
        <div class="loading">
          <i class="fas fa-spinner fa-spin fa-3x mb-3 text-primary"></i>
          <p class="text-muted">Loading courses...</p>
        </div>
      </div>
    `);

    // Make API request
    $.ajax({
      type: "GET",
      url: apiLink + "/api/course_list/get",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      data: {
        search: searchQuery,
        filter: filterValue,
        educator: true // Add this parameter to get only educator's courses
      },
      success: function (res) {
        $("#course").html("");
        if (res.length === 0) {
          if (searchQuery) {
            showNoResults("No courses found matching '" + searchQuery + "'");
          } else {
            showNoResults("You haven't created any courses yet");
          }
        } else {
          res.forEach(function (course) {
            showCourse(course);
          });
        }
      },
      error: function (err) {
        console.error("Failed to fetch courses:", err);
        showError();
      },
    });
  }

  function showNoResults(message) {
    $("#course").html(`
      <div class="col-12 text-center py-5">
        <div class="no-results">
          <i class="fas fa-search fa-3x mb-3 text-muted"></i>
          <h4 class="text-muted">${message}</h4>
          <p class="text-muted">Try adjusting your search criteria or filter settings.</p>
          ${message.includes("'") ? `
            <button class="btn btn-outline-primary mt-3" onclick="clearSearch()">
              <i class="fas fa-times"></i> Clear Search
            </button>
          ` : `
            <a href="/create_course" class="btn btn-primary mt-3">
              <i class="fas fa-plus"></i> Create New Course
            </a>
          `}
        </div>
      </div>
    `);
  }

  function showError() {
    $("#course").html(`
      <div class="col-12 text-center py-5">
        <div class="error-message">
          <i class="fas fa-exclamation-circle fa-3x mb-3 text-danger"></i>
          <h4 class="text-danger">Error loading courses</h4>
          <p class="text-muted">Please try again later.</p>
          <button class="btn btn-outline-primary mt-3" onclick="loadCourses()">
            <i class="fas fa-sync"></i> Retry
          </button>
        </div>
      </div>
    `);
  }

  // Function to display course details
  function showCourse(course) {
    $("#course").append(`
      <div class="course-item">
        <div class="course-image-wrapper">
          <img src="${apiLink + course.course_thumbnil}" class="course-thumbnail" alt="Course Thumbnail">
        </div>
        <div class="course-content">
          <h5 class="course-title">
            <a href="/course_detail?${course.id}">${course.title}</a>
          </h5>
          <p class="course-outcome my-color">${course.course_outcome}</p>
        </div>
        <div class="course-price">
          <p class="course-outcome my-color">
            ${course.course_fee === "0.00" ? 
              '<span class="badge bg-success">Free</span>' : 
              `$${course.course_fee}`
            }
          </p>
        </div>
        <div class="course-actions">
          <a href="/course_detail?${course.id}" class="btn btn-sm btn-primary">See details</a>
        </div>
      </div>
    `);
  }

  // Add clear search function
  window.clearSearch = function() {
    $(".search-input").val('');
    $('.filter-chip').removeClass('active');
    $('.filter-chip[data-value="name_a_z"]').addClass('active');
    $('.per-name').val('name_a_z');
    loadCourses();
  };
});
