const questions = [
  {
    question: "What is the main idea of the whole paragraph?",
    answers: [
      "There is one global beauty standard.",
      "Beauty is subjective and not universal.",
      "Western beauty ideals are always accepted.",
      "Body weight is the only beauty factor."
    ],
    correct: 1
  },
  {
    question: "Which option is a supporting detail (not the central idea)?",
    answers: [
      "Beauty can be hard to define.",
      "Beauty is influenced by culture.",
      "Narrow-shaped faces with round eyes and small noses.",
      "No one-size-fits-all beauty standard."
    ],
    correct: 2
  },
  {
    question: "The paragraph says beauty is subjective. This means...",
    answers: [
      "Only experts can define beauty.",
      "Everyone agrees on beauty traits.",
      "Ideas of beauty can change from person to person.",
      "Beauty is mostly about clothing."
    ],
    correct: 2
  },
  {
    question: "Which idea is repeated in different forms throughout the text?",
    answers: [
      "Beauty standards are exactly the same in every culture.",
      "Beauty varies by viewer, culture, and environment.",
      "Only skin tone affects attractiveness.",
      "The article rejects all science."
    ],
    correct: 1
  },
  {
    question: "What role does culture play in the paragraph?",
    answers: [
      "Culture has little to no effect.",
      "Culture makes beauty completely objective.",
      "Culture influences what people find attractive.",
      "Culture changes only fashion, not beauty."
    ],
    correct: 2
  },
  {
    question: "Which sentence best captures the author's final conclusion?",
    answers: [
      "Beauty can be measured with one global checklist.",
      "A universal definition of beauty does not apply to everyone.",
      "People should follow Western standards.",
      "Beauty depends only on facial features."
    ],
    correct: 1
  },
  {
    question: "If a sentence gives examples (e.g., fair skin vs darker skin), it is usually...",
    answers: [
      "the thesis statement",
      "a supporting detail",
      "the title",
      "the conclusion only"
    ],
    correct: 1
  },
  {
    question: "What does the paragraph suggest about environment?",
    answers: [
      "Environment shapes people's beauty perceptions.",
      "Environment has no role in opinions.",
      "Environment defines one perfect body type for all.",
      "Environment is less important than social media only."
    ],
    correct: 0
  },
  {
    question: "Which is the best short summary?",
    answers: [
      "Beauty is fixed and universal.",
      "Beauty is fully biological and never cultural.",
      "Beauty is complex, subjective, and shaped by context.",
      "Beauty is only about skin color."
    ],
    correct: 2
  },
  {
    question: "Which statement would the author most likely agree with?",
    answers: [
      "A one-size-fits-all standard is unrealistic.",
      "One international standard should replace local views.",
      "Beauty can be defined in one sentence for all people.",
      "All cultures prefer identical features."
    ],
    correct: 0
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionCounter = document.getElementById("question-counter");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer-text");
const timerBar = document.getElementById("timer-bar");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const finalScore = document.getElementById("final-score");
const performanceMsg = document.getElementById("performance-msg");

let currentQuestion = 0;
let score = 0;
let seconds = 15;
let timerId = null;
let answered = false;

function startGame() {
  currentQuestion = 0;
  score = 0;
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  nextBtn.classList.add("hidden");
  feedback.textContent = "";
  const q = questions[currentQuestion];
  questionCounter.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
  scoreText.textContent = `Score: ${score}`;
  questionText.textContent = q.question;
  answersBox.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.addEventListener("click", () => handleAnswer(btn, index));
    answersBox.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  seconds = 15;
  timerText.textContent = `Time left: ${seconds}s`;
  timerBar.style.width = "100%";

  timerId = setInterval(() => {
    seconds -= 1;
    timerText.textContent = `Time left: ${seconds}s`;
    timerBar.style.width = `${(seconds / 15) * 100}%`;

    if (seconds <= 0) {
      clearInterval(timerId);
      lockQuestion();
      feedback.textContent = "Time is up!";
      nextBtn.classList.remove("hidden");
    }
  }, 1000);
}

function handleAnswer(clickedBtn, index) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const correctIndex = questions[currentQuestion].correct;
  const buttons = [...answersBox.children];

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
  });

  if (index === correctIndex) {
    clickedBtn.classList.add("correct");
    score += 100;
    feedback.textContent = "Correct! +100";
  } else {
    clickedBtn.classList.add("wrong");
    feedback.textContent = "Not this one. Read the key idea again.";
  }

  scoreText.textContent = `Score: ${score}`;
  nextBtn.classList.remove("hidden");
}

function lockQuestion() {
  answered = true;
  const correctIndex = questions[currentQuestion].correct;
  [...answersBox.children].forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
  });
}

function nextQuestion() {
  currentQuestion += 1;
  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScore.textContent = `Your score: ${score} / ${questions.length * 100}`;

  const ratio = score / (questions.length * 100);
  if (ratio >= 0.8) performanceMsg.textContent = "Excellent work! You can identify main ideas very well.";
  else if (ratio >= 0.5) performanceMsg.textContent = "Good job! Review detail vs main idea for even better accuracy.";
  else performanceMsg.textContent = "Nice effort! Read the paragraph again and look for repeated big ideas.";
}

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startGame);
