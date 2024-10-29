$(document).ready(function () {
  // Fetch courses on page load
  $.ajax({
    type: "GET",
    url: apiLink + "/api/course/get",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      $("#course").html(
        ` <center><h2 style="color:blue;">View Course</h2></center><br>`
      );
      res.forEach(function (course) {
        showCourse(course);
      });
    },
    error: function (err) {
      console.error("Failed to fetch courses:", err);
    },
  });

  // Function to display course details
  function showCourse(course) {
    $("#course").append(`
            
            <div class="course-list-item" data-course-id="${course.id}">
                <img src="${
                  apiLink + course.course_thumbnil
                }" class="course-thumbnail" alt="Course Thumbnail">
                <div class="course-details">
                    <h5 class="course-title">${course.title}</h5>
                    <p class="course-outcome my-color">${
                      course.course_outcome
                    }</p>
                </div>
                <div class="course-actions">
                    <a href="/course_detail?${
                      course.id
                    }" class="btn btn-sm btn-primary">See details</a>
                   
                </div>
            </div>
        `);
  }
});
