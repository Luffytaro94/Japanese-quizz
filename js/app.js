/**
 * app.js
 * Contrôleur principal : navigation entre écrans, déroulement du quiz,
 * rendu de "Tous les mots" et des statistiques.
 */

(function () {
  "use strict";

  const SESSION_TARGET_WORDS = 20; // nombre de mots uniques visés par session

  // ---------------------------------------------------------------------
  // Vérification obligatoire de la base au démarrage
  // ---------------------------------------------------------------------
  const validation = validateWords(WORDS);
  if (!validation.valid) {
    // Signalement clair au développeur : on ne masque jamais le problème.
    document.addEventListener("DOMContentLoaded", () => {
      const app = document.getElementById("app");
      app.innerHTML =
        '<div style="padding:24px;font-family:monospace;color:#fff;background:#3a1a16;min-height:100vh;">' +
        "<h2>Erreur : base de mots invalide</h2><ul>" +
        validation.errors.map((e) => `<li>${escapeHtml(e)}</li>`).join("") +
        "</ul></div>";
    });
    console.error("Validation WORDS échouée :", validation.errors);
    // On arrête l'initialisation normale de l'application.
    window.__JPQUIZ_INVALID__ = true;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------
  // État en mémoire
  // ---------------------------------------------------------------------
  let progress = {}; // rempli au démarrage depuis le storage
  let session = null; // état de la session de quiz en cours

  function freshSession() {
    return {
      currentWord: null,
      awaitingCorrection: false,
      recentIds: [],
      processing: false,
      asked: 0, // nombre de questions initiales répondues (pas les retypes)
      correct: 0,
      wrong: 0,
      uniqueSeen: new Set(),
      missed: new Set(),
    };
  }

  // ---------------------------------------------------------------------
  // Navigation entre écrans
  // ---------------------------------------------------------------------
  const screens = {};

  function initScreens() {
    document.querySelectorAll(".screen").forEach((el) => {
      screens[el.id] = el;
    });
  }

  function showScreen(id) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    if (screens[id]) screens[id].classList.add("active");
  }

  // ---------------------------------------------------------------------
  // Accueil
  // ---------------------------------------------------------------------
  function renderHome() {
    const masteredCount = WORDS.filter(
      (w) => getWordProgress(progress, w.id).level === "mastered"
    ).length;

    document.getElementById(
      "home-mastered-count"
    ).textContent = `${masteredCount} / 100 maîtrisés`;
    document.getElementById("home-progress-fill").style.width = `${masteredCount}%`;
  }

  function goHome() {
    renderHome();
    showScreen("screen-home");
  }

  // ---------------------------------------------------------------------
  // Quiz
  // ---------------------------------------------------------------------
  function startSession() {
    session = freshSession();
    showScreen("screen-quiz");
    nextQuestion();
  }

  function nextQuestion() {
    const word = pickNextWord(WORDS, progress, session.recentIds);
    session.currentWord = word;
    session.awaitingCorrection = false;
    session.awaitingAdvance = false;
    session.processing = false;

    session.recentIds.push(word.id);
    if (session.recentIds.length > 2) session.recentIds.shift();

    renderQuestion();
  }

  function renderQuestion() {
    const word = session.currentWord;
    document.getElementById("quiz-french").textContent = word.french;
    document.getElementById("quiz-progress-text").textContent = `${session.uniqueSeen.size} / ${SESSION_TARGET_WORDS}`;

    const feedback = document.getElementById("quiz-feedback");
    feedback.textContent = "";
    feedback.className = "quiz-feedback";

    const input = document.getElementById("quiz-input");
    input.value = "";
    input.className = "quiz-input";
    input.disabled = false;

    const submitBtn = document.getElementById("quiz-submit");
    submitBtn.textContent = "Valider";
    submitBtn.disabled = false;

    const hanko = document.getElementById("hanko");
    hanko.classList.remove("stamp");
    hanko.style.opacity = "0";

    document.getElementById("quiz-card").classList.remove("shake");

    // Prêt à recevoir la saisie immédiatement.
    window.requestAnimationFrame(() => input.focus());
  }

  function handleQuizSubmit(e) {
    e.preventDefault();
    if (!session || session.processing) return;

    const input = document.getElementById("quiz-input");
    const raw = input.value;

    // Protection : réponse vide ignorée (pas de plantage, pas de comptage).
    if (raw.trim() === "") {
      input.focus();
      return;
    }

    const word = session.currentWord;

    if (session.awaitingCorrection) {
      handleCorrectionAttempt(raw, word);
      return;
    }

    const correct = isAnswerCorrect(raw, word);
    session.processing = true;

    // Met à jour la progression persistante.
    const entry = getWordProgress(progress, word.id);
    const updated = updateWordProgress(entry, correct);
    progress[word.id] = updated;
    saveProgress(progress);

    // Statistiques de session (comptées une seule fois par question posée).
    session.asked += 1;
    session.uniqueSeen.add(word.id);
    if (correct) {
      session.correct += 1;
    } else {
      session.wrong += 1;
      session.missed.add(word.id);
    }

    if (correct) {
      showCorrectFeedback(word);
    } else {
      showIncorrectFeedback(word, raw);
    }
  }

  function showCorrectFeedback(word) {
    const feedback = document.getElementById("quiz-feedback");
    feedback.className = "quiz-feedback correct";
    feedback.innerHTML = `✓ Correct — <span class="fb-answer">${escapeHtml(word.romaji)}</span>`;

    const input = document.getElementById("quiz-input");
    input.className = "quiz-input correct";
    input.disabled = true;

    const hanko = document.getElementById("hanko");
    hanko.classList.add("stamp");

    const submitBtn = document.getElementById("quiz-submit");
    submitBtn.textContent = "Continuer →";
    submitBtn.disabled = false;

    session.processing = false;
    session.awaitingAdvance = true;
  }

  function showIncorrectFeedback(word, userAnswer) {
    const feedback = document.getElementById("quiz-feedback");
    feedback.className = "quiz-feedback incorrect";
    feedback.innerHTML =
      `✗ Incorrect<br>Ta réponse : <span class="fb-answer">${escapeHtml(userAnswer.trim())}</span><br>` +
      `Bonne réponse : <span class="fb-answer">${escapeHtml(word.romaji)}</span>`;

    const card = document.getElementById("quiz-card");
    card.classList.remove("shake");
    void card.offsetWidth; // force le redémarrage de l'animation
    card.classList.add("shake");

    const input = document.getElementById("quiz-input");
    input.className = "quiz-input incorrect";
    input.value = "";
    input.disabled = false;

    const submitBtn = document.getElementById("quiz-submit");
    submitBtn.textContent = "Valider la correction";
    submitBtn.disabled = false;

    session.awaitingCorrection = true;
    session.processing = false;

    window.requestAnimationFrame(() => input.focus());
  }

  function handleCorrectionAttempt(raw, word) {
    if (isAnswerCorrect(raw, word)) {
      // La bonne réponse a été retapée correctement : on peut avancer.
      advanceAfterAnswer();
    } else {
      const input = document.getElementById("quiz-input");
      input.className = "quiz-input incorrect";
      input.value = "";

      const card = document.getElementById("quiz-card");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");

      window.requestAnimationFrame(() => input.focus());
    }
  }

  // Gère le tap/Entrée sur "Continuer" après une bonne réponse.
  function handleContinue() {
    if (!session || !session.awaitingAdvance) return;
    session.awaitingAdvance = false;
    advanceAfterAnswer();
  }

  function advanceAfterAnswer() {
    if (session.uniqueSeen.size >= SESSION_TARGET_WORDS) {
      endSession();
    } else {
      nextQuestion();
    }
  }

  function endSession() {
    const total = session.correct + session.wrong;
    const rate = total > 0 ? Math.round((session.correct / total) * 100) : 0;

    document.getElementById("summary-stats").innerHTML = `
      ${statRow("Mots étudiés", session.uniqueSeen.size)}
      ${statRow("Bonnes réponses", session.correct)}
      ${statRow("Erreurs", session.wrong)}
      ${statRow("Taux de réussite", rate + " %")}
    `;

    const reviewEl = document.getElementById("summary-review");
    reviewEl.textContent =
      session.missed.size > 0
        ? `${session.missed.size} mot${session.missed.size > 1 ? "s" : ""} ${session.missed.size > 1 ? "sont" : "est"} à revoir.`
        : "Aucune erreur cette session, bravo !";

    showScreen("screen-summary");
  }

  function statRow(label, value) {
    return `<div class="stat-card"><span class="stat-label">${escapeHtml(label)}</span><span class="stat-value">${escapeHtml(String(value))}</span></div>`;
  }

  // ---------------------------------------------------------------------
  // Tous les mots
  // ---------------------------------------------------------------------
  const LEVEL_LABEL = {
    new: { icon: "🆕", text: "Nouveau", cls: "badge-new" },
    review: { icon: "🔄", text: "À revoir", cls: "badge-review" },
    mastered: { icon: "✅", text: "Maîtrisé", cls: "badge-mastered" },
  };

  function renderAllWords() {
    const list = document.getElementById("allwords-list");
    const rows = WORDS.map((w) => {
      const level = getWordProgress(progress, w.id).level;
      const info = LEVEL_LABEL[level];
      return `
        <li class="word-row">
          <div class="word-row-main">
            <span class="word-row-id">${w.id}.</span>
            <span class="word-row-fr">${escapeHtml(w.french)}</span>
            <span class="word-row-romaji">— ${escapeHtml(w.romaji)}</span>
          </div>
          <span class="badge ${info.cls}">${info.icon} ${info.text}</span>
        </li>`;
    });
    list.innerHTML = rows.join("");
  }

  // ---------------------------------------------------------------------
  // Statistiques
  // ---------------------------------------------------------------------
  function renderStats() {
    let seen = 0,
      correct = 0,
      wrong = 0,
      mastered = 0,
      review = 0;

    WORDS.forEach((w) => {
      const p = getWordProgress(progress, w.id);
      if (p.attempts > 0) seen += 1;
      correct += p.correct;
      wrong += p.wrong;
      if (p.level === "mastered") mastered += 1;
      if (p.level === "review") review += 1;
    });

    const total = correct + wrong;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

    document.getElementById("stats-wrap").innerHTML = `
      ${statRow("Mots vus", `${seen} / 100`)}
      ${statRow("Bonnes réponses", correct)}
      ${statRow("Erreurs", wrong)}
      ${statRow("Taux de réussite", rate + " %")}
      ${statRow("Mots maîtrisés", `${mastered} / 100`)}
      ${statRow("Mots à revoir", review)}
    `;
  }

  // ---------------------------------------------------------------------
  // Réinitialisation
  // ---------------------------------------------------------------------
  function openResetModal() {
    document.getElementById("modal-reset").classList.remove("hidden");
  }
  function closeResetModal() {
    document.getElementById("modal-reset").classList.add("hidden");
  }
  function confirmReset() {
    resetProgress();
    progress = loadProgress();
    closeResetModal();
    renderHome();
    showScreen("screen-home");
  }

  // ---------------------------------------------------------------------
  // Câblage des événements
  // ---------------------------------------------------------------------
  function wireEvents() {
    document.getElementById("btn-start").addEventListener("click", startSession);
    document.getElementById("btn-allwords").addEventListener("click", () => {
      renderAllWords();
      showScreen("screen-allwords");
    });
    document.getElementById("btn-stats").addEventListener("click", () => {
      renderStats();
      showScreen("screen-stats");
    });
    document.getElementById("btn-settings").addEventListener("click", () => showScreen("screen-settings"));

    document.getElementById("btn-quiz-home").addEventListener("click", goHome);
    document.getElementById("btn-allwords-back").addEventListener("click", goHome);
    document.getElementById("btn-stats-back").addEventListener("click", goHome);
    document.getElementById("btn-settings-back").addEventListener("click", goHome);

    document.getElementById("btn-restart").addEventListener("click", startSession);
    document.getElementById("btn-summary-home").addEventListener("click", goHome);

    document.getElementById("btn-open-reset").addEventListener("click", openResetModal);
    document.getElementById("btn-reset-cancel").addEventListener("click", closeResetModal);
    document.getElementById("btn-reset-confirm").addEventListener("click", confirmReset);

    const quizForm = document.getElementById("quiz-form");
    quizForm.addEventListener("submit", (e) => {
      if (session && session.awaitingAdvance) {
        e.preventDefault();
        handleContinue();
      } else {
        handleQuizSubmit(e);
      }
    });
  }

  // ---------------------------------------------------------------------
  // Démarrage
  // ---------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    if (window.__JPQUIZ_INVALID__) return; // erreur déjà affichée plus haut

    initScreens();
    progress = loadProgress();
    wireEvents();
    goHome();
  });
})();
