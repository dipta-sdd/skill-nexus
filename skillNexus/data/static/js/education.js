// get all levels from server
let levels = "";
levels = reload(levels);
function reload(levels) {
  $.ajax({
    type: "GET",
    url: apiLink + "/api/edu",
    async: false,
    success: function (res) {
      // console.log(res);
      if (res.length == 0) {
        $(".level-con").html(`<div class="alert alert-danger" role="alert">
        No level found.
        </div>`);
        $(".level-con").attr("isEmpty", "true");
      } else {
        $(".level-con").html(``);
        showLevel(res); // add levels in form
      }
      levels = res;
    },
  });
  return levels;
}

function showLevel(levels) {
  $.map(levels, function (level, indexOrKey) {
    $(`#addEduModel .form-control.level`).append(`
        <option value="${level.id}">${level.name}</option>
    `);
    $.map(level.degrees, function (degree, indexOrKey) {
      $(`#addEduModel .form-control.degree`).append(`
            <option class="level${level.id} d-none" value="${degree.id}">${degree.name}</option>
        `);
      $.map(degree.groups, function (group, indexOrKey) {
        $(`#addEduModel .form-control.group`).append(`
                <option class="degree${degree.id} d-none" value="${group.id}">${group.name}</option>
            `);
      });
    });
  });
  //   $(`#addEduModel .form-control.degree`).removeAttr("disabled");
}

// on selecting education level
$("#addEduModel .form-control.level").change(function (e) {
  // e.preventDefault();
  val = $(this).val();
  // console.log(val);
  $(`#addEduModel .degree option`).addClass("d-none");
  $(`#addEduModel .degree option.level${val}`).removeClass("d-none");
  $(`#addEduModel .degree option.default`).removeClass("d-none");
  //   $("#addEduModel .form-control.degree").removeAttr("disabled");
  $("#addEduModel .form-control.degree").val("");
  $(`#addEduModel .group option`).addClass("d-none");
  $(`#addEduModel .group option.default`).removeClass("d-none");
  $("#addEduModel .form-control.group").val("");
  $("#addEduModel .form-control.result_type").val("");
});
$("#addEduModel .form-control.degree").change(function (e) {
  // e.preventDefault();
  val = $(this).val();
  // console.log(val);
  $(`#addEduModel .group option`).addClass("d-none");
  $(`#addEduModel .group option.degree${val}`).removeClass("d-none");
  $(`#addEduModel .group option.default`).removeClass("d-none");
  //   $("#addEduModel .form-control.group").removeAttr("disabled");
  $("#addEduModel .form-control.group").val("");
  $("#addEduModel .form-control.result_type").val("");
});

$("#addEduModel .form-control.group").change(function (e) {
  // e.preventDefault();
});

// on change result type
$("#addEduModel .form-control.result_type").change(function (e) {
  let val = $(this).val();
  if (val == "") {
    $("#addEduModel .form-control.result").val("");
    $("#addEduModel .form-control.gpa").val("");
    $("#addEduModel .form-control.gpa_range").val("");
    $("#addEduModel .con_result").addClass("d-none");
    $("#addEduModel .con_gpa").addClass("d-none");
    $("#addEduModel .con_range").addClass("d-none");
  } else if (val == "Grade") {
    $("#addEduModel .form-control.result").val("");
    $("#addEduModel .form-control.gpa").val("");
    $("#addEduModel .form-control.gpa_range").val("");
    $("#addEduModel .con_result").addClass("d-none");
    $("#addEduModel .con_gpa").removeClass("d-none");
    $("#addEduModel .con_range").removeClass("d-none");
  } else {
    $("#addEduModel .form-control.result").val("");
    $("#addEduModel .form-control.gpa").val("");
    $("#addEduModel .form-control.gpa_range").val("");
    $("#addEduModel .con_result").removeClass("d-none");
    $("#addEduModel .con_gpa").addClass("d-none");
    $("#addEduModel .con_range").addClass("d-none");
  }
});

