// let currentURL = window.location.href;
// let urlParts = currentURL.split("/");
// let thirdSlashPart = urlParts.slice(0, 3).join("/");
// let apiLink = thirdSlashPart;
let apiLink = "";
// if (apiLink == "https://skill-nexus.sankarsan.xyz") {
// if (apiLink == "https://skill-nexus.sankarsan.xyz") {
//   apiLink = "https://skill-nexus-api.sankarsan.xyz";
// }
//  else {
// apiLink += ":8000";
// apiLink = "http://127.0.0.1:8000";
// }
function toObj(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]["name"]] = arr[i]["value"];
  }
  return obj;
}

// Function to create a cookie
function createCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

// Function to read a cookie
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Function to delete a cookie
function deleteCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}

// get current user from cookie and save it to local storage
function on_page_load(reqs) {
  let current_theme = localStorage.getItem("theme");
  if (current_theme == "dark") {
    goDark();
    $("#theme").prop("checked", true);
  } else {
    goLight();
  }
  // sidebar activation
  $(`#sidebar ul li`).each(function () {
    a = this.child;
  });
  if (Array.isArray(reqs) && reqs.length) {
  } else {
    hide_loader();
  }
  $.ajax({
    type: "GET",
    url: apiLink + "/api/current_user",
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
  })
    .then(function (user) {
      localStorage.setItem("user", JSON.stringify(user));
      // $(".logged-in").removeClass("d-none");
      // $(`.u-${user.role}`).removeClass("d-none");
      // if (user.profile_picture) {
      //   $("#nav_con .profile-con .icon").addClass("d-none");
      //   $("#nav_con .profile-con").append(`
      //     <img src="${apiLink + user.profile_picture}" alt="">
      //   `);
      // }
      // check requierd user type

      if (reqs == "auth") {
        setTimeout(() => {
          if (user.status == "Suspended") {
            location.replace("/suspended");
          }
          location.replace("/profile");
          hide_loader();
        }, 10);
      } else if (Array.isArray(reqs) && reqs.length) {
        if (user.status == "Suspended") {
          location.replace("/suspended");
        }
        let status = false;
        reqs.map((req) => {
          if (user.role == req) {
            status = true;
          }
        });
        if (!status) {
          location.replace("/login");
        }
        hide_loader();
      } else {
        if (user.status == "Suspended") {
          location.replace("/suspended");
        }
        hide_loader();
      }
    })
    .catch(function (error) {
      //console.log(error);
      localStorage.removeItem("user");
      // $(".logged-out").removeClass("d-none");
      hide_loader();
      if (Array.isArray(reqs) && reqs.length && reqs != "auth") {
        location.replace("/login");
      }
    });
}

function get_user() {
  let ret = JSON.parse(localStorage.getItem("user"));
  return ret;
}

// on click logout
$(".logout").click(function (e) {
  e.preventDefault();
  // alert("logout");
  deleteCookie("token");
  localStorage.removeItem("user");

  location.replace("/logout");
});

// hide loader
function hide_loader() {
  // $(".loader-container").delay(10000).addClass("d-none");
  $(".loader-container").delay(10).fadeOut(100);
}

//profile pic click
$(".profile-con").click(function (e) {
  e.preventDefault();
  $(".profile-con .dropdown-menu").toggleClass("show");
});
// drop down item click
$(".dropdown-item").click(function (e) {
  e.preventDefault();
  let link = $(this).attr("href");
  location.replace(link);
});

// change theme to dark
function goDark() {
  $("#body").attr("data-bs-theme", "dark");
  $("body").css("--bg", "#293037");
  $("body").css("--bg2", "#293037db");
  $("body").css("--color", "#ffffff");
  $("body").addClass("theme-dark");
  $("body").removeClass("theme-light");
  $(".navbar-btn").addClass("btn-outline-light");
  $(".navbar-btn").removeClass("btn-outline-dark");
  $("nav.navbar").removeClass("navbar-light");
  $("nav.navbar").addClass("navbar-dark");
  $("nav.navbar").attr("data-bs-theme", "dark");
}
// change theme to light
function goLight() {
  $("#body").attr("data-bs-theme", "light");
  $("body").css("--bg", "#ECF0F1");
  $("body").css("--bg2", "#ECF0F1c7");
  // $("body").css("--bg", "#ffffff");
  // $("body").css("--bg2", "#ffffffc7");
  $("body").css("--color", "#000000");
  $("body").addClass("theme-light");
  $("body").removeClass("theme-dark");
  $(".navbar-btn").addClass("btn-outline-dark");
  $(".navbar-btn").removeClass("btn-outline-light");
  $("nav.navbar").removeClass("navbar-dark");
  $("nav.navbar").addClass("navbar-light");
  $("nav.navbar").attr("data-bs-theme", "light");
}

// change the on click
$("#theme").change(function (e) {
  // e.preventDefault();
  if ($(this).prop("checked")) {
    goDark();
    localStorage.setItem("theme", "dark");
  } else {
    goLight();
    localStorage.setItem("theme", "light");
  }
  // console.log($(this).prop("checked"));
});

// mobile view sidebar button click
$(".sidebar_btn i").click(function (e) {
  e.preventDefault();
  $("#sidebar").toggleClass("sidebar_open");
  $(".sidebar_btn i").toggleClass("fa-rotate-90");
  $(".sidebar_btn i").toggleClass("fa-rotate-270");
});
// hide sidebar
function hide_sidebar() {
  $("#sidebar").addClass("d-none");
  $("#body").addClass("ms-auto");
}

