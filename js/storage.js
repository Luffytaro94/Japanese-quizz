/**
 * storage.js
 * Toute la persistance locale de l'application (localStorage).
 * Aucune donnée n'est jamais envoyée sur un serveur.
 */

const STORAGE_KEY = "jpquiz_progress_v1";

/**
 * Structure par défaut d'une entrée de progression pour un mot.
 */
function defaultWordProgress() {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    correctStreak: 0,
    weight: 1,
    level: "new", // "new" | "review" | "mastered"
  };
}

/**
 * Charge la progression depuis localStorage.
 * Si les données sont absentes, corrompues, ou invalides,
 * renvoie un état vide propre sans jamais planter.
 */
function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    // On ne garde que les entrées qui ressemblent à une progression valide.
    const clean = {};
    for (const [id, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry !== "object") continue;
      clean[id] = {
        attempts: Number.isFinite(entry.attempts) ? entry.attempts : 0,
        correct: Number.isFinite(entry.correct) ? entry.correct : 0,
        wrong: Number.isFinite(entry.wrong) ? entry.wrong : 0,
        correctStreak: Number.isFinite(entry.correctStreak) ? entry.correctStreak : 0,
        weight: Number.isFinite(entry.weight) && entry.weight > 0 ? entry.weight : 1,
        level: ["new", "review", "mastered"].includes(entry.level) ? entry.level : "new",
      };
    }
    return clean;
  } catch (e) {
    console.warn("Progression locale corrompue, réinitialisation silencieuse.", e);
    return {};
  }
}

/**
 * Sauvegarde la progression complète dans localStorage.
 * Échoue silencieusement (avec log) si le stockage est indisponible
 * (mode privé plein, quota dépassé, etc.) pour ne jamais casser l'appli.
 */
function saveProgress(progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (e) {
    console.warn("Impossible de sauvegarder la progression.", e);
    return false;
  }
}

/**
 * Renvoie l'entrée de progression d'un mot, en la créant si besoin.
 */
function getWordProgress(progress, id) {
  return progress[id] ? progress[id] : defaultWordProgress();
}

/**
 * Supprime toute la progression utilisateur (pas la base des mots).
 */
function resetProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.warn("Impossible de réinitialiser la progression.", e);
    return false;
  }
}
