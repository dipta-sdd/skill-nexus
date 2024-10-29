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
        showLevel(res);
      }
      levels = res;
    },
  });
  return levels;
}
function showLevel(levels) {
  $(`select.form-control`).html(
    `<option value="" selected>Select one</option>`
  );
  $("input.form-control").val("");
  $.map(levels, function (level, index) {
    // level <option value="" selected>Select one</option>

    $(`.form-control.level`).append(
      `<option value="${level.id}">${level.name}</option>`
    );
    $(".level-con").append(`
    <div class="accordion" id="level${level.id}">
        <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button ${
              level.degrees.length == 0 ? "collapsed" : ""
            }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_level${level.id}" aria-expanded="${level.degrees.length == 0 ? "false" : "true"}" aria-controls="collapse">
            ${level.name}
            </button>
        </h2>
        <div id="collapse_level${
          level.id
        }" class="accordion-collapse collapse ${level.degrees.length == 0 ? "" : "show"}" data-bs-parent="#level${level.id}">
            <div class="accordion-body level ps-5">
                
            </div>
        </div>
        </div>
    </div>
    `);
    if (level.degrees.length <= 0) {
      $(`#collapse_level${level.id} .level`).html(`
        <div class="alert alert-danger mb-0 py-0" role="alert">
            No Degree.
        </div>
      `);
      $(`#collapse_level${level.id} .level`).attr("isEmpty", "true");
    } else {
      $.map(level.degrees, function (degree, indexOrKey) {
        $(`.form-control.degree`).append(
          `<option class="d-none level${level.id} opt" value="${degree.id}">${degree.name}</option>`
        );
        $(`#collapse_level${level.id} .level`).append(`
          <div class="accordion" id="degree${degree.id}">
            <div class="accordion-item">
              <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_degree${degree.id}" aria-expanded="false" aria-controls="collapse">
                  ${degree.name}
                  </button>
              </h2>
              <div id="collapse_degree${degree.id}" class="accordion-collapse collapse " data-bs-parent="#degree${degree.id}">
                  <div class="accordion-body degree ps-5">
                      
                  </div>
              </div>
            </div>
          </div>
        `);
        if (degree.groups.length <= 0) {
          $(`#collapse_degree${degree.id} .degree`)
            .html(`<div class="alert alert-danger mb-0 py-0" role="alert">
            No Groups or Mejor.
          </div>`);
          $(`#collapse_degree${degree.id} .degree`).attr("isEmpty", "true");
        } else {
          $(`#collapse_degree${degree.id} .degree`).append(
            `<ul class="list-group">`
          );
          $.map(degree.groups, function (group, indexOrKey) {
            $(`#collapse_degree${degree.id} .degree .list-group`).append(
              `<li class="list-group-item">${group.name}</li>`
            );
          });
          $(`#collapse_degree${degree.id} .degree`).append(`</ul>`);
        }
      });
    }
  });
}
// selecting level on add group
levelSelector = document.getElementById("addGrouplevel");
$(levelSelector).change(function (e) {
  val = $(levelSelector).val();
  $(`#addGroup select.form-control.degree`).val("");
  $(`#addGroup select.form-control.degree .opt`).addClass("d-none");
  $(`#addGroup select.form-control.degree .level${val}`).removeClass("d-none");
});
// click add level button
$("#addLevel .btn-primary").click(function (e) {
  e.preventDefault();
  val = $("#addLevel .form-control").val();
  // alert(val);
  if (val == "") {
    showToast("Please fill all fields", "danger");
  } else {
    $.ajax({
      type: "POST",
      url: apiLink + "/api/edu/level",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      data: { name: val },
      success: function (response) {
        showToast(val + " successfully added.", "primary");
        reload(levels);
      },
    });
  }
});
// click add degree button
$("#addDegree .btn-primary").click(function (e) {
  e.preventDefault();
  val = $("#addDegree input.form-control").val();
  data = collectData("addDegree");
  error = false;
  $.map(data, function (val, indexOrKey) {
    if (val == "") {
      error = true;
    }
  });
  if (error) {
    showToast("Please fill all fields", "danger");
  } else {
    $.ajax({
      type: "POST",
      url: apiLink + "/api/edu/degree",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      data: data,
      success: function (response) {
        showToast(data.name + " successfully added.", "primary");
        reload(levels);
      },
    });
  }
});
// click add group or major button
$("#addGroup .btn-primary").click(function (e) {
  e.preventDefault();
  val = $("#addGroup input.form-control").val();
  data = collectData("addGroup");
  error = false;
  $.map(data, function (val, indexOrKey) {
    if (val == "") {
      error = true;
    }
  });
  if (error) {
    showToast("Please fill all fields", "danger");
  } else {
    $.ajax({
      type: "POST",
      url: apiLink + "/api/edu/group_or_mejor",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      data: data,
      success: function (response) {
        showToast(data.name + " successfully added.", "primary");
        reload(levels);
      },
    });
  }
});

// collect all data
function collectData(id) {
  const data = {};
  // Iterate over each input within the #personal div
  $(`#${id} .form-control`).each(function () {
    const inputType = $(this).prop("tagName");
    const name = $(this).attr("name");
    data[name] = $(this).val();
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
