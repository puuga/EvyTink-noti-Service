var express = require("express");
var FCM = require('./fcm');
var path = require('path');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');

var app = express();
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


var serverKeyTest = 'AIzaSyDHvf91VkmwtKJRIZwJlAicWa2HCqWyu78';
var serverKeyEvytinkAdmin = 'AIzaSyDXFyC4lCz3lhl0IrJlYyYB8q8YPAMzLGM';
var serverKeyEvytink = 'AIzaSyAyLmDe1RtSClGINvc9u59bMDL72ms7ZEs';
var fcm = new FCM(serverKeyEvytink);

app.get('/', function (req, res) {
  // console.log('hello');
  // res.send("Hello");
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/topics', function (req, res) {
  var topics = ["general", "news", "promotion", "event"];
  console.log(topics);
  res.send(topics);
});

app.get('/form', function(req, res) {
  console.log('get form');
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/send', function (req, res) {
  console.log('send to FCM');
  console.log(req.body);
  if (!req.body)
    return res.sendStatus(400);

  var topic = req.body.topic;
  var titleText = req.body.titleText;
  var bodyText = req.body.bodyText;
  var sound = req.body.sound;
  var isDebug = req.body.isDebug;

  console.log('topic: ' + topic);
  console.log('titleText: ' + titleText);
  console.log('bodyText: ' + bodyText);
  console.log('sound: ' + sound);

  var message = {
    to: '/topics/friendly_engage', // required
    collapse_key: 'EVYtink!',
    priority: "high",
    data: {
        mTopic: 'friendly_engage',
        isDebug: isDebug
    },
    notification: {
        title: titleText,
        body: bodyText
    }
  };

  switch (topic) {
    case "general":
      message.to = "/topics/general";
      message.data.mTopic = "/topics/general";
      break;
    case "news":
      message.to = "/topics/news";
      message.data.mTopic = "/topics/news";
      break;
    case "promotion":
      message.to = "/topics/promotion";
      message.data.mTopic = "/topics/promotion";
      break;
    case "event":
      message.to = "/topics/event";
      message.data.mTopic = "/topics/event";
      break;
    default:

  }

  if (sound==="default") {
    message.notification.sound = "default";
  }

  fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!", err);
    } else {
        console.log("Successfully sent with response: ", response);
    }
  });

  res.send(message);
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// app.listen(3000);
// console.log("My Service is listening to port 3000.");
