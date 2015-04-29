$( document ).ready(function() {

  var money = 5000.00;
  var popup;

  $('#money').html('$' + money.toString());

  $('#oAuthBeginLink').on('click', function(e) {
    e.preventDefault();
    
    var w = 550;
    var h = 550;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);

    popup = window.open($(this).data('url'), 'Dwolla OAuth', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);

    setInterval(function() {
      money -= .83;
      $('#money').html('$' + money.toFixed(2));
    }, 100);
  });

  window.addEventListener('message', function(event) {
    alert(event.data);
    location = '/finishChallenge?money=' + money.toString();
    popup.close();
  }, false);

});