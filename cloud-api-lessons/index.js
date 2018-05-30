var koa = require('koa')
var koaParseJson = require('koa-parse-json')
var route = require('koa-route')
var fetch = require('node-fetch');



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
  headers: {'Content-Type': 'application/json', 'authorization': 'Bearer 00Df4000002cqlJ!AREAQAsCFZdD3QvHM4fuMB3O.4FkSTyT1xMNFKINBSou4.YP73qUO9ejnmPelGXx7.N4bwUMxCjqETZWVYIGnzF0JjQYRCiY'},
})
  }
};

es.onerror = function(e) {
  console.log(e);
};

/* End code from Julien */
app.listen(port)
console.log('App booted on port %d', port)





/*
app.use(koaParseJson())



 On a root GET respond with a friendly message explaining that this
application has no interesting client-side component. 

app.use(route.get('/', function *() {

  this.body = 'Hello, this is a trivial cloudBit Reader App. Nothing else to see here; all the action happens server-side.  To see any recent input activity from webhook-registered cloudBits do this on the command line: `heroku logs --tail`.'

}))

*/

/* On a root POST log info about the (should be) cloudBit event. 

app.use(route.post('/', function *() {

  console.log('received POST: %j', this.request.body)

  if (this.request.body && this.request.body.type) {
    handleCloudbitEvent(this.request.body)
  }

  this.body = 'OK'

}))



app.listen(port)
console.log('App booted on port %d', port)



// Helpers

function handleCloudbitEvent(event) {
  switch (event.type) {
    case 'amplitude':
      // Do whatever you want with the amplitde
      console.log(event.payload)
      console.log('cloudBit input received: %d%', event.payload.percent)
      fetch('https://legocity4.my.salesforce.com/services/data/v42.0/sobjects/Tire_event__e', { 
        method: 'POST',
        body: JSON.stringify({"Tire_id__c":"123","Tire_id__c":event.payload.percent}),
        headers: {'Content-Type': 'application/json', 'authorization': 'Bearer 00Df4000002cqlJ!AREAQKXMSdLDur4V1OVzQoHyHfEZHBdOqUlLhTbZfEzYMZ2GhxStlaXoXv3T8G_f8YXSX9iQtDcyVtabc.oFQ71GqyduYX9p'},
      })
	      .then(res => res.json())
        .then(json => console.log("json", json))
        .catch(err => console.error("err", err));
      break
    case 'connectionChange':
      // One day, cloudBits will emit this event too, but not yet.
      break
    default:
      console.warn('cloudBit sent an unexpected event: %j', event)
      break
  }
}
*/
