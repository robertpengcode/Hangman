console.log('app.js loaded');

//use jQuery
$(document).ready(function() {
  //set up 3 "classes": Letter, Word, & Game
  //define a "Letter" class using a constructor function
  function Letter(value, hidden) {
    this.value = value;
    this.hidden = hidden;
    this.hide = function() {
      this.hidden = true;
    };
    this.show = function() {
      this.hidden = false;
    };
    this.render = function() {
      if (this.hidden) {
        return '?';
      } else {
        return this.value;
      }
    };
  }

  //define a "Word" class using a class declaration
  class Word {
    constructor(letters) {
      this.letters = [];
      this.tryCount = 0;
      this.tryCorrect = false;
    }
    getLetter(newWord) {
      for (let i = 0; i < newWord.length; i++) {
        let aLetter = new Letter(newWord[i], true);
        this.letters.push(aLetter);
      }
    }
    try (tryLetter) {
      for (let k = 0; k < this.letters.length; k++) {
        if (this.letters[k].value === tryLetter) {
          this.letters[k].hidden = false;
          this.tryCount++;
        }
      }
    }
    isFound() {
      for (let m = 0; m < this.letters.length; m++) {
        if (this.letters[m].hidden === true) {
          return false;
        }
      }
      return true;
    }
    render() {
      let status = '';
      for (let j = 0; j < this.letters.length; j++) {
        status += this.letters[j].render();
        status += ` `;
      }
      return status;
    }
  }

  //define a "Game" class using a class declaration
  class Game {
    constructor(wordBank) {
      this.gameIsOn = true;
      this.guessesAllowed = 10;
      this.guessedLetters = [];
      this.guessedLettersString = 'Guessed Letters: ';
      this.wordBank = wordBank;
      this.currentWord = '';
      this.output = '';
      this.messageCorrect = `🙂 Correct! Keep Guessing.`;
      this.messageWrong = '';
      this.messageWin = `😄 Game Over! You win. Click Exit to play again.`;
      this.messageHangman = `😵 Hangman! You lose. Click Exit to play again.`;
    }
    startGame() {
      this.currentWord = new Word();
      let randomIndex = Math.floor(Math.random() * 25);
      this.currentWord.getLetter(this.wordBank[randomIndex]);
      this.output = this.currentWord.render();
      wordOutput.append(this.output);
    }
    guess(tryLetter) {
      this.currentWord.try(tryLetter);
      this.output = this.currentWord.render();
      wordOutput.empty();
      wordOutput.append(this.output);
      this.guessedLetters.push(tryLetter);
      //console.log(this.guessedLetters);
      this.guessedLettersString += `'${tryLetter}' `;
      guessedLetters.empty();
      guessedLetters.append(this.guessedLettersString);
      //console.log(this.currentWord.isFound());

      //renderMessage, control game over
      if (this.currentWord.tryCount > 0) {
        this.currentWord.tryCorrect = true;
        this.currentWord.tryCount = 0;
      }
      if (this.currentWord.tryCorrect) {
        if (this.currentWord.isFound()) {
          this.gameIsOn = false;
          message.empty();
          message.append(this.messageWin);
        } else {
          message.empty();
          message.append(this.messageCorrect);
          this.currentWord.tryCorrect = false;
        }
      } else {
        this.guessesAllowed = this.guessesAllowed - 1;
        console.log(this.guessesAllowed);
        message.empty();
        if (this.guessesAllowed === 0) {
          this.gameIsOn = false;
          console.log(this.gameIsOn);
          message.append(this.messageHangman);
        } else if (this.guessesAllowed === 1) {
          this.messageWrong = `☹️ Wrong! You have only 1 time left!`;
          message.append(this.messageWrong);
        } else {
          this.messageWrong = `☹️ Wrong! You have ${this.guessesAllowed} times left.`;
          message.append(this.messageWrong);
        }
      }
    }
  }

  //define the words in the game using an array
  let wordBank = [
    'apple',
    'banana',
    'bat',
    'bird',
    'broccoli',
    'blueberry',
    'carrot',
    'cat',
    'chicken',
    'cow',
    'deer',
    'dog',
    'grape',
    'horse',
    'lion',
    'orange',
    'pear',
    'pig',
    'potato',
    'pumpkin',
    'rabbit',
    'shark',
    'strawberry',
    'tiger',
    'tomato',
  ];

  //use jQuery selector to select the html elements
  const message = $('#message');
  const wordOutput = $('#wordOutput');
  const letterKey = $('#letterKey');
  const keys = $('.letter');
  const guessedLetters = $('#guessedLetters');

  //create a new game object
  let currentGame = new Game(wordBank);

  //start or restart a game; use jQuery selector
  const btnStartGame = $('#btnStart');
  //click Restart Game button to restart a game; use jQuery on method
  btnStartGame.on('click', function() {
    if (currentGame.gameIsOn) {
      currentGame.startGame();
    }
  });

  //click letter keyboard to get id
  letterKey.on('click', function(event) {
    if (currentGame.gameIsOn) {
      tryLetter = getButtonID(event.target.id);
      currentGame.guess(tryLetter);
      number = currentGame.guessesAllowed;
      currentGame.renderMessage;
      draw(number);
    }
  });
  //function to turn a letter button's id
  function getButtonID(buttonID) {
    return buttonID;
  }

  //use jQuery selector
  const btnExit = $('#btnExit');
  //click the exit button to exit the game; use jQuery on method
  btnExit.on('click', refresh);
  //exit the game by refreshing the page
  function refresh() {
    location.reload();
  }

  //define canvas element
  let canvas = $('#canvasHangman');
  let ctx = canvas[0].getContext("2d");
  //function to draw on canvas
  function draw(number) {
    //let number = currentGame.guessesAllowed;
    //console.log(number);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    switch (number) {
      //step1: draw a circle as head
      case 9:
        ctx.beginPath();
        ctx.arc(100, 75, 35, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        //step2: draw 2 arcs as eyes
      case 8:
        ctx.beginPath();
        ctx.arc(88, 70, 7, 0, 1 * Math.PI, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(112, 70, 7, 0, 1 * Math.PI, true);
        ctx.stroke();
        break;
        //step3: draw 1 arc as mouth
      case 7:
        ctx.beginPath();
        ctx.arc(100, 80, 12, 0, 1 * Math.PI, false);
        ctx.stroke();
        break;
        //step4: draw a line as body
      case 6:
        ctx.beginPath();
        ctx.moveTo(100, 110);
        ctx.lineTo(100, 150);
        ctx.stroke();
        break;
        //step5: draw two lines as hands
      case 5:
        ctx.beginPath();
        ctx.moveTo(100, 130);
        ctx.lineTo(60, 115);
        ctx.moveTo(100, 130);
        ctx.lineTo(140, 115);
        ctx.stroke();
        break;
        //step6: draw two lines as legs
      case 4:
        ctx.beginPath();
        ctx.moveTo(100, 150);
        ctx.lineTo(60, 165);
        ctx.moveTo(100, 150);
        ctx.lineTo(140, 165);
        ctx.stroke();
        break;
        //step7: draw a line as floor and change to nervous face
      case 3:
        //floor
        ctx.beginPath();
        ctx.moveTo(20, 190);
        ctx.lineTo(180, 190);
        ctx.strokeStyle = "purple";
        ctx.stroke();
        //clear the original face and put on a nervous face
        ctx.clearRect(78, 50, 44, 45);
        ctx.beginPath();
        ctx.moveTo(80, 70);
        ctx.lineTo(95, 70);
        ctx.moveTo(105, 70);
        ctx.lineTo(120, 70);
        ctx.moveTo(90, 90);
        ctx.lineTo(110, 90);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        break;
        //step8: draw a line as pole
      case 2:
        ctx.beginPath();
        ctx.moveTo(30, 190);
        ctx.lineTo(30, 10);
        ctx.strokeStyle = "purple";
        ctx.stroke();
        break;
        //step9: draw a line as branch
      case 1:
        ctx.beginPath();
        ctx.moveTo(20, 10);
        ctx.lineTo(110, 10);
        ctx.strokeStyle = "purple";
        ctx.stroke();
        break;
        //step10: draw a line to hang the man and change to dead face
        //drop hands & legs as well
      case 0:
        ctx.beginPath();
        ctx.moveTo(100, 10);
        ctx.lineTo(100, 40);
        ctx.strokeStyle = "purple";
        ctx.stroke();
        //sad mouth
        ctx.clearRect(78, 50, 44, 45);
        ctx.beginPath();
        ctx.arc(100, 100, 12, 0, 1 * Math.PI, true);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        //two crossed eyes
        ctx.moveTo(80, 65);
        ctx.lineTo(95, 80);
        ctx.moveTo(80, 80);
        ctx.lineTo(95, 65);
        ctx.moveTo(105, 65);
        ctx.lineTo(120, 80);
        ctx.moveTo(105, 80);
        ctx.lineTo(120, 65);
        ctx.stroke();
        //clear the original body and drop hands & legs
        ctx.clearRect(50, 112, 100, 55);
        ctx.beginPath();
        //body
        ctx.moveTo(100, 110);
        ctx.lineTo(100, 150);
        //dropped hands
        ctx.moveTo(100, 130);
        ctx.lineTo(60, 150);
        ctx.moveTo(100, 130);
        ctx.lineTo(140, 150);
        //dropped legs
        ctx.moveTo(100, 150);
        ctx.lineTo(60, 170);
        ctx.moveTo(100, 150);
        ctx.lineTo(140, 170);
        ctx.stroke();
        break;
    }
  }
})
