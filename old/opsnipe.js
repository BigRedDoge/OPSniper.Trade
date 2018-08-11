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
    OPTradeUp();
});

function OPTradeUp() {
    var values, i;
    function OPbean(callback) {
        var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&sort=n&wear_range_high=1&wear_range_low=0.0000000001';
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
                        skin = skin.replace(/\n/g, '');
                        skin = skin.replace(/'/g, '');
                        listing = listing.replace('https://', '');
                        sugprice = sugprice.slice(1);
                        sugprice = parseFloat(sugprice) * 0.75;
                        sugprice = sugprice.toFixed(2);
                        sugprice = "$" + sugprice;
                        var comb = [skin, wear, listprice, sugprice, listing, inspect];
                        console.log(comb);
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
        TradeUpDB(values);
        setTimeout(function() {
            OPfloats();
        }, 14000);
    }));

function TradeUpDB() {
    console.log(values);
    var check = [];
    for (i = 0; i < values.length; i++) {
        con.query("SELECT * FROM PrimaryDB WHERE listing = '" + values[i][4] + "'", function(err, result) {
            if (err) throw err;
            check.push(result.length);
            if (check.length === values.length - 1) {
                for (var j = 0; j < check.length; j++) {
                    if (j === check.length - 1) {
                        TradeUps();
                    }
                    if (check[j] === 0) {
                        var sql = "INSERT INTO PrimaryDB (skin, wear, listprice, sugprice, listing) VALUES ('" + String(values[j][0]) + "', '" + String(values[j][1]) + "', '" + String(values[j][2]) + "', '" + String(values[j][3]) + "', '" + String(values[j][4]) + "')";
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

function TradeUps() {
    var oldFood, newFood, newLength;
    con.query("SELECT skin, wear, sugprice, listprice, listing FROM PrimaryDB WHERE EXISTS (SELECT * FROM Food WHERE skin = PrimaryDB.skin AND wear > PrimaryDB.wear)", function(err, result) {
        if (err) throw err;
        newFood = result.length;
        console.log("ok");
        con.query("SELECT * FROM TradeUpDB", function(err, result) {
            if (err) throw err;
            oldFood = result.length;
            newLength = newFood - oldFood;
            console.log(newLength);
            con.query("INSERT INTO TradeUpDB (skin, wear, sugprice, listprice, listing) SELECT skin, wear, sugprice, listprice, listing FROM PrimaryDB WHERE EXISTS (SELECT * FROM Food WHERE skin = PrimaryDB.skin AND wear > PrimaryDB.wear) ORDER BY id DESC LIMIT " + newLength, function(err, result) {
                if (err) throw err;
                console.log(result);
                console.log("Success");
                con.query("UPDATE TradeUpDB INNER JOIN Food ON TradeUpDB.skin = Food.skin SET TradeUpDB.rarity = Food.rarity, TradeUpDB.collection = Food.collection WHERE TradeUpDB.rarity IS NULL AND TradeUpDB.collection IS NULL",
                function(err, result) {
                  if (err) throw err;
                  console.log("Inserted Tier Ranking")
                });
            });
        });
    });
  }
}
