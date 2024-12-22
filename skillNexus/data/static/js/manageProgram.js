// program session add
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
      // if success go to program session page
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

// click application view
$(".application-view").click(function (e) {
  e.preventDefault();
  $(this).addClass("loading");
  let id = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: apiLink + "/api/university/program/application/" + id,
    success: function (res) {
      // if success show application details in modal
      // Remove loading class from the button
      $(e.target).closest(".btn").removeClass("loading");

      // Populate applicant details in the modal
      $("#applicantModal .modal-body .application_id").html(
        res.applicant.application_id
      );
      $("#applicantModal .modal-body .student_name").html(
        res.applicant.student_name
      );
      $("#applicantModal .modal-body .student_id").html(
        res.applicant.student_id
      );
      $("#applicantModal .modal-body .email").html(res.applicant.email);
      $("#applicantModal .modal-body .mobile").html(res.applicant.mobile);
      $("#applicantModal .modal-body .country").html(res.applicant.country);

      // Create and set status badge with appropriate styling
      let statusBadge = $("<span>")
        .addClass("badge")
        .addClass("rounded-pill ")
        .addClass(
          res.applicant.status === "Accepted"
            ? "bg-success"
            : res.applicant.status === "Rejected"
            ? "bg-danger"
            : "bg-info"
        )
        .text(res.applicant.status);
      $("#applicantModal .modal-body .status").html(statusBadge);

      // Populate session name, comments, and timestamps
      $("#applicantModal .modal-body .session_name").html(
        res.applicant.session_name
      );
      $("#applicantModal .modal-body .comment").val(res.applicant.comment);
      $("#applicantModal .modal-body .created_at").html(
        formatDateTime(res.applicant.created_at)
      );
      $("#applicantModal .modal-body .updated_at").html(
        formatDateTime(res.applicant.updated_at)
      );
      // create educations table rows
      let educationsHtml = "";
      // create trainings table rows
      let trainingsHtml = "";
      // create experiences table rows
      let experiencesHtml = "";
      // loop through educations and create table rows
      $.map(res.educations, function (education, indexOrKey) {
        educationsHtml += `
          <tr>
            <td>${indexOrKey + 1}</td>
            <td>${education.degree}</td>
            <td>${education.level}</td>
            <td>${education.major}</td>
            <td>${education.institute}</td>
            <td>${education.passing_year}</td>
            <td>
              ${
                education.result_type === "Grade"
                  ? parseFloat(education.gpa).toFixed(2) +
                    " out of " +
                    parseFloat(education.gpa_scale).toFixed(2)
                  : education.result
              }
            </td>
          </tr>
        `;
      });
      // Loop through trainings and create table rows
      $.map(res.trainings, function (training, indexOrKey) {
        // Start constructing table row for each training
        trainingsHtml += `
          <tr>
            <!-- Display training index -->
            <td>${indexOrKey + 1}</td>
            <!-- Display training title -->
            <td>${training.title}</td>
            <!-- Display institution name -->
            <td>${training.institution_name}</td>
            <!-- Display country name -->
            <td>${training.country}</td>
            <!-- Display training duration -->
            <td>${training.duration_year} year${
          training.duration_year > 1 ? "s" : ""
        } ${training.duration_month} month${
          training.duration_month > 1 ? "s" : ""
        } ${training.duration_day} day${
          training.duration_day > 1 ? "s" : ""
        }</td>
            <!-- Display start date -->
            <td>${formatDateTime(training.start_date)}</td>
            <!-- Display end date -->
            <td>${formatDateTime(training.end_date)}</td>
          </tr>
          `;
      });

      // loop through experiences and create table rows
      $.map(res.experiences, function (experience, indexOrKey) {
        experiencesHtml += `
          <tr>
            <!-- Display experience index -->
            <td>${indexOrKey + 1}</td>
            <!-- Display designation -->
            <td>${experience.designation}</td>
            <!-- Display department name -->
            <td>${experience.department}</td>
            <!-- Display organisation name -->
            <td>${experience.organisation_name}</td>
            <!-- Display location -->
            <td>${experience.location}</td>
            <!-- Display duration -->
            <td>${experience.duration_year} year${
          experience.duration_year > 1 ? "s" : ""
        } ${experience.duration_month} month${
          experience.duration_month > 1 ? "s" : ""
        } ${experience.duration_day} day${
          experience.duration_day > 1 ? "s" : ""
        }</td>
            <!-- Display start date -->
            <td>${formatDateTime(experience.start_date)}</td>
            <!-- Display end date -->
            <td>${formatDateTime(experience.end_date)}</td>
          </tr>
          `;
      });

      // Create footer buttons based on application status
      let footerHtml = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-info btn-comment" data-bs-dismiss="modal">Add Comment</button>`;

      if (res.applicant.status === "Pending") {
        // If pending, show approve and reject buttons
        footerHtml += `<button type="button" class="btn btn-success btn-approve">Accept</button>
        <button type="button" class="btn btn-danger btn-reject">Reject</button> `;
      } else if (res.applicant.status === "Approved") {
        // If approved, only show reject button
        footerHtml += `<button type="button" class="btn btn-danger btn-reject">Reject</button> `;
      } else if (res.applicant.status === "Rejected") {
        // If rejected, only show approve button
        footerHtml += `<button type="button" class="btn btn-success btn-approve">Accept</button> `;
      }
      // Add footer buttons to modal
      $("#applicantModal .modal-footer ").html(footerHtml);

      // fix empty table
      // if educations table is empty, add a row that says "No education"
      if (educationsHtml === "") {
        educationsHtml = "<tr><td colspan='7'>No education</td></tr>";
      }
      // if trainings table is empty, add a row that says "No training"
      if (trainingsHtml === "") {
        trainingsHtml = "<tr><td colspan='8'>No training</td></tr>";
      }
      // if experiences table is empty, add a row that says "No experience"
      if (experiencesHtml === "") {
        experiencesHtml = "<tr><td colspan='8'>No experience</td></tr>";
      }
      // add education table to modal
      $("#applicantModal .modal-body #educations").html(educationsHtml);
      // add training table to modal
      $("#applicantModal .modal-body #trainings").html(trainingsHtml);
      // add experience table to modal
      $("#applicantModal .modal-body #experiences").html(experiencesHtml);
      // add footer buttons to modal
      $("#applicantModal .modal-footer ").html(footerHtml);

      // show modal
      $("#applicantModal").modal("show");
    },

    error: function (e) {
      showToast("Something went wrong, try again.", "danger");
    },
  });
});