// collect data under a div
function collectData(id) {
  let data = {};
  $(`#${id} .form-control`).each(function () {
    const name = $(this).attr("name");
    data[name] = $(this).val();
  });

  return data;
}
// add new education
$("#addEduModel .btn-primary").click(function (e) {
  e.preventDefault();
  let data = collectData("addEduModel");
  let err = checkError(data);
  // console.log(err);
  if (!err) {
    $.ajax({
      type: "POST",
      url: apiLink + "/api/education/add",
      data: data,
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      success: function (res) {
        $("#addEduModel").modal("hide");
        showToast("Updated", "success");
        showAllEdu();
      },
      statusCode: {
        503: function () {
          showToast("Please check your network", "danger");
        },
        400: function (err) {
          err = err.responseJSON;
          console.log(err);
        },
      },
    });
  }

  //
});
// check err on add form
function checkError(data) {
  let err = false;
  $("#addEduModel .form-control").removeClass("is-invalid");
  $("#addEduModel .text-danger").addClass("d-none");
  $.map(data, function (val, key) {
    if (val == "") {
      if (key == "result") {
        if (
          data["result_type"] == "Class" ||
          data["result_type"] == "Division"
        ) {
          err = true;
          $(`#addEduModel .form-control.result`).addClass("is-invalid");
        }
      } else if (key == "gpa" || key == "gpa_scale") {
        if (data["result_type"] == "Grade") {
          err = true;
          $(`#addEduModel .form-control.${key}`).addClass("is-invalid");
        }
      } else {
        err = true;
        $(`#addEduModel .form-control.${key}`).addClass("is-invalid");
      }
    }
  });
  return err;
}
showAllEdu();
// show exciting education
function showAllEdu() {
  $.ajax({
    type: "GET",
    url: apiLink + "/api/education/get",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      $(".result-con").html("");
      res.map((edu) => {
        displayEdu(edu);
      });
      checkEmpty();
    },
  });
}
function displayEdu(edu) {
  let cls = [];
  cls[1] = "1st";
  cls[2] = "2nd";
  cls[3] = "3rd";

  $(".result-con").append(`
      <div class="row" id="education${edu.id}">
        <div class="col-xl-6 col-lg-4 col-12">
          <p class="my-color">
            <strong class="institue">
              ${edu.institute}
            </strong>
            <br>
            <small  class="degrees">
              ${edu.degree} , ${edu.group}
            </small>
          </p>
        </div>
        <div class="col-xl-2 col-lg-3 col-5">
          <p class="results my-color">
            Result
            <br>
              <svg class="Icon_icon__2UXCa" width="15" height="13" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg"><title>5A6D22FE-C616-4A4D-8A84-8442835023EC</title><path d="M14.152 3.455c0-1.452-1.221-2.634-2.721-2.634H3.569c-1.5 0-2.72 1.182-2.72 2.634v6.09c0 1.452 1.22 2.633 2.72 2.633h7.862c1.5 0 2.72-1.181 2.72-2.633v-6.09zm.848 0v6.09C15 11.45 13.4 13 11.431 13H3.569C1.601 13 0 11.45 0 9.545v-6.09C0 1.55 1.601 0 3.569 0h7.862C13.399 0 15 1.55 15 3.455zm-2.334 3.449c0 .227-.19.41-.424.41H9.843L8.445 9.389a.427.427 0 0 1-.43.18.42.42 0 0 1-.34-.313l-.982-4.18-.996 2.007a.427.427 0 0 1-.383.233H2.758a.418.418 0 0 1-.424-.411c0-.227.19-.41.424-.41h2.29l1.406-2.836a.437.437 0 0 1 .43-.23c.18.02.326.147.367.317l1.03 4.382.977-1.448a.426.426 0 0 1 .355-.186h2.629c.234 0 .424.184.424.41z" fill="#B9B9C0" fill-rule="evenodd"></path> </svg> 
            <span class="grade">
              
            ${edu.result_type}: ${
    edu.gpa
      ? edu.gpa + " out of " + edu.gpa_scale
      : cls[edu.result] + " " + edu.result_type
  }
            </span>

          </p>
        </div>
        <div class="col-xl-2 col-lg-3 col-5">
          <p class="results my-color">
            Passing Year
            <br>
            <svg class="Icon_icon__2UXCa" width="14" height="15" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><title>86017104-411A-4112-AC71-935BCF9B16F1</title><path d="M9.691 10.881a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm7.208-2.978a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm10.641-3.544H.876v-1.31c0-.648.528-1.176 1.177-1.176h.84v.504a.439.439 0 0 0 .878 0v-.504h6.46v.504a.439.439 0 0 0 .875 0v-.504h.84c.65 0 1.178.528 1.178 1.176v1.31zm0 8.34c0 .65-.528 1.178-1.177 1.178H2.053c-.65 0-1.177-.528-1.177-1.177V5.235h12.248V12.7zM11.947.997h-.84V.438a.437.437 0 1 0-.877 0v.558H3.771V.438a.438.438 0 1 0-.877 0v.558h-.84A2.055 2.055 0 0 0 0 3.05v9.65c0 1.134.921 2.055 2.053 2.055h9.894A2.055 2.055 0 0 0 14 12.7V3.05c0-1.133-.92-2.054-2.053-2.054z" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
            <span class="grade">
              
            ${edu.passing_year}
            </span>

          </p>
        </div>
        <div class="col-2">
          <div class="edit-delete">
            <!--<i class="fa-solid fa-pen fa-xl my-color btn-edit" target="${
              edu.id
            }"></i> -->
            <i class="fa-solid fa-trash fa-xl my-color btn-del" target="${
              edu.id
            }"></i>
            
          </div>
        </div>
        <hr>
      </div>
    `);
}

$(document).on("click", ".btn-del", function (e) {
  e.preventDefault();
  education_id = $(this).attr("target");
  $.ajax({
    type: "DELETE",
    url: apiLink + "/api/education/del",
    data: { education_id: education_id },
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      showAllEdu();
    },
  });
});

$(document).on("click", ".btn-edit", function () {
  e.preventDefault();
  education_id = $(this).attr("target");
});
// check container is empty
function checkEmpty() {
  if (
    $(".result-con .row").each(function () {
      return 1;
    }).length <= 0
  ) {
    $(".result-con ").append(
      '<center class="text-danger">There is no education to show.</center>'
    );
  }
}
