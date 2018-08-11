var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var server = http.createServer(app);
const io = require('socket.io').listen(server);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
var cloudscraper = require('cloudscraper');
var mysql = require('mysql');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res) {
  res.render('index');
});

app.use(express.static('public'));

server.listen(9000, function() {
  console.log("Ready to Destory OP");
});

io.on('connection', function(socket) {
  socket.emit('connected', { description: "Connected!"});
  fs.readFile('opbeaneddata.json', function(err, data) {
  if (data != "") {
    var info = JSON.parse(data);
    socket.emit('prevdata', info);
    }
  });

floatSnipe();
function floatSnipe() {
  function OPfloats() {
  function OPbean(callback) {
    var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&sort=n&wear_range_high=0.1&wear_range_low=0.000000000001';
    cloudscraper.get(opfloatUrl, function (err, response, body) {
    if (err) throw err;
    if (body != undefined) {
      let dom = new JSDOM(body.toString());
      let bean = dom.window.document.getElementById('scroll');
      var bepis = $(bean).children();
      var list = [];
      if (bean != undefined) {
          for (i = 1; i < bepis.length; i++) {
            let boop = bepis[i];
            let wear = $(boop).children('div').children('div.text-center.wear-value').find('*').html();
            let listprice =  $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
            let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
            let skin = $(boop).children('div').children('a.market-name.market-link').html();
            let listing =  "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
              skin = skin.replace(/\n/g, '');
              wear = wear.replace(/%/g, '');
              wear = wear.replace(/Wear: /g, '');
              wear = parseFloat(wear) / 100;
              wear = wear.toFixed(7);
              sugprice = sugprice.slice(1);
              sugprice = parseFloat(sugprice) * 0.75;
              sugprice = sugprice.toFixed(2);
              sugprice = "$" + sugprice;
              var beaned = [];
	      var comb = [skin, wear, listprice, sugprice, listing];
             /* beaned.push(skin); //skin = skin;
              beaned.push(wear); //wear = wear;
              beaned.push(listprice); //listprice = listprice;
              beaned.push(sugprice); //sugprice = sugprice;
              beaned.push(listing); //listing = listing;*/
              list.push(comb);
              if (i === 35) {
                if(callback) callback(list);
		              console.log(beaned);
                }
              }
            }
          }
        });
      }
  (OPbean(function(callback) {
    console.log(callback);
    var values = callback;
    fs.writeFile('opbeaneddata.json', values, function(err) {
      if (err) throw err;
    });
    database(values);
    socket.emit('floatData', callback);
      setTimeout(function() {
        OPfloats();
      }));
      }
    OPfloats();
  }

function database() {
  console.log(values);
  console.log("what happened");
  var con = mysql.createConnection({
        host: 'opsniper.trade',
        user: 'root',
        password: '****',
        database: 'opsniper',
        multipleStatements: true
       });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
  });
}
