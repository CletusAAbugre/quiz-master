const API_URL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=hard";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");

// Fetch Questions from API
async function fetchQuestions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    questions = data.results;
    loadQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
    questionEl.innerText = "Failed to load questions. Please try again later.";
  }
}

// Load a Question
function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionEl.innerText = decodeHTML(currentQuestion.question);

  answersEl.innerHTML = "";

  const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  shuffleArray(allAnswers);

  allAnswers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.classList.add("answer", "list-group-item", "list-group-item-action");
    button.innerText = `${String.fromCharCode(65 + index)}. ${decodeHTML(answer)}`;
    button.addEventListener("click", () => {
      checkAnswer(answer, currentQuestion.correct_answer);
      // Disable all buttons after an answer is selected
      const allButtons = answersEl.querySelectorAll("button");
      allButtons.forEach(btn => btn.disabled = true);
      nextBtn.style.display = "block";  // Show next button after answering
    });
    answersEl.appendChild(button);
  });
}

// Check Answer
function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    score++;
    alert("Correct!");
  } else {
    alert(`Wrong! The correct answer is: ${decodeHTML(correctAnswer)}`);
  }

  currentQuestionIndex++;
}

// Show Results
function showResults() {
  questionEl.innerText = `Quiz Complete! Your score: ${score}/${questions.length}`;
  answersEl.innerHTML = "";
  nextBtn.style.display = "none";
  
  // Disable all buttons (including Next button)
  const allButtons = answersEl.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);
  
  const startOverButton = document.createElement("button");
  startOverButton.innerText = "Start Over";
  startOverButton.addEventListener("click", restartQuiz);
  answersEl.appendChild(startOverButton);
}

// Utility: Decode HTML Entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Utility: Shuffle Array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];  // Swap elements
  }
}

// Event Listener
nextBtn.addEventListener("click", loadQuestion);

// Restart Quiz
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.style.display = "none";  // Hide "Next" button
  fetchQuestions();  // Reload questions
}

// Initialize Quiz
fetchQuestions();
