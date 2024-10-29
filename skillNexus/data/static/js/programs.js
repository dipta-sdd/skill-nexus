// show all program
$.ajax({
  type: "GET",
  url: apiLink + "/api/university/program/get",
  headers: {
    Authorization: "Bearer " + getCookie("token"),
  },
  success: function (res) {
    $(".program-con ").html("");

    $.map(res, function (program, indexOrKey) {
      showProgram(program);
    });
    checkEmpty();
  },
});

$("#addProgram .btn-primary").click(function (e) {
  e.preventDefault();
  let data = collectData("#addProgram");
  let program_id = $("#addProgram").attr("target");
  if (program_id) {
    data["id"] = program_id;
  }
  $.ajax({
    type: "POST",
    url: apiLink + "/api/university/program/add",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: data,
    success: function (res) {
      showToast("program Successfully Added", "primary");
      $(`#addProgram input , #addProgram select, #addProgram textarea`).each(
        function () {
          $(this).val("");
        }
      );
      $(`#program${program_id}`).remove();
      $(".program-con center").remove();
      showProgram(res);
      $("#addProgram").modal("hide");
      if (program_id) {
        $("#addProgram").removeAttr("target");
      }
    },
    statusCode: {
      503: function () {
        showToast("Please check your network", "danger");
      },
      400: function (err) {
        err = err.responseJSON;
        console.log(err);
        $(`#addProgram input , #addProgram select, #addProgram textarea`).each(
          function () {
            if (err[$(this).attr("name")]) {
              $(this).attr("name");
              $(this).addClass("is-invalid");
            } else {
              $(this).removeClass("is-invalid");
            }
          }
        );
      },
    },
  });
});
// check container is empty
function checkEmpty() {
  if (
    $(".program-con .row").each(function () {
      return 1;
    }).length <= 0
  ) {
    $(".program-con ").append(
      '<center class="text-danger">There is no program to show.</center>'
    );
  }
}
// collect all data
function collectData(selector) {
  const data = {};
  $(
    `${selector} input.form-control , ${selector} select.form-control, ${selector} textarea`
  ).each(function () {
    val = $(this).val();
    data[$(this).attr("name")] = val;
  });
  return data;
}
// turn form to blank
function blank(selector) {
  $(
    `${selector} input.form-control , ${selector} select.form-control, ${selector} textarea`
  ).each(function () {
    $(this).val("");
  });
}
//load edit program on modal
$(document).on("click", ".program-con .btn-edit", function (e) {
  e.preventDefault();
  program_id = $(this).attr("target");
  $.ajax({
    type: "GET",
    url: apiLink + "/api/university/program/get",
    data: {
      program_id: program_id,
    },
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      res = res[0];
      $("#addProgram").modal("show");
      $("#addProgram select, #addProgram input, #addProgram textarea").each(
        function () {
          $(this).val(res[$(this).attr("name")]);
        }
      );
      $("#addProgram").attr("target", program_id);
    },
  });
});
$(document).on("click", ".program-con .btn-del", function (e) {
  e.preventDefault();
  program_id = $(this).attr("target");
  $.ajax({
    type: "DELETE",
    url: apiLink + "/api/university/program/del",
    data: {
      program_id: program_id,
    },
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      console.log(res);
      showToast("Program has been deleted.", "primary");
      $(`#program${program_id}`).remove();
      checkEmpty();
    },
  });
});
//show program to the display
function showProgram(program) {
  console.log(program);
  $(".program-con").append(`
        <div class="row" id="program${program.id}">
          <div class="col-xl-9 ">
            <span class="name">
              ${program.name}
            </span>
            <br>
            <span class="type">
              ${program.type}
            </span>
          </div>
          <div class="col-xl-3 pt-1 ">
            <div class="row">
              <div class="col-xl-12 col-6 smaller_details-con">
                <span class="smaller-details"><svg class="Icon_icon__2UXCa" width="14" height="14" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><title>86017104-411A-4112-AC71-935BCF9B16F1</title><path d="M9.691 10.881a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm7.208-2.978a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm10.641-3.544H.876v-1.31c0-.648.528-1.176 1.177-1.176h.84v.504a.439.439 0 0 0 .878 0v-.504h6.46v.504a.439.439 0 0 0 .875 0v-.504h.84c.65 0 1.178.528 1.178 1.176v1.31zm0 8.34c0 .65-.528 1.178-1.177 1.178H2.053c-.65 0-1.177-.528-1.177-1.177V5.235h12.248V12.7zM11.947.997h-.84V.438a.437.437 0 1 0-.877 0v.558H3.771V.438a.438.438 0 1 0-.877 0v.558h-.84A2.055 2.055 0 0 0 0 3.05v9.65c0 1.134.921 2.055 2.053 2.055h9.894A2.055 2.055 0 0 0 14 12.7V3.05c0-1.133-.92-2.054-2.053-2.054z" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
                &nbsp;${program.duration_year} Year${
    program.duration_year ? "s" : ""
  } ${program.duration_month} Month${program.duration_month ? "s" : ""}</span>
              </div>
              <div class="col-xl-12 col-6 mb-2">
                <div class="smaller_details-con pt-3">
                    <i class="fa-solid fa-pen fa-xl my-color btn-edit" target="${
                      program.id
                    }"></i>
                    <i class="fa-solid fa-trash fa-xl my-color btn-del" target="${
                      program.id
                    }"></i>
                </div>
              </div>
            </div>
          </div>
          <hr class="mb-1">
          <div class="col-12">
            <strong>Dscription: </strong> description
          </div>
                  <hr>
        </div>

    `);
}
