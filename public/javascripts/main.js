var socket = io.connect('https://opsniper.trade', {secure: true});

var sqldata;

var dogeConfig = {
  user: "Doge"
}
var nawtyConfig = {
  user: "Nawty"
}

var Selector;

$(document).ready(function() {
  for (var z = 0; z < notifisounds.length; z++) {
    new Audio(notifisounds[z]);
  }
  setTimeout(function() {
    if (!Notification) {
      $('#useralert').empty();
      $('#useralert').fadeIn().append('<div class="alert alert-danger fade in" id="alertmsg"></div>');
      $('#alertmsg').empty().append("Your Browser Doesn't Support Notifications");
      $('#useralert').css("display", "inline-block");
      setTimeout(function() {
        $('#useralert').fadeOut()
        $('#alertmsg').fadeOut();
      }, 5000);
    }
    if (Notification.permission !== 'granted') {
      $('#useralert').empty();
      $('#useralert').fadeIn().append('<div class="alert alert-info fade in" id="alertmsg"></div>');
      $('#alertmsg').empty().append("Requesting Permission to Display Notifications");
      $('#useralert').css("display", "inline-block");
      Notification.requestPermission();
      setTimeout(function() {
        $('#useralert').fadeOut()
        $('#alertmsg').fadeOut();
        if (Notification.permission === 'granted') {
          $('#useralert').empty();
          $('#useralert').fadeIn().append('<div class="alert alert-success fade in" id="alertmsg"></div>');
          $('#alertmsg').empty().append("Notifications Have Been Turned On!");
          $('#useralert').css("display", "inline-block");
          setTimeout(function() {
            $('#useralert').fadeOut()
            $('#alertmsg').fadeOut();
          }, 5000);
        }
      }, 5000);
    }
  }, 3000);
});

socket.on('connect', function(data) {
  socket.emit('join', "Hello there");
  console.log("Connected to Server!");
  $('#useralert').empty();
  $('#useralert').fadeIn().append('<div class="alert alert-success fade in" id="alertmsg"></div>');
  $('#alertmsg').empty().append("Connected to Server!");
  $('#useralert').css("display", "inline-block");
  setTimeout(function() {
    $('#useralert').fadeOut()
    $('#alertmsg').fadeOut();
  }, 5000);
});

socket.on('usersonline', function(data) {
  console.log(data);
  $('.navbar-text').empty();
  $('.navbar-text').append("Users Online:");
  $('.navbar-text').append(" " + data);
});

socket.on('connected', function(data) {

});

socket.on('disconnect', function() {
  $('#useralert').empty();
  $('#useralert').fadeIn().append('<div class="alert alert-danger fade in" id="alertmsg"></div>');
  $('#alertmsg').empty().append("Disconnected From Server!");
  $('#useralert').css("display", "inline-block");
});

socket.on('prevdata', function(data) {
  for (var i = 0; i < data.length; i++) {
  //  notify(data[i].skin, data[i].wear, data[i].tier, data[i].listprice, data[i].sugprice, data[i].listing);
    $('#dataTable').append("<tr><td id='skin'>" + data[i].skin + "</td> <td id='float'>" + data[i].wear + "</td><td id='pattern'>" + data[i].pattern + "</td><td id='tier'>" + data[i].tier + "</td><td id='price'>" + data[i].listprice + "</td><td id='estprice'>" + data[i].sugprice + "</td><td id='datetime'>" + data[i].date + "</td><td id='metjm'><a role='button' class='btn btn-primary btn-xs' target='_blank' href=https://metjm.net/#" + data[i].inspect + ">metjm</a></td>" + "<td id='listinglink'><a role='button' class='btn btn-primary btn-xs' target='_blank' href=https://" + data[i].listing + ">OPS Link</a></td><td id='confirm'><a role='button' class='btn btn-primary btn-xs' onclick='logPurchase(" + (data[i].listing).replace('opskins.com/?loc=shop_view_item&item=', '') + ")' id='" + (data[i].listing).replace('opskins.com/?loc=shop_view_item&item=', '') + "'>Sniped</a></td></tr>");
  }
});

socket.on('refresh', function(data) {
  console.log("refresh")
  console.log(data);
  for (var y = 0; y < data.length; y++) {
    notify(data[y].skin, data[y].wear, data[y].tier, data[y].listprice, data[y].sugprice, data[y].listing);
    $('#dataTable').fadeIn().prepend("<tr></div><td id='skin'>" + data[y].skin + "</td> <td id='float'>" + data[y].wear + "</td><td id='pattern'>" + data[y].pattern + "</td><td id='tier'>" + data[y].tier + "</td><td id='price'>" + data[y].listprice + "</td><td id='estprice'>" + data[y].sugprice + "</td><td id='datetime'>" + data[y].date + "</td><td id='metjm'><a role='button' class='btn btn-primary btn-xs' target='_blank' href=https://metjm.net/#" + data[y].inspect + ">metjm</a></td>" + "<td id='listinglink'><a role='button' class='btn btn-primary btn-xs' target='_blank' href=https://" + data[y].listing + ">OPS Link</a></td><td id='confirm'><a role='button' class='btn btn-primary btn-xs' onclick='logPurchase(" + (data[y].listing).replace('opskins.com/?loc=shop_view_item&item=', '') + ")' id='" + (data[y].listing).replace('opskins.com/?loc=shop_view_item&item=', '') + "'>Sniped</a></td></tr>");
    var newListing = new Promise(function(resolve, reject) {
      var findlisting = $(document).find('#listinglink > a')[0];
      var firstlisting = ($(findlisting).attr("href")).replace('opskins.com/?loc=shop_view_item&item=', '').replace('https://', '')
      $("#" + firstlisting).parent().parent().addClass("bg-success");
      resolve(firstlisting);
    });
    newListing.then(function(value) {
      console.log("Highlighted New Listing!");
      console.log(value);
      setTimeout(function() {
        $("#" + value).parent().parent().removeClass("bg-success");
      }, 25000);
    });
  }
});

