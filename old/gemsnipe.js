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
    OPSapph();
});

function OPSapph() {
    var values, i, y;
    var gems = [];
    function OPbean(callback) {
        var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=doppler&sort=n';
        cloudscraper.get(opfloatUrl, function(err, response, body) {
            if (err) throw err;
            if (body != undefined) {
                let dom = new JSDOM(body.toString());
                let bean = dom.window.document.getElementById('scroll');
                var bepis = $(bean).children();
                var list = [];
                if (bean != undefined) {
                    for (i = 1; i < bepis.length; i++) {
                        let boop = bepis[i];
                        let wear = ($(boop).children('div').children('div.text-center.wear-value').find('*').attr('title')).replace(/Raw Float Wear: /g, '');
                        let listprice = $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
                        let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
                        let skin = $(boop).children('div').children('a.market-name.market-link').html();
                        let listing = "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
                        let inspect = $(boop).find('div > div.item-add-wear > div.item-buttons.text-center > a').attr('href').replace(/steam:/, '');
                        let gem = $(boop).find('div > div.item-desc > small').text();
                        skin = skin.replace(/\n/g, '');
                        skin = skin.replace(/'/g, '');
                        listing = listing.replace('https://', '');
                        sugprice = sugprice.slice(1);
                        sugprice = parseFloat(sugprice) * 0.75;
                        sugprice = sugprice.toFixed(2);
                        sugprice = "$" + sugprice;
                        var comb = [skin, wear, listprice, sugprice, listing, inspect, gem];
                        list.push(comb);
                        if (i === 35) {
                          if (callback) callback(list);
                        }
                    }
                }
            }
        });
    }
    (OPbean(function(callback) {
      values = callback.reverse();
      gemFilter(values);
      function gemFilter() {
        gems = [];
        for (var z = 0; z < values.length; z++) {
          if (values[z][6] === "Factory New★ Covert Knife (Sapphire)") {
            values[z].splice(6, 7);
            values[z][0] = values[z][0].replace(/Doppler/, 'Sapphire');
            gems.push(values[z]);
          } else if (values[z][6] === "Factory New★ Covert Knife (Ruby)") {
            values[z][0] = values[z][0].replace(/Doppler/, 'Ruby');
            values[z].splice(6, 7);
            gems.push(values[z]);
          } else if (values[z][6] === "Factory New★ Covert Knife (Black Pearl)") {
            values[z][0] = values[z][0].replace(/Doppler/, 'Black Pearl');
            values[z].splice(6, 7);
            gems.push(values[z]);
          } else if (values[z][6] === "Factory New★ Covert Knife (Emerald)") {
            values[z][0] = values[z][0].replace(/Gamma Doppler/, 'Emerald');
            values[z].splice(6, 7);
            gems.push(values[z]);
          }
          if (z === values.length - 1) {
            SapphDB(gems);
          }
        }
      }
        setTimeout(function() {
            OPSapph();
        }, 14000);
    }));

function SapphDB() {
  console.log(gems);
  var check = [];
  for (y = 0; y < gems.length; y++) {
      con.query("SELECT * FROM PrimaryDB WHERE listing = '" + gems[y][4] + "'", function(err, result) {
          if (err) throw err;
          check.push(result.length);
            if (check.length === gems.length) {
                for (var j = 0; j < check.length; j++) {
                    if (check[j] === 0) {
                        var sql = "INSERT INTO PrimaryDB (skin, wear, listprice, sugprice, listing) VALUES ('" + String(gems[j][0]) + "', '" + String(gems[j][1]) + "', '" + String(gems[j][2]) + "', '" + String(gems[j][3]) + "', '" + String(gems[j][4]) + "')";
                        con.query(sql, function(err, result) {
                            if (err) throw err;
                            console.log("Skin Inserted Into Database");
                        });
                     }
                  }
              }
        });
    }
  }
}
