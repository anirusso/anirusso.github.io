const green = 'rgb(108,169,101)';
const yellow = 'rgb(200,182,83)';
const grey = 'rgb(120,124,127)';

const WORDS = [
  'Aioli',
  'Anise',
  'Apple',
  'Aspic',
  'Bacon',
  'Bagel',
  'Basil',
  'Beans',
  'Beets',
  'Berry',
  'Bison',
  'Bread',
  'Broth',
  'Candy',
  'Caper',
  'Chard',
  'Chili',
  'Chips',
  'Clams',
  'Clove',
  'Cocoa',
  'Cream',
  'Crepe',
  'Crisp',
  'Cumin',
  'Curry',
  'Dairy',
  'Dates',
  'Dijon',
  'Dough',
  'Donut',
  'Flour',
  'Fries',
  'Fruit',
  'Fudge',
  'Gouda',
  'Gourd',
  'Grain',
  'Grape',
  'Gravy',
  'Grits',
  'Guava',
  'Gumbo',
  'Gyoza',
  'Herbs',
  'Honey',
  'Icing',
  'Jelly',
  'Jerky',
  'Juice',
  'Kebab',
  'Latte',
  'Leeks',
  'Lemon',
  'Limes',
  'Liver',
  'Mango',
  'Maple',
  'Melon',
  'Mocha',
  'Nacho',
  'Olive',
  'Onion',
  'Pasta',
  'Peach',
  'Pecan',
  'Pesto',
  'Pizza',
  'Prawn',
  'Prune',
  'Quail',
  'Queso',
  'Ramen',
  'Ranch',
  'Roast',
  'Salad',
  'Salsa',
  'Sauce',
  'Shank',
  'Spice',
  'Squid',
  'Steak',
  'Stock',
  'Sugar',
  'Sushi',
  'Syrup',
  'Tacos',
  'Taffy',
  'Tapas',
  'Thyme',
  'Toast',
  'Trout',
  'Wafer',
  'Wagyu',
  'Wings',
  'Wheat',
  'Yeast'
];

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[
  Math.floor(Math.random() * WORDS.length)
].toLowerCase();

function initBoard() {
  let board = document.getElementById('game-board');
  //reset board on reload
  board.replaceChildren();
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement('div');
    row.className = 'letter-row';

    for (let j = 0; j < 5; j++) {
      let box = document.createElement('div');
      box.className = 'letter-box';
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}

document.addEventListener('keyup', e => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === 'Backspace' && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === 'Enter') {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
  let box = row.children[nextLetter];

  box.textContent = pressedKey;
  box.classList.add('filled-box');

  currentGuess.push(pressedKey);

  nextLetter += 1;
}

function deleteLetter() {
  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];
  box.textContent = '';
  box.classList.remove('filled-box');
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
  let guessString = '';
  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    toastr.error('Not enough letters!');
    return;
  }

  for (let i = 0; i < 5; i++) {
    let letterColor = '';
    let box = row.children[i];
    let letter = currentGuess[i];

    let letterPosition = rightGuess.indexOf(currentGuess[i]);
    // is letter in the correct guess
    if (letterPosition === -1) {
      letterColor = grey;
    } else {
      if (currentGuess[i] === rightGuess[i]) {
        letterColor = green;
      } else {
        letterColor = yellow;
      }

      rightGuess[letterPosition] = '#';
    }

    let delay = 250 * i;
    setTimeout(() => {
      //shade box
      box.style.backgroundColor = letterColor;
      shadeKeyBoard(letter, letterColor);
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success('You guessed right! Game over!');
    guessesRemaining = 0;
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName('keyboard-button')) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === green) {
        return;
      }

      if (oldColor === yellow && color !== green) {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

document.getElementById('keyboard-cont').addEventListener('click', e => {
  const target = e.target;

  if (!target.classList.contains('keyboard-button')) {
    return;
  }
  let key = target.textContent;

  if (key === 'Del') {
    key = 'Backspace';
  }

  document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
});

$(document).ready(function() {
  $('#keyboard-cont').hide();
  $('#reload').hide();
  $('#play').click(startGame);
});

function startGame() {
  $('#pregame').hide(1000);
  $('#container').show(1000);
  $('#keyboard-cont').show();
  $('#reload').show();
  initBoard();
}
