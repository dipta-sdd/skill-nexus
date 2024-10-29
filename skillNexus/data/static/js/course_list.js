$(document).ready(function () {
    // Fetch courses on page load
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_list/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        success: function (res) {
            $("#course").html("");
            res.forEach(function (course) {
                showCourse(course);
            });
        },
        error: function (err) {
            console.error('Failed to fetch courses:', err);
        },
    });

    // Function to display course details
    function showCourse(course) {
        $("#course").append(`
            
            <div class="col-xl-2 col-lg-3 col-9 mb-2"><img src="${apiLink + course.course_thumbnil}" class="course-thumbnail" alt="Course Thumbnail"></div>
            <div class="col-xl-8 col-lg-7"><h5 class="course-title"> <a href="/course_list_single?${course.id}"> ${course.title}</a> </h5>
                    <p class="course-outcome my-color">${course.course_outcome}</p></div>
            <div class="col-xl-2 col-lg-2 text-end"><p class="course-outcome my-color">${course.course_fee} $</p></div>
            <hr>
        `);

   
    }

});
