# ARCHITECTURE — OpenSTEAM LMS

> Mis à jour : 2026-04-24. À maintenir à jour après chaque évolution structurante.

---

## 1. Stack technique

| Couche | Technologies |
|--------|-------------|
| Back-end | PHP 7.3+, Doctrine ORM 2.x, Symfony YAML 5.4 LTS, Monolog, PHPMailer, Guzzle, Firebase JWT, phpCAS, Google API Client, OAuth2 Google, OpenStack |
| Front-end | Vanilla JS + jQuery + i18next (`.localize()`), Bootstrap 5, système `pseudoModal` maison |
| Build | **Gulp 4** (`npm run build` / `npx gulp build`) — tâches dans `gulp/classroomTasks.js` |
| Base de données | MySQL / MariaDB (`utf8mb4_unicode_ci`) |
| Génération BDD | `sql-files/SteamLmsGenerateDb.php` |

---

## 2. Structure des dossiers principaux

```
opensteamlms/
├── bootstrap.php           # Autoload PSR-4, chargement .env, initialisation Doctrine
├── cli-config.php          # Doctrine CLI
├── routing/Routing.php     # Front controller unique (?controller=X&action=Y)
├── classroom/
│   ├── home.php            # Point d'entrée enseignant (injecte variables JS globales)
│   ├── login.php           # Page de connexion (injecte variables JS globales)
│   ├── home.html           # ⚠️ GÉNÉRÉ par Gulp — NE PAS MODIFIER DIRECTEMENT
│   ├── Views/              # Sources HTML concaténées par Gulp → home.html
│   │   ├── header.html
│   │   ├── home_footer.html
│   │   ├── teacherProfilePanel.html
│   │   └── ...
│   └── assets/
│       ├── js/
│       │   ├── constants/modals.js    # Contenu HTML des modales injecté au chargement
│       │   ├── main/modal.js          # Classe Modal + pseudoModal (openModal = display:block)
│       │   ├── scripts/
│       │   │   ├── buttons.js         # Handlers jQuery sur les boutons UI
│       │   │   ├── displayPanel.js    # Rendu des panneaux enseignant/élève
│       │   │   ├── loadModals.js      # Injection unique des modales dans le DOM
│       │   │   └── manageClassroom.js # Gestion des classes, élèves, CSV…
│       │   └── utils/
│       │       └── demoStudentDisplay.js  # Helpers alias compte démo (voir § 5)
│       └── lang/{fr,en,es,ar}/ns.json    # Fichiers i18n
├── plugins/                # Plugins (gitignoré) — structure PascalCase
├── gulp/classroomTasks.js  # Tâches Gulp (concat views, copy plugin assets…)
├── .env                    # Variables d'environnement (ne pas committer)
└── .github/lms/            # Mémoire agent (ARCHITECTURE.md, CHANGELOG.md)
```

---

## 3. Règles de build critiques

- **`classroom/home.html` est généré** par Gulp (concat de `classroom/Views/*.html`).
  → **Ne jamais éditer `home.html` directement.** Toujours modifier les fichiers sources dans `Views/`.
- Après modification d'une View ou d'un plugin : `npm run build` (alias de `npx gulp build`).
- Les fichiers JS dans `classroom/assets/js/` sont servis directement (pas de bundling).
  → Les caches navigateur peuvent persister : **Ctrl+Shift+R** nécessaire après un déploiement.

---

## 4. Variables d'environnement (.env)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `VS_HOST` | ✅ | URL publique du LMS |
| `VS_DB_*` | ✅ | Connexion base de données |
| `VS_DEMOSTUDENT` | ✅ | Pseudo DB du compte élève de démo (ex. `"Vue élève"`) |
| `DEMOSTUDENT_DISPLAY` | ❌ | Alias d'affichage client-wide pour le compte démo (frontend uniquement, ne modifie pas la DB). Vide = utilise `VS_DEMOSTUDENT`. Chaque enseignant peut encore surcharger via son localStorage. |
| `VS_AUTO_MAIL` | ❌ | Active/désactive les mails automatiques |
| `LMS_NAME` | ❌ | Nom de l'instance LMS (mails, UI) |
| `LMS_COLOR` | ❌ | Couleur principale en hex |
| `VS_LOG_PATH` | ❌ | Chemin du fichier de log |
| `ADMIN_PSEUDO/PASSWORD/EMAIL` | ✅ init | Compte administrateur initial |

---

## 5. Système de renommage du compte démo

**Fichier** : `classroom/assets/js/utils/demoStudentDisplay.js`

Chaîne de priorité (décroissante) pour le nom affiché :
1. `localStorage['demoStudentDisplayName']` — override per-teacher/browser
2. `demoStudentDisplayDefault` — global JS injecté depuis `DEMOSTUDENT_DISPLAY` (.env)
3. `demoStudentName` — global JS injecté depuis `VS_DEMOSTUDENT` (.env)
4. `'demostudent'` — fallback codé en dur

**UI** : Section "Renommer" dans la modale Paramètres (`settings-teacher-modal`), accessible via le bouton Paramètres du profil enseignant.

**Zones d'affichage patchées** :
- Sidebar (`#user-name`) — `displayPanel.js`
- Liste élèves de la classe — `manageClassroom.js` `displayClassDashboardListing`
- Titre dynamique de la section (`<span id="settings-demo-student-current-name">`)
- Input pré-rempli au clic Paramètres — `buttons.js`

**⚠️ Ne pas modifier** les usages backend-bound de `demoStudentName` dans `manageClassroom.js` lignes ~749, ~779, ~1096, ~1211 (CSV/stats/exclusions) et ~422, ~531 (reservedNickname) : ces comparaisons doivent rester sur le pseudo DB.

---

## 6. Sous-agents spécialisés

| Nom | Domaine | Fichier |
|-----|---------|---------|
| `auth` | Authentification (CAS/GAR/LTI/SSO/Local) | `.github/agents/auth.agent.md` |
| `backend` | PHP / Doctrine / Routing | `.github/agents/backend.agent.md` |
| `db` | Base de données, Doctrine, schéma SQL | `.github/agents/db.agent.md` |
| `devops` | Déploiement, environnements, infrastructure | `.github/agents/devops.agent.md` |
| `docs` | Documentation, README, onboarding | `.github/agents/docs.agent.md` |
| `frontend` | Vues, assets, build Gulp | `.github/agents/frontend.agent.md` |
| `i18n` | Internationalisation, traductions | `.github/agents/i18n.agent.md` |
| `mail` | Templates emails, PHPMailer, délivrabilité | `.github/agents/mail.agent.md` |
| `plugins` | Plugins LMS (`Plugins\`) | `.github/agents/plugins.agent.md` |
| `security` | Sécurité OWASP, audit, conformité | `.github/agents/security.agent.md` |
| `testing` | Tests, qualité, couverture | `.github/agents/testing.agent.md` |
| `upgrade` | Modernisation stack PHP/Doctrine/Symfony | `.github/agents/upgrade.agent.md` |
| `api` | Endpoints, contrats JSON, intégrations | `.github/agents/api.agent.md` |

---

## 7. Architecture pseudoModal

`loadModals.js` injecte **une seule fois** au chargement de la page le HTML de toutes les modales via `new Modal(element, modal)` → `innerHTML +=`. `pseudoModal.openModal(id)` fait uniquement `display:block` + `$('#id').localize()`. Le DOM des modales est donc toujours disponible après le chargement initial — il n'y a pas de re-injection.
