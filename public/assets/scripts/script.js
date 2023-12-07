$(document).ready(function() {
  $(window).scroll(function(event) {
    let scroll = $(this).scrollTop();
    let opacity = 1 - scroll / 750;
    if (opacity >= 0) {
      $('#top').css('opacity', opacity);
    }
  });
});
