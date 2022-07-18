const input = document.querySelector('#word');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const restartBtn = document.querySelector('#restart');
const attempts = document.querySelector('#attempts');
const tryBtn = document.querySelector('#try');
const error = document.querySelector('#error');
const attemptsLeftText = 'Attempts Left';

const API_URL = 'https://random-words-api.vercel.app/word/verb';

let randomWord = '';
let randomWordLetters = [];
let attemptsLeft = 0;

//Gets random Word From API
const getWord = async () => {
  const response = await fetch(API_URL);
  const word = await response.json();
  return word[0].word;
};

//Starts Game
const start = async () => {
  disableButtons(false);
  input.value = '';
  try {
    randomWord = await getWord();
    //Creates an Array filled with _ per every letter in the word
    randomWordLetters = Array(randomWord.length).fill('__', 0, randomWord.length);

    //Attempts to guess the word
    attemptsLeft = randomWord.length + 1;
    attempts.innerText = `${attemptsLeftText}: ${attemptsLeft}`;

    drawLetter(randomWordLetters);
  } catch (err) {
    error.classList.remove('hide');
    error.innerText = 'Something went wrong, please try restarting the game';
  }
};

//Disables try button
const disableButtons = (state) => {
  tryBtn.disabled = state;
};

//Draws every letter of the word inside the html list
const drawLetter = (randomWordLetters) => {
  list.innerHTML = '';
  return randomWordLetters.forEach((letter) => {
    list.innerHTML += `<li>${letter}<li>`;
  });
};

//Checks if the letter picked by the user is in the chosen word and calls update word function/check winner function or updateAttempts function
const checkLetter = (e, randomWord, randomWordLetters) => {
  if (input.value !== '') {
    let letterExist = false;
    for (let i = 0; i < randomWord.length; i++) {
      if (randomWord[i].toUpperCase() === input.value.toUpperCase()) {
        randomWordLetters = updateRandomWordLetters(randomWordLetters, i, input.value);
        drawLetter(randomWordLetters);
        letterExist = true;
      }
    }
    if (!letterExist && attemptsLeft > 0) attemptsLeft = updateAttempts(attemptsLeft);
  }
  checkWinner(attemptsLeft, randomWordLetters);
  e.preventDefault();
  return (input.value = '');
};

//Updates word letters when the person picks a letter that's in the word
const updateRandomWordLetters = (randomWordLetters, i, value) => {
  randomWordLetters[i] = value.toUpperCase();
  return randomWordLetters;
};

//Updates attempts if the person fails
const updateAttempts = (attemptsLeft) => {
  attemptsLeft -= 1;
  attempts.innerText = `${attemptsLeftText}: ${attemptsLeft}`;
  return attemptsLeft;
};

//Cheks if the person have won or have lost
const checkWinner = (attemptsLeft, randomWordLetters) => {
  if (attemptsLeft === 0) {
    attemptsLeft = 0;
    disableButtons(true);
    return (attempts.innerText = `${attemptsLeftText}: ${attemptsLeft} - You've Lost
     The word was: ${randomWord}`);
  }

  if (randomWordLetters.every((letter) => letter !== '__')) {
    disableButtons(true);
    return (attempts.innerText = `${attemptsLeftText}: ${attemptsLeft} - You've won`);
  }
};

//Event listeners
//Checks input
input.addEventListener('input', () => {
  input.value = input.value[0] ? input.value[0] : '';
});

//Checks word on submit
form.addEventListener('submit', (e) => {
  checkLetter(e, randomWord, randomWordLetters);
});

//Restarts the game
restartBtn.addEventListener('click', start);

start();
