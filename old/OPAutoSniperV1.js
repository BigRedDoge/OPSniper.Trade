const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
const mysql = require('mysql');
const date = require('date-and-time');

const now = new Date();

var queue = [];
queueloop();

var cookies = "****";

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '****',
    database: 'opsniper',
    multipleStatements: true
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected to Database!');
  CHSnipe();
});

function CHSnipe() {

  let scrape = async function login() {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({width: 1200, height: 800});
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3188.0 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
      window.open = (url) => {
        top.location = url;
      }
    });

    await page.setCookie(...cookies);
    await page.goto('https://opskins.com/?app=730_2&loc=shop_search&search_item=%28Case+Hardened%29%7C%28Karambit+Fade%29%7C%28%22M9+Bayonet+%7C+Fade%22%29%7C%28%22Bayonet+%7C+Marble+Fade%22%29%7C%28%22Flip+Knife+%7C+Marble+Fade%22%29%7C%28%E2%98%85+Crimson+Web+Field-Tested+%29%7C%28%E2%98%85+Crimson+Web+Minimal+Wear%29%7C%28AWP+%7C+Asiimov+Field-Tested%29%7C%28M4A4+%7C+Asiimov+Field-Tested%29%7C%28AWP+%7C+Asiimov+Battle-Scarred%29%7C%28Doppler%29+-Gloves&sort=n&wear_range_high=100&wear_range_low=0.000000000001', {
      timeout: 0
    });

    await page.waitForSelector('#scroll');
    //console.log(await page.cookies());
    //await page.waitFor(1500);

    let snipe = await page.evaluate(() => {
        var skinArr =[];
        var bean = document.getElementById('scroll');
        console.log(bean);
        var bepis = $(bean).children();
        if (bepis != undefined) {
          var bepislength = bepis.length;
          for (var i = 1; i < bepislength; i++) {
            // Get Skin Data Elements
            let boop = bepis[i];
            let wear = ($(boop).children('div').children('div.text-center.wear-value').find('*').attr('title'));
            let listprice = $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
            let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
            let skin = $(boop).children('div').children('a.market-name.market-link').html();
            let listing = "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
            let inspect = $(boop).find('div > div.item-add-wear > div.item-buttons.text-center > a').attr('href');
            let gem = $(boop).find('div > div.item-desc > small').text();
            let accountbalance = $('body > div.content-fluid.nav-push > nav > div.container-fluid.nav-container-fluid > div.navbar-header > div.navbar-brand.navbar-rigth.visible-lg.visible-md.visible-sm > div.coin-count > a > span.op-count').text();
            if (wear !== undefined)  {
            inspect = inspect.replace(/steam:/, '');
            skin = skin.replace(/\n/g, '');
            skin = skin.replace(/'/g, '');
            wear = wear.replace(/Raw Float Wear: /g, '');
            listing = listing.replace('https://', '');
            sugprice = sugprice.slice(1);
            sugprice = parseFloat(sugprice);
            sugprice = sugprice.toFixed(2);
            sugprice = "$" + sugprice;
            // Create Array of Skin Data
            var beaned = [skin, wear, listprice, sugprice, listing, inspect, gem, accountbalance];
            skinArr.push(beaned);
          }
            if (i === bepis.length - 1) {
              return skinArr;
            }
          }
       }
      });
      await browser.close();
      return snipe;
  }

  scrape().then((value) => {
    //console.log(value);
  //  value = value.reverse();
    CaseHardDB(value);
    setTimeout(function() {
      FloatSnipe();
    }, 10000);
    function CaseHardDB() {
//      console.log(value);
        var check = [];
        var link = [];
        var list = []
        for (i = 0; i < value.length; i++) {
            con.query("SELECT * FROM PrimaryListings WHERE listing = '" + value[i][4] + "'", function(err, result) {
                if (err) throw err;
                check.push(result.length);
                if (check.length === value.length) {
                  var linklength = link.length - 1;
                      var checklength = check.length;
                      Organize();
                      function Organize() {
                        if (check[checklength - 1] === 0) {
                            link.push(value[checklength - 1][5]);
                            var patterns = {}
                            patterns.skin = value[checklength - 1][0];
                            patterns.wear = value[checklength - 1][1];
                            patterns.listprice = value[checklength - 1][2];
                            patterns.sugprice = value[checklength - 1][3];
                            patterns.listing = value[checklength - 1][4];
                            patterns.inspect = value[checklength - 1][5];
                            patterns.balance = value[checklength - 1][7];
                            var gem = value[checklength - 1][6];
                            list.push(patterns);
                            if ((patterns.skin).includes("Case Hardened")||(patterns.skin).includes("Fade")) {
                              queue.push(patterns);
                            }
                            if ((patterns.skin).includes("Crimson Web")) {
                              if ((parseFloat(patterns.wear)).toFixed(3) > 0.15 && (parseFloat(patterns.wear)).toFixed(3) < 0.16) {
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float CW" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                              if ((parseFloat(patterns.wear)).toFixed(2) == 0.07 || (parseFloat(patterns.wear)).toFixed(2) == 0.08 || (parseFloat(patterns.wear)).toFixed(2) == 0.09) {
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float CW" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                            }
                            if ((patterns.skin).includes("Asiimov")) {
                              if ((patterns.skin).includes("AWP | Asiimov")) {
                                if ((parseFloat(patterns.wear)).toFixed(2) >= 0.90) {
                                  con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Blackiimov" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                  function(err, result) {
                                    if (err) throw err;
                                    console.log("Inserted " + patterns.skin + " into Snipe Database");
                                  });
                                }
                              }
                              if ((patterns.skin).includes("AWP | Asiimov")) {
                                if ((parseFloat(patterns.wear)).toFixed(2) <= 0.20) {
                                  con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float Asii" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                  function(err, result) {
                                    if (err) throw err;
                                    console.log("Inserted " + patterns.skin + " into Snipe Database");
                                  });
                                }
                              }
                              if ((patterns.skin).includes("M4A4 | Asiimov") && (parseFloat(patterns.wear)).toFixed(2) <= 0.24) {
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float Asii" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                            }
                            if ((patterns.skin).includes("Doppler")) {
                              if (gem === "Factory New★ Covert Knife (Sapphire)") {
                                patterns.skin = (patterns.skin).replace(/Doppler/, 'Sapphire');
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Sapphire" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              } else if (gem === "Factory New★ Covert Knife (Ruby)") {
                                patterns.skin = (patterns.skin).replace(/Doppler/, 'Ruby');
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Ruby" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              } else if (gem === "Factory New★ Covert Knife (Black Pearl)") {
                                patterns.skin = (patterns.skin).replace(/Doppler/, 'Black Pearl');
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Black Pearl" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              } else if (gem === "Factory New★ Covert Knife (Emerald)") {
                                patterns.skin = (patterns.skin).replace(/Gamma Doppler/, 'Emerald');
                                con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Emerald" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              }
                            }
                            con.query("INSERT INTO PrimaryListings (skin, wear, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                            function(err, result) {
                              if (err) throw err;
                              console.log("Inserted " + patterns.skin + " into Listings Database");
                              checklength = checklength - 1;
                              if (checklength != 0) {
                                Organize();
                              }
                            });
                        } else {
                          checklength = checklength - 1;
                          if (checklength != 0) {
                            Organize();
                          }
                        }
                      }
                }
            });
        }
      }
  });
}

