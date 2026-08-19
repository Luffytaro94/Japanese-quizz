# Japanese Quiz — 100 mots

Application de révision : français → romaji japonais. 100 % locale, sans compte ni serveur.

## Lancer l'application en local

C'est un site statique (HTML/CSS/JS), il faut juste un petit serveur local pour éviter les soucis de navigateur avec les fichiers `file://` :

- **Avec VS Code** : installe l'extension "Live Server", clic droit sur `index.html` → "Open with Live Server".
- **Avec Python** (si installé) : ouvre un terminal dans le dossier et tape :
  ```
  python3 -m http.server 8000
  ```
  puis ouvre `http://localhost:8000` dans ton navigateur.

## Où se trouve la liste des 100 mots

Dans `js/data.js`, tableau `WORDS`. Tu peux modifier une traduction ou en ajouter en gardant le même format `{ id, french, romaji }` (les `id` doivent rester uniques, de 1 à 100).

## Comment la progression est sauvegardée

Tout est stocké dans le `localStorage` de ton navigateur (clé `jpquiz_progress_v1`). Rien n'est envoyé sur internet. La progression reste après fermeture/rechargement, mais elle est propre à cet appareil et à ce navigateur.

## Réinitialiser la progression

Dans l'application : **Accueil → ⚙ Paramètres → Réinitialiser ma progression** (une confirmation est demandée). Seule ta progression est effacée, pas la liste des 100 mots.

## Mettre l'application sur GitHub Pages

1. Crée un nouveau dépôt GitHub et mets-y tout le contenu de ce dossier (`index.html`, `css/`, `js/`) à la racine du dépôt.
2. Dans le dépôt : **Settings → Pages**.
3. Dans "Source", choisis la branche `main` et le dossier `/ (root)`, puis sauvegarde.
4. Après une minute ou deux, ton application est accessible à l'adresse indiquée par GitHub (du type `https://ton-pseudo.github.io/nom-du-depot/`).

## Ce que je n'ai pas pu vérifier

J'ai testé la logique (vérification des réponses, répétition pondérée, sauvegarde/robustesse du stockage, cohérence des 100 entrées) avec des scripts automatisés en Node.js, et tout passe. Je n'ai en revanche pas pu ouvrir l'application dans un vrai navigateur pour vérifier visuellement le rendu final — regarde bien la première utilisation pour confirmer que tout s'affiche comme prévu, surtout sur ton téléphone.
