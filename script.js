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

const getWord = async () => {
  const response = await fetch(API_URL);
  const word = await response.json();
  return word[0].word;
};

const start = async () => {
  disableButtons(false);
  input.value = '';
  try {
    randomWord = await getWord();
  
    randomWordLetters = Array(randomWord.length).fill('__', 0, randomWord.length);

    attemptsLeft = randomWord.length + 1;
    attempts.innerText = `${attemptsLeftText}: ${attemptsLeft}`;

    drawLetter(randomWordLetters);
  } catch (err) {
    error.classList.remove('hide');
    error.innerText = 'Something went wrong, please try restarting the game';
  }
};

const disableButtons = (state) => {
  tryBtn.disabled = state;
};

const drawLetter = (randomWordLetters) => {
  list.innerHTML = '';
  return randomWordLetters.forEach((letter) => {
    list.innerHTML += `<li>${letter}<li>`;
  });
};

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

const updateRandomWordLetters = (randomWordLetters, i, value) => {
  randomWordLetters[i] = value.toUpperCase();
  return randomWordLetters;
};

const updateAttempts = (attemptsLeft) => {
  attemptsLeft -= 1;
  attempts.innerText = `${attemptsLeftText}: ${attemptsLeft}`;
  return attemptsLeft;
};

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

input.addEventListener('input', () => {
  input.value = input.value[0] ? input.value[0] : '';
});

form.addEventListener('submit', (e) => {
  checkLetter(e, randomWord, randomWordLetters);
});

restartBtn.addEventListener('click', start);

start();
