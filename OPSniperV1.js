const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'opsniper.trade',
    user: 'root',
    password: 'MYSQL_PASSWORD',
    database: 'opsniper',
    multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
    Launch();
});

function Launch() {
  console.log("Launching Scripts");
  OPTradeUp();
  setTimeout(function() {
    OPCaseHard();
  }, 2250);
  setTimeout(function() {
    OPSapph();
  }, 4500);
  setTimeout(function() {
    OPBlackiimov();
  }, 6750);
  setTimeout(function() {
    OPAsiimov();
  }, 9000);
  setTimeout(function() {
    OPCrimsonWeb();
  }, );
}

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
            OPTradeUp();
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
//skin, wear, sugprice, listprice, listing
function TradeUps() {
    var oldFood, newFood, newLength;
    con.query("SELECT * FROM PrimaryDB WHERE EXISTS (SELECT * FROM Food WHERE skin = PrimaryDB.skin AND wear > PrimaryDB.wear)", function(err, result) {
        if (err) throw err;
        newFood = result.length;
        console.log("ok");
        con.query("SELECT * FROM TradeUpDB", function(err, result) {
            if (err) throw err;
            oldFood = result.length;
            newLength = newFood - oldFood;
            console.log(newLength);
            con.query("INSERT INTO TradeUpDB (skin, wear, sugprice, listprice, listing) SELECT skin, wear, sugprice, listprice, listing FROM PrimaryDB WHERE EXISTS (SELECT * FROM Food WHERE skin = PrimaryDB.skin AND wear > PrimaryDB.wear) ORDER BY id DESC LIMIT " + newLength,
            function(err, result) {
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

function OPFireIce() {
    var values, i;
    function OPbean(callback) {
      var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=marble+fade+-gut+-falchion+-shadow+-huntsman+-bowie+-m9+-butterfly+-&sort=n';
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
        FireIceDB(values);
        OPFade();
        setTimeout(function() {
            OPFireIce();
        }, 14000);
    }));
function FireIceDB() {
    console.log(values);
    var check = [];
    var link = [];
    var list = [];
    for (i = 0; i < values.length; i++) {
        con.query("SELECT * FROM FIListings WHERE listing = '" + values[i][4] + "'", function(err, result) {
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
                        var sql = "INSERT INTO FIListings (skin, wear, listprice, sugprice, listing, inspect) VALUES ('" + values[j][0] + "', '" + values[j][1] + "', '" + values[j][2] + "', '" + values[j][3] + "', '" + values[j][4] + "', '" + values[j][5] + "')";
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
                                    con.query("INSERT INTO FIPatterns (skin, wear, pattern, listprice, sugprice, listing, inspect) VALUES ('" + list[x].skin + "', '" + list[x].wear + "', '" + list[x].pattern + "', '" + list[x].listprice + "', '" + list[x].sugprice + "', '" + list[x].listing + "', '" + list[x].inspect + "')",
                                    function(err, result) {
                                      if (err) throw err;
                                      console.log("Marble Fades Inserted With Patterns");
                                    });
                                    if (x === list.length - 1) {
                                      var fireice = [];
                                      var newFI, oldFI, FIlength;
                                      con.query("SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM FIPatterns WHERE EXISTS (SELECT * FROM FI WHERE pattern = FIPatterns.pattern AND skin = FIPatterns.skin)",
                                      function(err, result) {
                                        if (err) throw err;
                                        newFI = result.length;
                                        fireice = JSON.stringify(result);
                                        con.query("SELECT * FROM FireIceDB", function(err, result) {
                                          if (err) throw err;
                                          oldFI = result.length;
                                          FIlength = newFI - oldFI;
                                          con.query("INSERT INTO FireIceDB (skin, wear, pattern, listprice, sugprice, listing, inspect) SELECT skin, wear, pattern, listprice, sugprice, listing, inspect FROM FIPatterns WHERE EXISTS (SELECT * FROM FI WHERE pattern = FIPatterns.pattern AND skin = FIPatterns.skin) ORDER BY id DESC LIMIT " + FIlength,
                                          function(err, result) {
                                            if (err) throw err;
                                            console.log(result);
                                            con.query("UPDATE FireIceDB INNER JOIN FI ON FireIceDB.skin = FI.skin AND FireIceDB.pattern = FI.pattern SET FireIceDB.max = FI.max WHERE FireIceDB.max IS NULL",
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
        FadeDB(values);
        OPCaseHard();
        setTimeout(function() {
            OPFade();
        }, 14000);
    }));

function FadeDB() {
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
                                            con.query("UPDATE FadeDB INNER JOIN FADE ON FadeDB.skin = FADE.skin AND FadeDB.pattern = FADE.pattern SET FadeDB.fade = FADE.fade WHERE FadeDB.max IS NULL AND TradeUpDB.collection IS NULL",
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

function OPCaseHard() {
    var values, i;
    function OPbean(callback) {
      var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=ak-47%7Cfive-seven%7Ckarambit%7Cbayonet%7Cflip+case+hardened&sort=n';
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
          }, 2000);
        });
    }
    (OPbean(function(callback) {
        values = callback.reverse();
        CaseHardDB(values);
        setTimeout(function() {
            OPCaseHard();
        }, 14000);
    }));

function CaseHardDB() {
    console.log(values);
    var check = [];
    var link = [];
    var list = []
    for (i = 0; i < values.length; i++) {
        con.query("SELECT * FROM CHListings WHERE listing = '" + values[i][4] + "'", function(err, result) {
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
                        var sql = "INSERT INTO CHListings (skin, wear, listprice, sugprice, listing, inspect) VALUES ('" + String(values[j][0]) + "', '" + String(values[j][1]) + "', '" + String(values[j][2]) + "', '" + String(values[j][3]) + "', '" + String(values[j][4]) + "', '" + String(values[j][5]) + "')";
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

function OPBlackiimov() {
    var values, i;
    function OPbean(callback) {
        var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=awp+asiimov&sort=n&wear_range_high=100&wear_range_low=90';
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
        BlackiimovDB(values);
        setTimeout(function() {
            OPBlackiimov();
        }, 14000);
    }));

    function BlackiimovDB() {
        console.log(values);
        var check = [];
        for (i = 0; i < values.length; i++) {
            con.query("SELECT * FROM PrimaryDB WHERE listing = '" + values[i][4] + "'", function(err, result) {
                if (err) throw err;
                check.push(result.length);
                if (check.length === values.length - 1) {
                    for (var j = 0; j < check.length; j++) {
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

function OPAsiimov() {
    var values, i;
    function OPbean(callback) {
        var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=asiimov+-p90+-p250&sort=n&wear_range_high=20&wear_range_low=18';
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
        AsiimovDB(values);
        setTimeout(function() {
            OPAsiimov();
        }, 14000);
    }));

    function AsiimovDB() {
        console.log(values);
        var check = [];
        for (i = 0; i < values.length; i++) {
            con.query("SELECT * FROM PrimaryDB WHERE listing = '" + values[i][4] + "'", function(err, result) {
                if (err) throw err;
                check.push(result.length);
                if (check.length === values.length - 1) {
                    for (var j = 0; j < check.length; j++) {
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
