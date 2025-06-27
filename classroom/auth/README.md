# SSO part

This plugin enables Single Sign-On (SSO) integration, including support for Apple, Microsoft and Google authentication.

## Requirements

- `codercat/jwk-to-pem` ^1.0  
  Required for converting JWK keys to PEM format, used in Apple SSO authentication.

- `league/oauth2-google` ^4.0  
  Required for Google OAuth2 authentication.

Install these packages via Composer:

```
composer require codercat/jwk-to-pem league/oauth2-google
```

## Apple SSO

To enable Apple SSO, place your Apple private key file (`.p8`, e.g., `AuthKey_XXXXXXXXXX.p8`) in the `key` folder.

**Never share your private keys publicly.**
