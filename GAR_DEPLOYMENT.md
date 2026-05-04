# Déploiement GAR SAML — PFPART et PFPROD

Guide de mise en production du flow SAML GAR (PluginGARv2).  
Le flow local avec SSP IdP factice fonctionne. Ce document décrit les étapes pour brancher le vrai GAR.

---

## Vue d'ensemble

```
LOCAL (actuel)                    PFPART / PFPROD
──────────────────────────────    ──────────────────────────────────────────
IdP : SSP local (exampleauth)  →  IdP : idp-auth.partenaire.test-gar.education.fr
SP  : gar-local / gar-local-ens → SP  : gar-dev (PFPART) / gar-prod (PFPROD)
Fichiers : SAML_local.php      →  Fichiers : SAML.php / SAML_prod.php
Entry    : gar_saml_access_local*.php → gar_saml_access.php / gar_saml_access_prod.php
```

Les fichiers PFPART (`SAML.php`, `gar_saml_access.php`, `disconnect_saml.php`) et PFPROD
(`SAML_prod.php`, `gar_saml_access_prod.php`, `disconnect_saml_prod.php`) existent déjà dans
`plugins/PluginGARv2/gar_files/php/`. Les étapes ci-dessous portent sur la configuration
SSP et l'échange de métadonnées avec le GAR.

---

## Étape 1 — Générer les certificats SP

Un certificat par environnement (même paire clé/cert peut être réutilisée si souhaité).

```bash
# PFPART
openssl req -newkey rsa:2048 -new -x509 -days 3652 -nodes \
  -out opensteamlms/simplesaml/cert/saml-dev.crt \
  -keyout opensteamlms/simplesaml/cert/saml-dev.pem \
  -subj "/C=FR/ST=IDF/L=Paris/O=Vittascience/CN=vittascience.com"

# PFPROD
openssl req -newkey rsa:2048 -new -x509 -days 3652 -nodes \
  -out opensteamlms/simplesaml/cert/saml-prod.crt \
  -keyout opensteamlms/simplesaml/cert/saml-prod.pem \
  -subj "/C=FR/ST=IDF/L=Paris/O=Vittascience/CN=vittascience.com"
```

Permissions requises (lecture seule par www-data) :
```bash
chmod 640 opensteamlms/simplesaml/cert/*.pem
chown root:www-data opensteamlms/simplesaml/cert/*.pem
```

---

## Étape 2 — Configurer config.php

Copier le template et substituer les variables :

```bash
cp plugins/PluginGARv2/gar_files/simplesaml-config/config.php.dist \
   opensteamlms/simplesaml/config/config.php
```

Variables à remplacer dans `config.php` :

| Variable | PFPART | PFPROD |
|---|---|---|
| `__BASE_URL__` | `https://vittascience.com/` | `https://fr.vittascience.com/` |
| `__SECRET_SALT__` | `openssl rand -base64 32` | `openssl rand -base64 32` (différent) |
| `__COOKIE_DOMAIN__` | `.vittascience.com` | `.vittascience.com` |
| `__CERTDIR__` | chemin absolu vers `simplesaml/cert/` | idem |
| `__METADATADIR__` | chemin absolu vers `simplesaml/metadata/` | idem |
| `__LOGDIR__` | chemin absolu writable | idem |
| `__TMPDIR__` | chemin absolu writable | idem |

Points importants :
- `session.cookie.samesite` → `'None'` (HTTPS en prod, contrairement au local qui utilise `'Lax'`)
- `session.cookie.secure` → `true`
- `session.cookie.domain` → `.vittascience.com`
- `enable.saml20-idp` → `false` (l'IdP factice local n'est pas déployé en prod)
- `'exampleauth'` → `false`

---

## Étape 3 — Configurer authsources.php

Copier le template et renseigner les entityID :

```bash
cp plugins/PluginGARv2/gar_files/simplesaml-config/authsources.php.dist \
   opensteamlms/simplesaml/config/authsources.php
```

Variables à remplacer :

