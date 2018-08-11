var socket = io.connect('https://opsniper.trade', {secure: true});

var Selector = {};
var rccid;

$(document).ready(function() {
  socket.on('AllPurchases', function(data) {
    for (var i = 0; i < data.length; i++) {
      var id = (data[i].listing).replace('opskins.com/?loc=shop_view_item&item=', '');
      $('#purchasetable').prepend("<tr id=" + id + " onclick='submitid(" + id +")'><td>" + data[i].user + "</td><td>" + data[i].skin + "</td><td>" + data[i].wear + "</td><td>" + data[i].tier + "</td><td>" + data[i].listprice + "</td><td>" + data[i].sellprice + "</td><td>" + data[i].profit + "</td>"
      +"<td><div class='dropdown'> <button type='button' class='btn bbtn btn-sm btn-light border border-dark dropdown-toggle' data-toggle='dropdown'> + </button><div class='dropdown-menu'><h5 class='dropdown-header'>" + data[i].skin + "<div class='dropdown-divider'></div><a class='dropdown-item' href='https://" + data[i].listing + "' target='_blank'> Listing Link </a><div class='dropdown-divider'></div><a class='dropdown-item' href='https://" + data[i].salelink + "' target='_blank'> Sale Link </a><div class='dropdown-divider'></div><a class='dropdown-item' href='" + data[i].inspect + "' target='_blank'>Inspect Link </a></div></div></td></tr>");
    }
  });
});

socket.on('connect', function(data) {
  socket.emit('join', "User on Purchase Page");
  socket.emit('requestpurchases', "Requesting User Purchases");
});

function submitid(id) {
    $("#" + rccid).removeClass("bg-success");
    $("#" + id).addClass("bg-success");
    $('#purchaseid').val(id);
    rccid = id;
}

socket.emit('Calc');

socket.on('Calculations', function(data) {
  $('#').empty();
  var calc = JSON.parse(JSON.stringify(data));
  console.log(calc);
  $('#totalpurchased').append("$" + data.Total.cost);
  $('#totalsalecost').append("$" + data.SalesTotal.cost);
  $('#totalunsold').append("$" + data.Total.unsold);
  $('#totalsold').append("$" + data.Total.sales);
  $('#totalprofit').append("$" + data.Total.profit);
  $('#dogepurchased').append("$" + data.DogeTotal.cost);
  $('#dogeonsale').append("$" + data.DogeTotal.unsold);
  $('#dogesales').append("$" + data.DogeTotal.sales);
  $('#dogeprofit').append("$" + data.DogeTotal.profit);
  $('#nawtypurchased').append("$" + data.NawtyTotal.cost);
  $('#nawtyonsale').append("$" + data.NawtyTotal.unsold);
  $('#nawtysales').append("$" + data.NawtyTotal.sales);
  $('#nawtyprofit').append("$" + data.NawtyTotal.profit);
});

