/**
 * data.js
 * Base de données des 100 mots japonais (français -> romaji).
 * Chaque entrée : { id, french, romaji, alt? }
 * `alt` (optionnel) liste des réponses alternatives également acceptées
 * (variantes de romanisation ou synonymes courants).
 */

const WORDS = [
  // --- Verbes (1-40) ---
  { id: 1, french: "Manger", romaji: "taberu" },
  { id: 2, french: "Boire", romaji: "nomu" },
  { id: 3, french: "Dormir", romaji: "neru" },
  { id: 4, french: "Se réveiller", romaji: "okiru" },
  { id: 5, french: "Marcher", romaji: "aruku" },
  { id: 6, french: "Courir", romaji: "hashiru" },
  { id: 7, french: "Parler", romaji: "hanasu" },
  { id: 8, french: "Écouter", romaji: "kiku" },
  { id: 9, french: "Regarder / Voir", romaji: "miru" },
  { id: 10, french: "Lire", romaji: "yomu" },
  { id: 11, french: "Écrire", romaji: "kaku" },
  { id: 12, french: "Acheter", romaji: "kau" },
  { id: 13, french: "Vendre", romaji: "uru" },
  { id: 14, french: "Payer", romaji: "harau" },
  { id: 15, french: "Aller", romaji: "iku" },
  { id: 16, french: "Venir", romaji: "kuru" },
  { id: 17, french: "Rentrer", romaji: "kaeru" },
  { id: 18, french: "Attendre", romaji: "matsu" },
  { id: 19, french: "Travailler", romaji: "hataraku" },
  { id: 20, french: "Étudier", romaji: "benkyousuru", alt: ["benkyosuru"] },
  { id: 21, french: "Comprendre", romaji: "wakaru" },
  { id: 22, french: "Savoir", romaji: "shiru" },
  { id: 23, french: "Penser", romaji: "omou" },
  { id: 24, french: "Aimer (bien)", romaji: "suki" },
  { id: 25, french: "Vouloir (un objet)", romaji: "hoshii" },
  { id: 26, french: "Pouvoir", romaji: "dekiru" },
  { id: 27, french: "Utiliser", romaji: "tsukau" },
  { id: 28, french: "Faire", romaji: "suru" },
  { id: 29, french: "Donner", romaji: "ageru" },
  { id: 30, french: "Recevoir", romaji: "morau" },
  { id: 31, french: "Ouvrir", romaji: "akeru" },
  { id: 32, french: "Fermer", romaji: "shimeru" },
  { id: 33, french: "Entrer", romaji: "hairu" },
  { id: 34, french: "Sortir", romaji: "deru" },
  { id: 35, french: "Monter", romaji: "noboru" },
  { id: 36, french: "Descendre", romaji: "oriru" },
  { id: 37, french: "Arrêter", romaji: "tomeru" },
  { id: 38, french: "Commencer", romaji: "hajimeru" },
  { id: 39, french: "Finir", romaji: "owaru" },
  { id: 40, french: "Chercher", romaji: "sagasu" },

  // --- Adjectifs (41-60) ---
  { id: 41, french: "Grand", romaji: "ookii" },
  { id: 42, french: "Petit", romaji: "chiisai" },
  { id: 43, french: "Nouveau", romaji: "atarashii" },
  { id: 44, french: "Vieux (objet)", romaji: "furui" },
  { id: 45, french: "Bien / Bon", romaji: "ii", alt: ["yoi"] },
  { id: 46, french: "Mauvais", romaji: "warui" },
  { id: 47, french: "Cher", romaji: "takai" },
  { id: 48, french: "Bon marché", romaji: "yasui" },
  { id: 49, french: "Délicieux", romaji: "oishii" },
  { id: 50, french: "Chaud (température)", romaji: "atsui" },
  { id: 51, french: "Froid (température)", romaji: "samui" },
  { id: 52, french: "Tiède / Doux", romaji: "atatakai" },
  { id: 53, french: "Frais", romaji: "suzushii" },
  { id: 54, french: "Rapide", romaji: "hayai" },
  { id: 55, french: "Lent", romaji: "osoi" },
  { id: 56, french: "Difficile", romaji: "muzukashii" },
  { id: 57, french: "Simple / Facile", romaji: "kantan" },
  { id: 58, french: "Amusant", romaji: "tanoshii" },
  { id: 59, french: "Occupé", romaji: "isogashii" },
  { id: 60, french: "En forme", romaji: "genki" },

  // --- Noms (61-100) ---
  { id: 61, french: "Eau", romaji: "mizu" },
  { id: 62, french: "Riz / Repas", romaji: "gohan" },
  { id: 63, french: "Pain", romaji: "pan" },
  { id: 64, french: "Viande", romaji: "niku" },
  { id: 65, french: "Poisson", romaji: "sakana" },
  { id: 66, french: "Légume", romaji: "yasai" },
  { id: 67, french: "Fruit", romaji: "kudamono" },
  { id: 68, french: "Œuf", romaji: "tamago" },
  { id: 69, french: "Thé", romaji: "ocha", alt: ["cha"] },
  { id: 70, french: "Café", romaji: "kouhii" },
  { id: 71, french: "Alcool", romaji: "sake", alt: ["osake"] },
  { id: 72, french: "Argent", romaji: "okane" },
  { id: 73, french: "Temps / Heure", romaji: "jikan" },
  { id: 74, french: "Matin", romaji: "asa" },
  { id: 75, french: "Midi", romaji: "hiru" },
  { id: 76, french: "Soir / Nuit", romaji: "yoru" },
  { id: 77, french: "Aujourd'hui", romaji: "kyou" },
  { id: 78, french: "Demain", romaji: "ashita" },
  { id: 79, french: "Hier", romaji: "kinou" },
  { id: 80, french: "Week-end", romaji: "shuumatsu" },
  { id: 81, french: "École", romaji: "gakkou" },
  { id: 82, french: "Entreprise / Bureau", romaji: "kaisha" },
  { id: 83, french: "Maison", romaji: "ie" },
  { id: 84, french: "Gare", romaji: "eki" },
  { id: 85, french: "Rue / Chemin", romaji: "michi" },
  { id: 86, french: "Voiture", romaji: "kuruma" },
  { id: 87, french: "Train", romaji: "densha" },
  { id: 88, french: "Avion", romaji: "hikouki" },
  { id: 89, french: "Ami", romaji: "tomodachi" },
  { id: 90, french: "Famille", romaji: "kazoku" },
  { id: 91, french: "Personne (individu)", romaji: "hito" },
  { id: 92, french: "Enfant", romaji: "kodomo" },
  { id: 93, french: "Professeur", romaji: "sensei" },
  { id: 94, french: "Travail (emploi)", romaji: "shigoto" },
  { id: 95, french: "Téléphone", romaji: "denwa" },
  { id: 96, french: "Portable (mobile)", romaji: "keitai", alt: ["keitaidenwa"] },
  { id: 97, french: "Livre", romaji: "hon" },
  { id: 98, french: "Sac", romaji: "kaban" },
  { id: 99, french: "Pays", romaji: "kuni" },
  { id: 100, french: "Langue japonaise", romaji: "nihongo" },
];

