$(document).ready(function () {
    const url = window.location.href;
    const courseId = url.split('?')[1]; // Extract the course ID from the URL

    // Fetch course lecture details based on the course ID
    $.ajax({
        type: "GET",
        url: apiLink + "/api/course_video/get",
        headers: {
            Authorization: "Bearer " + getCookie("token"),
        },
        data: {
            course_id: courseId,
        },
        success: function (res) {
            $("#course").html(""); // Clear previous content
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
            <div class="col-12 mb-4">
                <div class="video-card">
                    <div class="video-thumbnail">
                        <img src="${apiLink + courseLecture.video}" alt="Video Thumbnail" class="img-fluid">
                    </div>
                    <div class="video-details mt-3">
                        <h3 class="video-title">${courseLecture.title}</h3>
                        <p class="video-description">${courseLecture.lecture_description}</p>
                        ${courseLecture.material ? `
                            <div class="mt-3">
                                <a href="${apiLink + courseLecture.material}" target="_blank" class="btn btn-primary">Download PDF</a>
                            </div>` : ``}
                        <div class="btn-group mt-3" role="group">
                            <button type="button" class="btn btn-primary btn-sm" style="width: 60px; font-size: 12px;" onclick="openEditModal(${courseLecture.id}, '${courseLecture.title}', '${courseLecture.lecture_description}', '${apiLink + courseLecture.material}', '${apiLink + courseLecture.video}')">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm ms-2" style="width: 60px; font-size: 12px;" onclick="deleteVideo(${courseLecture.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    // Function to open edit modal and populate with data
    window.openEditModal = function (id, title, description, material, video) {
        $('#lectureTitle').val(title);
        $('#lectureDescription').val(description);
        $('#lectureMaterial').val(''); // Clear file input
        $('#lectureVideo').val(''); // Clear file input
        $('#editModal').modal('show');

        $('#saveChanges').off('click').on('click', function () {
            saveChanges(id);
        });
    }

    // Function to handle save changes
    function saveChanges(id) {
        const formData = new FormData($('#editForm')[0]);
        formData.append('id', id);
        
        $.ajax({
            type: "POST",
            url: apiLink + "/api/course_video/edit",
            headers: {
                Authorization: "Bearer " + getCookie("token"),
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                $('#editModal').modal('hide');
                location.reload(); // Reload the page to reflect changes
            },
            error: function (err) {
                console.error('Failed to save changes:', err);
            },
        });
    }

    // Function to handle delete video (adjust this as per your backend logic)
    window.deleteVideo = function (courseId) {
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
            //         location.reload(); // Reload the page to reflect changes
            //     },
            //     error: function (err) {
            //         console.error('Failed to delete video:', err);
            //     },
            // });
        }
    }
});
