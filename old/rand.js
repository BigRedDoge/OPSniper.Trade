CREATE TABLE PrimaryDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255)
);

var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'opsniper.trade',
  user: 'root',
  password: '****',
  database: 'opdb',
  multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err;
    var sql = "INSERT INTO 'PrimaryDB' (skin, float, listprice, sugprice, listing) VALUES ?";
    con.query(sql, res, function(err, result) {
      if (err) throw err;
      console.log("Number of Records Inserted: " + result.affectedRows);
    });
 });

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE PrimaryDB (id INT AUTO_INCREMENT PRIMARY KEY, skin VARCHAR(255)";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Table Created!");
    console.log(result);
  });
});


CREATE TABLE PrimaryDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);



/* for (var i; i < values.length; i++) {
let check = values[i];
console.log(values[i]);
var chksql = "SELECT * FROM PrimaryDB WHERE skin = ?";
con.query(chksql, [check], function(err, result) {
 if (err) throw err;
 console.log(result);
});
}
var sql = "INSERT INTO PrimaryDB (skin, wear, listprice, sugprice, listing) VALUES ?";
var values = callback;
con.query(sql, [values], function(err, result) {
if (err) throw err;
console.log("Number of records inserted: " + result.affectedRows);
});
*/


"SELECT * FROM PrimaryDB WHERE EXISTS (SELECT wear FROM PrimaryDB WHERE  wear =" + values[i][1] + ")"



+ String(values[j][0]) + ", " + String(values[j][1) + ", " + String(values[j][2]) + ", " + String(values[j][3]) + ", " + String(values[j][4) + ")";

CREATE TABLE Food
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
rarity VARCHAR(255),
collection VARCHAR(255)
);

CREATE TABLE TradeUpDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
rarity VARCHAR(255),
collection VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255)
);

CREATE TABLE CH
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255)
);

CREATE TABLE CaseHardDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);


CREATE TABLE CHListings
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE SCM_GemsDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
cond VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE SCM_CHListings
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
cond VARCHAR(255),
listprice VARCHAR(255),
listingid VARCHAR(255),
assetid VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE SCM_CaseHardDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
cond VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE CornersDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FIListings
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FIPatterns
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FireIceDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FI
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
pattern VARCHAR(255),
max VARCHAR(255)
);

CREATE TABLE PrimaryListings
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
wear VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255),
sniper VARCHAR(255),
date VARCHAR(255)
);

CREATE TABLE PrimaryPatterns
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
wear VARCHAR(255),
pattern VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255),
sniper VARCHAR(255),
date VARCHAR(255)
);

CREATE TABLE PrimarySnipes
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
wear VARCHAR(255),
pattern VARCHAR(255),
tier VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255),
sniper VARCHAR(255),
date VARCHAR(255)
);

CREATE TABLE UserPurchases
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
user VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
wear VARCHAR(255),
pattern VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
tier VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
listprice VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
sellprice VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
revenue VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
profit VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
listing VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
inspect VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
sniper VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
date VARCHAR(255)
);

CREATE TABLE PatternDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
pattern VARCHAR(255),
tier VARCHAR(255)
);

CREATE TABLE FloatDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
wear VARCHAR(255),
grade VARCHAR(255),
collection VARCHAR(255)
);

ALTER TABLE FloatDB MODIFY COLUMN skin VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE InspectDB MODIFY COLUMN metjm VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

CREATE TABLE FadeListings
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FadePatterns
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FadeDB
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
wear VARCHAR(255),
pattern VARCHAR(255),
listprice VARCHAR(255),
sugprice VARCHAR(255),
listing VARCHAR(255),
inspect VARCHAR(255)
);

CREATE TABLE FADE
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
skin VARCHAR(255),
pattern VARCHAR(255),
fade VARCHAR(255)
);

CREATE TABLE SteamID
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
steamid VARCHAR(255),
status VARCHAR(255)
);

CREATE TABLE SteamID2
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
steamid VARCHAR(255),
status VARCHAR(255)
);

CREATE TABLE SteamID2
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
steamid VARCHAR(255),
status VARCHAR(255)
);

INSERT INTO TradeUpDB (skin, wear, rarity, collection) VALUES ('CZ75-Auto | Chalice', '0.001', 'Restricted', 'The Cobblestone Collection'), ('MP9 | Dark Age', '0.005', 'Mil-Spec', 'The Cobblestone Collection');

UPDATE TradeUpDB SET wear = '0.01', rarity = 'Mil-Spec' WHERE id = 29;

con.query("SELECT * FROM PrimaryDB WHERE EXISTS (SELECT * FROM Food WHERE skin = PrimaryDB.skin AND wear > PrimaryDB.wear)",
function(err, result) {

INSERT INTO TradeUpDB (skin, wear, sugprice, listprice, listing) SELECT skin, wear, sugprice, listprice, listing FROM PrimaryDB WHERE EXISTS (SELECT * FROM Food WHERE skin = PrimaryDB.skin AND wear > PrimaryDB.wear);

"UPDATE GemsDB INNER JOIN CH ON GemsDB.skin = CH.skin AND GemsDB.pattern = CH.pattern SET GemsDB.tier = CH.tier WHERE GemsDB.tier IS NULL"
