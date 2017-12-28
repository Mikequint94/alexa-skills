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
    alexa.appId = "amzn1.ask.skill.ef3249e9-5812-4854-8279-720830ef4b93"
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'AMAZON.StopIntent': function () {
      this.response.speak('Goodbye');
      this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye');
        this.emit(':responseReady');
    },
    'quitIntent': function () {
      this.response.speak('Goodbye');
      this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {  
        let helpText = 'Ghost is a word game where each player switches off saying letters until either a word is completed or there are no real words that begin with that letter chain. ';
        helpText += 'The player who completes a word loses.  The goal is to try and create a word chain that will force your opponent into completing a word. ';
        helpText += 'To play, simply say a letter like A, B, or C. You can ask for the score at any time.  First player to 5 points wins.';
        this.response.speak(helpText).listen("Pick a letter to continue.");
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {  
        if (fragment === "") {
          let speechOutput = "Welcome to Ghost! Please pick a letter to begin.  You can say Help for more information.";
        } else {
          let speechOutput = ` The total fragment is <say-as interpret-as="spell-out">${fragment}</say-as>. Pick a letter to continue.`;
        }
        this.response.speak(speechOutput).listen("Pick a letter to continue.");
        this.emit(':responseReady');
    },
    'LaunchRequest': function () {
    	this.emit('myIntent');
	   },
    'myIntent' : function() {
        fragment = "";
        validWords = [];
        alexaScore = 0;
        playerScore = 0;
        this.response.speak("Welcome to Ghost! Please pick a letter to begin.  You can say Help at anytime for more information.").listen("Pick a letter to begin");
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
            speechOutput += ` The total fragment is <say-as interpret-as="spell-out">${fragment}</say-as>. `;
        }
        if (!availableWords()) {
            speechOutput += `. There are no words with those letters.  <say-as interpret-as="interjection">bummer.</say-as> You lose. `;
            this.response.speak(alexaWin(speechOutput)).listen("Pick a letter");
            this.emit(':responseReady')
        } else {
          if (winRound()) {
             speechOutput += `. you completed a word.  the word was ${fragment}. `;
             this.response.speak(alexaWin(speechOutput)).listen("Pick a letter");
             this.emit(':responseReady')
          } else {
             let newLetter = alexaPick();
             if (newLetter.length === 1) {
             fragment += newLetter;
             speechOutput += `My Turn. I will pick ${newLetter}.  The current letter chain is `;
             speechOutput += `<say-as interpret-as="spell-out">${fragment}</say-as>`;
             speechOutput += `. Your turn! Pick a letter`;
             this.response.speak(speechOutput).listen("Pick a letter");
             this.emit(':responseReady')
             } else {
              this.response.speak(playerWin(newLetter)).listen("Pick a letter");
              this.emit(':responseReady')
             }
          }
        }
    }
};

function winRound() {
    return validWords.includes(fragment);
}
function availableWords() {
    validWords = dictionary.filter(
        word => word.slice(0,fragment.length) === fragment);
    if (validWords.length === 0) {
        return false
    } else {
        return true
    }
}

function alexaPick() {
    let nonLosingWords = validWords.filter(
        word => word.length > fragment.length + 1);
    if (nonLosingWords.length > 0) {
      let newWord = nonLosingWords[Math.floor(Math.random()*nonLosingWords.length)];
      return newWord.slice(fragment.length,fragment.length+1);
    } else {
        return `hmmmm. <say-as interpret-as="interjection">aw man. oy. uh oh.</say-as>  I can't think of anything, I guess I lose. good game!`;
    }
}
function alexaWin(speech) {
  alexaScore += 1;
  fragment = "";
  speech += ` The current score is... me: ${alexaScore}. you: ${playerScore}.`;
  speech += ' Pick a letter to begin the next round.'
  return speech;
}
function playerWin(speech) {
  playerScore += 1;
  fragment = alphabet[Math.floor(Math.random()*25)];
  speech += ` The current score is... me: ${alexaScore}. you: ${playerScore}.`;
  speech += ` I will begin the next round with ${fragment}.  Your turn.  Pick a letter`
  return speech;
}