function dogeSelect() {
  $('#useralert').empty();
  $('#useralert').fadeIn().append('<div class="alert alert-success fade in" id="alertmsg"></div>');
  $('#alertmsg').empty().append("Doge's purchases are being recorded");
  $('#useralert').css("display", "inline-block");
  Selector = dogeConfig;
  setTimeout(function() {
    $('#useralert').fadeOut()
    $('#alertmsg').fadeOut();
  }, 5000);
}

function nawtySelect() {
  $('#useralert').empty();
  $('#useralert').fadeIn().append('<div class="alert alert-success fade in" id="alertmsg"></div>');
  $('#alertmsg').empty().append("Nawty's purchases are being recorded");
  $('#useralert').css("display", "inline-block");
  Selector = nawtyConfig;
  setTimeout(function() {
    $('#useralert').fadeOut()
    $('#alertmsg').fadeOut();
  }, 5000);
}

function logPurchase(linkid) {
  console.log(linkid);
  var link = "opskins.com/?loc=shop_view_item&item=" + linkid;
  if (Selector.user === undefined) {
    $('#useralert').empty();
    $('#useralert').fadeIn().append('<div class="alert alert-danger fade in" id="alertmsg"></div>');
    $('#alertmsg').empty().append("Select who you are before submiting purchases!");
    $('#useralert').css("display", "inline-block");
    setTimeout(function() {
      $('#useralert').fadeOut()
      $('#alertmsg').fadeOut();
    }, 5000);
  } else {
    Selector.link = link;
    socket.emit('userpurchase', Selector);
  }
}

socket.on('confirmedsnipe', function(data) {
  $('#useralert').empty();
  $('#useralert').fadeIn().append('<div class="alert alert-success fade in" id="alertmsg"></div>');
  $('#alertmsg').empty().append(data);
  $('#useralert').css("display", "inline-block");
  setTimeout(function() {
    $('#useralert').fadeOut()
    $('#alertmsg').fadeOut();
  }, 5000);
});

socket.on('snipeconfirmerror', function(data) {
  $('#useralert').empty();
  $('#useralert').fadeIn().append('<div class="alert alert-danger fade in" id="alertmsg"></div>');
  $('#alertmsg').empty().append(data);
  $('#useralert').css("display", "inline-block");
  setTimeout(function() {
    $('#useralert').fadeOut()
    $('#alertmsg').fadeOut();
  }, 5000);
});

var notifisounds = ["audio/I\ am\ the\ Senate.mp3", "audio/A\ fine\ addition\ to\ my\ collection.mp3", "audio/Anakin Skywalker\ -\ Liar.mp3", "audio/Anakins\ Yippee.mp3", "audio/attemptonmylife..m4a", "audio/Darth\ SidiousEmperor\ Palpatine\ -\ Its\ treason\ then.mp3", "audio/generalkenobi.mp3", "audio/I\ Have\ the\ High\ Ground.mp3", "audio/Obi-Wan\ -\ Another\ happy\ landing.mp3", "audio/Obi-Wan\ -\ Hello\ there.mp3",
"audio/POWAAAAAAAAAAAAAAAAHHHHHHHHHH\ UNLIMITED\ POWAAAAAAHHHHHHHHHHH.mp3", "audio/Senator\ Palpatine\ -\ Do\ it.mp3", "audio/The\ Tragedy\ of\ Darth\ Plagueis\ The\ Wise\ HD\ Star\ Wars\ Episode\ III\ Revenge\ of\ The\ Sith\ (1).mp3", "audio/well\ whaddya\ know.mp3", "audio/The\ Tragedy\ of\ Darth\ Plagueis\ The\ Wise\ HD\ Star\ Wars\ Episode\ III\ Revenge\ of\ The\ Sith.mp3", "audio/This\ is\ where\ the\ fun\ begins.mp3"];

function notify(skin, wear, tier, listprice, sugprice, listing) {
  if (((parseFloat(listprice.replace('$', ''))) <
   (parseFloat(sugprice.replace('$', '')) * 1.20) && ((parseFloat(sugprice.replace('$', '')) <= 20))) || ((parseFloat(listprice.replace('$', ''))) <
   (parseFloat(sugprice.replace('$', '')) * 1.10)) && (parseFloat(sugprice.replace('$', '')) > 20) && Boolean(tier.includes("Ruby")) === false && Boolean(tier.includes("Sapphire")) === false
   && Boolean(tier.includes("Black Pearl")) === false && Boolean(tier.includes("Emerald")) === false) {
    console.log("Pushing Notification of Snipe!");
    var newsound = new Audio(notifisounds[Math.floor(Math.random() * 16)]);
    console.log(newsound);
    (newsound).play();
    var float = parseFloat(wear).toFixed(5)
    var notification = new Notification(skin, {
      icon: "https://opsniper.trade/favicon.ico",
      body: "Price: " + listprice + ", Wear: " + float + ", Tier: " + tier
    });
    notification.onclick = function() {
      window.open("https://" + listing);
    }
  }
}
