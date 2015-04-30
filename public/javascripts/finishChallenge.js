$( document ).ready(function() {
  $('#receiptOpen').click(function(e) {
    e.preventDefault();
    $('.receipt').slideToggle();
  });
});