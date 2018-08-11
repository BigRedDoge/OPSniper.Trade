# OPSniper.Trade

OPSniper.Trade was a website created to poll OPSkins.com for new skin listings and check if it was a potentially profitable purchase aka a "snipe". 
It runs a headless Chromium instance to login to Steam and OPSkins to emulate user activity and fetch the needed cookies.  Then it would
proceed to refresh 2 seperate search queries and log the listings.  It could detect, check, and send a notification of a newly listed profitable item in ~1 second.
Upon a newly created listing it would be added to the listings database. If it was a listing from the float search, the float of the item would be checked to see
if it met the profitable requirements from the float database.  When a skin matched the float parameters it would be added to the snipe database.
If it was a listing from the pattern search, the inspect link would be sent to my other website's server (katos.trade) to be processed.
The katos.trade api would send back a response such as [this example](https://i.imgur.com/jIiBdPO.png). Using the obtained pattern id, it would check if it
was an expensive pattern such as a blue gem or a fire and ice. If it was in the pattern database, it would then be added to the snipe database.
The website had a list of the last 25 listed snipes with information such as float, pattern, tier, collection, screenshot, and link to purchase.  When
a new snipe was listed it would highlight it in green and send the user a notification.  The notification could be clicked on to take the user directly to the purchase page.
There was also the page to see tracked user data.  This would log the user's purchases and calculate profit, revenue, total spent, unsold items cost, etc.
Overall the project was a success; however, due to OPSkins breaking Steam's TOS and their subsequent shutdown the project had to end.
Even though it took many months and a complete fresh start from a previously working version, it eventually ended up working out in the end (even if it was ended shortly after completion). 