function myFunction(id) {
    document.getElementById(id).classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function Sniped(snipe, sale, price) {
  this.snipelink = snipe;
  this.salelink = sale;
  this.saleprice = price;
}

function submitSale() {
  var pl = "opskins.com/?loc=shop_view_item&item=" + $('#purchaseid').val();
  console.log(pl);
  var sl = ($('#salelink').val()).replace('https://', '');
  var sp = $('#saleprice').val();
  if (pl !== undefined && sl !== undefined && sp !== undefined) {
    var UpdateSnipe = new Sniped(pl, sl, sp);
    socket.emit('salelog', UpdateSnipe);
    ResetTable();
  }
}

socket.on('updatedsale', function(data) {
  console.log(data);
});

function SearchTable() {
  var query = ($('#searchbarinput').val()).toUpperCase();
  console.log(query);
  var table = ($('#purchasetable').children().toArray());
  for (var x = 0; x < table.length; x++) {
    if (Boolean((($(table[x]).children().text()).toUpperCase()).includes(query)) === true) {
      console.log(x + 1); console.log(($(table[x]).html()));
    } else {
      $(table[x]).css('display', 'none')  }
  }
}

function ResetTable() {
  $('#purchasetable').empty();
  socket.emit('requestpurchases', "Requesting User Purchases");
}

function userSelect() {
  if ($('#userselect').val() === "1") {
    Selector.user = "Doge";
    console.log("Doge Selected");
  } else if ($('#userselect').val() === "2") {
    Selector.user = "Nawty";
    console.log("Nawty Selected");
  }
}

function logPurchase() {
  var link = $('#purchaselink').val();
  link = link.replace('https://', '');
  console.log(link);
  if (Selector.user === undefined) {
    console.log("No User Selected");
    $('#alertmsg').empty().append('<h1> Select who you are before submiting purchases! </h1>');
    $('#useralert').css("display", "inline");
    setTimeout(function() {
      $('#useralert').css("display", "none");
    }, 5000);
  } else {
    Selector.link = link;
    socket.emit('userpurchase', Selector);
  }
}

socket.on('snipeconfirmerror', function(data) {
  $('#useralert').css("display", "inline");
  $('#alertmsg').empty().append(data);
  setTimeout(function() {
    $('#useralert').css("display", "none");
  }, 5000);
});

socket.on('confirmedsnipe', function(data) {
  $('#useralert').css("display", "inline");
  $('#alertmsg').empty().append(data);
  setTimeout(function() {
    $('#useralert').css("display", "none");
  }, 5000);
});

function CostSort(sortType) {
  var table = ($('#purchasetable').children().toArray());
  var tablelength = table.length;
  var pricing = new Promise(function(resolve, reject) {
    var pricearr = [];
    var tablelength = table.length;
    for (var i = 0; i < tablelength; i++) {
      var price = parseFloat(($($(table[i]).children()[4]).text()).replace('$', ''));
      pricearr.push({
        id: ($($(table)[i]).attr('id')),
        price: (price)
      });
    }
    resolve (pricearr);
  });
  pricing.then((prices) => {
    if (sortType === "hightolow") {
      $('#cost').attr("onclick", "CostSort('lowtohigh')");
      var highsort = (prices).sort(function(a, b) { return b.price - a.price });
      var tablesort = new Promise(function(resolve, reject) {
        var highhtml = [];
        for (var x = 0; x < highsort.length; x++) {
          var itemhtml = "<tr id='" + highsort[x].id + "' onclick=submitid(" +
          parseFloat(((highsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + highsort[x].id)).html() +
           "</tr>";
          highhtml.push(itemhtml);
        }
        resolve (highhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    } else if (sortType === "lowtohigh") {
      $('#cost').attr("onclick", "CostSort('hightolow')");
      var lowsort = (prices).sort(function(a, b) { return a.price - b.price });
      var tablesort = new Promise(function(resolve, reject) {
        var lowhtml = [];
        for (var x = 0; x < lowsort.length; x++) {
          var itemhtml = "<tr id='" + lowsort[x].id + "' onclick=submitid(" +
          parseFloat(((lowsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + lowsort[x].id)).html() +
           "</tr>";
          lowhtml.push(itemhtml);
        }
        resolve (lowhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    }
  });
}

function ProfitSort(sortType) {
  var table = ($('#purchasetable').children().toArray());
  var tablelength = table.length;
  var pricing = new Promise(function(resolve, reject) {
    var pricearr = [];
    var tablelength = table.length;
    for (var i = 0; i < tablelength; i++) {
      var price = parseFloat(($($(table[i]).children()[6]).text()).replace('$', ''));
      if (Boolean(price) === true) {
        pricearr.push({
          id: ($($(table)[i]).attr('id')),
          price: (price)
        });
      }
    }
    resolve (pricearr);
  });
  pricing.then((prices) => {
    if (sortType === "hightolow") {
      $('#profit').attr("onclick", "ProfitSort('lowtohigh')");
      var highsort = (prices).sort(function(a, b) { return b.price - a.price });
      var tablesort = new Promise(function(resolve, reject) {
        var highhtml = [];
        for (var x = 0; x < highsort.length; x++) {
          var itemhtml = "<tr id='" + highsort[x].id + "' onclick=submitid(" +
          parseFloat(((highsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + highsort[x].id)).html() +
           "</tr>";
          highhtml.push(itemhtml);
        }
        resolve (highhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    } else if (sortType === "lowtohigh") {
      $('#profit').attr("onclick", "ProfitSort('hightolow')");
      var lowsort = (prices).sort(function(a, b) { return a.price - b.price });
      var tablesort = new Promise(function(resolve, reject) {
        var lowhtml = [];
        for (var x = 0; x < lowsort.length; x++) {
          var itemhtml = "<tr id='" + lowsort[x].id + "' onclick=submitid(" +
          parseFloat(((lowsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + lowsort[x].id)).html() +
           "</tr>";
          lowhtml.push(itemhtml);
        }
        resolve (lowhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    }
  });
}

function SaleSort(sortType) {
  var table = ($('#purchasetable').children().toArray());
  var tablelength = table.length;
  var pricing = new Promise(function(resolve, reject) {
    var pricearr = [];
    var tablelength = table.length;
    for (var i = 0; i < tablelength; i++) {
      var price = parseFloat(($($(table[i]).children()[5]).text()).replace('$', ''));
      if (Boolean(price) === true) {
        pricearr.push({
          id: ($($(table)[i]).attr('id')),
          price: (price)
        });
      }
    }
    resolve (pricearr);
  });
  pricing.then((prices) => {
    if (sortType === "hightolow") {
      $('#sale').attr("onclick", "SaleSort('lowtohigh')");
      var highsort = (prices).sort(function(a, b) { return b.price - a.price });
      var tablesort = new Promise(function(resolve, reject) {
        var highhtml = [];
        for (var x = 0; x < highsort.length; x++) {
          var itemhtml = "<tr id='" + highsort[x].id + "' onclick=submitid(" +
          parseFloat(((highsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + highsort[x].id)).html() +
           "</tr>";
          highhtml.push(itemhtml);
        }
        resolve (highhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    } else if (sortType === "lowtohigh") {
      $('#sale').attr("onclick", "SaleSort('hightolow')");
      var lowsort = (prices).sort(function(a, b) { return a.price - b.price });
      var tablesort = new Promise(function(resolve, reject) {
        var lowhtml = [];
        for (var x = 0; x < lowsort.length; x++) {
          var itemhtml = "<tr id='" + lowsort[x].id + "' onclick=submitid(" +
          parseFloat(((lowsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + lowsort[x].id)).html() +
           "</tr>";
          lowhtml.push(itemhtml);
        }
        resolve (lowhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    }
  });
}

function WearSort(sortType) {
  var table = ($('#purchasetable').children().toArray());
  var tablelength = table.length;
  var pricing = new Promise(function(resolve, reject) {
    var pricearr = [];
    var tablelength = table.length;
    for (var i = 0; i < tablelength; i++) {
      var price = parseFloat($($(table[i]).children()[2]).text());
      if (Boolean(price) === true) {
        pricearr.push({
          id: ($($(table)[i]).attr('id')),
          price: (price)
        });
      }
    }
    resolve (pricearr);
  });
  pricing.then((prices) => {
    if (sortType === "hightolow") {
      $('#wear').attr("onclick", "WearSort('lowtohigh')");
      var highsort = (prices).sort(function(a, b) { return b.price - a.price });
      var tablesort = new Promise(function(resolve, reject) {
        var highhtml = [];
        for (var x = 0; x < highsort.length; x++) {
          var itemhtml = "<tr id='" + highsort[x].id + "' onclick=submitid(" +
          parseFloat(((highsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + highsort[x].id)).html() +
           "</tr>";
          highhtml.push(itemhtml);
        }
        resolve (highhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    } else if (sortType === "lowtohigh") {
      $('#wear').attr("onclick", "WearSort('hightolow')");
      var lowsort = (prices).sort(function(a, b) { return a.price - b.price });
      var tablesort = new Promise(function(resolve, reject) {
        var lowhtml = [];
        for (var x = 0; x < lowsort.length; x++) {
          var itemhtml = "<tr id='" + lowsort[x].id + "' onclick=submitid(" +
          parseFloat(((lowsort[x].id).replace('#', ''))) + ")>" +
          $($('#purchasetable').find('#' + lowsort[x].id)).html() +
           "</tr>";
          lowhtml.push(itemhtml);
        }
        resolve (lowhtml);
      });
      tablesort.then((html) => {
        var sorting = new Promise(function(resolve, reject) {
          var sorted = html;
          $('#purchasetable').empty();
          resolve (sorted);
        });
        sorting.then((sorted) => {
          for (var z = 0; z < sorted.length; z++) {
            $('#purchasetable').append(sorted[z]);
          }
        });
      });
    }
  });
}
