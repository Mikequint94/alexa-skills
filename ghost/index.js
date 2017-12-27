const Alexa = require('alexa-sdk');
let fs = require("fs");
  const text = fs.readFileSync('dictionary.txt', "utf-8");
  let dictionary = text.split("\n");
  dictionary.splice(-1);
  let fragment = "";
  let validWords = [];
  let alexaScore = 0;
  let playerScore = 0;
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
        alexaScore = 0;
        playerScore = 0;
        this.response.speak("Welcome to Ghost! Please pick a letter to begin").listen("Pick a letter to begin");
        this.emit(':responseReady')
    },
     'scoreIntent' : function() {
         let speechOutput = `The current score is... me: ${alexaScore}. you: ${playerScore}. Pick a letter to continue. `;
         this.response.speak(speechOutput).listen("Pick a letter to continue");
         this.emit(':responseReady')
    },
    'letterIntent' : function() {
        let letter = this.event.request.intent.slots.letter.value.slice(0,1);
        fragment += letter.toLowerCase();
        
        let speechOutput = `You picked ${letter}. `
        if (fragment.length > 1) {
            speechOutput += ` The total fragment is <say-as interpret-as="spell-out">${fragment}</say-as>`;
        }
        if (!availableWords()) {
            speechOutput += `. There are no words with those letters.  <say-as interpret-as="interjection">wahoo.</say-as> You lose.`;
            alexaScore += 1;
            speechOutput += ` The current score is... me: ${alexaScore}. you: ${playerScore}.`;
            speechOutput += ' Say start new game if you would like to play again.'
            this.emit(':ask', speechOutput);
            this.emit('myIntent');
        }
       
       
        if (winRound()) {
           speechOutput += `. you completed a word.  the word was ${fragment}`;
            alexaScore += 1;
            speechOutput += `The current score is... me: ${alexaScore}. you: ${playerScore}.`;
             speechOutput += ' Say start new game if you would like to play again.'
            this.emit(':ask', speechOutput);
            this.emit('myIntent');
        } else {
           let newLetter = alexaPick();
           if (newLetter.length === 1) {
           fragment += newLetter;
           speechOutput += `. My Turn. I will pick ${newLetter}.  The current letter chain is `;
           speechOutput += `<say-as interpret-as="spell-out">${fragment}</say-as>`;
           speechOutput += `. Your turn! Pick a letter`;
           
           this.response.speak(speechOutput).listen("Pick a letter");
           this.emit(':responseReady')
           } else {
                playerScore += 1;
                newLetter += `The current score is... me: ${alexaScore}. you: ${playerScore}.`;
                newLetter += ' Say start new game if you would like to play again.'
                 this.emit(':ask', newLetter);
                this.emit('myIntent');
           }
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
    //   return alphabet[Math.floor(Math.random()*25)];
        return `hmmmm. <say-as interpret-as="interjection">aw man. oy. uh oh.</say-as>  I can't think of anything, I guess I lose. good game!`;
    }
    
}