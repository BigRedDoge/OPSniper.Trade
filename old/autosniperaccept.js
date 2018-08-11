const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en'
});

const logOnOptions = {
  accountName: '****',
  password: '****',
  twoFactorCode: SteamTotp.generateAuthCode('****')
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  console.log('Logged into Steam');
});

client.on('webSession', (sessionid, cookies) => {
  manager.setCookies(cookies);
  community.setCookies(cookies);
  community.startConfirmationChecker(10000, '****');
});

manager.on('newOffer', (offer) => {
  if (offer.itemsToGive.length == 0 && offer.itemsToReceive.length > 0)  {
    setTimeout(function()  {
      offer.accept((err,status) =>  {
        if (err) {
          console.log(err);
        } else {
          console.log('Accepted Offer');
        }
      });
    }, 1100);
  } else {
    console.log("This is just a regular offer");
  }
});
