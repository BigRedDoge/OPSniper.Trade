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
    OPCrimsonWeb();
});


function OPCrimsonWeb() {
    var values, flipflop, i;
    var opfloatUrl = ['https://opskins.com/?app=730_2&loc=shop_search&search_item=crimson+-gut%2Br8%2Bdesert%2Bauto%2Bscar%2Bdaggers%2Bfalchion%2Bgloves%2Bgalil%2Bp250&sort=n&wear_range_high=16&wear_range_low=15', 'https://opskins.com/?app=730_2&loc=shop_search&search_item=crimson+web+-gut+-r8+-desert+-auto+-scar+-daggers+-falchion&sort=n&wear_range_high=9&wear_range_low=7'];
    if (flipflop === undefined) {
        flipflop = 0;
    }
    if (flipflop === 0) {
        flipflop++;
    } else {
        flipflop--;
    }
    function OPbean(callback) {
        cloudscraper.get(opfloatUrl[flipflop], function(err, response, body) {
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
                        list.push(comb);
                        if (i === bepis.length - 1) {
                            if (callback) callback(list);
                        }
                    }
                }
            }
        });
    }
    (OPbean(function(callback) {
        values = callback.reverse();
        CrimsonWebDB(values);
        setTimeout(function() {
            OPCrimsonWeb();
        }, 14000);
    }));

    function CrimsonWebDB() {
        console.log(values);
        var check = [];
        for (i = 0; i < values.length; i++) {
            con.query("SELECT * FROM PrimaryDB WHERE listing = '" + values[i][4] + "'", function(err, result) {
                if (err) throw err;
                check.push(result.length);
                if (check.length === values.length - 1) {
                    for (var j = 0; j < check.length; j++) {
                        if (j === check.length - 1) {
                            //  tradeups();
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
}
