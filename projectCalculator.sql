-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.21-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for project_calculator
CREATE DATABASE IF NOT EXISTS `project_calculator` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `project_calculator`;

-- Dumping structure for table project_calculator.line_item
CREATE TABLE IF NOT EXISTS `line_item` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` int(10) unsigned NOT NULL,
  `material_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id on line_item` (`project_id`),
  KEY `material_id on line_item` (`material_id`),
  CONSTRAINT `material_id on line_item` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `project_id on line_item` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table project_calculator.line_item: ~0 rows (approximately)
DELETE FROM `line_item`;
/*!40000 ALTER TABLE `line_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `line_item` ENABLE KEYS */;

-- Dumping structure for table project_calculator.material
CREATE TABLE IF NOT EXISTS `material` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id on material` (`user_id`),
  CONSTRAINT `user_id on material` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- Dumping data for table project_calculator.material: ~3 rows (approximately)
DELETE FROM `material`;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` (`id`, `createdAt`, `updatedAt`, `name`, `url`, `price`, `description`, `user_id`) VALUES
	(1, '2021-10-23 08:01:05', '2021-10-23 08:01:05', '99th Garage', 'homedepot.com/aksjdf483hrdsfh', 9.99, '4x6 pressure treated 8ft lumber', 6),
	(2, '2021-10-23 21:20:12', '2021-10-23 21:20:12', '99th Laundry Room', 'homedepot.com/aksjdf483hrdsfh', 9.99, '4x6 pressure treated 8ft lumber', 6),
	(4, '2021-10-23 21:54:13', '2021-10-23 21:54:13', '99th Laundry over', 'homedepot.com/aksjdf483hrdsfh', 9.99, '4x6 pressure treated 8ft lumber', 6);
/*!40000 ALTER TABLE `material` ENABLE KEYS */;

-- Dumping structure for table project_calculator.project
CREATE TABLE IF NOT EXISTS `project` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id on project` (`user_id`),
  CONSTRAINT `user_id on project` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- Dumping data for table project_calculator.project: ~2 rows (approximately)
DELETE FROM `project`;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` (`id`, `createdAt`, `updatedAt`, `name`, `user_id`) VALUES
	(1, '2021-10-23 07:39:10', '2021-10-23 07:39:10', '99th Garage', 6),
	(2, '2021-10-23 21:52:10', '2021-10-23 21:52:10', '99th laundry', 6);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;

-- Dumping structure for table project_calculator.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

-- Dumping data for table project_calculator.user: ~5 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `createdAt`, `updatedAt`, `email`, `password`) VALUES
	(2, '2021-10-16 20:39:48', '2021-10-16 20:39:48', 'junky', '$2b$12$aaS93F1RTZ9voZN0FST.H.ZxrpfcjO.yfUyxRla3E5ft9syXdTZcu'),
	(3, '2021-10-16 20:40:43', '2021-10-16 20:40:43', 'junky', '$2b$12$es9t01Rm848aiXNi6HMGwO8v7SmeTyUu84gB05b2REJXZ5MEA9/2i'),
	(4, '2021-10-16 20:41:27', '2021-10-16 20:41:27', 'junky', '$2b$12$g0aPxgL7m0KyN6y8T9SuKOwAgEWGlvMtEky5XH5R7zAqSQ4IJACKO'),
	(5, '2021-10-16 20:59:48', '2021-10-16 20:59:48', 'junky@hotmail.com', '$2b$12$C4HZI6iXjLaCuwMutWlaaO2.KtUZxXNmBIF1mu1PaUCr9xs6LHnK6'),
	(6, '2021-10-22 21:45:00', '2021-10-22 21:45:00', 'zaynemayfield1@gmail.com', '$2b$12$qjefUsy4WaR1I1CwEZdofebYQOQcupzyKF5JXFDqG4GgaqI/jk0zG');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
