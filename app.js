/*
  Protótipo TVDi / TV 3.0
  ---------------------------------
  MVP:
  - vídeo Eduplay incorporado por iframe
  - enquete após 60 segundos
  - 2 alternativas
  - resposta correta soma 10 pontos
  - navegação por teclado simulando controle remoto

  LIMITAÇÃO IMPORTANTE:
  Como o vídeo do Eduplay está em outro domínio, o navegador pode impedir
  que este JavaScript leia currentTime() ou pause() o iframe diretamente.

  Nesta primeira versão, a enquete é disparada por um cronômetro local
  iniciado quando a página carrega.

  Para demonstração:
  1) inicie o vídeo manualmente
  2) o cronômetro da página dispara a enquete após QUESTION_TIME_MS
*/

const QUESTION_TIME_MS = 60_000;
const POINTS_FOR_CORRECT_ANSWER = 10;
const CORRECT_INDEX = 1;

let score = 0;
let selectedIndex = 0;
let questionShown = false;
let answered = false;
let questionTimer = null;

const scoreEl = document.getElementById("score");
const quizEl = document.getElementById("quiz");
const feedbackEl = document.getElementById("feedback");
const shadeEl = document.getElementById("shade");
const options = [...document.querySelectorAll(".option")];
const continueBtn = document.getElementById("continueBtn");

const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackText = document.getElementById("feedbackText");

function startQuestionTimer() {
  clearTimeout(questionTimer);

  questionTimer = setTimeout(() => {
    showQuestion();
  }, QUESTION_TIME_MS);
}

function showQuestion() {
  if (questionShown) return;

  questionShown = true;
  selectedIndex = 0;

  shadeEl.classList.remove("hidden");
  quizEl.classList.remove("hidden");
  feedbackEl.classList.add("hidden");

  updateFocus();
}

function updateFocus() {
  options.forEach((option, index) => {
    option.classList.toggle("focused", index === selectedIndex);
  });
}

function moveSelection(direction) {
  if (quizEl.classList.contains("hidden") || answered) return;

  if (direction === "next") {
    selectedIndex = (selectedIndex + 1) % options.length;
  } else {
    selectedIndex = (selectedIndex - 1 + options.length) % options.length;
  }

  updateFocus();
}

function submitAnswer() {
  if (quizEl.classList.contains("hidden") || answered) return;

  answered = true;

  const isCorrect = selectedIndex === CORRECT_INDEX;

  if (isCorrect) {
    score += POINTS_FOR_CORRECT_ANSWER;
    scoreEl.textContent = score;

    feedbackIcon.textContent = "✓";
    feedbackTitle.textContent = "Resposta correta";
    feedbackText.textContent =
      "Escutar conscientemente envolve direcionar a atenção para detalhes que podem passar despercebidos no ato de apenas ouvir.";
  } else {
    feedbackIcon.textContent = "•";
    feedbackTitle.textContent = "Observe novamente";
    feedbackText.textContent =
      "Ouvir pode acontecer de forma passiva. A escuta consciente exige atenção intencional aos detalhes e relações presentes no ambiente sonoro.";
  }

  quizEl.classList.add("hidden");
  feedbackEl.classList.remove("hidden");
  continueBtn.classList.add("focused");
}

function continueVideo() {
  if (feedbackEl.classList.contains("hidden")) return;

  feedbackEl.classList.add("hidden");
  shadeEl.classList.add("hidden");
}

function resetPrototype() {
  score = 0;
  selectedIndex = 0;
  questionShown = false;
  answered = false;

  scoreEl.textContent = "0";

  quizEl.classList.add("hidden");
  feedbackEl.classList.add("hidden");
  shadeEl.classList.add("hidden");

  updateFocus();
  startQuestionTimer();
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowLeft" || key === "ArrowUp") {
    event.preventDefault();
    moveSelection("previous");
  }

  if (key === "ArrowRight" || key === "ArrowDown") {
    event.preventDefault();
    moveSelection("next");
  }

  if (key === "Enter") {
    event.preventDefault();

    if (!quizEl.classList.contains("hidden")) {
      submitAnswer();
      return;
    }

    if (!feedbackEl.classList.contains("hidden")) {
      continueVideo();
    }
  }

  if (key.toLowerCase() === "r") {
    resetPrototype();
  }

  // Atalho para testes: pressione Q para abrir a pergunta imediatamente.
  if (key.toLowerCase() === "q") {
    showQuestion();
  }
});

options.forEach((option, index) => {
  option.addEventListener("click", () => {
    selectedIndex = index;
    updateFocus();
    submitAnswer();
  });
});

continueBtn.addEventListener("click", continueVideo);

startQuestionTimer();
