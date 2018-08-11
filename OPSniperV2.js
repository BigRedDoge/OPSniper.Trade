const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
const mysql = require('mysql');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const authcode = SteamTotp.generateAuthCode('STEAM_IDENTITY_SECRET');
const now = new Date();

var cookies;
var queue = [];

queueloop();

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'opsniper.trade',
    user: 'root',
    password: 'MYSQL_PASSWORD',
    database: 'opsniper',
    multipleStatements: true
});

SniperLogin();

var SavedEndpoint;

function SniperLogin() {

  let setup = async function login() {

    const browser = await puppeteer.launch({headless: true, executablePath: 'google-chrome-unstable'});
    const page = await browser.newPage();

    await page.setViewport({width: 1200, height: 800});
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3188.0 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
      window.open = (url) => {
        top.location = url;
      }
    });

    await page.goto('https://opskins.com/?loc=login');
    console.log("Reached OP Login Page");

    await page.waitForSelector('#login-outer > div.container > div:nth-child(2) > a');
    await page.click('#login-outer > div.container > div:nth-child(2) > a');

    await page.waitForSelector('#steamAccountName');
    console.log("Got to Steam Login Page");
    await page.click('#steamAccountName');
    await page.keyboard.type('STEAM_USERNAME');
    await page.click('#steamPassword');
    await page.keyboard.type('STEAM_PASSWORD');
    await page.waitForSelector('#imageLogin');
    await page.click('#imageLogin');

    await page.waitFor(6000);
    await page.click('#twofactorcode_entry');
    await page.keyboard.type(authcode);
    console.log("2fa");
    await page.waitForSelector('#login_twofactorauth_buttonset_entercode > div.auth_button.leftbtn > div.auth_button_h3').then(() =>
      page.click('#login_twofactorauth_buttonset_entercode > div.auth_button.leftbtn > div.auth_button_h3'));

    await page.waitFor(3000);
    await page.reload();

    var opcookies = await page.cookies();
    console.log(opcookies);
    console.log("Retrieved Cookies");

    await page.close();
    await browser.close();
    return opcookies;

  }

  setup().then((opcookies) => {
    cookies = opcookies;
    puppeteer.launch({headless: true, executablePath: 'google-chrome-unstable'}).then(async browser => {
      SavedEndpoint = browser.wsEndpoint();
      browser.disconnect();
      CHSnipe();
    });
  });

}

