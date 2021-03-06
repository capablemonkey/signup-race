$( document ).ready(function() {
  var money = 5000.00;
  var popup;
  var timer;
  var moneyInterval;

  $('#moneyBox').html('$' + money.toFixed(2));

  $('#oAuthBeginLink').on('click', function(e) {
    e.preventDefault();
    
    var w = 550;
    var h = 550;
    var left = (screen.width/2);
    var top = (screen.height/2)-(h/2);

    popup = window.open($(this).data('url'), 'Dwolla OAuth', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);

    moneyInterval = setInterval(function() {
      money -= 3.83;
      $('#moneyBox').html('$' + money.toFixed(2));
    }, 100);

    timer = new Timer($('#time'), 115);
    timer.start();

    // move things around:
    $('#mainbox').css('display', 'none');
    $('.timeBox').css('display', 'block');
    $('.container').css('position', 'absolute');
    $('.container').css('width', '342px');
  });

  window.addEventListener('message', function(event) {
    location = '/finishChallenge?challengeId=' + event.data.challengeId + '&money=' + money.toFixed(2) + '&time=' + timer.timeMS;
    popup.close();
    timer.stop();
    clearInterval(moneyInterval);

  }, false);
});

function Timer(element, interval) {
  this.timeMS = 0;
  this.intervalID = null;

  interval = interval || 115;

  this.start = function() {
    that = this;
    this.intervalID = setInterval(function() {
      that.timeMS += interval;
      element.html(formatTime(that.timeMS));
    }, interval);
  };

  this.stop = function() {
    clearInterval(this.intervalID);
  };
}

function formatTimeWords(ms) {
  min = Math.floor(ms / (1000 * 60));
  sec = Math.floor((ms / 1000) % 60);

  return (min > 0 ? min + ' minutes, ': '') + sec + ' seconds';
}

function formatTime(ms) {
  min = Math.floor(ms / (1000 * 60));
  sec = Math.floor((ms / 1000) % 60);
  mils = ms % 1000;

  return min + ':' + pad(sec, 2) + '.' + pad(mils, 3);
}

function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(0) + n;
}