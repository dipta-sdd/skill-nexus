$(document).ready(function () {
  const url = window.location.href;
  // Extract the value after the hyphen
  const value = url.split('?')[1];
  // Log the extracted value
  console.log(value);
  
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
        if (res.length > 0) {
          const course = res[0];
          populateEditForm(course);
        }
      },
      error: function (err) {
        console.error('Failed to fetch course details:', err);
      },
    });
  
    function populateEditForm(course) {
      $("#title").val(course.title);
      $("#course_outcome").val(course.course_outcome);
      $("#course_contain").val(course.course_contain);
      $("#course_fee").val(course.course_fee);
      if (course.course_thumbnil) {
        $("#thumbnail_preview").attr("src", apiLink + course.course_thumbnil);
      }
  
      $("#editCourse").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append("course_id", course.id);
        updateCourse(formData);
      });
    }
  
    function updateCourse(formData) {
      $.ajax({
        type: "POST",
        url: apiLink + "/api/course/edit",
        headers: {
          Authorization: "Bearer " + getCookie("token"),
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          showToast("Course updated successfully", 'primary');
          
          // window.location.reload();
          populateEditForm(res);
        },
        error: function (err) {
          console.error('Failed to update course:', err);
        },
      });
    }
  });
  