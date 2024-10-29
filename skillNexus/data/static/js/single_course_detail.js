const url = window.location.href;
// Extract the value after the hyphen
const value = url.split("?")[1];
// Log the extracted value
console.log(value);

$(document).ready(function () {
  // Fetch courses on page load
  $.ajax({
    type: "GET",
    url: apiLink + "/api/course/get",
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
      });
    },
    error: function (err) {
      console.error("Failed to fetch courses:", err);
    },
  });

  // function showCourse(course) {
  //     $("#course").append(`
  //         <div class="col-12 col-md-12 mx-auto my-3">
  //             <div class="card mb-3">
  //                 <div class="row g-0">
  //                     <div class="col-md-4">
  //                         <img src="${apiLink + course.course_thumbnil}" class="img-fluid rounded-start" alt="Course Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
  //                     </div>
  //                     <div class="col-md-8">
  //                         <div class="card-body">
  //                             <h5 class="card-title">${course.title}</h5>
  //                             <p class="card-text my-color">${course.course_outcome}</p>
  //                             <p class="card-text"><small class="text-muted">Course Info : ${course.course_fee} $</small></p>
  //                             <a href="/edit_detail?${course.id}" class="btn btn-primary">Edit Course</a>
  //                             <a href="#" class="btn btn-danger">Delete</a>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //             <ul class="nav nav-tabs my-color" id="myTab-${course.id}" role="tablist">
  //                 <li class="nav-item" role="presentation">
  //                     <button class="nav-link active" id="learn-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#learn-${course.id}" type="button" role="tab" aria-controls="learn-${course.id}" aria-selected="true">What you'll learn</button>
  //                 </li>
  //                 <li class="nav-item" role="presentation">
  //                     <button class="nav-link" id="content-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#content-${course.id}" type="button" role="tab" aria-controls="content-${course.id}" aria-selected="false">Course content</button>
  //                 </li>

  //                 <li class="nav-item" role="presentation">
  //                     <button class="nav-link" id="lectures-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#lectures-${course.id}" type="button" role="tab" aria-controls="lectures-${course.id}" aria-selected="false">Lectures</button>
  //                 </li>
  //                 <li class="nav-item" role="presentation">
  //                     <button class="nav-link" id="add-lecture-tab-${course.id}" data-bs-toggle="tab" data-bs-target="#add-lecture-${course.id}" type="button" role="tab" aria-controls="add-lecture-${course.id}" aria-selected="false">Add Lecture</button>
  //                 </li>
  //             </ul>
  //             <div class="tab-content" id="myTabContent-${course.id}">
  //                 <div class="tab-pane fade show active" id="learn-${course.id}" role="tabpanel" aria-labelledby="learn-tab-${course.id}">
  //                     <div class="card mt-3">
  //                         <div class="card-body">
  //                             <p class="card-text my-color">${course.course_outcome}</p>
  //                         </div>
  //                     </div>
  //                 </div>
  //                 <div class="tab-pane fade" id="content-${course.id}" role="tabpanel" aria-labelledby="content-tab-${course.id}">
  //                     <div class="card mt-3">
  //                         <div class="card-body">
  //                             <p class="card-text my-color ">${course.course_contain}</p>
  //                         </div>
  //                     </div>
  //                 </div>

  //                 <div class="tab-pane fade" id="lectures-${course.id}" role="tabpanel" aria-labelledby="lectures-tab-${course.id}">
  //                     <div class="card mt-3">
  //                         <div class="card-body" id="lectures-content-${course.id}">
  //                             <!-- Lectures will be appended here -->
  //                         </div>
  //                     </div>
  //                 </div>
  //                 <div class="tab-pane fade" id="add-lecture-${course.id}" role="tabpanel" aria-labelledby="add-lecture-tab-${course.id}">
  //                     <div class="card mt-3">
  //                         <div class="card-body">
  //                             <a href="/lecture_up?${course.id}" class="btn btn-primary">Add Lecture</a>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     `);
  //     fetchLectures(course.id);
  // }

  function showCourse(course) {
    $("#course").append(`
            <div class="col-12 col-md-12 mx-auto my-3">
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
                                
                                <p class="card-text"><small class="text-muted">Course Info : ${
                                  course.course_fee
                                } $</small></p>
                                <a href="/edit_detail?${
                                  course.id
                                }" class="btn btn-primary">Edit Course</a>
                                <a href="#" class="btn btn-danger delete">Delete</a>
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
                        <button class="nav-link" id="lectures-tab-${
                          course.id
                        }" data-bs-toggle="tab" data-bs-target="#lectures-${course.id}" type="button" role="tab" aria-controls="lectures-${course.id}" aria-selected="false">Lectures</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="add-lecture-tab-${
                          course.id
                        }" data-bs-toggle="tab" data-bs-target="#add-lecture-${course.id}" type="button" role="tab" aria-controls="add-lecture-${course.id}" aria-selected="false">Add Lecture</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="enrolled-users-tab-${
                          course.id
                        }" data-bs-toggle="tab" data-bs-target="#enrolled-users-${course.id}" type="button" role="tab" aria-controls="enrolled-users-${course.id}" aria-selected="false">Enrolled Users</button>
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
                    <div class="tab-pane fade" id="add-lecture-${
                      course.id
                    }" role="tabpanel" aria-labelledby="add-lecture-tab-${course.id}">
                        <div class="card mt-3">
                            <div class="card-body">
                                <a href="/lecture_up?${
                                  course.id
                                }" class="btn btn-primary">Add Lecture</a>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="enrolled-users-${
                      course.id
                    }" role="tabpanel" aria-labelledby="enrolled-users-tab-${course.id}">
                        <div class="card mt-3">
                            <div class="card-body" id="enrolled-users-content-${
                              course.id
                            }">
                            <div class=" table-responsive">
  <table class="table table-striped table-bordered align-middle">
    <thead class="">
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr>
        <td scope="row">dfss</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>


    </tbody>
  </table>
</div>   


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    fetchLectures(course.id);
    fetchEnrolledUsers(course.id);
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
    $(`#lectures-content-${courseId}`).append(`
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
                               
                                
                                <a href="${
                                  apiLink + lecture.video
                                }" target="_blank" class="btn btn-sm btn-outline-secondary">Video</a>
                                <a href="/lec_detail?${
                                  lecture.id
                                }" class="btn btn-sm btn-outline-secondary">View Lecture</a>
                                </div>
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>


     `);
  }
});
function fetchEnrolledUsers(courseId) {
  $.ajax({
    type: "GET",
    url: apiLink + "/api/enrollment/get",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: {
      course_id: courseId,
    },
    success: function (res) {
      $(`#enrolled-users-content-${courseId} tbody`).html(""); // Clear previous content
      res.forEach(function (user) {
        showEnrolledUser(courseId, user);
        console.log(user);
      });
    },
    error: function (err) {
      console.error("Failed to fetch enrolled users:", err);
    },
  });
}