$(document).on(
  "click",
  ".btn-comment , .btn-approve , .btn-reject",
  function (e) {
    e.preventDefault();
    let data = {
      comment: $("#applicantModal .modal-body textarea.comment").val(),
      id: $("#applicantModal .modal-body td.application_id").html(),
    };

    if ($(this).hasClass("btn-reject")) {
      data["status"] = "Rejected";
    } else if ($(this).hasClass("btn-approve")) {
      data["status"] = "Accepted";
    }
    $.ajax({
      url: "/api/university/program/application/" + data["id"],
      type: "POST",
      data: data,
      success: function (res) {
        showToast("Comment added successfully.", "success");
        $("#applicantModal").modal("hide");
      },
      error: function (e) {
        showToast("Something went wrong, try again.", "danger");
      },
    });
  }
);

// search applicants
$(document).on("keyup", "#applicantSearch", function (e) {
  var search = $(this).val().toLowerCase();
  const rows = $("#applicantsTable tr");
  $.each(rows, function (indexInArray, row) {
    const cells = $(row).find("td");
    if (cells.eq(1).text().toLowerCase().includes(search)) $(row).show();
    else if (cells.eq(2).text().toLowerCase().includes(search)) $(row).show();
    else if (cells.eq(3).text().toLowerCase().includes(search)) $(row).show();
    else if (cells.eq(4).text().toLowerCase().includes(search)) $(row).show();
    else if (cells.eq(5).text().toLowerCase().includes(search)) $(row).show();
    else if (cells.eq(6).text().toLowerCase().includes(search)) $(row).show();
    else if (cells.eq(7).text().toLowerCase().includes(search)) $(row).show();
    else $(row).hide();
  });
});
