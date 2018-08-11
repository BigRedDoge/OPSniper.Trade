const puppeteer = require('puppeteer');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
const mysql = require('mysql');

const cookies = "****";

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '****.',
    database: 'opsniper',
    multipleStatements: true
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected to Database!');
  CHSnipe();
});

function CHSnipe() {

async function login() {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({width: 1200, height: 800});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
      window.open = (url) => {
        top.location = url;
      }
    });
    await page.setCookie(...cookies);
    let opsniper = async function opsnipe() {

    await page.waitFor(1000);

    await page.goto('https://opskins.com/?app=730_2&loc=shop_search&search_item=case+hardened&sort=n', {
      timeout: 0
    });

    await page.waitForNavigation();
    await page.waitFor(1500);

    let loop = async function looper() {
      let snipe = await page.evaluate(() => {
          var skinArr =[];
          var bean = document.getElementById('scroll');
          console.log(bean);
          var bepis = $(bean).children();
          if (bepis != undefined) {
            for (var i = 1; i < bepis.length; i++) {
              // Get Skin Data Elements
              let boop = bepis[i];
              let wear = ($(boop).children('div').children('div.text-center.wear-value').find('*').attr('title'));
              let listprice = $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
              let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
              let skin = $(boop).children('div').children('a.market-name.market-link').html();
              let listing = "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
              let inspect = $(boop).find('div > div.item-add-wear > div.item-buttons.text-center > a').attr('href');
              inspect = inspect.replace(/steam:/, '');
              skin = skin.replace(/\n/g, '');
              skin = skin.replace(/'/g, '');
              wear = wear.replace(/Raw Float Wear: /g, '');
              listing = listing.replace('https://', '');
              sugprice = sugprice.slice(1);
              sugprice = parseFloat(sugprice) * 0.75;
              sugprice = sugprice.toFixed(2);
              sugprice = "$" + sugprice;
              // Create Array of Skin Data
              var beaned = [skin, wear, listprice, sugprice, listing, inspect];
              skinArr.push(beaned);

              if (i === bepis.length - 1) {
                return skinArr;
              }
            }
         }
        });
        return snipe
      }
      loop().then((value) => {
        console.log(value);
        value = value.reverse();
        CaseHardDB(value);
        /*setTimeout(function() {
          opsnipe();
        }, 15000);*/
        function CaseHardDB() {
            console.log(value);
            var check = [];
            var link = [];
            var list = []
            for (i = 0; i < value.length; i++) {
                con.query("SELECT * FROM CHListings WHERE listing = '" + value[i][4] + "'", function(err, result) {
                    if (err) throw err;
                    check.push(result.length);
                    if (check.length === value.length) {
                      var linklength = link.length - 1;
                        for (var j = 0; j < check.length; j++) {
                            if (check[j] === 0) {
                                link.push(value[j][5]);
                                var patterns = {}
                                patterns.skin = value[j][0];
                                patterns.wear = value[j][1];
                                patterns.listprice = value[j][2];
                                patterns.sugprice = value[j][3];
                                patterns.listing = value[j][4];
                                patterns.inspect = value[j][5];
                                list.push(patterns);
                                var sql = "INSERT INTO CHListings (skin, wear, listprice, sugprice, listing, inspect) VALUES ('" + String(value[j][0]) + "', '" + String(value[j][1]) + "', '" + String(value[j][2]) + "', '" + String(value[j][3]) + "', '" + String(value[j][4]) + "', '" + String(value[j][5]) + "')";
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
                                            con.query("INSERT INTO CaseHardDB (skin, wear, pattern, listprice, sugprice, listing, inspect) VALUES ('" + list[x].skin + "', '" + list[x].wear + "', '" + list[x].pattern + "', '" + list[x].listprice + "', '" + list[x].sugprice + "', '" + list[x].listing + "', '" + list[x].inspect + "')",
                                            function(err, result) {
                                              if (err) throw err;
                                              console.log("CH Inserted With Patterns");
                                            });
                                            if (x === list.length - 1) {
                                              var gems = [];
                                              var newCH, oldCH, CHlength;
                                              con.query("SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM CaseHardDB WHERE EXISTS (SELECT * FROM CH WHERE pattern = CaseHardDB.pattern AND skin = CaseHardDB.skin)",
                                              function(err, result) {
                                                if (err) throw err;
                                                newCH = result.length;
                                                gems = JSON.stringify(result);
                                                con.query("SELECT * FROM GemsDB", function(err, result) {
                                                  if (err) throw err;
                                                  oldCH = result.length;
                                                  CHlength = newCH - oldCH;
                                                  con.query("INSERT INTO GemsDB (skin, wear, pattern, listprice, sugprice, listing, inspect) SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM CaseHardDB WHERE EXISTS (SELECT * FROM CH WHERE pattern = CaseHardDB.pattern AND skin = CaseHardDB.skin) ORDER BY id DESC LIMIT " + CHlength,
                                                  function(err, result) {
                                                    if (err) throw err;
                                                    console.log(result);
                                                    con.query("UPDATE GemsDB INNER JOIN CH ON GemsDB.skin = CH.skin AND GemsDB.pattern = CH.pattern SET GemsDB.tier = CH.tier WHERE GemsDB.tier IS NULL",
                                                    function(err, result) {
                                                      if (err) throw err;
                                                      console.log("Inserted Tier Ranking");
                                                      return gems;
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
      });
    //  await page.waitFor(10000);
      opsniper().then((value) => {
        setTimeout(function() {
          opsniper();
        }, 10000);
      })
    //  return snipe;
    }
      opsniper();
  }
login();
/*
  scrape().then((value) => {
    console.log(value);
    value = value.reverse();
    CaseHardDB(value);
    setTimeout(function() {
      CHSnipe();
    }, 15000);
    function CaseHardDB() {
        console.log(value);
        var check = [];
        var link = [];
        var list = []
        for (i = 0; i < value.length; i++) {
            con.query("SELECT * FROM CHListings WHERE listing = '" + value[i][4] + "'", function(err, result) {
                if (err) throw err;
                check.push(result.length);
                if (check.length === value.length) {
                  var linklength = link.length - 1;
                    for (var j = 0; j < check.length; j++) {
                        if (check[j] === 0) {
                            link.push(value[j][5]);
                            var patterns = {}
                            patterns.skin = value[j][0];
                            patterns.wear = value[j][1];
                            patterns.listprice = value[j][2];
                            patterns.sugprice = value[j][3];
                            patterns.listing = value[j][4];
                            patterns.inspect = value[j][5];
                            list.push(patterns);
                            var sql = "INSERT INTO CHListings (skin, wear, listprice, sugprice, listing, inspect) VALUES ('" + String(value[j][0]) + "', '" + String(value[j][1]) + "', '" + String(value[j][2]) + "', '" + String(value[j][3]) + "', '" + String(value[j][4]) + "', '" + String(value[j][5]) + "')";
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
                                        con.query("INSERT INTO CaseHardDB (skin, wear, pattern, listprice, sugprice, listing, inspect) VALUES ('" + list[x].skin + "', '" + list[x].wear + "', '" + list[x].pattern + "', '" + list[x].listprice + "', '" + list[x].sugprice + "', '" + list[x].listing + "', '" + list[x].inspect + "')",
                                        function(err, result) {
                                          if (err) throw err;
                                          console.log("CH Inserted With Patterns");
                                        });
                                        if (x === list.length - 1) {
                                          var gems = [];
                                          var newCH, oldCH, CHlength;
                                          con.query("SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM CaseHardDB WHERE EXISTS (SELECT * FROM CH WHERE pattern = CaseHardDB.pattern AND skin = CaseHardDB.skin)",
                                          function(err, result) {
                                            if (err) throw err;
                                            newCH = result.length;
                                            gems = JSON.stringify(result);
                                            con.query("SELECT * FROM GemsDB", function(err, result) {
                                              if (err) throw err;
                                              oldCH = result.length;
                                              CHlength = newCH - oldCH;
                                              con.query("INSERT INTO GemsDB (skin, wear, pattern, listprice, sugprice, listing, inspect) SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM CaseHardDB WHERE EXISTS (SELECT * FROM CH WHERE pattern = CaseHardDB.pattern AND skin = CaseHardDB.skin) ORDER BY id DESC LIMIT " + CHlength,
                                              function(err, result) {
                                                if (err) throw err;
                                                console.log(result);
                                                con.query("UPDATE GemsDB INNER JOIN CH ON GemsDB.skin = CH.skin AND GemsDB.pattern = CH.pattern SET GemsDB.tier = CH.tier WHERE GemsDB.tier IS NULL",
                                                function(err, result) {
                                                  if (err) throw err;
                                                  console.log("Inserted Tier Ranking");
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
  });
  */
}
