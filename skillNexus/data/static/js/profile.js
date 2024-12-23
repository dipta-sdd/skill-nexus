$(document).ready(function () {
  let user = current_user();
  function current_user() {
    let uuu = "";
    $.ajax({
      type: "GET",
      url: apiLink + "/api/current_user",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      async: false,
      success: function (response) {
        uuu = response;
      },
    });
    return uuu;
  }

  // console.log(user);

  $(".profile-pic .fa-user").addClass("d-none");
  $(".profile-pic").append(
    `<img src="${apiLink + user.profile_picture}" alt=""/>`
  );
  $(".name").text(user.first_name + " " + user.last_name);
  $(".username").text("(" + user.username + ")");
  $(".role").text(user.role);
  showProfileDetails(user);

  console.log(user);
  if (user.role != "University") {
    showPersonalDetails();
  } else {
    $("#personal").remove();
  }
  // manage employe details
  if (user.role == "Employer") {
    $.ajax({
      type: "GET",
      url: apiLink + "/api/employer/company/get",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      success: function (company) {
        console.log(company);
        if (company) showDetails(".company", company);
      },
    });
  } else {
    $(".company").remove();
  }

  function showDetails(selector, company) {
    $(`${selector} .details .form-control.per-name`).each(function () {
      $(this).val(company[$(this).attr("name")]);
      $(this).attr("disabled", "");
    });
  }

  // edit company details
  $(".company button.btn-edit").click(function (e) {
    e.preventDefault();
    $(this).addClass("d-none");
    $(".company button.btn-save").removeClass("d-none");
    $(".company .details .form-control.per-name").removeAttr("disabled");
  });
  $(".company button.btn-save").click(function (e) {
    e.preventDefault();

    data = collectDataClass("company");
    if (!data.error) {
      $.ajax({
        type: "POST",
        url: apiLink + "/api/employer/company/add",
        data: data,
        headers: {
          Authorization: "Bearer " + getCookie("token"),
        },
        success: function (company) {
          showToast("Update successfull.", "primary");
          showDetails(".company", company);
          $(".company button.btn-edit").removeClass("d-none");
          $(".company button.btn-save").addClass("d-none");
        },
        error: function (error) {
          if (error.responseJSON) {
            labelErrors(".company .form-control", error.responseJSON);
          }
        },
      });
    }
  });

  // manage university details
  if (user.role == "University") {
    $.ajax({
      type: "GET",
      url: apiLink + "/api/university/get",
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      success: function (res) {
        showDetails(".university", res);
      },
    });
  } else {
    $(".university").remove();
  }
  // edit university details
  $(".university button.btn-edit").click(function (e) {
    e.preventDefault();
    $(this).addClass("d-none");
    $(".university button.btn-save").removeClass("d-none");
    $(".university .details .form-control.per-name").removeAttr("disabled");
  });
  $(".university button.btn-save").click(function (e) {
    e.preventDefault();

    data = collectDataClass("university");
    if (!data.error) {
      $.ajax({
        type: "POST",
        url: apiLink + "/api/university/add",
        data: data,
        headers: {
          Authorization: "Bearer " + getCookie("token"),
        },
        success: function (university) {
          showToast("Update successfull.", "primary");
          showDetails(".university", university);
          $(".university button.btn-edit").removeClass("d-none");
          $(".university button.btn-save").addClass("d-none");
        },
      });
    }
  });

  function collectDataClass(cls) {
    let data = {};
    $(`.${cls} .form-control.per-name`).each(function () {
      val = $(this).val();
      data[$(this).attr("name")] = val;
      if (val == "") {
        $(this).addClass("is-invalid");
        data["error"] = true;
      } else $(this).removeClass("is-invalid");
    });

    return data;
  }
  // show personal details
  function showPersonalDetails() {
    $.ajax({
      type: "POST",
      url: apiLink + "/api/personal_details",
      data: { id: user.id },
      success: function (res) {
        // console.log(res);
        $(".personal-details").html(`
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Father's Name</span>
            <input type="text" name="father_name" value="${
              res.father_name ? res.father_name : ""
            }" class="form-control per-name" disabled="" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Mother's Name</span>
            <input type="text" name="mother_name" value="${
              res.mother_name ? res.mother_name : ""
            }" class="form-control per-name" disabled />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Gender</span>
            <select  name="gender" class="form-control per-name" disabled >
            <option></option>
            <option value="Male" ${
              res.gender == "Male" ? "selected" : ""
            }>Male</option>
            <option value="Female" ${
              res.gender == "Female" ? "selected" : ""
            }>Female</option>
            <option value="Other" ${
              res.gender == "Other" ? "selected" : ""
            }>Other</option>
            </select>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Date of Birth</span>
            <input type="date" name="date_of_birth" value="${
              res.date_of_birth ? res.date_of_birth : ""
            }" class="form-control per-name" disabled />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Religion</span>
            <input type="text" name="religion" value="${
              res.religion ? res.religion : ""
            }" class="form-control per-name" disabled />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Marital Status</span>
            <select name="marital_status" class="form-control per-name" disabled >
            <option></option>
            <option value="Single" ${
              res.marital_status == "Single" ? "selected" : ""
            }>Single</option>
            <option value="Married" ${
              res.marital_status == "Married" ? "selected" : ""
            }>Married</option>
            </select>
          </div>
        </div>
      `);
      },
      error: function (err) {
        res = err.responseJSON;
        $(".personal-details").html(`+
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Father's Name</span>
            <input type="text" name="father_name" value="${
              res.father_name ? res.father_name : ""
            }" class="form-control per-name" disabled="" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Mother's Name</span>
            <input type="text" name="mother_name" value="${
              res.mother_name ? res.mother_name : ""
            }" class="form-control per-name" disabled />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Gender</span>
            <select  name="gender" class="form-control per-name" disabled >
            <option></option>
            <option value="Male" ${
              res.gender == "Male" ? "selected" : ""
            }>Male</option>
            <option value="Female" ${
              res.gender == "Female" ? "selected" : ""
            }>Female</option>
            <option value="Other" ${
              res.gender == "Other" ? "selected" : ""
            }>Other</option>
            </select>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Date of Birth</span>
            <input type="date" name="date_of_birth" value="${
              res.date_of_birth ? res.date_of_birth : ""
            }" class="form-control per-name" disabled />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Religion</span>
            <input type="text" name="religion" value="${
              res.religion ? res.religion : ""
            }" class="form-control per-name" disabled />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-3">
            <span class="input-group-text">Marital Status</span>
            <select name="marital_status" class="form-control per-name" disabled >
            <option></option>
            <option value="Single" ${
              res.marital_status == "Single" ? "selected" : ""
            }>Single</option>
            <option value="Married" ${
              res.marital_status == "Married" ? "selected" : ""
            }>Married</option>
            </select>
          </div>
        </div>
      `);
      },
    });
  }

  const btn_edit_per = document.getElementById("btn-edit-personal");
  // console.log(btn_edit_per);

  $(document).on("click", "#personal .btn-edit-p", function (e) {
    e.preventDefault();
    $("#personal input").removeAttr("disabled");
    $("#personal select").removeAttr("disabled");
    $("#personal .btn-edit-p").toggleClass("d-none");
    $("#personal .btn-save-p").toggleClass("d-none");
  });

  // click on edit on profile details
  $(document).on("click", "#btn-edit-profile", function (e) {
    // $("#profile .btn-edit-p").click(function (e) {
    e.preventDefault();
    $("#profile .btn-edit-p").toggleClass("d-none");
    $("#profile .btn-save-p").toggleClass("d-none");
    $(".profile-details2").html(`
    <div class="col-lg-6">
      <div class="input-group mb-3">
        <span class="input-group-text">First Name</span>
        <input type="text" value="${
          user.first_name
        }" class="form-control f-name"  />
      </div>
    </div>
    <div class="col-lg-6">
      <div class="input-group mb-3">
        <span class="input-group-text">Last Name</span>
        <input type="text" value="${
          user.last_name
        }" class="form-control l-name"  />
      </div>
    </div>
    <div class="col-lg-6">
      <div class="input-group mb-3">
        <span class="input-group-text">Username </span>
        <input type="text" value="${
          user.username
        }" class="form-control u-name" disabled />
      </div>
    </div>
    <div class="col-lg-6">
      <div class="input-group mb-3">
        <span class="input-group-text">Mobile </span>
        <input type="number" value="${
          user.mobile ? user.mobile : ""
        }" class="form-control mobile" />
      </div>
    </div>
    <div class="col-lg-6">
      <div class="input-group mb-3">
        <span class="input-group-text">Email </span>
        <input type="email" value="${
          user.email
        }" class="form-control email" disabled/>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="input-group mb-3">
        <span class="input-group-text">Country</span>
        <input type="text" value="${
          user.country ? user.country : ""
        }" class="form-control country" />
      </div>
    </div>
    <div class="col-12">
      <div class="input-group mb-3">
        <span class="input-group-text">Bio</span>
        <textarea type="text"  class="form-control bio" >${
          user.bio ? user.bio : ""
        }</textarea>
      </div>
    </div>
  `);
  });

  $("#profile .btn-save-p").on("click", function (e) {
    e.preventDefault();

    let data = {
      id: user.id,
      mobile: $(".mobile").val(),
      email: $(".email").val(),
      first_name: $(".f-name").val(),
      last_name: $(".l-name").val(),
      bio: $(".bio").val(),
      country: $(".country").val(),
    };
    $.ajax({
      type: "POST",
      url: apiLink + "/api/edit_profile",
      async: "false",
      data: data,
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
    })
      .then(function (res) {
        console.log(res);
        showToast("Details Successfully updated.", "primary");
        res.username = user.username;
        showProfileDetails(res);
        $("#profile .btn-edit-p").toggleClass("d-none");
        $("#profile .btn-save-p").toggleClass("d-none");
      })
      .catch(function (error) {
        console.log(error);
        showToast("Details update failed.", "danger");
      });
  });

  // personal details save
  $(document).on("click", "#personal .btn-save-p", function (e) {
    e.preventDefault();
    let data = collectData("personal");
    data["id"] = user.id;
    $.ajax({
      type: "POST",
      url: apiLink + "/api/personal_details/edit",
      data: data,
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
    })
      .then(function (res) {
        console.log(res);
        showToast("Details Successfully updated.", "primary");
        $("#personal .btn-edit-p").toggleClass("d-none");
        $("#personal .btn-save-p").toggleClass("d-none");
        restoreData("personal", res);
      })
      .catch(function (error) {
        console.log(error);
        showToast("Details update failed.", "danger");
      });
  });
  //
  //
  // showing personal detail of the user
  function showProfileDetails(user) {
    $(".profile-details2").html(`
      
      <div class="col-lg-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Name</span>
          <input type="text" value="${
            user.first_name + " " + user.last_name
          }" class="form-control per-name" disabled />
        </div>
      </div>

      <div class="col-lg-6"></div>
      
      <div class="col-lg-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Username </span>
          <input type="text" value="${
            user.username
          }" class="form-control per-name" disabled />
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Mobile </span>
          <input type="text" value="${
            user.mobile ? user.mobile : ""
          }" class="form-control per-name" disabled />
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Email </span>
          <input type="email" value="${
            user.email
          }" class="form-control per-name" disabled />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="input-group mb-3">
          <span class="input-group-text">Country</span>
          <input type="text" value="${
            user.country ? user.country : ""
          }" class="form-control per-name" disabled />
        </div>
      </div>
      <div class="col-12">
        <div class="input-group mb-3">
          <span class="input-group-text">Bio</span>
          <textarea type="text"  class="form-control per-name" disabled >${
            user.bio ? user.bio : ""
          }</textarea>
        </div>
      </div>
    `);
  }

  // profile pic chosing
  const imageInput = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  let cropper;

  imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        imagePreview.src = this.result;
        imagePreview.style.display = "block";

        // Create Cropper Container dynamically
        const cropperContainer = document.createElement("div");
        cropperContainer.style.maxWidth = imagePreview.width + "px";
        imagePreview.parentNode.insertBefore(
          cropperContainer,
          imagePreview.nextSibling
        );

        // Initialize Cropper.js
        const image = imagePreview;
        cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 0.8,
        });
      });

      reader.readAsDataURL(file);
    }
  });

  // Example - Getting cropped image data for further actions
  function getCroppedImage() {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImageFile = dataURItoBlob(
        croppedCanvas.toDataURL("image/jpeg")
      );
      console.log(croppedImageFile);
      const formData = new FormData();
      formData.append(
        "profile_picture",
        croppedImageFile,
        user.username + ".jpg"
      );
      $.ajax({
        type: "POST",
        url: apiLink + "/api/edit_profile",
        data: formData,
        // data: JSON.stringify({ profile_picture: croppedImageFile }),
        processData: false,
        contentType: false,
        headers: {
          Authorization: "Bearer " + getCookie("token"),
        },
        success: function (res) {
          console.log("upload successfull");
          // showimg notification of success
          showToast("Profile uploaded successfully.");
          $(".profile-pic img").attr("src", apiLink + res.profile_picture);
          $("#nav_con .profile-con img").attr(
            "src",
            apiLink + res.profile_picture
          );
          $("#profilePicChangeModal").modal("hide");
          console.log(`$("#profilePicChangeModal").modal("hide");`);
          console.log(res);
        },
      });
    }
  }
  $(saveCropedPic).click(function (e) {
    e.preventDefault();
    getCroppedImage();
  });
  // Helper function to convert data URI to a Blob (which can be treated as a file)
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  // collect data under a div
  function collectData(id) {
    const data = {};

    // Iterate over each input within the #personal div
    $(`#${id} .form-control.per-name`).each(function () {
      const inputType = $(this).prop("tagName");
      const name = $(this).attr("name");

      if (inputType === "INPUT") {
        data[name] = $(this).val();
      } else if (inputType === "SELECT") {
        data[name] = $(this).val();
      }
    });

    return data;
  }

  //deable and show new data
  function restoreData(id, data) {
    $(`#${id} .form-control.per-name`).each(function () {
      const name = $(this).attr("name");
      $(this).val(data[name]);
      $(this).attr("disabled", "");
    });
  }

  // let button = $("button.btn.btn-outline-primary.ms-auto.me-0");
  // let makepdf = document.getElementById("body");
  // $("button.btn.btn-outline-primary.ms-auto.me-0").click(function (e) {
  //   e.preventDefault();
  //   // alert("");
  //   let mywindow = window.open("", "PRINT", "height=400,width=600");

  //   mywindow.document.write(makepdf.innerHTML);
  //   mywindow.document.close();
  //   mywindow.focus();
  //   window.print();
  //   mywindow.close();

  //   return true;
  // });
});