function CHSnipe() {

  let scrape = async function login() {

    const browser = await puppeteer.connect({browserWSEndpoint: SavedEndpoint}).catch(() => { return });
    const page = await browser.newPage().catch(() => { return });

        page.on('error', error => {
          return;
        });

        page.on('pageerror', error => {
          return;
        });

        page.on('requestfailed', request => {
          return;
        });

        page.on('load', () => {
          console.log("Page Loaded");
        });

    await page.setViewport({width: 1200, height: 800})
    .catch(() => {
      return;
    });

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3188.0 Safari/537.36')
    .catch(() => {
      return;
    });

    await page.evaluateOnNewDocument(() => {
      window.open = (url) => {
        top.location = url;
      }
    });

    await page.setCookie(...cookies).catch(error => { return;});

    await page.goto('https://opskins.com/?app=730_2&loc=shop_search&search_item=%28Case+Hardened%29%7C%28Karambit+Fade%29%7C%28%22M9+Bayonet+%7C+Fade%22%29%7C%28%22Bayonet+%7C+Marble+Fade%22%29%7C%28%22Flip+Knife+%7C+Marble+Fade%22%29%7C%28%E2%98%85+Crimson+Web+Field-Tested+%29%7C%28%E2%98%85+Crimson+Web+Minimal+Wear%29%7C%28AWP+%7C+Asiimov+Field-Tested%29%7C%28M4A4+%7C+Asiimov+Field-Tested%29%7C%28AWP+%7C+Asiimov+Battle-Scarred%29%7C%28Doppler%29+-Gloves&sort=n&wear_range_high=100&wear_range_low=0.000000000001', {
      timeout: 10000
    }).catch(error => {
      return;
    });


    await page.waitForSelector('#scroll')
    .catch(error => {
      return;
    });

    await page.waitFor(25);

    let chsnipe = await page.evaluate(() => {
          var skinArr =[];
          var bean = document.getElementById('scroll');
          var bepis = $(bean).children();
          if (bepis != undefined) {
            var bepislength = bepis.length;
            for (var i = 0; i < bepis.length; i++) {
              // Get Skin Data Elements
              let boop = bepis[i];
              let wear = ($(boop).children('div').children('div.text-center.wear-value').find('*').attr('title'));
              let listprice = $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
              let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
              let skin = $(boop).children('div').children('a.market-name.market-link').html();
              let listing = "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
              let inspect = $(boop).find('div > div.item-add-wear > div.item-buttons.text-center > a').attr('href');
              let gem = $(boop).find('div > div.item-desc > small').text();
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
              var beaned = [skin, wear, listprice, sugprice, listing, inspect, gem];
              console.log(beaned);
              skinArr.push(beaned);
            }
              if (i === bepis.length - 1) {
                return skinArr;
              }
            }
         }
       }).catch(() => {
         return;
       });

       await page.setCookie(...cookies)
       .catch(error => {
         return;
       });

       await page.goto('https://opskins.com/?app=730_2&loc=shop_search&search_item=-turf&sort=n&wear_range_high=1&wear_range_low=0.000000000001', {
         timeout: 10000
       }).catch(error => {
         return;
       });

       await page.waitForSelector('#scroll')
       .catch(error => {
         return;
       });

       await page.waitFor(25);

       let floatsnipe = await page.evaluate(() => {
           var skinArr =[];
           var bean = document.getElementById('scroll');
           console.log(bean);
           var bepis = $(bean).children();
           if (bepis != undefined) {
             var bepislength = bepis.length;
             for (var i = 0; i < bepis.length; i++) {
               // Get Skin Data Elements
               let boop = bepis[i];
               let wear = ($(boop).children('div').children('div.text-center.wear-value').find('*').attr('title'));
               let listprice = $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
               let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
               let skin = $(boop).children('div').children('a.market-name.market-link').html();
               let listing = "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
               let inspect = $(boop).find('div > div.item-add-wear > div.item-buttons.text-center > a').attr('href');
               let gem = $(boop).find('div > div.item-desc > small').text();
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
               var beaned = [skin, wear, listprice, sugprice, listing, inspect, gem];
               console.log(beaned);
               skinArr.push(beaned);
             }
               if (i === bepis.length - 1) {
                 return skinArr;
               }
             }
          }
        }).catch(() => {
          return;
        });

    await page.close();
    await browser.disconnect();
    return ([chsnipe, floatsnipe]);
  }

  scrape().then((value) => {
    if (value[0] !== undefined) {
      CaseHardDB(value[0]);
    }
    if (value[1] !== undefined) {
      FloatSnipeDB(value[1]);
    }
    setTimeout(function() {
      CHSnipe();
    }, 100);
    function CaseHardDB(value) {
        var check = [];
        var link = [];
        var list = [];
        var checklength;
        var x = 0;

        queryLoop();

        function queryLoop() {
          pool.query("SELECT * FROM PrimaryListings WHERE listing = '" + value[x][4] + "'", function(err, result) {
              if (err) throw err;
              check.push(result.length);
              x = x + 1;
              if (x < value.length) {
                setTimeout(function() {
                  queryLoop();
                }, 1);
              } else {
                  var linklength = link.length - 1;
                  checklength = check.length;
                  Organize();
              }
            });
        }

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
                            var gem = value[checklength - 1][6];
                            list.push(patterns);
                            console.log(patterns);
                            if ((patterns.skin).includes("Case Hardened")||(patterns.skin).includes("Fade")) {
                              queue.push(patterns);
                            }
                            if ((patterns.skin).includes("Crimson Web")) {
                              if ((parseFloat(patterns.wear)).toFixed(3) > 0.15 && (parseFloat(patterns.wear)).toFixed(3) < 0.16) {
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float CW" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                              if ((parseFloat(patterns.wear)).toFixed(2) == 0.07 || (parseFloat(patterns.wear)).toFixed(2) == 0.08 || (parseFloat(patterns.wear)).toFixed(2) == 0.09) {
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float CW" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                            }
                            if ((patterns.skin).includes("Asiimov")) {
                              if ((patterns.skin).includes("AWP | Asiimov")) {
                                if ((parseFloat(patterns.wear)).toFixed(2) >= 0.90) {
                                  pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Blackiimov" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                  function(err, result) {
                                    if (err) throw err;
                                    console.log("Inserted " + patterns.skin + " into Snipe Database");
                                  });
                                }
                              }
                              if ((patterns.skin).includes("AWP | Asiimov")) {
                                if ((parseFloat(patterns.wear)).toFixed(2) <= 0.20) {
                                  pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float Asii" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                  function(err, result) {
                                    if (err) throw err;
                                    console.log("Inserted " + patterns.skin + " into Snipe Database");
                                  });
                                }
                              }
                              if ((patterns.skin).includes("M4A4 | Asiimov") && (parseFloat(patterns.wear)).toFixed(2) <= 0.24) {
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Low Float Asii" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                            }
                            if ((patterns.skin).includes("Doppler")) {
                              if (gem === "Factory New★ Covert Knife (Sapphire)") {
                                patterns.skin = (patterns.skin).replace(/Doppler/, 'Sapphire');
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Sapphire" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              } else if (gem === "Factory New★ Covert Knife (Ruby)") {
                                patterns.skin = (patterns.skin).replace(/Doppler/, 'Ruby');
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Ruby" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              } else if (gem === "Factory New★ Covert Knife (Black Pearl)") {
                                patterns.skin = (patterns.skin).replace(/Doppler/, 'Black Pearl');
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Black Pearl" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              } else if (gem === "Factory New★ Covert Knife (Emerald)") {
                                patterns.skin = (patterns.skin).replace(/Gamma Doppler/, 'Emerald');
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + "Emerald" + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database")
                                });
                              }
                            }
                            pool.query("INSERT INTO PrimaryListings (skin, wear, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                            function(err, result) {
                              if (err) throw err;
                              console.log("Inserted " + patterns.skin + " into Listings Database");
                              checklength = checklength - 1;
                              if (checklength !== 0) {
                                setTimeout(function() {
                                  Organize();
                                }, 1);
                              } else {
                            //    return;
                              }
                            });
                        } else {
                          checklength = checklength - 1;
                          if (checklength !== 0) {
                            setTimeout(function() {
                              Organize();
                            }, 1);
                          } else {
                          //  return;
                          }
                        }
                      }

      //  }
      }
    });

    function FloatSnipeDB(value) {
      var check = [];
      var link = [];
      var list = [];
      var checklength;
      var x = 0;

      queryLoop();

      function queryLoop() {
        pool.query("SELECT * FROM PrimaryListings WHERE listing = '" + value[x][4] + "'", function(err, result) {
            if (err) throw err;
            check.push(result.length);
            x = x + 1;
            if (x < value.length) {
              setTimeout(function() {
                queryLoop();
              }, 1);
            } else {
                var linklength = link.length - 1;
                checklength = check.length;
                Organize();
            }
          });
      }

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
                          var gem = value[checklength - 1][6];
                          list.push(patterns);
                          console.log(patterns);
                          pool.query("INSERT INTO PrimaryListings (skin, wear, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" + "OP" + "', NOW())",
                          function(err, result) {
                            if (err) throw err;
                            console.log("Inserted " + patterns.skin + " into Listings Database");
                            checklength = checklength - 1;
                            pool.query("SELECT skin, wear, grade, collection FROM FloatDB WHERE skin = '" + patterns.skin + "' AND wear > " + patterns.wear,
                            function(err, result) {
                              if (err) throw err;
                              if (result.length > 0) {
                                var res = JSON.parse(JSON.stringify(result));
                                patterns.grade = res[0].grade;
                                patterns.collection = res[0].collection;
                                  pool.query("INSERT INTO PrimarySnipes (skin, wear, pattern, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', '" + patterns.grade + "', '" + patterns.collection  + "', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" +
                                  "OP" + "', NOW())",
                                  function (err, result) {
                                    if (err) throw err;
                                    console.log("Inserted " + patterns.skin + " into Snipe Database");
                                  });
                              } else if (parseFloat(patterns.wear) < 0.001) {
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, tier, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + patterns.skin + "', '" + patterns.wear + "', 'Low Float', '" + patterns.listprice + "', '" + patterns.sugprice + "', '" + patterns.listing + "', '" + patterns.inspect + "', '" +
                                "OP" + "', NOW())",
                                function (err, result) {
                                  if (err) throw err;
                                  console.log("Inserted " + patterns.skin + " into Snipe Database");
                                });
                              }
                            });
                            checklength = checklength - 1;
                            if (checklength !== 0) {
                              setTimeout(function() {
                                Organize();
                              }, 1);
                            } else {
                            }
                          });
                      } else {
                        checklength = checklength - 1;
                        if (checklength !== 0) {
                          setTimeout(function() {
                            Organize();
                          }, 1);
                        } else {
                        }
                      }
                    }
              }
}

