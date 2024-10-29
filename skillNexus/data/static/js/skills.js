$.ajax({
  type: "GET",
  url: apiLink + "/api/skills/all",
  success: function (response) {
    response.map(function (skill) {
      $(".all-skill.skill-flex").append(`
            <span class="skill" data-target="${skill.id}" data-name="${skill.name}" id="skill${skill.id}"> ${skill.name} <i class="fa-solid fa-check second"></i> <i class="fa-solid fa-plus first"></i></span>
        `);
    });
    $.ajax({
      type: "GET",
      url: apiLink + "/api/skills/get",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      success: function (response) {
        response.map(function (skill) {
          skill_name = $(`#skill${skill.skill}`).attr("data-name");
          $(`#skill${skill.skill}`).addClass("d-none");
          console.log(skill_name);
          $(".my-skill.skill-flex").append(`
            <span class="skill" data-target="${skill.skill}" data-name="${skill_name}" id="my_skill${skill.skill}"> ${skill_name} <i class="fa-solid fa-check first"></i> <i class="fa-solid fa-xmark second"></i></span>
           `);
        });
      },
    });
  },
});

//$(document).on("click");
$(".btn-add").click(function (e) {
  e.preventDefault();
  $("#collapse").collapse("show");
  $(this).addClass("d-none");
});
$("button.btn-close").click(function (e) {
  e.preventDefault();
  $("#collapse").collapse("hide");
  $(".btn-add").removeClass("d-none");
});
$(document).on("click", ".all-skill.skill-flex .skill", function (e) {
  let id = $(this).attr("data-target");
  $.ajax({
    type: "POST",
    url: apiLink + "/api/skills/add",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: {
      skill: id,
    },
    success: function (skill) {
      skill_name = $(`#skill${skill.skill}`).attr("data-name");
      $(`#skill${skill.skill}`).addClass("d-none");
      // console.log(skill_name);
      $(".my-skill.skill-flex").append(`
        <span class="skill" data-target="${skill.skill}" data-name="${skill_name}" id="my_skill${skill.skill}"> ${skill_name} <i class="fa-solid fa-check first"></i> <i class="fa-solid fa-xmark second"></i></span>
        `);
    },
  });
});

$(document).on("click", ".my-skill.skill-flex .skill", function (e) {
  let id = $(this).attr("data-target");
  $.ajax({
    type: "DELETE",
    url: apiLink + "/api/skills/del",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    data: {
      skill_id: id,
    },
    success: function (skill) {
      console.log(`#skill${id}`);
      $(`#my_skill${id}`).remove();
      $(`#skill${id}`).removeClass("d-none");
    },
  });
});

// hgghgh
