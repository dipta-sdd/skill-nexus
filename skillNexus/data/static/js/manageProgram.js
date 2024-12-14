$("#programSessionModal form").submit(function (e) {
  e.preventDefault();
  let data = new FormData(this);
  $.ajax({
    type: "post",
    url: apiLink + "/api/university/program/session",
    data: data,
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    contentType: false,
    processData: false,
    success: function (response) {
      // console.table(response);
      window.location.href = "/university/program/session/" + response.id;
    },
    error: function (e) {
      if (e.responseJSON) {
        labelErrors(
          "#programSessionModal .modal-body .form-control",
          e.responseJSON
        );
      } else showToast("Something went wrong, try again.", "danger");
    },
  });
});

// alert();
