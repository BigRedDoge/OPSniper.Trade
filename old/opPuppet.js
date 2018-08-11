const puppeteer = require('puppeteer');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
//const Cookie = require('js-cookie');
var fs = require('fs');


const authcode = SteamTotp.generateAuthCode('****');

let scrape = async function login() {
  const browser = await puppeteer.launch({headless: true, executablePath: 'google-chrome-unstable'});
  const page = await browser.newPage();

// Setting Chrome Up
  await page.setViewport({width: 1200, height: 800});
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36');
  await page.evaluateOnNewDocument(() => {
    window.open = (url) => {
      top.location = url;
    }
  });

// Going to OP Login Page
  await page.goto('https://opskins.com/?loc=login');
  console.log("got to op");
//  await page.waitForSelector('html');
  await page.waitFor(7500);
  await page.click('#login-outer > div.container > div:nth-child(2) > a');

// Putting Login Information in Steam
  //await page.waitForSelector('body > div.responsive_page_frame.with_header > div.responsive_page_content');
  await page.waitFor(7500);
  console.log("got to steam");
  await page.click('#steamAccountName');
  await page.keyboard.type('****');
  await page.click('#steamPassword');
  await page.keyboard.type('****');
  await page.waitFor(1000);
  await page.click('#imageLogin');

// Entering 2FA Code and Loging In
  await page.waitFor(4000);
  await page.click('#twofactorcode_entry');
  await page.keyboard.type(authcode);
  console.log("2fa");
  await page.waitFor(4000).then(() =>
    page.click('#login_twofactorauth_buttonset_entercode > div.auth_button.leftbtn > div.auth_button_h3'));

// OP Home Page Logged In
  //await page.waitForNavigation();
  await page.waitFor(7500)
  await page.reload();
  console.log("getting cookies");

// Going to New 0.00x Floats
//  await page.goto('https://opskins.com');

// Cookie Code
  console.log(await page.cookies());

//  return result;
//  await page.waitFor(999999);

// Closing Browser
  await browser.close();
  await process.exit(0);
}

scrape().then((value) => {
  console.log(value);
});
