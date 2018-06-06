var koa = require('koa')
var koaParseJson = require('koa-parse-json')
var route = require('koa-route')
var fetch = require('node-fetch');
var curl = require('curlrequest');



var port = Number(process.env.PORT) || 7800
var app = koa() 

/* Beginning code from Julien */

const EventSource = require("eventsource");

const url = "https://api-http.littlebitscloud.cc/v2/devices/243c201f8634/input";

const token =
  "0818ce2545bb60e2672e5a18a9d7413ecc8534da02785bee59879c0789197143";

const options = { headers: { Authorization: token } };

const es = new EventSource(url, options);

// time to wait in ms
const delay = 1000;

console.log('Hello Hello');

let lastHit = new Date().getTime();

es.onmessage = function(event) {

  var options = {
    url : 'https://login.salesforce.com/services/oauth2/token',
    data : "grant_type=password&client_id=3MVG9zlTNB8o8BA2sCD.ILWj2c.LEB2fYifkDB.aT7iFGZ90gg6yC7uJCHvMlTPdH99xuS4vIp.cRhjQqG36I&client_secret=2067544168180146327&username=user@legocity4.demo&password=Salesforce1"
  };

  curl.request(options, function (error, data) {
    console.log('error: ', error);
    //console.log('data: ', data);
    var accessTokenResult = JSON.parse(data);
    console.log('accessTokenResult.access_token: ', accessTokenResult.access_token);

    const percent = JSON.parse(event.data).percent;
    const elapsed = new Date().getTime() - lastHit;
    // be sure to wait a little
    if (percent !== undefined && elapsed > delay) {
      // send data to sales force
      console.log(percent); 
      lastHit = new Date().getTime();
      
      fetch('https://legocity4.my.salesforce.com/services/data/v42.0/sobjects/Tire_event__e', { 
      method: 'POST',
      body: JSON.stringify({"Tire_id__c":"123","Pressure__c":percent}),
      headers: {'Content-Type': 'application/json', 'authorization': 'Bearer '+accessTokenResult.access_token},
      })
    }
  });
};

es.onerror = function(e) {
  console.log(e);
};

/* End code from Julien */
app.listen(port)
console.log('App booted on port %d', port)
