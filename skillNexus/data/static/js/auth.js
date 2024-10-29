$("#btn_reg").click(function (e) {
  e.preventDefault();
  var data = $("#sign_form").serializeArray(); //get all field
  const obj = toObj(data); //conver array to obj
  $("#sign_form small").text(""); //clear all error
  if (obj.password !== obj.confirm_password) {
    $(".confirm_password small").text("Password doesn't match");
  } else {
    $.ajax({
      type: "POST",
      url: apiLink + "/api/signup",
      data: data,
      // dataType: "application/json",
      success: function (response) {
        console.log(response);
        showToast("Sign Up Succesfull. Login Now", "info");
      },
      error: function (e) {
        const data = e.responseJSON;
        if ($.isPlainObject(data)) {
          $.each(data, function (field, errors) {
            $(`.${field} small`).text(errors.join(", "));
          });
        }
      },
    });
  }
});

// on click login
$("#btn_login").click(function (e) {
  e.preventDefault();
  var data = $("#login_form").serializeArray(); //get all field of the login form
  const obj = toObj(data); //conver array to obj
  $("#login_form small").text(""); //clear all error

  $.ajax({
    type: "POST",
    url: apiLink + "/api/login",
    data: data,
    // dataType: "application/json",
    success: function (response) {
      // console.log(response);
      showToast(response.message, "info");
      createCookie("token", response.access_token, 3);
      location.replace("/profile");
    },
    error: function (e) {
      const data = e.responseJSON;
      if ($.isPlainObject(data) && !data.message) {
        $.each(data, function (field, errors) {
          $(`.${field} small`).text(errors.join(", "));
        });
      } else {
        $(`.message small`).text(data.message);
      }
    },
  });
});

$(".user-box .eye").click(function (e) {
  e.preventDefault();

  let target = $(this).attr("target");
  let type = $(`.${target} input`).attr("type");
  if (type == "password") {
    $(`.${target} input`).attr("type", "text");
  } else {
    $(`.${target} input`).attr("type", "password");
  }
  $(`.${target} i.fa-regular`).toggleClass("fa-eye-slash");
  $(`.${target} i.fa-regular`).toggleClass("fa-eye");
});
