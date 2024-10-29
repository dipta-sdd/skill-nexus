$.ajax({
  type: "GET",
  url: apiLink + "/api/program",
  success: function (program) {
    showPrograms(program);
  },
});

function showPrograms(programs) {
  $(".program-con").html("");
  programs.map(function (program) {
    $(".program-con").append(`
        <div class="row">
            <div class="col-xl-12 pb-2">
            <a href="/program_and_course?=id${
              program.id
            }" class="name text-primary">
                ${program.name} 
            </a>
            <i class="type">
                ${program.type} Program
            </i>
            <a href="/univrsity?id=${
              program.university_id
            }" class="versity my-color">${program.university_name}</a>
            <span class="type"><svg class="Icon_icon__2UXCa" width="16" height="16" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><title>86017104-411A-4112-AC71-935BCF9B16F1</title><path d="M9.691 10.881a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm7.208-2.978a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.827 0 .913.913 0 0 1-1.827 0zm-3.604 0a.913.913 0 1 1 1.826 0 .913.913 0 0 1-1.826 0zm10.641-3.544H.876v-1.31c0-.648.528-1.176 1.177-1.176h.84v.504a.439.439 0 0 0 .878 0v-.504h6.46v.504a.439.439 0 0 0 .875 0v-.504h.84c.65 0 1.178.528 1.178 1.176v1.31zm0 8.34c0 .65-.528 1.178-1.177 1.178H2.053c-.65 0-1.177-.528-1.177-1.177V5.235h12.248V12.7zM11.947.997h-.84V.438a.437.437 0 1 0-.877 0v.558H3.771V.438a.438.438 0 1 0-.877 0v.558h-.84A2.055 2.055 0 0 0 0 3.05v9.65c0 1.134.921 2.055 2.053 2.055h9.894A2.055 2.055 0 0 0 14 12.7V3.05c0-1.133-.92-2.054-2.053-2.054z" fill="#B8B8B8" fill-rule="evenodd"></path></svg>
                &nbsp; ${
                  program.duration_year
                } Year${program.duration_year ? "s" : ""} ${program.duration_month} Month${program.duration_month ? "s" : ""}</span>
            </div>
            <hr>
        </div>
        `);
  });
}