// function showEnrolledUser(courseId, user) {
//     $("#enrolled-users-content-" + courseId).append(`
//         <div class="col-12">
//             <div class="card mb-3">
//                 <div class="row g-0">
//                     <div class="col-md-4">
//                         <img src="${apiLink + user.profile_picture}" class="img-fluid rounded-start" alt="User Profile Picture" style="width: 100%; height: 100%; object-fit: cover;">
//                     </div>
//                     <div class="col-md-8">
//                         <div class="card-body">
//                             <h5 class="card-title">${user.username}</h5>
//                             <p class="card-text">${user.email}</p>
//                             <button class="btn btn-danger ban-user" data-course-id="${courseId}" data-user-id="${user.id}">Ban User</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `);
// }

function showEnrolledUser(courseId, user) {
  $(` tbody`).append(`
    <tr>
        <td scope="row">${user.first_name + " " + user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.mobile}</td>
        <td><button class="btn btn-danger ban-user py-0" data-course-id="${courseId}" data-user-id="${
    user.id
  }">Ban User</button></td>
      </tr>
    `);
  // alert("");
  console.log(user);
}

$(document).on("click", ".ban-user", function () {
  const courseId = $(this).data("course-id");
  const userId = $(this).data("user-id");

  $.ajax({
    type: "DELETE",
    url: apiLink + "/api/enrollment/delete",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: {
      course_id: courseId,
      user_id: userId,
    },
    success: function (res) {
      // alert("User has been banned successfully.");
      showToast("User has been banned successfully.", "Danger");
      fetchEnrolledUsers(courseId); // Refresh the user list
    },
    error: function (err) {
      console.error("Failed to ban user:", err);
    },
  });
});

// $(document).on("click", ".delete", function () {
//   e.preventDefault();
//   alert("");
// });
