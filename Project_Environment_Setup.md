# How to setup project environment

1. .env file creation
2. VirtualHost Setup
3. Database setup
4. Dependencies

## .env file creation

At the root of your current folder (`/STEAMS-LMS/`) create a `.env` file.
Inside of this file, copy/paste the following

``` 
VS_HOST=
VS_DB_HOST=**localhost**
VS_DB_PORT=**3306**
VS_DB_NAME=
VS_DB_USER=
VS_DB_PWD=
VS_MAPS_API_KEY=
VS_CAPTCHA_SECRET=
VS_CAPTCHA_PUBLIC_KEY=
VS_MAIL_SERVER=
VS_MAIL_PORT=
VS_MAIL_TYPE=
VS_MAIL_ADDRESS=
VS_MAIL_PASSWORD=
```

> If you already have a working development environment for Vittascience, you can just copy/paste the `.env` file and put `localhost` as the **DB_HOST**.

## VirtualHost Setup

1. Open your hosts file with admin privileges (`C:\windows\system32\drivers\etc\hosts`) or  (`sudo nano /etc/hosts`)

2. Modify your hosts file by adding this line: `127.0.0.1 steamlms`

3. 🏗️ Add steamlms:80 as a VirtualHost in your XAMPP/MAMP/hosting software

> If you already have a working development environment for Vittascience, you can change the 80/3360 ports in your hosting software to 90/3360 to avoid any conflicts with your already used ports.

## Database setup

For now, use the Vittascience database you use for your working development environment.

If you don't have a working database, contact one of the repository managers.

## Dependencies

Run `composer install` to download all the needed PHP dependencies.
Then, run `npm install` to download all the needed JavaScript dependencies.
