const Alexa = require('alexa-sdk');
let fs = require("fs");
  const text = fs.readFileSync('dictionary.txt', "utf-8");
  let dictionary = text.split("\n");
  dictionary.splice(-1);
  let fragment = "";
  let validWords = [];
  let playerTurn = true;
  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

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
        fragment = "";
        validWords = [];
        playerTurn = true;
        this.response.speak("Welcome to Ghost! Please pick a letter to begin").listen("Pick a letter to begin");
        this.emit(':responseReady')
    },
    'letterIntent' : function() {
        let letter = this.event.request.intent.slots.letter.value;
        fragment += letter.toLowerCase().slice(0,1);
        
        let speechOutput = `You picked ${letter}. The total fragment is `
        speechOutput += `<say-as interpret-as="spell-out">${fragment}</say-as>`;
        
        if (!availableWords()) {
            speechOutput += ". There are no words with those letters.  You lose.";
            this.emit(':tell', speechOutput);
        }
       
       
        if (winRound()) {
           speechOutput += `. you completed a word.  the word was ${fragment}`;
           this.emit(':tell', speechOutput);
        } else {
           let newLetter = alexaPick();
           fragment += newLetter;
           speechOutput += `. My Turn. I will pick ${newLetter}.  The current letter chain is `;
           speechOutput += `<say-as interpret-as="spell-out">${fragment}</say-as>`;
           speechOutput += `. Your turn! Pick a letter`;
           
           this.response.speak(speechOutput).listen("Pick a letter");
           this.emit(':responseReady')
        }
        
      

    }
};

let winRound =function() {
    return validWords.includes(fragment);
}
let availableWords = function() {
    validWords = dictionary.filter(
        word => word.slice(0,fragment.length) === fragment);
    if (validWords.length === 0) {
        return false
    } else {
        return true
    }
}

let alexaPick = function() {
    let nonLosingWords = validWords.filter(
        word => word.length > fragment.length + 1);
    if (nonLosingWords.length > 0) {
      let newWord = nonLosingWords[Math.floor(Math.random()*nonLosingWords.length)];
      return newWord.slice(fragment.length,fragment.length+1);
    } else {
      return alphabet[Math.floor(Math.random()*25)];
    }
    
}