function FloatSnipe() {
    let scrape = async function login() {

      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();

      await page.setViewport({width: 1200, height: 800});
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3188.0 Safari/537.36');
      await page.evaluateOnNewDocument(() => {
        window.open = (url) => {
          top.location = url;
        }
      });

      await page.setCookie(...cookies);
      await page.goto('https://opskins.com/?app=730_2&loc=shop_search&search_item=-turf&sort=n&wear_range_high=1&wear_range_low=0.000000000001', {
        timeout: 0
      });

      await page.waitForSelector('#scroll');
      //console.log(await page.cookies());
      //await page.waitFor(1500);

      let snipe = await page.evaluate(() => {
          var skinArr =[];
          var bean = document.getElementById('scroll');
          console.log(bean);
          var bepis = $(bean).children();
          if (bepis != undefined) {
            var bepislength = bepis.length;
            for (var i = 1; i < bepislength; i++) {
              // Get Skin Data Elements
              let boop = bepis[i];
              let wear = ($(boop).children('div').children('div.text-center.wear-value').find('*').attr('title'));
              let listprice = $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
              let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
              let skin = $(boop).children('div').children('a.market-name.market-link').html();
              let listing = "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
              let inspect = $(boop).find('div > div.item-add-wear > div.item-buttons.text-center > a').attr('href');
              let gem = $(boop).find('div > div.item-desc > small').text();
              let accountbalance = $('body > div.content-fluid.nav-push > nav > div.container-fluid.nav-container-fluid > div.navbar-header > div.navbar-brand.navbar-rigth.visible-lg.visible-md.visible-sm > div.coin-count > a > span.op-count').text();
              if (wear !== undefined)  {
              console.log(accountbalance);
              inspect = inspect.replace(/steam:/, '');
              skin = skin.replace(/\n/g, '');
              skin = skin.replace(/'/g, '');
              wear = wear.replace(/Raw Float Wear: /g, '');
              listing = listing.replace('https://', '');
              sugprice = sugprice.slice(1);
              sugprice = parseFloat(sugprice) * .75;
              sugprice = sugprice.toFixed(2);
              sugprice = "$" + sugprice;
              // Create Array of Skin Data
              var beaned = [skin, wear, listprice, sugprice, listing, inspect, gem, accountbalance];
              skinArr.push(beaned);
            }
              if (i === bepis.length - 1) {
                return skinArr;
              }
            }
         }
        });
        await browser.close();
        return snipe;
    }

scrape().then((value) => {
  FloatSnipeDB(value);
  setTimeout(function() {
      CHSnipe();
  }, 10000);
  function FloatSnipeDB() {
    var check = [];
    var link = [];
    var list = []
    for (i = 0; i < value.length; i++) {
    var checklength;

        con.query("SELECT * FROM PrimaryListings WHERE listing = '" + value[i][4] + "'", function(err, result) {
            if (err) throw err;
            check.push(result.length);
            if (check.length === value.length) {
              var linklength = link.length - 1;
              checklength = check.length;
              Organize();
            }
          });
                  function Organize() {
                    if (check[checklength - 1] === 0) {
                        link.push(value[checklength - 1][5]);
                        var patterns = {};
                        patterns.skin = value[checklength - 1][0];
                        patterns.wear = value[checklength - 1][1];
                        patterns.listprice = value[checklength - 1][2];
                        patterns.sugprice = value[checklength - 1][3];
                        patterns.listing = value[checklength - 1][4];
                        patterns.inspect = value[checklength - 1][5];
                        patterns.balance = value[checklength - 1][7];
                        var gem = value[checklength - 1][6];
                        list.push(patterns);
                        console.log(patterns);
                        con.query("INSERT INTO PrimaryListings (skin, wear, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                        function(err, result) {
                          if (err) throw err;
                          console.log("Inserted " + patterns.skin + " into Listings Database");
                          checklength = checklength - 1;
                          con.query("SELECT skin, wear, grade, collection FROM FloatDB WHERE skin = '" + patterns.skin + "' AND wear > " + patterns.wear,
                          function(err, result) {
                            if (err) throw err;
                            if (result.length > 0) {
                              var res = JSON.parse(JSON.stringify(result));
                              patterns.grade = res[0].grade;
                              patterns.collection = res[0].collection;
                                con.query("INSERT INTO PrimarySnipes (skin, wear, pattern, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + patterns.grade + "', '" + patterns.collection  + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" +
                                "OP" + "', NOW())",
                                function (err, result) {
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                                if ((parseFloat(patterns.listprice)) < (parseFloat(patterns.sugprice) * 10)) {
                                  console.log("autosniper test: " + patterns);
                                }
                            } else if (parseFloat(patterns.wear) < 0.001) {
                              con.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', Low Float <0.000x  '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" +
                              "OP" + "', NOW())",
                              function (err, result) {
                                console.log("Inserted " + patterns.skin + " into Snipe Database");
                              });
                            }
                          });
                          if (checklength != 0) {
                            Organize();
                          }
                        });
                    } else {
                      checklength = checklength - 1;
                      if (checklength != 0) {
                        Organize();
                      }
                    }
                  }
              }
            }
          });
}
function queueloop() {
    if (queue.length === 0) {
      setTimeout(function() {
          queueloop();
      }, 350);
    } else {
              var sniper = [];
              sniper.push(queue[0]);
              $.ajax({
                  url: "http://katos.trade:1739/?url=steam:" + sniper[0].inspect,
                  dataType: 'json',
                  success: function(response) {
                      queue.shift();
                      queueloop();
                      sniper[0].pattern = response.iteminfo.paintseed;
                      console.log(sniper);
                      con.query("INSERT INTO PrimaryPatterns (skin, wear, pattern, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + sniper[0].skin + "', '" + sniper[0].wear + "', '" + sniper[0].pattern + "', '" + sniper[0].listprice + "', '" + sniper[0].sugprice + "', '" + sniper[0].listing + "', '" + sniper[0].inspect
                      + "', '" + "OP" + "', NOW())",
                      function(err, result) {
                          if (err) throw err;
                          console.log("Inserted " + sniper[0].skin + " into Patterns Database");
                          con.query("SELECT skin, pattern, tier FROM PatternDB WHERE skin = '" + sniper[0].skin + "' AND pattern = '" + sniper[0].pattern + "'",
                          function(err, result) {
                            if (err) throw err;
                              if (result.length > 0) {
                                con.query("INSERT INTO PrimarySnipes (skin, wear, pattern, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + sniper[0].skin + "', '" + sniper[0].wear + "', '" + sniper[0].pattern + "', '" + sniper[0].listprice + "', '" + sniper[0].sugprice + "', '" + sniper[0].listing + "', '" + sniper[0].inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (parseFloat(sniper[0].listprice) < (parseFloat(sniper[0].sugprice) * 2) && parseFloat(sniper[0].balance) < parse(sniper[0].listprice)) {
                                    console.log("autosniper test: " + patterns);
                                  }
                                  if (err) throw err;
                                  con.query("UPDATE PrimarySnipes INNER JOIN PatternDB ON PrimarySnipes.skin = PatternDB.skin AND PrimarySnipes.pattern = PatternDB.pattern SET PrimarySnipes.tier = PatternDB.tier WHERE PrimarySnipes.tier IS NULL",
                                  function(err, result) {
                                    if (err) throw err;
                                    console.log("Inserted Tier Ranking for " + sniper[0].skin + " into Snipe Database");
                                  });
                                });
                              }
                          });
                      });
                    }
                });
    }
}
