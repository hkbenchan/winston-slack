/* winston-slack
** -----------
** ## A [Winston](https://github.com/flatiron/winston) Transport for sending messages to slack.
** (C) 2015, Ben Chan
** MIT License
*/

/* 
  Dependencies
  ------------
*/

var winston = require('winston'),
  util = require('util'),
  request = require("request");

/*
  Local (Private) Variables
  -------------------------
*/

// required variables - winston-slack will not start without at least these options.
var required = [ "slackHookUrl" ],
// optional variables (and their default values)
  optional = {
    // username: Can be anything (Default "Winston-Agent")
    "username" : "Winston-Agent",
    // channel: Which channel should winston-slack point to
    "channel" : null,
    // standard winston variables
    "level" : "info",
    // handle exceptions?
    "handleExceptions" : false,
    // color (in hex code, e.g. "#1393a1")
    "color": "#36a64f"

  };

var Slack = winston.transports.Slack = exports.Slack = function (options) {
  
  options = options || {};

  // check if there is any required field that are missing
  var missRequiredProp = [];
  required.forEach(function (p) {
    if (!options.hasOwnProperty(p)) missRequiredProp.push(p);
  })
  if (missRequiredProp.length) throw "You must specify options: " + missRequiredProp.join(",") + " to use winston-slack";

  // combine keys
  this.options = {};

  for (var key in optional) {
    if (options.hasOwnProperty(key)) {
      this.options[key] = options[key];
    } else {
      this.options[key] = optional[key];
    }
  }

  for (var key in required) {
    this.options[required[key]] = options[required[key]];
  }

  // name this service
  this.name = "SlackTransport";

  // minimum record level
  this.level = this.options.level || 'info';

  // should I handle exception?
  this.handleExceptions = this.options.handleExceptions;
}

util.inherits(Slack, winston.Transport);

Slack.prototype.log = function(level, msg, meta, callback) {
  //
  // Store this message and metadata, maybe use some custom logic
  // then callback indicating success.
  //

  // compile the beautiful json and then send to destination
  var logJson = {};

  var jsonFields = [];

  jsonFields.push({
    "title": "Log Level",
    "value": level,
    "short": true
  });
  
  for (var key in meta) {
    jsonFields.push({
      "title": key,
      "value": (typeof meta[key] == "object") ? JSON.stringify(meta[key]) : meta[key],
      "short": true
    })
  }

  logJson.fields = jsonFields;
  logJson.fallback = msg;
  logJson.text = this.options.subject;
  logJson.color = this.options.color;
  logJson.username = this.options.username;

  if (this.options.channel) {
    // override channel
    logJson.channel = this.options.channel;
  }

  request.post({
    url: this.options.slackHookUrl,
    body: logJson,
    json: true
  }, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    // forget the body, we just need to confirm the body is received
    callback(err, !!body);
  });
};