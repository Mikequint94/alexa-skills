const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = "amzn1.ask.skill.ef3249e9-5812-4854-8279-720830ef4b93" // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'AMAZON.StopIntent': function () {
        this.response.speak('Goodbye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {  // practice help
        var helpText = 'please say a letter like A, B, or C';
        this.response.speak(helpText);
        this.emit(':responseReady');
    },
    'LaunchRequest': function () {
    	this.emit('myIntent');
	   },
    'myIntent' : function() {
        //build response first using responseBuilder and then emit
        this.response.speak("Welcome to Ghost! Please pick a letter to begin").listen("Pick a letter to begin");
        this.emit(':responseReady')
    },
    'letterIntent' : function() {
        let letter = this.event.request.intent.slots.letter.value || "A";
        this.emit(':tell', `you picked ${letter}`);
    }
};