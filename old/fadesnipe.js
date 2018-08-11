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
    OPFade();
});

function OPFade() {
    var values, i;
    function OPbean(callback) {
      var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=kara%7Cm9+fade+-marble&sort=n&type=k';
        cloudscraper.get(opfloatUrl, function(err, response, body) {
            if (err) throw err;
            setTimeout(function() {
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
                        skin = skin.replace(/\n/g, '');
                        skin = skin.replace(/'/g, '');
                        listing = listing.replace('https://', '');
                        sugprice = sugprice.slice(1);
                        sugprice = parseFloat(sugprice) * 0.75;
                        sugprice = sugprice.toFixed(2);
                        sugprice = "$" + sugprice;
                        var comb = [skin, wear, listprice, sugprice, listing, inspect];
                        list.push(comb);
                        if (i === 35) {
                            if (callback) callback(list);
                        }
                    }
                }
            }
          }, 1000);
        });
    }
    (OPbean(function(callback) {
        values = callback.reverse();
        database(values);
        setTimeout(function() {
            OPFade();
        }, 14000);
    }));

function database() {
    console.log(values);
    var check = [];
    var link = [];
    var list = []
    for (i = 0; i < values.length; i++) {
        con.query("SELECT * FROM FadeListings WHERE listing = '" + values[i][4] + "'", function(err, result) {
            if (err) throw err;
            check.push(result.length);
            if (check.length === values.length - 1) {
              var linklength = link.length - 1;
                for (var j = 0; j < check.length; j++) {
                    if (check[j] === 0) {
                        link.push(values[j][5]);
                        var patterns = {}
                        patterns.skin = values[j][0];
                        patterns.wear = values[j][1];
                        patterns.listprice = values[j][2];
                        patterns.sugprice = values[j][3];
                        patterns.listing = values[j][4];
                        patterns.inspect = values[j][5];
                        list.push(patterns);
                        console.log(link.length);
                        var sql = "INSERT INTO FadeListings (skin, wear, listprice, sugprice, listing, inspect) VALUES ('" + values[j][0] + "', '" + values[j][1] + "', '" + values[j][2] + "', '" + values[j][3] + "', '" + values[j][4] + "', '" + values[j][5] + "')";
                        con.query(sql, function(err, result) {
                            if (err) throw err;
                            console.log("Skin Inserted Into Database");
                        });
                    }
                    if (j === check.length - 1) {
                      setTimeout(function() {
                      call();
                        function call() {
                          $.ajax({
                              url: 'http://katos.trade:1739/?url=steam:' + link[link.length - 1],
                              dataType: 'json',
                              success: function(response) {
                                console.log(response.iteminfo.paintseed);
                                list[link.length - 1].pattern = response.iteminfo.paintseed;
                                link.pop();
                                if (link.length != 0) {
                                  call();
                                } else {
                                  console.log("noice");
                                  console.log(list);
                                  for (var x = 0; x < list.length; x++) {
                                    con.query("INSERT INTO FadePatterns (skin, wear, pattern, listprice, sugprice, listing, inspect) VALUES ('" + list[x].skin + "', '" + list[x].wear + "', '" + list[x].pattern + "', '" + list[x].listprice + "', '" + list[x].sugprice + "', '" + list[x].listing + "', '" + list[x].inspect + "')",
                                    function(err, result) {
                                      if (err) throw err;
                                      console.log("Fades Inserted With Patterns");
                                    });
                                    if (x === list.length - 1) {
                                      var fadearr = [];
                                      var newF, oldF, Flength;
                                      con.query("SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM FadePatterns WHERE EXISTS (SELECT * FROM FADE WHERE pattern = FadePatterns.pattern AND skin = FadePatterns.skin)",
                                      function(err, result) {
                                        if (err) throw err;
                                        newF = result.length;
                                        fadearr = JSON.stringify(result);
                                        con.query("SELECT * FROM FadeDB", function(err, result) {
                                          if (err) throw err;
                                          oldF = result.length;
                                          Flength = newF - oldF;
                                          con.query("INSERT INTO FadeDB (skin, wear, pattern, listprice, sugprice, listing, inspect) SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM FadePatterns WHERE EXISTS (SELECT * FROM FADE WHERE pattern = FadePatterns.pattern AND skin = FadePatterns.skin) ORDER BY id DESC LIMIT " + Flength,
                                          function(err, result) {
                                            if (err) throw err;
                                            console.log(result);
                                            con.query("UPDATE FadeDB INNER JOIN FADE ON FadeDB.skin = FADE.skin AND FadeDB.pattern = FADE.pattern SET FadeDB.fade = FADE.fade WHERE FadeDB. IS NULL AND TradeUpDB.collection IS NULL",
                                            function(err, result) {
                                              if (err) throw err;
                                              console.log("Inserted Tier Ranking")
                                            });
                                          });
                                        });
                                      });
                                    }
                                  }
                                }
                              }
                          });
                        }
                    }, 500);
                  }
                }
            }
        });
    }
  }
}
