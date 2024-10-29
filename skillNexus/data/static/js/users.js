$('input.sta[type="checkbox"], input.role[type="checkbox"]').prop(
  "checked",
  true
);
loadtable();
$(
  'select.sort-by , input.sta[type="checkbox"], input.role[type="checkbox"]'
).change(function (e) {
  e.preventDefault();
  loadtable();
});

function loadtable() {
  var checkedRole = [];
  $('input.role[type="checkbox"]:checked').each(function () {
    checkedRole.push($(this).val());
  });
  var checkedStatus = [];
  $('input.sta[type="checkbox"]:checked').each(function () {
    checkedStatus.push($(this).val());
  });
  $.ajax({
    type: "POST",
    url: apiLink + "/api/admin/users",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: {
      sort_by: $("select.sort-by").val(),
      role: JSON.stringify(checkedRole),
      status: JSON.stringify(checkedStatus),
    },
    success: function (res) {
      $("tbody").html("");

      $.map(res, function (user, indexOrKey) {
        showUser(user);
      });
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
      );
    },
    error: function (res) {
      $("tbody").html("");
      $("tbody").html(`
        <tr>
            <td scope="row"></td>
            <td>No User Found</td>
            <td></td>
            <td></td>
        </tr>
    `);
    },
  });
}
function getCheckedRole() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const values = Array.from(checkboxes).map((checkbox) => checkbox.value);
  return values;
}

let col = {
  Active: "primary",
  Suspended: "info",
  Banned: "danger",
};
function showUser(user) {
  $("tbody").append(`
        <tr>
            <td scope="row">${user.username}</td>
            <td>${user.role}</td>
            <td>${convertUTCToLocalTime(user.date_joined)}</td>
            <td>${convertUTCToLocalTime(user.last_login)}</td>
            <td id="parent${
              user.id
            }" class="users-loader-con"> <span class="text-${
    col[user.status]
  }">${user.status}</span>
                <button type="button" target-status="Active" target-id="${
                  user.id
                }" class="${
    user.status == "Active" ? "d-none" : ""
  } btn fa-solid fa-circle-check text-primary" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<span>Active</span>"></button>
                <button type="button" target-status="Suspended" target-id="${
                  user.id
                }" class="${
    user.status == "Suspended" ? "d-none" : ""
  } btn fa-solid fa-lock text-info" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<span>Suspend</span>"  ${
    user.role == "Admin" ? "disabled" : ""
  }></button>
                <button type="button" target-status="Banned" target-id="${
                  user.id
                }" class="${
    user.status == "Banned" ? "d-none" : ""
  } btn fa-solid fa-ban text-danger" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<span>Ban</span>"  ${
    user.role == "Admin" ? "disabled" : ""
  }></button>
                
                <div class="users-loader"></div>

            </td>
        </tr>
    `);
}
function convertUTCToLocalTime(utcTimeString) {
  const utcDate = new Date(utcTimeString);
  const offset = utcDate.getTimezoneOffset() * 60000;
  const localDate = new Date(utcDate.getTime() + offset);
  const formattedLocalDate = localDate
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  return formattedLocalDate;
}

$(document).on("click", "button.fa-solid", function (e) {
  e.preventDefault();
  let id = $(this).attr("target-id");
  let status = $(this).attr("target-status");
  let prev_status = $(`td#parent${id} span`).text();
  $(`td#parent${id} .users-loader`).addClass("show");
  $.ajax({
    type: "POST",
    url: apiLink + "/api/admin/user/status",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: {
      id: id,
      status: status,
    },
    success: function (res) {
      console.log(res);
      $(`td#parent${id} span`).text(res.status);
      $(`td#parent${id} span`).removeClass();
      $(`td#parent${id} span`).addClass(`text-${col[res.status]}`);
      $(`td#parent${id} button[target-status=${res.status}]`).addClass(
        "d-none"
      );
      $(`td#parent${id} button[target-status=${prev_status}]`).removeClass(
        "d-none"
      );

      $(`td#parent${id} .users-loader`).removeClass("show");
    },
  });
});
