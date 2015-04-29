$( document ).ready(function() {

  var money = 5000.00;
  var popup;

  $('#moneyBox').html('$' + money.toFixed(2));

  $('#oAuthBeginLink').on('click', function(e) {
    e.preventDefault();
    
    var w = 550;
    var h = 550;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);

    popup = window.open($(this).data('url'), 'Dwolla OAuth', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);

    setInterval(function() {
      money -= .83;
      $('#moneyBox').html('$' + money.toFixed(2));
    }, 100);

    // move things around:
    $('#mainbox').css('display', 'none');
    $('.timeBox').css('display', 'block');
    $('.container').css('position', 'absolute');
    $('.container').css('width', '342px');
  });

  window.addEventListener('message', function(event) {
    location = '/finishChallenge?challengeId=' + event.data.challengeId;
    popup.close();

  }, false);

});