const questions = [
    {
        question: "Which language runs in a web browser?",
        answers: [
            { text: "Java", correct: false },
            { text: "C", correct: false },
            { text: "JavaScript", correct: true },
            { text: "Python", correct: false }
        ]
    },
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hypertext Markup Language", correct: true },
            { text: "Hypertext Markdown Language", correct: false },
            { text: "Hyperloop Machine Language", correct: false }
        ]
    },
    {
        question: "Which CSS property is used to change the text color?",
        answers: [
            { text: "content-color", correct: false },
            { text: "color", correct: true },
            { text: "text-style", correct: false },
            { text: "font-color", correct: false }
        ]
    }
];

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timeLeft = 15;
let timerInterval;

const questionElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const timerDisplay = document.getElementById('time-count');
const progressBar = document.getElementById('progress-bar');
const quizContent = document.getElementById('quiz-content');
const resultScreen = document.getElementById('result-screen');

function startQuiz() {
    // Shuffling questions for a fresh experience
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('high-score-val').innerText = localStorage.getItem('quizHighScore') || 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    startTimer();
    updateProgressBar();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerDisplay.innerText = timeLeft;
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoCheckAnswer();
        }
    }, 1000);
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) score++;
    
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === "true");
        button.disabled = true;
    });

    clearInterval(timerInterval);
    nextButton.classList.remove('hide');
}

function autoCheckAnswer() {
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === "true");
        button.disabled = true;
    });
    nextButton.classList.remove('hide');
}

function setStatusClass(element, correct) {
    if (correct) element.classList.add('correct');
    else element.classList.add('wrong');
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (shuffledQuestions.length > currentQuestionIndex) {
        setNextQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    progressBar.style.width = `100%`;
    quizContent.classList.add('hide');
    resultScreen.classList.remove('hide');
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = shuffledQuestions.length;
    
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (score > highScore) localStorage.setItem('quizHighScore', score);
}

startQuiz();