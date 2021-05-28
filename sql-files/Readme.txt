/////////////

Pour créer en une fois la base de données et les tables:
	- utiliser le fichier steam-lms-create-db-and-tables.sql

Pour modifier le nom de la table avant de la créer:
	- éditer le fichier steam-lms-create-db-and-tables.sql
	- modifier la ligne 24 
		exemple: CREATE DATABASE IF NOT EXISTS `nom_de_la_base_de_données` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

/////////////
/////////////

Pour insérer les tables dans base de données déjà créé :
	- utiliser le fichier steam-lms-create-tables-only.sql 

/////////////
/////////////

To create the database and the tables:
	- use the steam-lms-create-db-and-tables.sql file

To modify le database name before creating it :
	- edit steam-lms-create-db-and-tables.sql file
	- change line 24 
		example: CREATE DATABASE IF NOT EXISTS `name_of_the_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

/////////////
/////////////

To upload tables on an already created table :
	- use steam-lms-create-tables-only.sql file

/////////////