| Variable | Valeur |
|---|---|
| `__ENTITY_ID_DEV__` | `https://vittascience.com/gar-dev` |
| `__ENTITY_ID_PROD__` | `https://fr.vittascience.com/gar` |

Les auth sources `gar-local*`, `gar-test-*` et `saml20-idp-hosted.php` **ne doivent pas être présents** sur PFPART/PFPROD (supprimer ou ne pas copier).

---

## Étape 4 — Récupérer le certificat de l'IdP GAR

Le `certData` dans `saml20-idp-remote.php` est actuellement un placeholder. Il faut le remplacer par le vrai certificat de l'IdP GAR.

### Méthode automatique (SSP metadata converter)

1. Télécharger le XML de l'IdP GAR :
   ```bash
   # PFPART
   curl -s https://idp-auth.partenaire.test-gar.education.fr/idp/metadata > /tmp/gar-pfpart.xml
   # PFPROD
   curl -s https://idpauth.gar.education.fr/idp/metadata > /tmp/gar-pfprod.xml
   ```

2. Accéder au convertisseur SSP sur le serveur :
   ```
   https://vittascience.com/simplesaml/module.php/admin/metadata-converter
   ```
   Coller le XML → SSP génère le tableau PHP prêt à l'emploi.

### Méthode manuelle

Extraire le `<ds:X509Certificate>` du XML :
```bash
grep -oP '(?<=<ds:X509Certificate>)[^<]+' /tmp/gar-pfprod.xml
```

Puis dans `opensteamlms/simplesaml/metadata/saml20-idp-remote.php`, remplacer :
```php
'certData' => 'REPLACE_WITH_IDP_CERT_FROM_METADATA',
```
par la valeur extraite (sans espaces ni sauts de ligne).

> ⚠️ Le GAR tourne ses certificats environ une fois par an. Surveiller les communications
> GAR et mettre à jour `certData` avant expiration pour éviter toute interruption de service.

---

## Étape 5 — Fournir la metadata SP au GAR

SSP génère automatiquement la metadata XML du SP à l'URL :
```
https://vittascience.com/simplesaml/module.php/saml/sp/metadata.php/gar-dev   (PFPART)
https://fr.vittascience.com/simplesaml/module.php/saml/sp/metadata.php/gar-prod (PFPROD)
```

Cette URL (ou le XML téléchargé) est à **transmettre à l'équipe GAR** lors de l'inscription
sur le portail partenaire GAR pour que l'IdP autorise le SP Vittascience.

Le GAR vérifie notamment :
- L'`entityID` du SP
- L'URL ACS (`AssertionConsumerService`)
- Le certificat de signature du SP
- Les attributs demandés (`IDO`, `UAI`, `PRE`, `NOM`, `PRO`, `DIV`, `GRO`, `P_MEL`)

---

## Étape 6 — Copier les fichiers PHP dans classroom/

Les fichiers entry-point et la logique SAML doivent être copiés vers `classroom/` :

```bash
# PFPART
cp plugins/PluginGARv2/gar_files/php/SAML.php          classroom/SAML.php
cp plugins/PluginGARv2/gar_files/php/gar_saml_access.php classroom/gar_saml_access.php
cp plugins/PluginGARv2/gar_files/php/disconnect_saml.php classroom/gar_user_disconnect.php

# PFPROD (si déployé directement en prod)
cp plugins/PluginGARv2/gar_files/php/SAML_prod.php          classroom/SAML_prod.php
cp plugins/PluginGARv2/gar_files/php/gar_saml_access_prod.php classroom/gar_saml_access_prod.php
cp plugins/PluginGARv2/gar_files/php/disconnect_saml_prod.php classroom/gar_user_disconnect_prod.php

# Page de confirmation déconnexion (commune)
cp plugins/PluginGARv2/gar_files/php/gar_user_disconnected.php classroom/gar_user_disconnected.php
```

> `SAML.php` (PFPART) et `SAML_prod.php` (PFPROD) utilisent respectivement les auth sources
> `gar-dev` et `gar-prod` — ils n'ont pas besoin de la variable `$_garAuthSource` contrairement
> à `SAML_local.php`.

