// show all experience
$.ajax({
  type: "GET",
  url: apiLink + "/api/experience/get",
  headers: {
    Authorization: "Bearer " + getCookie("token"),
  },
  success: function (res) {
    $(".experience-con ").html("");
    res.map(function (experience) {
      showexperience(experience);
    });
    checkEmpty();
  },
  error: function (err) {
    checkEmpty();
  },
});

$("#addExperienceModel .btn-primary").click(function (e) {
  e.preventDefault();
  let data = collectData("addExperienceModel");
  let experience_id = $("#addExperienceModel").attr("target");
  if (experience_id) {
    data["id"] = experience_id;
  }
  $.ajax({
    type: "POST",
    url: apiLink + "/api/experience/add",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: data,
    success: function (res) {
      showToast("experience Successfully Added", "primary");
      $(
        `#addExperienceModel input.form-control , #addExperienceModel select.form-control`
      ).each(function () {
        $(this).val("");
      });
      $(`#experience${experience_id}`).remove();
      $(".experience-con center").remove();
      showexperience(res);
      $("#addExperienceModel").modal("hide");
      if (experience_id) {
        $("#addExperienceModel").removeAttr("target");
      }
    },
    statusCode: {
      503: function () {
        showToast("Please check your network", "danger");
      },
      400: function (err) {
        if (!err) {
          console.log("object");
        }
        err = err.responseJSON;
        console.log(err);
        $(
          `#addExperienceModel input.form-control , #addExperienceModel select.form-control`
        ).each(function () {
          if (err[$(this).attr("name")]) {
            $(this).addClass("is-invalid");
          } else {
            $(this).removeClass("is-invalid");
          }
        });
      },
    },
  });
});
// check container is empty
function checkEmpty() {
  if (
    $(".experience-con .row").each(function () {
      return 1;
    }).length <= 0
  ) {
    $(".experience-con ").append(
      '<center class="text-danger">There is no experience to show.</center>'
    );
  }
}
// display a experience
function showexperience(experience) {
  console.log(experience);
  $(".experience-con").append(`
        <div class="row" id="experience${experience.id}">
            <div class="col-xl-12 col-8 pb-3">
            <span class="institute">
                ${experience.organisation_name}
            </span>
            <br>
            <span class="designation">
              <i> ${experience.designation} </i> , ${experience.department}
            </span>
            </div>
            <div class="col-xl-2 col-4 pt-1 date-duration">
            
            <span class="location"> 
                <svg class="Icon_icon__2UXCa" width="14" height="17" viewBox="0 0 14 17" xmlns="http://www.w3.org/2000/svg"><title>B8A81890-540B-4D41-A5D3-6F649851464A</title><path d="M6.991 8.658a1.892 1.892 0 0 1-1.89-1.89c0-1.041.849-1.89 1.89-1.89 1.042 0 1.89.849 1.89 1.89 0 1.042-.848 1.89-1.89 1.89m0-4.724a2.838 2.838 0 0 0-2.834 2.834 2.838 2.838 0 0 0 2.834 2.835 2.838 2.838 0 0 0 2.835-2.835A2.838 2.838 0 0 0 6.99 3.934m4.279 7.335L6.99 15.548l-4.278-4.279a6.057 6.057 0 0 1 0-8.555A6.028 6.028 0 0 1 6.991.944c1.55 0 3.1.59 4.279 1.77a6.057 6.057 0 0 1 0 8.555m.668-9.224a7.004 7.004 0 0 0-9.893 0c-2.727 2.728-2.727 7.166 0 9.893l4.613 4.612a.468.468 0 0 0 .667 0l4.613-4.612c2.726-2.727 2.726-7.165 0-9.893" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
                &nbsp ${experience.location}
            </span>
            </div>
            <div class="col-xl-4 col-5 pt-1 date-duration">
            
            <span class="duration"><svg class="Icon_icon__2UXCa" width="14" height="14" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><title>86017104-411A-4112-AC71-935BCF9B16F1</title><path d="M9.691 10.881a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm7.208-2.978a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm10.641-3.544H.876v-1.31c0-.648.528-1.176 1.177-1.176h.84v.504a.439.439 0 0 0 .878 0v-.504h6.46v.504a.439.439 0 0 0 .875 0v-.504h.84c.65 0 1.178.528 1.178 1.176v1.31zm0 8.34c0 .65-.528 1.178-1.177 1.178H2.053c-.65 0-1.177-.528-1.177-1.177V5.235h12.248V12.7zM11.947.997h-.84V.438a.437.437 0 1 0-.877 0v.558H3.771V.438a.438.438 0 1 0-.877 0v.558h-.84A2.055 2.055 0 0 0 0 3.05v9.65c0 1.134.921 2.055 2.053 2.055h9.894A2.055 2.055 0 0 0 14 12.7V3.05c0-1.133-.92-2.054-2.053-2.054z" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
                &nbsp ${experience.duration_year} Year${
    experience.duration_year ? "s" : ""
  } ${experience.duration_month} Month${experience.duration_month ? "s" : ""} ${
    experience.duration_day
  } Day${experience.duration_day ? "s" : ""}</span>
            </div>
            <div class="col-xl-4 col-5  pt-1 date-duration">
            
            <span class="date"><svg class="Icon_icon__2UXCa" width="14" height="14" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><title>86017104-411A-4112-AC71-935BCF9B16F1</title><path d="M9.691 10.881a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm7.208-2.978a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm10.641-3.544H.876v-1.31c0-.648.528-1.176 1.177-1.176h.84v.504a.439.439 0 0 0 .878 0v-.504h6.46v.504a.439.439 0 0 0 .875 0v-.504h.84c.65 0 1.178.528 1.178 1.176v1.31zm0 8.34c0 .65-.528 1.178-1.177 1.178H2.053c-.65 0-1.177-.528-1.177-1.177V5.235h12.248V12.7zM11.947.997h-.84V.438a.437.437 0 1 0-.877 0v.558H3.771V.438a.438.438 0 1 0-.877 0v.558h-.84A2.055 2.055 0 0 0 0 3.05v9.65c0 1.134.921 2.055 2.053 2.055h9.894A2.055 2.055 0 0 0 14 12.7V3.05c0-1.133-.92-2.054-2.053-2.054z" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
                &nbsp ${experience.start_date} &nbsp - &nbsp ${
    experience.end_date
  } </span>
            </div>
            <div class="col-2">
            <div class="edit-delete">
                <i class="fa-solid fa-pen fa-xl my-color btn-edit" target="${
                  experience.id
                }"></i>
                <i class="fa-solid fa-trash fa-xl my-color btn-del" target="${
                  experience.id
                }"></i>
                
            </div>
            </div>
            <hr>
        </div>    
    `);
}
// collect all data
function collectData(id) {
  const data = {};
  $(`#${id} input.form-control , #${id} select.form-control`).each(function () {
    data[$(this).attr("name")] = $(this).val();
  });

  return data;
}
// turn form to blank
function blank(id) {
  $(`#${id} .form-control`).each(function () {
    $(this).val("");
  });

  return data;
}

$(document).on("click", ".experience-con .btn-edit", function (e) {
  e.preventDefault();
  experience_id = $(this).attr("target");
  $.ajax({
    type: "GET",
    url: apiLink + "/api/experience/get",
    data: {
      experience_id: experience_id,
    },
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      res = res[0];
      $("#addExperienceModel").modal("show");
      $("#addExperienceModel select, #addExperienceModel input").each(
        function () {
          $(this).val(res[$(this).attr("name")]);
        }
      );
      $("#addExperienceModel").attr("target", experience_id);
    },
  });
});
$(document).on("click", ".experience-con .btn-del", function (e) {
  e.preventDefault();
  experience_id = $(this).attr("target");
  $.ajax({
    type: "DELETE",
    url: apiLink + "/api/experience/del",
    data: {
      experience_id: experience_id,
    },
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function (res) {
      console.log(res);
      showToast("experience has been deleted.", "primary");
      $(`#experience${experience_id}`).remove();
      checkEmpty();
    },
  });
});
