-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb
-- Généré le : mer. 15 mars 2023 à 01:47
-- Version du serveur : 10.9.3-MariaDB-1:10.9.3+maria~ubu2204
-- Version de PHP : 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `opensteam`
--

-- --------------------------------------------------------

--
-- Structure de la table `learn_tags`
--

CREATE TABLE `learn_tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `learn_tags`
--

INSERT INTO `learn_tags` (`id`, `name`) VALUES
(1, 'Fonctions'),
(2, 'Statistiques'),
(3, 'Calculs'),
(4, 'Algo et programmation'),
(5, 'Entrer l\'expression d\'une fonction'),
(6, 'Tableau de valeur'),
(7, 'Image'),
(8, 'Représentation graphique'),
(9, 'Antécédent'),
(10, 'Extrema'),
(11, 'Intersection'),
(12, 'Moyenne'),
(13, 'Quartile'),
(14, 'Médiane'),
(15, 'Moustache'),
(16, 'Tri'),
(17, 'Indicateurs'),
(18, 'Fractions'),
(19, 'Racines'),
(20, 'Algorithme');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `learn_tags`
--
ALTER TABLE `learn_tags`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `learn_tags`
--
ALTER TABLE `learn_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
