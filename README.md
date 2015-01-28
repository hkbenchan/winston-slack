# winston-slack
A winston extension that connects the log to Slack platform

#Usage

```js
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
```

Go to your slack channel and then add a service integration, select "Incoming WebHooks", get the WebHook URL and replace it.

I suggest use this slack transport to handle exceptions only, put it into normal transports may result too many notifications in your channel :(

#Test it
Sorry, I have not created a test case yet :(

#License
MIT License

#Suggestion/Issues
Please feel free to create a ticket, I will try to address them as soon as possible.