/**
 * Vérifie l'intégrité de la base de mots.
 * Retourne { valid: boolean, errors: string[] }
 */
function validateWords(words) {
  const errors = [];

  if (!Array.isArray(words)) {
    return { valid: false, errors: ["WORDS n'est pas un tableau."] };
  }

  if (words.length !== 100) {
    errors.push(`Nombre d'entrées incorrect : ${words.length} (attendu : 100).`);
  }

  const seenIds = new Set();
  const seenRomaji = new Set();

  words.forEach((w, index) => {
    if (!w || typeof w !== "object") {
      errors.push(`Entrée à l'index ${index} invalide (n'est pas un objet).`);
      return;
    }

    if (typeof w.id !== "number" || !Number.isInteger(w.id)) {
      errors.push(`Entrée à l'index ${index} : id manquant ou invalide.`);
    } else {
      if (w.id < 1 || w.id > 100) {
        errors.push(`id ${w.id} hors de la plage 1-100.`);
      }
      if (seenIds.has(w.id)) {
        errors.push(`id ${w.id} en double.`);
      }
      seenIds.add(w.id);
    }

    if (typeof w.french !== "string" || w.french.trim() === "") {
      errors.push(`Entrée id=${w.id ?? index} : champ "french" vide ou manquant.`);
    }

    if (typeof w.romaji !== "string" || w.romaji.trim() === "") {
      errors.push(`Entrée id=${w.id ?? index} : champ "romaji" vide ou manquant.`);
    } else {
      const key = w.romaji.trim().toLowerCase();
      if (seenRomaji.has(key)) {
        errors.push(`romaji "${w.romaji}" en double (id=${w.id}).`);
      }
      seenRomaji.add(key);
    }
  });

  // Vérifie que les ids 1..100 sont tous présents, sans trou.
  for (let i = 1; i <= 100; i++) {
    if (!seenIds.has(i)) {
      errors.push(`id ${i} manquant (trou dans la séquence).`);
    }
  }

  return { valid: errors.length === 0, errors };
}
