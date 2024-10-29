let timer = setInterval(slide, 18000);

function slide() {
  let next = $("#slider .myslide.show").attr("next");
  $("#slider .myslide.show").removeClass("show");
  $(`#slider .myslide${next}`).addClass("show");
}

function slideBack() {
  console.log("back");
  let back = $("#slider .myslide.show").attr("next");
  $("#slider .myslide.show").removeClass("show");
  $(`#slider .myslide${back}`).addClass("show");
}

function slideShow(n) {
  console.log("object");
  $("#slider .myslide.show").removeClass("show");
  $(`#slider .myslide${n}`).addClass("show");
}

// function dot(n) {
//   $("#slideer .showing").removeClass("showing");
//   $(`#slider .dot`).each(function () {
//     const target = $(this).attr("target");
//     if (target == n) {
//       $(this).addClass("showing");
//     }
//   });
// }

$("#slider .dot").click(function (e) {
  e.preventDefault();
  const target = $(this).attr("target");
  $("#slider .myslide.show").removeClass("show");
  $(`#slider .myslide${target}`).addClass("show");
});
