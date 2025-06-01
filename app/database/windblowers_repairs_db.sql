-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 03:48 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `windblowers_repairs_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `repair_id` varchar(10) NOT NULL,
  `date_created` date NOT NULL,
  `time` int(11) NOT NULL,
  `time_cost` int(11) NOT NULL,
  `materials` text NOT NULL,
  `material_cost` text NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`id`, `repair_id`, `date_created`, `time`, `time_cost`, `materials`, `material_cost`, `job_type_id`, `notes`) VALUES
(1, '2522001', '2025-05-27', 240, 180, '', '', 1, 'Some Notes');

-- --------------------------------------------------------

--
-- Table structure for table `calendar_details_settings`
--

CREATE TABLE `calendar_details_settings` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `week_enabled` tinyint(1) NOT NULL,
  `day_enabled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_details_settings`
--

INSERT INTO `calendar_details_settings` (`id`, `name`, `week_enabled`, `day_enabled`) VALUES
(1, 'Instrument', 1, 1),
(2, 'Serial Number', 0, 0),
(3, 'Instrument Status', 0, 1),
(4, 'Customer', 0, 0),
(5, 'Job Type', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `color` varchar(20) NOT NULL,
  `repairer_id` int(11) NOT NULL,
  `repair_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_events`
--

INSERT INTO `calendar_events` (`id`, `type`, `title`, `description`, `date`, `color`, `repairer_id`, `repair_id`) VALUES
(1, 'Repair', '', '', '2025-05-29', 'blue', 1, '2522001');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `firstname`, `surname`, `email`, `telephone`, `address`) VALUES
(1, 'Josh', 'Cox', '', '07796593187', '');

-- --------------------------------------------------------

--
-- Table structure for table `hourly_rate`
--

CREATE TABLE `hourly_rate` (
  `id` int(11) NOT NULL,
  `hourly_rate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hourly_rate`
--

INSERT INTO `hourly_rate` (`id`, `hourly_rate`) VALUES
(1, 45);

-- --------------------------------------------------------

--
-- Table structure for table `instruments`
--

CREATE TABLE `instruments` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `manufacturer` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `serial_number` varchar(50) NOT NULL,
  `status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instruments`
--

INSERT INTO `instruments` (`id`, `type`, `manufacturer`, `model`, `serial_number`, `status_id`) VALUES
(1, 'Flute', 'Pearl', '505', 'HDL1963', 2);

-- --------------------------------------------------------

--
-- Table structure for table `instrument_statuses`
--

CREATE TABLE `instrument_statuses` (
  `id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instrument_statuses`
--

INSERT INTO `instrument_statuses` (`id`, `status`) VALUES
(1, 'Not Yet Dropped Off'),
(2, 'In Workshop');

-- --------------------------------------------------------

--
-- Table structure for table `job_types`
--

CREATE TABLE `job_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `notes` text NOT NULL,
  `materials` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_types`
--

INSERT INTO `job_types` (`id`, `name`, `notes`, `materials`) VALUES
(1, 'Unspecified', '', ''),
(2, 'Repad', 'Repad Notes', ''),
(3, 'Clean', 'Clean Notes', ''),
(12, 'Flute Repad', 'Flute Repad Notes\nMore Notes', ''),
(13, 'Clarinet Repad', 'Clarinet  Repad Notes\nMore Notes', ''),
(14, 'Soprano Saxophone Repad', 'Soprano Sax Repad Notes\nMore Notes', ''),
(15, 'Alto Saxophone Repad', 'Alto Sax  Repad Notes\nMore Notes', ''),
(16, 'Tenor Saxophone Repaid', 'Tenor Sax  Repad Notes\nMore Notes', ''),
(17, 'Baritone Saxophone Repad', 'Baritone Sax  Repad Notes\nMore Notes', ''),
(18, 'Bass Saxophone Repaid', 'Bass Sax  Repad Notes\nMore Notes', '');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `name`, `price`) VALUES
(2, 'Flute Pad', 50),
(3, 'Clarinet Pad', 12);

-- --------------------------------------------------------

--
-- Table structure for table `repairers`
--

CREATE TABLE `repairers` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `hours` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repairers`
--

INSERT INTO `repairers` (`id`, `name`, `hours`) VALUES
(1, 'Purple', '8,8,8,8,4'),
(2, 'Ryan', '0,8,8,8,0');

-- --------------------------------------------------------

--
-- Table structure for table `repairs`
--

CREATE TABLE `repairs` (
  `id` varchar(10) NOT NULL,
  `status` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `in_house` tinyint(1) NOT NULL,
  `instrument_id` int(11) NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repairs`
--

INSERT INTO `repairs` (`id`, `status`, `customer_id`, `in_house`, `instrument_id`, `notes`) VALUES
('2522001', 1, 1, 0, 1, 'Appears to be a simple repad');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calendar_details_settings`
--
ALTER TABLE `calendar_details_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hourly_rate`
--
ALTER TABLE `hourly_rate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `instruments`
--
ALTER TABLE `instruments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `instrument_statuses`
--
ALTER TABLE `instrument_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_types`
--
ALTER TABLE `job_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repairers`
--
ALTER TABLE `repairers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `calendar_details_settings`
--
ALTER TABLE `calendar_details_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hourly_rate`
--
ALTER TABLE `hourly_rate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `instruments`
--
ALTER TABLE `instruments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `instrument_statuses`
--
ALTER TABLE `instrument_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `job_types`
--
ALTER TABLE `job_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `repairers`
--
ALTER TABLE `repairers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
