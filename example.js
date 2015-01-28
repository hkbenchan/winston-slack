/**
*	Replace the slack hook url
*/

var slackUrl = "<Replace here>",
slackUsername = "<Replace here>";


var winston = require("winston");
require("./lib/winston-slack").Slack;

var loggingOptions = {
	exceptionHandlers: [
		new (winston.transports.Slack)({
			slackHookUrl: slackUrl,
			handleExceptions: true,
			username: slackUsername
		})
	]
}

var logger = new (winston.Logger)(loggingOptions);

// lets try to throw a error
throw new Error("Some random error");

