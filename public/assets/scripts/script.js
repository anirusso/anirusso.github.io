$(document).ready(function() {
  $(window).scroll(function(event) {
    let scroll = $(this).scrollTop();
    let opacity = 1 - scroll / 1500;
    if (opacity >= 0) {
      $('#top').css('opacity', opacity);
    }
  });
});
