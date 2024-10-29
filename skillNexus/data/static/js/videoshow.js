$(document).ready(function () {
    // Fetch courses on page load
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        success: function (res) {
            $("#video").html("");  // Clear existing content in #video
            
            if (res.length === 0) {
                $("#video").html("<p>No videos found.</p>");
            } else {
                res.forEach(function (video) {
                    showCourse(video);  // Display each course lecture
                });
            }
        },
        error: function (err) {
            console.error('Failed to fetch courses:', err);
            $("#video").html("<p>Error fetching videos.</p>");
        },
    });

    // Function to display course details
    function showCourse(video) {
        $("#video").append(`
            <div class="col-md-6">
                <h3 style="text-align: center; margin-top: 10px;">${video.title}</h3>
                <div id="lectureDetails${video.id}" class="text-center">
                    <h4 id="lectureTitle${video.id}"></h4>
                    <p id="lectureDescription${video.id}"></p>
                    <div id="lectureVideo${video.id}" class="embed-responsive embed-responsive-16by9" style="display: none;">
                        <video id="video${video.id}" class="embed-responsive-item" controls></video>
                    </div>
                </div>
            </div>
        `);

        showCourseVideo(video.id);  // Fetch and display video for the course lecture
    }

    // Function to fetch and display course lecture video
    function showCourseVideo(lectureId) {
        $.ajax({
            type: "GET",
            url: apiLink + `/api/course_lecture/${lectureId}`,
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            success: function (data) {
                $(`#lectureTitle${lectureId}`).text(data.title);
                $(`#lectureDescription${lectureId}`).text(data.lecture_description);

                if (data.video_url) {
                    $(`#video${lectureId}`).attr('src', data.video_url);
                    $(`#lectureVideo${lectureId}`).show();
                } else {
                    alert('Video not available for this lecture.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Failed to fetch lecture details: ' + textStatus);
                console.error('Error details:', errorThrown);
            }
        });
    }
});
