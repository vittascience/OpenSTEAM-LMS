<?php

/**
 * SimpleSAMLphp auth sources — template for LMS GAR deployment
 *
 * Variables à substituer avant utilisation :
 *   __ENTITY_ID_DEV__  → entityID du SP pour PFPART, e.g. https://vittascience.com/gar-dev
 *   __ENTITY_ID_PROD__ → entityID du SP pour PFPROD, e.g. https://vittascience.com/gar
 *
 * LOCAL : l'auth source 'gar-local' en bas de ce fichier permet de tester le flow
 * SAML complet sans connexion au GAR réel (SSP joue IdP et SP sur la même instance).
 *
 * L'URL ACS et les endpoints SLO du SP sont générés automatiquement par SSP
 * à partir du 'baseurlpath' défini dans config.php — ne pas les spécifier ici.
 *
 * Certificats : placer saml-dev.pem / saml-dev.crt et saml-prod.pem / saml-prod.crt
 * dans le certdir configuré dans config.php.dist (opensteamlms/simplesaml/cert/).
 *
 * Générer les certs :
 *   openssl req -newkey rsa:2048 -new -x509 -days 3652 -nodes \
 *     -out saml-dev.crt -keyout saml-dev.pem \
 *     -subj "/C=FR/ST=IDF/L=Paris/O=Vittascience/CN=vittascience.com"
 */

