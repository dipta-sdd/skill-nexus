$(document).ready(function () {
    // Fetch course lectures on page load
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_video/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        success: function (res) {
            $("#course").html("");
            res.forEach(function (courseLecture) {
                showCourseLecture(courseLecture);
            });
        },
        error: function (err) {
            console.error('Failed to fetch course lectures:', err);
        },
    });

    // Function to display course lecture details
    function showCourseLecture(courseLecture) {
        $("#course").append(`
            <div class="col-12">
                <div class="video-card">
                    <div class="video-thumbnail">
                        <video width="100%" controls>
                            <source src="${apiLink + courseLecture.video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="video-details my-color">
                        <h3 class="video-title ">${courseLecture.title}</h3>
                        <div class="video-uploader ">${courseLecture.lecture_description}</div>
                        <div class="course-actions">
                            <a href="/lec_detail?${courseLecture.id}" class="btn btn-sm btn-primary">Play Lecture</a>
                            
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    // Function to handle edit video
    function editVideo(courseId) {
        window.location.href = `/videoshow?id=${courseId}`;
    }

    // Function to handle delete video (adjust this as per your backend logic)
    function deleteVideo(courseId) {
        if (confirm("Are you sure you want to delete this video?")) {
            // Perform delete operation via AJAX or redirect to delete endpoint
            // Example:
            // $.ajax({
            //     type: "DELETE",
            //     url: apiLink + "/api/course_video/delete/" + courseId,
            //     headers: {
            //         Authorization: "Bearer " + getCookie("token"),
            //     },
            //     success: function (res) {
            //         // Handle success
            //     },
            //     error: function (err) {
            //         console.error('Failed to delete video:', err);
            //     },
            // });
        }
    }
});
