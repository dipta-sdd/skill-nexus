$(document).ready(function () {
    // Fetch course lecture details based on ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
  
    if (courseId) {
      $.ajax({
        type: "GET",
        url: `/api/course_video/get?id=${courseId}`,
        headers: {
          "Authorization": `Bearer ${getCookie("token")}`
        },
        success: function (response) {
          $('#lectureId').val(response.id);
          $('#title').val(response.title);
          $('#lectureDescription').val(response.lecture_description);
          // Populate other form fields if needed
        },
        error: function (error) {
          console.error('Error fetching course lecture:', error);
        }
      });
    }
  
    // Submit form to update course lecture details
    $('#courseForm').submit(function (event) {
      event.preventDefault();
      const formData = new FormData(this);
  
      $.ajax({
        type: "POST",
        url: "/api/course_video/edit",
        headers: {
          "Authorization": `Bearer ${getCookie("token")}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          console.log('Course lecture updated successfully:', response);
          // Handle success behavior (e.g., show success message)
        },
        error: function (error) {
          console.error('Error updating course lecture:', error);
          // Handle error behavior (e.g., show error message)
        }
      });
    });
  
    // Function to get cookie value by name
    function getCookie(name) {
      const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]*)');
      return cookieValue ? cookieValue.pop() : '';
    }
  });
  