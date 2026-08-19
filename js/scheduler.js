/**
 * scheduler.js
 * - Normalisation et vérification des réponses en romaji.
 * - Sélection pondérée du mot suivant (répétition espacée simple).
 * - Mise à jour de la progression après chaque réponse.
 */

/**
 * Normalise une chaîne romaji pour la comparaison :
 * - minuscule, espaces superflus supprimés
 * - macrons convertis en voyelle doublée (ō -> oo)
 * - voyelles longues ramenées à une seule voyelle (oo/ou -> o, uu -> u, etc.)
 * - variantes de translittération courantes unifiées (si/shi, ti/chi, tu/tsu, hu/fu, zi/ji)
 * - apostrophe de "n'" supprimée
 */
function normalizeRomaji(str) {
  if (typeof str !== "string") return "";

  let s = str.trim().toLowerCase();

  // Supprime tous les espaces (accidentels ou multiples).
  s = s.replace(/\s+/g, "");

  // Macrons -> voyelle doublée.
  const macrons = { ā: "aa", ī: "ii", ū: "uu", ē: "ee", ō: "oo" };
  s = s.replace(/[āīūēō]/g, (ch) => macrons[ch] || ch);

  // Apostrophe de n' (ex: gen'ki) supprimée.
  s = s.replace(/'/g, "");

  // Variantes de romanisation Kunrei -> Hepburn.
  s = s.replace(/si/g, "shi").replace(/ti/g, "chi").replace(/tu/g, "tsu").replace(/hu/g, "fu").replace(/zi/g, "ji");

  // Voyelles longues -> voyelle courte (tolère ou/oo/o, uu/u, ii/i, etc.)
  s = s.replace(/ou/g, "o");
  s = s.replace(/([aeiou])\1+/g, "$1");

  return s;
}

/**
 * Vérifie si une réponse utilisateur correspond au mot attendu
 * (romaji principal ou une des variantes alternatives).
 */
function isAnswerCorrect(userInput, wordEntry) {
  const given = normalizeRomaji(userInput);
  if (given === "") return false;

  const candidates = [wordEntry.romaji, ...(wordEntry.alt || [])];
  return candidates.some((c) => normalizeRomaji(c) === given);
}

const MIN_WEIGHT = 0.3;
const MAX_WEIGHT = 50;
const MASTERY_STREAK = 3;

/**
 * Met à jour la progression d'un mot après une réponse (correcte ou non).
 * Retourne la nouvelle entrée de progression (ne mute pas l'originale).
 */
function updateWordProgress(entry, wasCorrect) {
  const next = { ...entry };
  next.attempts += 1;

  if (wasCorrect) {
    next.correct += 1;
    next.correctStreak += 1;
    next.weight = Math.max(MIN_WEIGHT, next.weight * 0.5);
    next.level = next.correctStreak >= MASTERY_STREAK ? "mastered" : "review";
  } else {
    next.wrong += 1;
    next.correctStreak = 0;
    next.weight = Math.min(MAX_WEIGHT, next.weight * 3);
    next.level = "review";
  }

  return next;
}

/**
 * Choisit le prochain mot à afficher, avec tirage aléatoire pondéré.
 * - Les mots ratés récemment ont un poids plus élevé (reviennent plus souvent).
 * - `recentIds` (les 2 derniers mots affichés) sont exclus du tirage quand
 *   c'est possible, pour éviter les répétitions immédiates.
 */
function pickNextWord(words, progress, recentIds = []) {
  let pool = words.filter((w) => !recentIds.includes(w.id));
  if (pool.length === 0) pool = words; // sécurité si la liste est trop courte

  const weights = pool.map((w) => {
    const p = getWordProgress(progress, w.id);
    return p.weight > 0 ? p.weight : 1;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;

  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }

  return pool[pool.length - 1]; // filet de sécurité (arrondis flottants)
}