---

## Étape 7 — Différences cookies entre local et prod

`SAML_local.php` ne pose **pas** de cookies avec domaine fixe (pour fonctionner sur localhost).
`SAML.php` / `SAML_prod.php` posent les cookies avec `domain='vittascience.com'`.

Vérifier dans `SAML.php` :
```php
setcookie('isFromGar', true, time() + 3600 * 24, '/', 'vittascience.com');
setcookie('isGarTest', true, time() + 3600 * 24, '/', 'vittascience.com');
```

Et dans `gar_user_disconnected.php` la version prod utilise le domaine :
```php
setcookie('isFromGar', '', time() - 3600, '/', 'vittascience.com');
setcookie('isGarTest',  '', time() - 3600, '/', 'vittascience.com');
```

---

## Étape 8 — Nginx : routing SSP

La configuration Nginx doit exposer `/simplesaml/` et router vers le bon PHP-FPM.
Vérifier que le bloc existant dans `serverlms/config/nginx.conf` est en place :

```nginx
location ~ ^/simplesaml/(?<phpfile>[^/]+\.php)(?<pathinfo>/.*)?$ {
    include fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_param SCRIPT_FILENAME /var/www/html/vendor/simplesamlphp/simplesamlphp/public/$phpfile;
    fastcgi_param SCRIPT_NAME     /simplesaml/$phpfile;
    fastcgi_param PATH_INFO       $pathinfo;
    fastcookie_param REQUEST_URI  $request_uri;
    fastcgi_param SIMPLESAMLPHP_CONFIG_DIR /var/www/html/simplesaml/config;
}
```

L'URL de base SSP (`baseurlpath` dans `config.php`) doit correspondre exactement à ce routing.

---

## Récapitulatif fichiers modifiés / créés

| Fichier | Action | Note |
|---|---|---|
| `simplesaml/config/config.php` | Créer depuis `.dist` | Substituer les variables |
| `simplesaml/config/authsources.php` | Créer depuis `.dist` | Substituer entityID, supprimer les `gar-local*` |
| `simplesaml/metadata/saml20-idp-remote.php` | Modifier | Remplacer `certData` placeholder par le vrai cert GAR |
| `simplesaml/metadata/saml20-idp-hosted.php` | Ne pas déployer | Uniquement pour le test local |
| `simplesaml/metadata/saml20-sp-remote.php` | Ne pas déployer | Uniquement pour le test local |
| `simplesaml/cert/saml-dev.crt` + `.pem` | Déjà généré | Utiliser pour PFPART |
| `simplesaml/cert/saml-prod.crt` + `.pem` | Générer | Utiliser pour PFPROD |
| `classroom/SAML.php` | Copier depuis `gar_files/php/` | Auth source `gar-dev` |
| `classroom/gar_saml_access.php` | Copier depuis `gar_files/php/` | Entry-point PFPART |
| `classroom/gar_user_disconnect.php` | Copier `disconnect_saml.php` | SLO PFPART |
| `classroom/gar_user_disconnected.php` | Copier depuis `gar_files/php/` | Page post-SLO |

---

## Checklist de go-live

- [ ] Certificats SP générés et permissions correctes
- [ ] `config.php` et `authsources.php` renseignés (pas de `__PLACEHOLDER__` restant)
- [ ] `certData` de l'IdP GAR renseigné dans `saml20-idp-remote.php`
- [ ] Metadata SP transmise au GAR et SP déclaré dans le portail partenaire GAR
- [ ] Nginx routing `/simplesaml/` fonctionnel (`curl https://domaine/simplesaml/` → 200)
- [ ] SP metadata accessible publiquement (`/simplesaml/module.php/saml/sp/metadata.php/gar-dev`)
- [ ] Test de connexion PFPART complet (élève + enseignant)
- [ ] Validation GAR (qualification PFPART signée)
- [ ] Switch vers PFPROD (changer auth source `gar-dev` → `gar-prod` dans les fichiers entry)
- [ ] Désactiver l'admin SSP (`auth.adminpassword` → désactivé ou hash fort)
