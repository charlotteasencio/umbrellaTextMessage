const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const path = require('path')
const fetch = require('node-fetch');
const bodyParser = require('body-parser')

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

var includeRain;
var twiml;

//May need to add twilio cred
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

app.post('/sms', (req, res) => {
  
  var incoming = req.body.Body;
  console.log(incoming)
  twiml = new MessagingResponse();

  fetch("https://api.openweathermap.org/data/2.5/weather" + 
      "?q=" + incoming + ",US" + 
      "&appid=" + process.env.OPEN_WEATHER_AUTH)

   .then((response) => {
      return response.json()
   })
   .then((weatherResponse) => {
     var includeRain = weatherResponse.weather[0].main
     console.log(weatherResponse)
     console.log(includeRain)
      if(includeRain === "Rain" || includeRain === "Drizzle" || includeRain === "Mist") {
        twiml.message("You should probably bring an umbrella!")
      } else {
        twiml.message("You probably don't need an umbrella but we make no promises!")
      }

     res.writeHead(200, {'Content-Type': 'text/xml'});
     res.end(twiml.toString());
   })
});

app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname + '/index.html'));
  });

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});