var cloudscraper = require("cloudscraper");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);

function OPbean(callback) {
    var opfloatUrl = 'https://opskins.com/?app=730_2&loc=shop_search&search_item=awp+asiimov&sort=n&wear_range_high=100&wear_range_low=90';
  cloudscraper.get(opfloatUrl, function (error, response, body) {
  if (body != undefined) {
    let dom = new JSDOM(body.toString());
    let bean = dom.window.document.getElementById('scroll');
    console.log(bean);
    let bepis = $(bean).children();
    console.log(bepis.length);
    if (bean != undefined) {
        for (i = 1; i < bepis.length; i++) {
          let boop = bepis[i];
          let float = $(boop).children('div').children('div.text-center.wear-value').find('*').html();
          let listprice =  $(boop).children('div').children('div.item-add-wear').children('div.item-amount').html();
          let sugprice = $(boop).children('div').children('div.item-add-wear').children('div.market-name').find('span').html();
          let skin = $(boop).children('div').children('a.market-name.market-link').html();
          let listing =  "https://opskins.com/" + $(boop).children('div').children('a.market-name.market-link').attr('href');
          skin = skin.replace(/\n/g, '');
          float = float.replace(/%/g, '');
          float = float.replace(/Wear: /g, '');
          float = parseFloat(float) / 100;
          float = float.toFixed(7);
          sugprice = sugprice.slice(1);
          sugprice = parseFloat(sugprice) * 0.75;
          sugprice = sugprice.toFixed(2);
          sugprice = "$" + sugprice;
          var beaner = { weapon:skin, wear:float, listprice:listprice, estprice:sugprice, listlink:listing }
          if(callback) callback(beaner);
        }
      }
    }
  });
}

(OPbean(function(callback) {
    console.log(callback);
}));
