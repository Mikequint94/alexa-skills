const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = "amzn1.ask.skill.ef3249e9-5812-4854-8279-720830ef4b93" // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
    	this.emit('myIntent');
	   },
    'myIntent' : function() {
        //build response first using responseBuilder and then emit
        this.response.speak('Welcome to Ghost!');
        this.emit(':responseReady');
    }
};