function queueloop() {
    if (queue.length === 0) {
      setTimeout(function() {
          queueloop();
      }, 250);
    } else {
              var sniper = [];
              sniper.push(queue[0]);
              $.ajax({
                  url: "https://katos.trade:1738/?url=steam:" + sniper[0].inspect,
                  dataType: 'json',
                  success: function(response) {
                      queue.shift();
                      queueloop();
                      sniper[0].pattern = response.iteminfo.paintseed;
                      pool.query("INSERT INTO PrimaryPatterns (skin, wear, pattern, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + sniper[0].skin + "', '" + sniper[0].wear + "', '" + sniper[0].pattern + "', '" + sniper[0].listprice + "', '" + sniper[0].sugprice + "', '" + sniper[0].listing + "', '" + sniper[0].inspect
                      + "', '" + "OP" + "', NOW())",
                      function(err, result) {
                          if (err) throw err;
                          console.log("Inserted " + sniper[0].skin + " into Patterns Database");
                          pool.query("SELECT skin, pattern, tier FROM PatternDB WHERE skin = '" + sniper[0].skin + "' AND pattern = '" + sniper[0].pattern + "'",
                          function(err, result) {
                              if (err) throw err;
                              if (result.length > 0) {
                                pool.query("INSERT INTO PrimarySnipes (skin, wear, pattern, listprice, sugprice, listing, inspect, sniper, date) VALUES ('" + sniper[0].skin + "', '" + sniper[0].wear + "', '" + sniper[0].pattern + "', '" + sniper[0].listprice + "', '" + sniper[0].sugprice + "', '" + sniper[0].listing + "', '" + sniper[0].inspect + "', '" + "OP" + "', NOW())",
                                function(err, result) {
                                    if (err) throw err;
                                    pool.query("UPDATE PrimarySnipes INNER JOIN PatternDB ON PrimarySnipes.skin = PatternDB.skin AND PrimarySnipes.pattern = PatternDB.pattern SET PrimarySnipes.tier = PatternDB.tier WHERE PrimarySnipes.tier IS NULL",
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