$("#body").append(`
      <footer class="footer-section">
      <div class="container">
        <div class="footer-cta pt-5">
          <div class="row">
            <div class="col-xl-4 col-md-4 mb-30">
              <div class="single-cta">
                <i class="far fa-envelope-open"></i>
                <div class="cta-text">
                  <h4>Mail us</h4>
                  <span>skillnexus@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-content pt-5 pb-1">
          <div class="row">
            <div class="col-xl-4 col-lg-4 mb-50">
              <div class="footer-widget">
                <br />
                <!-- <div class="footer-logo">
														<a href="index.html"><img src="./assets/images/logo.png" class="img-fluid" alt="logo"></a>
												</div> -->
                <div class="footer-text">
                  <p>
                    Skillnexus unlocks possibilities for students &
                    universities. Students: learn new skills with free videos,
                    find freelance gigs, and apply to universities - all in one
                    place. Universities: discover top talent, showcase programs,
                    and offer exciting opportunities. It's a win-win for
                    everyone involved!
                  </p>
                </div>
                <div class="footer-social-icon">
                  <span>Follow us</span>
                  <ul class="social_icon">
                    <li>
                      <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa-brands fa-twitter"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa-brands fa-instagram"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa-brands fa-youtube"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-lg-4 col-md-6 mb-30">
              <div class="footer-widget">
                <div class="footer-widget-heading">
                  <h3>Useful Links</h3>
                </div>
                <ul>
                  <li><a href="#">Our Team</a></li>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Our Gallery</a></li>
                  <li><a href="#">Selection Process</a></li>
                </ul>
              </div>
            </div>
            <div class="col-xl-4 col-lg-4 col-md-6 mb-50">
              <div class="footer-widget">
                <div class="footer-widget-heading">
                  <h3>Subscribe</h3>
                </div>
                <div class="footer-text mb-25">
                  <p>
                    Don’t miss to subscribe to our new feeds, kindly fill the
                    form below.
                  </p>
                </div>
                <div class="subscribe-form">
                  <form action="#">
                    <input type="text" placeholder="Email Address" />
                    <button><i class="fab fa-telegram-plane"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright-area">
        <div class="container">
          <div class="row">
            <div class="col-xl-6 col-lg-6 text-center text-lg-left">
              <div class="copyright-text">
                <p>
                  Copyright &copy; 2024, All Right Reserved
                  <a href="#">SkillNexus</a>
                </p>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 d-none d-lg-block text-right">
              <div class="footer-menu">
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Terms</a></li>
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Policy</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
`);

$(`#sidebar ul li`).each(function () {
  a = $(this).find("a");
  let linkUrl = a.attr("href");
  let curUrl = window.location.href;
  let parsedUrl = new URL(curUrl);
  let path = parsedUrl.pathname;
  path += "";
  linkUrl += "";
  // console.log(linkUrl);
  // console.log(path);
  if (path == linkUrl) {
    //console.log("path");
    $(this).addClass("active");
  }
});
function labelErrors(selector, e) {
  $(selector).each(function () {
    if (e[$(this).attr("name")]) {
      $(this).addClass("is-invalid");
      $(this).next("small.text-danger").text(e[$(this).attr("name")]);
    } else {
      $(this).removeClass("is-invalid");
      $(this).next("small.text-danger").text();
    }
  });
}

function collectData(selector) {
  let data = {};
  $(selector).each(function () {
    const name = $(this).attr("name");
    const type = $(this).attr("type");

    if (type === "file") {
      // Handle file inputs
      const files = $(this).prop("files");
      if (files.length > 0) {
        data[name] = files; // Save the FileList object
      } else {
        data[name] = null; // No file selected
      }
    } else {
      // Handle other inputs
      data[name] = $(this).val();
    }
  });

  // Add CSRF token if needed
  data["csrfmiddlewaretoken"] = getCookie("csrftoken");

  return data;
}

function loadData(selector, data) {
  $(selector).each(function () {
    $(this).val(data[$(this).attr("name")]);
  });
}

function formatDateTime(datetimeString) {
  const date = new Date(datetimeString);

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDateTime = date.toLocaleString("en-US", options);

  return formattedDateTime.replace(",", "");
}

function showToast(
  message,
  color = "primary",
  autohide = true,
  timeout = 5000
) {
  $(".toast-container").append(`
    <div class="toast align-items-center text-bg-${color} border-0 "
        role="alert"
        aria-live="assertive"
        data-bs-animation="true"
        data-bs-autohide="${autohide}"
        aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close" 
            ></button>
        </div>
    </div>
    `);
  if (autohide) {
    var newToast = $(".toast:last");

    newToast.show(1000);
    setTimeout(function () {
      newToast.hide(1000);
    }, timeout);
  }
}
$(document).on("click", ".toast button.btn-close", function (e) {
  e.preventDefault();
  $(this).closest(".toast").hide(1000);
});

// oldToastld toast

// function showToast(msg, bgc) {
//   $(".toast-container").append(`<div
//           class="toast align-items-center text-bg-${bgc} border-0"
//           role="alert"
//           aria-live="assertive"
//           aria-atomic="true"
//         >
//           <div class="d-flex">
//             <div class="toast-body">${msg}</div>
//             <button
//               type="button"
//               class="btn-close btn-close-white me-2 m-auto"
//               data-bs-dismiss="toast"
//               aria-label="Close"
//             ></button>
//           </div>
//         </div>`);
//   var newToast = $(".toast:last");
//   newToast.toast("show");
//   setTimeout(function () {
//     newToast.toast("hide");
//     newToast.remove(); // Remove the toast from the DOM after hiding
//   }, 3000);
// }
