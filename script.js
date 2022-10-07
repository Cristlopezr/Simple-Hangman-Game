(() => {
	const input = document.querySelector('#word'),
		form = document.querySelector('#form'),
		list = document.querySelector('#list'),
		restartBtn = document.querySelector('#restart'),
		attempts = document.querySelector('#attempts'),
		winnerOrLoser = document.querySelector('#winner-or-loser'),
		tryBtn = document.querySelector('#try'),
		error = document.querySelector('#error'),
		attemptsLeftText = 'Attempts Left';

	const API_URL = 'https://random-words-api.vercel.app/word/verb';

	let randomWord = '',
		randomWordArray = [],
		attemptsLeft = 0;

	const getWord = async () => {
		const response = await fetch(API_URL);
		const word = await response.json();
		return word[0].word;
	};

	const start = async () => {
		disableButtons(false);
		winnerOrLoser.classList.remove('loser');
		winnerOrLoser.classList.remove('winner');
		winnerOrLoser.innerText = '';
		input.value = '';
		try {
			randomWord = await getWord();
			console.log(randomWord);

			randomWordArray = Array(randomWord.length).fill('__', 0, randomWord.length);

			attemptsLeft = randomWord.length + 1;

			attempts.innerText = `${attemptsLeftText}: ${attemptsLeft}`;

			drawLetter(randomWordArray);
		} catch (err) {
			error.classList.remove('hide');
			error.innerText = 'Something went wrong, please try restarting the game';
		}
	};

	const disableButtons = state => {
		tryBtn.disabled = state;
	};

	const drawLetter = randomWordArray => {
		list.innerHTML = '';
		return randomWordArray.forEach(letter => {
			list.innerHTML += `<li>${letter}<li>`;
		});
	};

	const checkLetter = (e, randomWord, randomWordArray) => {
		if (input.value !== '') {
			let letterExist = false;
			for (let i = 0; i < randomWord.length; i++) {
				if (randomWord[i].toUpperCase() === input.value.toUpperCase()) {
					randomWordArray = updateRandomWordArray(randomWordArray, i, input.value);
					drawLetter(randomWordArray);
					letterExist = true;
				}
			}
			if (!letterExist && attemptsLeft > 0) attemptsLeft = updateAttempts(attemptsLeft);
		}
		checkWinner(attemptsLeft, randomWordArray);
		e.preventDefault();
		return (input.value = '');
	};

	const updateRandomWordArray = (randomWordArray, i, value) => {
		randomWordArray[i] = value.toUpperCase();
		return randomWordArray;
	};

	const updateAttempts = attemptsLeft => {
		attemptsLeft -= 1;
		attempts.innerText = `${attemptsLeftText}: ${attemptsLeft}`;
		return attemptsLeft;
	};

	const checkWinner = (attemptsLeft, randomWordArray) => {
		if (attemptsLeft === 0) {
			attemptsLeft = 0;
			disableButtons(true);
			winnerOrLoser.classList.add('loser');
			return (winnerOrLoser.innerText = `You've Lost :(
				The word was: ${randomWord}`);
		}

		if (randomWordArray.every(letter => letter !== '__')) {
			disableButtons(true);
			winnerOrLoser.classList.add('winner');
			return (winnerOrLoser.innerText = `You've won!!!`);
		}
	};

	input.addEventListener('input', () => {
		input.value = input.value[0] ? input.value[0] : '';
	});

	form.addEventListener('submit', e => {
		checkLetter(e, randomWord, randomWordArray);
	});

	restartBtn.addEventListener('click', start);

	start();
})();
