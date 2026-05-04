# CHANGELOG — OpenSTEAM LMS

Entrées les plus récentes en tête.

---

## 2026-04-24 — Fix overflow sidebar mobile

**Fichiers modifiés :**
- `classroom/assets/css/main.css` (@media max-width: 767.98px) : `.sidebar-classroom div:not(:first-child)` passe de `width:100px` fixe à `flex:1 1 0; min-width:56px; max-width:100px`. Conteneur `.sidebar-classroom` reçoit `flex-wrap:nowrap; overflow-x:auto` (scrollbar masquée). Icônes : `width/height: clamp(36px, 12vw, 60px)`.

**Motif :** Quand des plugins (Gamification, Statistics, Acadekids…) ajoutent des entrées au sidebar bottom mobile, les boutons à largeur fixe (100 px) débordaient et se chevauchaient sur petits écrans (cf. capture utilisateur, 7 entrées sur ~627 px).

**À tester :** sidebar mobile avec ≥ 6 entrées ; vérifier que les icônes ne se chevauchent plus, restent cliquables, et que le défilement horizontal fonctionne si vraiment trop d'entrées.

---

## 2026-04-24 — Renommage variable env + README

**Fichiers modifiés :**
- `.env` : `VS_DEMOSTUDENT_DISPLAY` → `DEMOSTUDENT_DISPLAY`
- `classroom/home.php`, `classroom/login.php` : lecture `$_ENV['DEMOSTUDENT_DISPLAY']`
- `classroom/assets/js/utils/demoStudentDisplay.js` : mise à jour du commentaire
- `README.md` : ajout de `DEMOSTUDENT_DISPLAY` dans le template `.env` documenté

**Motif :** La variable `VS_DEMOSTUDENT_DISPLAY` avait le préfixe `VS_` réservé aux variables
internes Vittascience. `DEMOSTUDENT_DISPLAY` est plus lisible pour les clients qui déploient
leur propre instance.

---

## 2026-04-24 — Feature : renommage du compte démo par l'enseignant

**Contexte :** Permettre à chaque enseignant de personnaliser, côté front uniquement,
le nom affiché pour le compte élève de démonstration (`VS_DEMOSTUDENT`).

**Fichiers créés :**
- `classroom/assets/js/utils/demoStudentDisplay.js` — helpers `getDemoStudentDisplayName()`,
  `getCapitalizedDemoStudentDisplayName()`, `setDemoStudentDisplayName()`, `resetDemoStudentDisplayName()`
  avec chaîne de priorité : localStorage > `DEMOSTUDENT_DISPLAY` (.env) > `VS_DEMOSTUDENT` > `'demostudent'`

**Fichiers modifiés :**
- `classroom/Views/home_footer.html` : inclusion du script `demoStudentDisplay.js`
- `classroom/assets/js/constants/modals.js` : section "Renommer" dans la modale Paramètres
  (`settings-teacher-modal`), avec `<span id="settings-demo-student-current-name">` pour
  titre dynamique, input pré-rempli et boutons Mettre à jour / Réinitialiser
- `classroom/assets/js/scripts/buttons.js` : handler `#settings-teacher` → prefill input
  et span avant `pseudoModal.openModal()`
- `classroom/assets/js/scripts/displayPanel.js` : sidebar `#user-name` affiche l'alias pour
  le compte démo
- `classroom/assets/js/scripts/manageClassroom.js` : liste classe + handlers save/reset
  (`#settings-validate-demo-student-name`, `#settings-reset-demo-student-name`)
- `classroom/home.php` + `classroom/login.php` : injection globale JS `demoStudentDisplayDefault`
- `.env` : ajout variable `DEMOSTUDENT_DISPLAY` (optionnelle, vide par défaut)
- `classroom/assets/lang/{fr,en,es,ar}/ns.json` : 3 clés i18n dans
  `classroom.profil.accountSettings` (demoStudentDisplayName, demoStudentDisplayNameHelp,
  demoStudentDisplayReset)
- `classroom/Views/teacherProfilePanel.html` : section renommage retirée (déplacée vers
  modale Paramètres) + `pb-4` pour espacement bas de page

**Autres fixes dans la même session :**
- CSV button : `d-none d-xl-inline` sur le texte → icône seule en dessous du breakpoint xl
- `README.md` : `DEMOSTUDENT_DISPLAY` documenté dans le template `.env`
