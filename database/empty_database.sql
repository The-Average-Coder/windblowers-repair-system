SET NAMES utf8mb4;

CREATE TABLE `assessments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `repair_id` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `date_created` date NOT NULL,
  `time` int NOT NULL DEFAULT '0',
  `time_cost` int NOT NULL DEFAULT '0',
  `materials` varchar(400) COLLATE utf8mb4_general_ci NOT NULL,
  `job_type_id` int NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `calendar_details_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `week_enabled` tinyint(1) NOT NULL,
  `day_enabled` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `calendar_details_settings` WRITE;

INSERT INTO `calendar_details_settings` (`id`, `name`, `week_enabled`, `day_enabled`)
VALUES
	(1,'Instrument',1,1),
	(2,'Serial Number',0,0),
	(3,'Instrument Status',0,1),
	(4,'Customer',0,0),
	(5,'Job Type',0,1);

UNLOCK TABLES;

CREATE TABLE `calendar_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `time` int NOT NULL DEFAULT '0',
  `all_day` tinyint(1) NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `repairer_id` int NOT NULL,
  `repair_id` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `telephone` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `address` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hourly_rate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hourly_rate` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `hourly_rate` WRITE;

INSERT INTO `hourly_rate` (`id`, `hourly_rate`)
VALUES
	(1,4500);

UNLOCK TABLES;

CREATE TABLE `instrument_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `instrument_statuses` WRITE;

INSERT INTO `instrument_statuses` (`id`, `status`)
VALUES
	(1,'Unspecified');

UNLOCK TABLES;

CREATE TABLE `instruments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `manufacturer` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `serial_number` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `job_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci NOT NULL,
  `materials` text COLLATE utf8mb4_general_ci NOT NULL,
  `time` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `job_types` WRITE;

INSERT INTO `job_types` (`id`, `name`, `notes`, `materials`, `time`)
VALUES
	(1,'Unspecified','','',0);

UNLOCK TABLES;

CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `price` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `repairers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `hours` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `repairs` (
  `id` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `status` int NOT NULL,
  `customer_id` int NOT NULL,
  `in_house` tinyint(1) NOT NULL,
  `instrument_id` int NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci NOT NULL,
  `deadline` date DEFAULT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;