$config = [

    /*
     * -------------------------------------------------------------------------
     * GAR PFPART (test / qualification)
     * IdP: https://idp-auth.partenaire.test-gar.education.fr
     * -------------------------------------------------------------------------
     */
    'gar-dev' => [
        'saml:SP',

        /*
         * SP entityID submitted to GAR for PFPART qualification.
         * Must match exactly what is declared in the SP metadata sent to GAR.
         */
        'entityID' => '__ENTITY_ID_DEV__',

        /*
         * IdP entityID — do NOT change, this is the GAR's canonical identifier.
         */
        'idp' => 'https://idpauth.gar.education.fr/cas/idp',

        /*
         * SP certificate — RSA-SHA256, used to sign AuthnRequests and to
         * allow the IdP to encrypt assertions.
         * 'privatekey'  → path relative to certdir (just the filename)
         * 'certificate' → path relative to certdir (just the filename)
         */
        'privatekey'  => 'saml-dev.pem',
        'certificate' => 'saml-dev.crt',

        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

        /*
         * RTFS v8.2 §3.2 — AuthnRequests MUST be signed.
         */
        'sign.authnrequest' => true,

        /*
         * RTFS v8.2 §3.3 — Assertions MUST be signed.
         */
        'WantAssertionsSigned' => true,

        /*
         * ACS binding — HTTP-POST only (RTFS v8.2 §3.1).
         * L'URL ACS est dérivée automatiquement de 'baseurlpath' dans config.php :
         *   {baseurlpath}/module.php/saml/sp/saml2-acs.php/gar-dev
         * SSP gère aussi le SLO automatiquement sur les 3 bindings requis par
         * le RTFS (HTTP-POST, HTTP-Redirect, SOAP) — aucune config supplémentaire ici.
         * Les endpoints SLO du SP sont déclarés dans les métadonnées SP exportées
         * vers le GAR, et les endpoints SLO de l'IdP dans saml20-idp-remote.php.
         */
        'acs.Bindings' => [
            'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        ],

        /*
         * Attribute mapping — GAR returns attributes with these exact names
         * in both CAS and SAML (no remapping needed).
         * Attributes will be available as arrays: $attributes['IDO'][0], etc.
         */
        'attributes' => [
            'IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT',
        ],
        'attributes.required' => ['IDO', 'UAI'],
    ],

    /*
     * -------------------------------------------------------------------------
     * GAR PFPROD (production)
     * IdP: https://idpauth.gar.education.fr
     * -------------------------------------------------------------------------
     */
    'gar-prod' => [
        'saml:SP',

        'entityID' => '__ENTITY_ID_PROD__',

        'idp' => 'https://idpauth.gar.education.fr/cas/idp',

        'privatekey'  => 'saml-prod.pem',
        'certificate' => 'saml-prod.crt',

        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

        'sign.authnrequest' => true,

        'WantAssertionsSigned' => true,

        'acs.Bindings' => [
            'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        ],

        'attributes' => [
            'IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT',
        ],
        'attributes.required' => ['IDO', 'UAI'],
    ],
];

// =============================================================================
// LOCAL TESTING ONLY — Ne pas déployer en PFPART/PFPROD
// =============================================================================

$config += [

    /*
     * SP local — pointe vers l'IdP SSP hébergé localement (saml20-idp-hosted.php).
     * Permet de tester le flow SAML complet sans passer par le GAR réel.
     * Utiliser SAML_local.php (auth source 'gar-local') à la place de SAML.php.
     */
    'gar-local' => [
        'saml:SP',
        'entityID' => 'http://localhost:90/gar-local',
        'idp'      => 'http://localhost:90/simplesaml/',   // entityID de saml20-idp-hosted.php
        'privatekey'  => 'saml-dev.pem',
        'certificate' => 'saml-dev.crt',
        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        'sign.authnrequest' => true,
        'WantAssertionsSigned' => true,
        'acs.Bindings' => ['urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'],
        'attributes' => ['IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT'],
        'attributes.required' => ['IDO', 'UAI'],
    ],

    /*
     * SP local ENSEIGNANT — pointe vers le second IdP local (auth: gar-test-enseignant).
     * Utilisé par gar_saml_access_local_ens.php pour tester le flow prof.
     */
    'gar-local-ens' => [
        'saml:SP',
        'entityID' => 'http://localhost:90/gar-local-ens',
        'idp'      => 'http://localhost:90/simplesaml/',   // même IdP que gar-local, l'authproc sélectionne le profil
        'privatekey'  => 'saml-dev.pem',
        'certificate' => 'saml-dev.crt',
        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        'sign.authnrequest' => true,
        'WantAssertionsSigned' => true,
        'acs.Bindings' => ['urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'],
        'attributes' => ['IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT'],
        'attributes.required' => ['IDO', 'UAI'],
    ],

    // SP élève 2 — Sophie, 6ème A (même classe que Jean)
    'gar-local-eleve2' => [
        'saml:SP',
        'entityID' => 'http://localhost:90/gar-local-eleve2',
        'idp'      => 'http://localhost:90/simplesaml/',
        'privatekey'  => 'saml-dev.pem',
        'certificate' => 'saml-dev.crt',
        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        'sign.authnrequest' => true,
        'WantAssertionsSigned' => true,
        'acs.Bindings' => ['urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'],
        'attributes' => ['IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT'],
        'attributes.required' => ['IDO', 'UAI'],
    ],

    // SP élève 3 — Luca, 5ème B (classe de Thomas)
    'gar-local-eleve3' => [
        'saml:SP',
        'entityID' => 'http://localhost:90/gar-local-eleve3',
        'idp'      => 'http://localhost:90/simplesaml/',
        'privatekey'  => 'saml-dev.pem',
        'certificate' => 'saml-dev.crt',
        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        'sign.authnrequest' => true,
        'WantAssertionsSigned' => true,
        'acs.Bindings' => ['urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'],
        'attributes' => ['IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT'],
        'attributes.required' => ['IDO', 'UAI'],
    ],

    // SP enseignant 2 — Thomas, 5ème B seulement
    'gar-local-ens2' => [
        'saml:SP',
        'entityID' => 'http://localhost:90/gar-local-ens2',
        'idp'      => 'http://localhost:90/simplesaml/',
        'privatekey'  => 'saml-dev.pem',
        'certificate' => 'saml-dev.crt',
        'signature.algorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        'sign.authnrequest' => true,
        'WantAssertionsSigned' => true,
        'acs.Bindings' => ['urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'],
        'attributes' => ['IDO', 'UAI', 'PRE', 'NOM', 'PRO', 'DIV', 'GRO', 'P_MEL', 'idENT'],
        'attributes.required' => ['IDO', 'UAI'],
    ],

    /*
     * Backend d'authentification factice pour l'IdP local.
     * exampleauth:Static renvoie immédiatement les attributs sans page de login.
     *
     * Pour simuler un élève :
     */
    'gar-test-eleve' => [
        'exampleauth:StaticSource',
        'IDO' => ['testeleve001'],
        'UAI' => ['0123456A'],
        'PRE' => ['Jean'],
        'NOM' => ['TestEleve'],
        'PRO' => ['National_elv'],
        'DIV' => ['6A##6ème A'],
        'GRO' => ['6A-MATHS##Groupe Maths##6A'],
    ],
    // Élève 2 : Sophie — même UAI, même 6ème A (peut rejoindre Marie)
    'gar-test-eleve2' => [
        'exampleauth:StaticSource',
        'IDO' => ['testeleve002'],
        'UAI' => ['0123456A'],
        'PRE' => ['Sophie'],
        'NOM' => ['TestEleve2'],
        'PRO' => ['National_elv'],
        'DIV' => ['6A##6ème A'],
        'GRO' => ['6A-MATHS##Groupe Maths##6A'],
    ],
    // Élève 3 : Luca — 5ème B (classe de Thomas)
    'gar-test-eleve3' => [
        'exampleauth:StaticSource',
        'IDO' => ['testeleve003'],
        'UAI' => ['0123456A'],
        'PRE' => ['Luca'],
        'NOM' => ['TestEleve3'],
        'PRO' => ['National_elv'],
        'DIV' => ['5B##5ème B'],
        'GRO' => ['5B-SVT##Groupe SVT##5B'],
    ],
    /*
     * Pour simuler un enseignant :
     */
    'gar-test-enseignant' => [
        'exampleauth:StaticSource',
        'IDO' => ['testenseignant001'],
        'UAI' => ['0123456A'],
        'PRE' => ['Marie'],
        'NOM' => ['TestEnseignant'],
        'PRO' => ['National_ens'],
        'DIV' => ['6A##6ème A', '5B##5ème B'],
        'GRO' => ['6A-MATHS##Groupe Maths##6A'],
        'P_MEL' => ['marie.test@ac-test.fr'],
    ],
    // Enseignant 2 : Thomas — 5ème B seulement
    'gar-test-enseignant2' => [
        'exampleauth:StaticSource',
        'IDO' => ['testenseignant002'],
        'UAI' => ['0123456A'],
        'PRE' => ['Thomas'],
        'NOM' => ['TestEnseignant2'],
        'PRO' => ['National_ens'],
        'DIV' => ['5B##5ème B'],
        'GRO' => ['5B-SVT##Groupe SVT##5B'],
        'P_MEL' => ['thomas.test@ac-test.fr'],
    ],
    /*
     * Pour simuler un employé (sans division) :
     */
    'gar-test-employe' => [
        'exampleauth:StaticSource',
        'IDO' => ['testemploye001'],
        'UAI' => ['0123456A'],
        'PRE' => ['Pierre'],
        'NOM' => ['TestEmploye'],
        'PRO' => ['National_doc'],
        'DIV' => [],
        'GRO' => [],
        'P_MEL' => ['pierre.test@ac-test.fr'],
    ],
];
