const url = window.location.href;
const value = url.split("?")[1];

$(document).ready(function () {
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
    $("#course_fee").text(course.course_fee);
    $("#course").append(`
            <div class="col-12 col-md-12 mx-auto my-2">
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${
                              apiLink + course.course_thumbnil
                            }" class="img-fluid rounded-start" alt="Course Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${course.title}</h5>
                                <p class="card-text my-color">${
                                  course.course_outcome
                                }</p>
                                <p class="card-text"><small class="text-muted">Course Fee: ${
                                  course.course_fee
                                } $</small></p>
                                <div id="enrollBtnContainer-${course.id}">
                                    <a href="#" class="btn btn-primary enroll-btn" data-course-id="${
                                      course.id
                                    }">Enroll Now</a>
                                </div>
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
                    <div class="tab-pane fade" id="reviews-${
                      course.id
                    }" role="tabpanel" aria-labelledby="reviews-tab-${course.id}">
                        <div class="card mt-3">
                            <div class="card-body">
                                <p class="card-text my-color">No reviews yet.</p>
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

                    <div class="tab-pane fade" id="lectures-${
                      course.id
                    }" role="tabpanel" aria-labelledby="lectures-tab-${course.id}">
                        <div class="card mt-3">
                            <div class="card-body" id="lectures-content-${
                              course.id
                            }">
                                <!-- Lectures will be appended here -->
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
            </div>
        `);
    fetchLectures(course.id);
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

  // function showLecture(courseId, lecture) {
  //     $(`#lectures-content-${courseId}`).append(`
  //    <div class="col-12">
  //         <div class="card mb-3">
  //             <div class="row g-0">
  //                 <div class="col-md-4">
  //                     <video class="img-fluid rounded-start" width="100%" height="150" controls style="object-fit: cover;">
  //                         <source src="${apiLink + lecture.video}" type="video/mp4">
  //                         Your browser does not support the video tag.
  //                     </video>
  //                 </div>
  //                 <div class="col-md-8">
  //                     <div class="card-body">
  //                         <h5 class="card-title">${lecture.title}</h5>
  //                         <p class="card-text my-color">${lecture.lecture_description}</p>
  //                         <div class="lecture-links mb-2">

  //                             <a href="${apiLink + lecture.video}" target="_blank" class="btn btn-sm btn-outline-secondary">Video</a>
  //                             <a href="/lec_detail?${lecture.id}" class="btn btn-sm btn-outline-secondary">View Lecture</a>
  //                             </div>

  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>

  //  `);
  // }

  function showLecture(courseId, lecture) {
    // Check enrollment status before showing lecture details
    checkEnrollmentStatus(courseId, function (isEnrolled) {
      const lectureContent = `
                <div class="col-12">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <video class="img-fluid rounded-start" width="100%" height="150" controls style="object-fit: cover;">
                                    <source src="${
                                      apiLink + lecture.video
                                    }" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${lecture.title}</h5>
                                    <p class="card-text my-color">${
                                      lecture.lecture_description
                                    }</p>
                                    <div class="lecture-links mb-2">
                                        
                                       
                                        <a href="/student_view_lec_detail?${courseId}&${
        lecture.id
      }" class="btn btn-sm btn-outline-secondary">View Lecture</a>
                                    </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      // If enrolled, show lecture content; otherwise, show blurred content
      if (isEnrolled) {
        $(`#lectures-content-${courseId}`).append(lectureContent);
      } else {
        // Show blurred content
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
