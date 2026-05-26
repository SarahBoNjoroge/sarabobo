-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2026 at 10:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bank_management_system`
--
CREATE DATABASE IF NOT EXISTS `bank_management_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bank_management_system`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `account_type` enum('Savings','Checking') NOT NULL,
  `balance` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `name`, `email`, `phone`, `address`, `created_at`) VALUES
(123, 'Sarah', 'sarah4@gmail.com', '09876542', 'kalu', '2025-04-03 22:42:52'),
(6543, 'sara', 'sara@gmail.com', '987654678', 'gany', '2025-04-03 23:02:12');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `username`, `password`, `role`) VALUES
(1, 'sandra', 'sandra', 'you', 'employee'),
(2, 'AESRGDH', 'DGFH', 'YUU', 'UYYUYI'),
(3, 'jay', 'jayn', 'jay', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `loan_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `loan_amount` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `duration_months` int(11) NOT NULL,
  `status` enum('Pending','Approved','Rejected','Paid') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `transaction_type` enum('Deposit','Withdrawal','Transfer') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Teller','Manager') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`loan_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6544;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `loan_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;
--
-- Database: `bookshop`
--
CREATE DATABASE IF NOT EXISTS `bookshop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bookshop`;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`) VALUES
(4, 'admin5', '$2y$10$hNxPKA18ngW5QhT6uP/MsuBYGa0Tt7Ki0.9Eb1CMJJlnKiIXQBwGK', '2025-07-08 11:11:07'),
(7, 'admin90', '$2y$10$viVYYuKK.G7CQZx2hnO0w.zCAWlDXUwwSVPatS5x3oMlxov.9fyd2', '2025-07-09 07:17:45'),
(9, 'bobo', '$2y$10$GL7k27nLKlMbYK2Szsa.xe2Vd0LZ/G0LYivFylPFVu3eqtcYOBFB6', '2025-07-09 07:30:32'),
(10, 'sarah', '$2y$10$fhWNLBQumuT5NgI6qM2/IOT8iuXoapNnpKHDlDcBBFnaTCZH4viIe', '2025-07-09 07:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cover_image` varchar(255) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `grade` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `price`, `stock`, `description`, `created_at`, `cover_image`, `level`, `grade`, `subject`) VALUES
(1, 'Creative Arts and Sports Learner\'s Book Grade 8', 'Kenya Institute of Curriculum Development (KICD)', 500.00, 70, 'This learner-centered book is designed to engage Grade 8 students in the exploration of Visual Arts, Performing Arts, and Physical Education. The content supports the Competency-Based Curriculum (CBC) and encourages creativity, critical thinking, collaboration, and active participation.', '2025-06-03 08:01:32', '	creative_arts_grade8.jpeg', 'Junior Secondary', 'Grade 8', 'Creative Arts & Sports'),
(2, 'Spotlight Pre-Technical Studies Learner\'s Book Grade 9', 'Spotlight Publishers (Kenya)', 500.00, 90, 'The Spotlight Pre-Technical Studies Learner’s Book for Grade 9 is a comprehensive course book developed in line with the Competency-Based Curriculum (CBC). It equips learners with foundational knowledge, values, and practical skills in various technical fields, preparing them for future specialization and hands-on innovation.', '2025-06-08 08:13:23', 'spotlight_pretech_grade9.jpeg', 'Junior Secondary', 'Grade 9', 'Pre-Technical Studies'),
(3, 'Fasihi Simulizi Gredi ya 7,8 na 9', 'oxford', 700.00, 20, 'Fasihi Simulizi Gredi ya 7, 8 na 9 ni kitabu cha kipekee kilichoandaliwa kwa uangalifu ili kuendeleza uelewa wa wanafunzi kuhusu fasihi simulizi katika kiwango cha msingi. Kitabu hiki kinachambua vipengele mbalimbali vya fasihi simulizi kama vile methali, hadithi za kihistoria, nyimbo, nahau, na methali. Kina mazoezi ya kuibua ubunifu, kukuza lugha, na kuhimiza ushirikiano wa kikundi darasani.\r\n\r\nLengo kuu ni kukuza ustadi wa kusikiliza, kuzungumza, kusoma, na kuandika kwa kutumia maudhui ya kijadi yanayohusiana na maisha ya kila siku ya wanafunzi. Kinafuata kikamilifu mtaala mpya wa elimu (CBC) nchini Kenya na kinafaa sana kwa walimu na wanafunzi.', '2025-06-06 11:51:30', 'Fasihi Simulizi Gredi ya 7,8 na 9.jpeg', 'Junior Secondary', 'Grade 8', 'Kiswahili'),
(4, 'Let\'s Do Mathematical Activities Grade 2', 'Kenya Literature Bureau (KLB)', 450.00, 9, 'Let’s Do Mathematical Activities Grade 2 is a well-structured course book that introduces Grade 2 learners to essential mathematical concepts through engaging activities, colorful illustrations, and real-life applications. The book follows the Competency-Based Curriculum (CBC) and focuses on developing critical thinking, problem-solving skills, and a strong numerical foundation.\r\n\r\nThe activities are learner-centered, encourage exploration, and are designed to help pupils apply mathematical ideas in everyday life. Topics covered include numbers, measurements, shapes, patterns, and data handling, all aligned with the Grade 2 curriculum.', '2025-06-11 11:53:21', 'Let\'s Do Mathematical Activities Grade 2.jpeg', 'Primary', 'Grade 2', 'Mathematics'),
(5, 'Oxford 360° Atlas for Junior School', 'Oxford University Press (OUP)', 850.00, 27, 'The Oxford 360° Atlas for Junior School is a visually engaging and curriculum-aligned atlas designed specifically for learners in upper primary. It combines clear, up-to-date maps with informative graphics, photos, and fact boxes to support social studies, geography, and environmental learning.\r\n\r\nWith user-friendly layouts and simplified explanations, this atlas nurtures map-reading skills, global awareness, and appreciation of Kenya’s physical and political features. It also covers regional and world maps, climate zones, and global environmental challenges in an age-appropriate way.\r\n\r\n', '2025-06-19 11:56:08', 'Oxford 360° Atlas for Junior School.jpeg\r\n', 'Junior Secondary', 'Grade 9', 'Social Studies'),
(6, 'Everyday Science and Technology Grade 4', 'Kenya Literature Bureau (KLB)', 600.00, 45, 'Everyday Science and Technology Grade 4 is part of the Competency-Based Curriculum (CBC) series approved by KICD. This book introduces learners to scientific and technological concepts through everyday experiences.\r\n\r\nThe content is structured to encourage exploration, observation, and problem-solving through interactive activities and real-life examples. It integrates digital literacy, environmental awareness, and innovation, preparing learners to understand and apply science in their daily lives.\r\n\r\n', '2025-06-11 11:58:03', 'Everyday Science and Technology.jpeg', 'Primary', 'Grade 4', 'Home Science');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `username`, `full_name`, `phone`, `email`, `password`, `created_at`, `reset_token`, `reset_token_expiry`) VALUES
(154, 'Bobo', 'Sarah Njoroge', '0793591911', 'sarahnjoroge729@gmail.com', '$2y$10$HN.enEfp58FRY0LgX1P1T.9GLCokFe3SuEizaD0Gv68EE77ine4se', '2026-05-14 10:56:57', '114e2e5a2029c87a674704ad77f5ca1d', '2026-05-26 16:53:29'),
(155, 'Bobo', 'Bobo', '0711293493', 'bilela5678cleo@gmail.com', '$2y$10$TXOfPxBN99iQlGEUBDJstenAwkbEfTRw1mxKX92BYr4KVGeBjeSiq', '2026-05-26 12:54:09', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `delivery_type` varchar(50) DEFAULT NULL,
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `pickup_point` varchar(255) DEFAULT NULL,
  `parcel_service` varchar(100) DEFAULT NULL,
  `receiver_phone` varchar(20) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `total_price`, `delivery_type`, `latitude`, `longitude`, `pickup_point`, `parcel_service`, `receiver_phone`, `order_date`, `status`) VALUES
(13, 154, 2508.00, 'parcel', NULL, NULL, NULL, '2NK', '97y7864723987', '2026-05-15 05:15:51', 'DELIVERED'),
(14, 154, 1200.00, 'pickup', NULL, NULL, 'Juja', NULL, NULL, '2026-05-25 09:05:03', 'PENDING'),
(15, 154, 500.00, 'doorstep', '-1.0623478368455859', '37.123553439855236', NULL, NULL, NULL, '2026-05-26 08:58:07', 'PROCESSING'),
(16, 154, 1100.00, 'parcel', NULL, NULL, NULL, 'fargo', '3456789078', '2026-05-26 14:11:31', 'PENDING'),
(17, 155, 850.00, 'parcel', NULL, NULL, NULL, 'G4S', 'O711234567', '2026-05-26 20:02:10', 'PENDING');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_type` varchar(20) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_type`, `item_id`, `quantity`, `price`) VALUES
(25, 13, 'stationery', 2, 2, 554.00),
(26, 13, 'book', 2, 1, 500.00),
(27, 13, 'book', 3, 1, 700.00),
(28, 13, 'stationery', 1, 1, 200.00),
(29, 14, 'book', 2, 1, 500.00),
(30, 14, 'book', 3, 1, 700.00),
(31, 15, 'book', 1, 1, 500.00),
(32, 16, 'book', 2, 1, 500.00),
(33, 16, 'book', 6, 1, 600.00),
(34, 17, 'stationery', 1, 2, 200.00),
(35, 17, 'book', 4, 1, 450.00);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `review` text NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `customer_id`, `review`, `rating`, `created_at`) VALUES
(1, 123, 'frr', 5, '2025-07-09 10:36:54'),
(2, 123, 'good', 3, '2025-07-09 10:38:19'),
(3, 123, 'fr', 5, '2025-07-09 10:40:15'),
(4, 123, 'you need to update your system\n', 5, '2025-07-09 11:47:16'),
(5, 154, 'i love your service', 4, '2026-05-26 14:16:28');

-- --------------------------------------------------------

--
-- Table structure for table `stationery`
--

CREATE TABLE `stationery` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stationery`
--

INSERT INTO `stationery` (`id`, `name`, `description`, `price`, `image`, `created_at`) VALUES
(1, 'Modelling_clay', 'Unlock your creativity with this high-quality, non-toxic modelling clay. Perfect for school projects, arts & crafts, or stress relief, this clay is soft, easy to mold, and comes in vibrant colors. Ideal for children, students, hobbyists, and professionals alike.', 200.00, 'Modelling clay.jpeg', '2025-06-16 07:22:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stationery`
--
ALTER TABLE `stationery`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stationery`
--
ALTER TABLE `stationery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- Database: `homeless_db`
--
CREATE DATABASE IF NOT EXISTS `homeless_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `homeless_db`;
--
-- Database: `hospital_management`
--
CREATE DATABASE IF NOT EXISTS `hospital_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hospital_management`;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(50) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `doctor_name` int(50) NOT NULL,
  `residence` varchar(50) NOT NULL,
  `appointment_date` datetime NOT NULL,
  `reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_name`, `doctor_name`, `residence`, `appointment_date`, `reason`) VALUES
(1564567, 'belden', 0, 'chuka', '2024-03-17 18:38:00', 'gfjghhj');

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `patient_id` int(50) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `amount` int(20) NOT NULL,
  `payment_details` varchar(50) NOT NULL,
  `date_issued` varchar(20) NOT NULL,
  `reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`patient_id`, `patient_name`, `amount`, `payment_details`, `date_issued`, `reason`) VALUES
(1234, 'belden', 35654, 'SDFF', '2024-03-07T18:57', 'SURGERY');

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
  `consultation_id` int(50) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `doctor_name` varchar(50) NOT NULL,
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `doctor_id` int(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `specialty` varchar(50) NOT NULL,
  `department_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctor_id`, `name`, `specialty`, `department_name`) VALUES
(754, 'bobo47.', '', 'operations and theat'),
(0, 'sarah', '', 'DaCQW'),
(0, 'sarah', '', 'parts'),
(1234, 'sarah', '', 'operations and theat'),
(56789, 'dfxkjl;', 'dtfghjkl;', 'tdyfuygihojpkpl'),
(546789, 'hgfhh', 'fghjkl;', 'tyuio'),
(1234, 'ewrtyt', 'werty', 'eqwersdtfhyj');

-- --------------------------------------------------------

--
-- Table structure for table `in_patients`
--

CREATE TABLE `in_patients` (
  `patient_id` int(10) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `residence` varchar(50) NOT NULL,
  `admission_date` date NOT NULL,
  `room_no` text NOT NULL,
  `nurse_name` varchar(50) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `patient_id` int(20) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `residence` varchar(20) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `age` int(50) NOT NULL,
  `phone` int(50) NOT NULL,
  `illness` varchar(50) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_id`, `patient_name`, `residence`, `gender`, `age`, `phone`, `illness`, `date`) VALUES
(1234, 'belden', 'chuka', 'Male', 19, 789655, 'accident', '2024-03-17 17:54:00'),
(1234, 'belden', 'chuka', 'Male', 19, 789655433, 'ukedi', '2024-03-10 18:25:00'),
(1234, 'belden', 'chuka', 'Male', 19, 789655433, 'ukedi', '2024-03-10 18:25:00'),
(1234, 'belden', 'chuka', 'Male', 19, 789655433, 'ukedi', '2024-03-10 18:25:00'),
(1234, 'belden', 'chuka', 'Male', 19, 789655433, 'TB', '2024-03-10 18:25:00');

-- --------------------------------------------------------

--
-- Table structure for table `residence`
--

CREATE TABLE `residence` (
  `patient_id` int(50) NOT NULL,
  `residence` varchar(50) NOT NULL,
  `admission_date` int(20) NOT NULL,
  `room_no` int(50) NOT NULL,
  `nurse_name` varchar(50) NOT NULL,
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `patient_name` varchar(50) NOT NULL,
  `doctor_name` varchar(50) NOT NULL,
  `test_results` varchar(50) NOT NULL,
  `test_date` datetime NOT NULL,
  `recommendations` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_name` varchar(50) NOT NULL,
  `capacity` int(100) NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_name`, `capacity`, `status`) VALUES
('GFBBDF', 69, 'FULL');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(10) NOT NULL,
  `staff_name` varchar(50) NOT NULL,
  `gender` text NOT NULL,
  `phone` int(15) NOT NULL,
  `duty` varchar(100) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `staff_name`, `gender`, `phone`, `duty`, `date`) VALUES
(56789, 'vhbjn.,m.', 'Male', 789655, 'fghjkl', '2024-04-03');

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `patient_name` varchar(50) NOT NULL,
  `doctor_name` varchar(50) NOT NULL,
  `test_results` varchar(50) NOT NULL,
  `test_date` datetime NOT NULL,
  `recommendations` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- Database: `job_search_db`
--
CREATE DATABASE IF NOT EXISTS `job_search_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `job_search_db`;

-- --------------------------------------------------------

--
-- Table structure for table `career_resources`
--

CREATE TABLE `career_resources` (
  `resource_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `link` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `upload_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_resources`
--

INSERT INTO `career_resources` (`resource_id`, `title`, `description`, `link`, `category`, `upload_date`) VALUES
(1, 'Resume Writing Guide', 'Learn how to write a professional resume.', 'https://example.com/resume_guide', 'Resume', '2023-01-15'),
(2, 'Interview Preparation', 'Prepare yourself for job interviews', 'https://example.com/interview_checklist', 'Interview', '2023-02-20'),
(3, 'Job Search Websites', 'A list of top job search websites', 'https://example.com/job_search_websites', 'Job Search', '2023-03-10'),
(4, 'Java Developer Job Listings', 'Job listings for Java developers.', 'https://example.com/java_job_listings', 'Job Listings', '2023-04-05');

-- --------------------------------------------------------

--
-- Table structure for table `job_listings`
--

CREATE TABLE `job_listings` (
  `job_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `requirements` text NOT NULL,
  `salary` varchar(60) NOT NULL,
  `posting_date` date NOT NULL,
  `expiry_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_listings`
--

INSERT INTO `job_listings` (`job_id`, `title`, `company`, `location`, `description`, `requirements`, `salary`, `posting_date`, `expiry_date`) VALUES
(1, 'Java developer', 'XYZ Company', 'Nairobi', 'Java developers with 3 years of experience', 'Masters in Comp science', '90$', '2024-04-06', '2024-03-04'),
(2, 'Front end developing', 'Acme analytics', 'Mombasa', 'Experience with Html and Css', '3 years of experience', '80$', '2024-02-03', '2024-11-04'),
(3, 'UX/UI Designer', 'DesignCo', 'Nakuru', 'Work with the best Graphic designers', 'Proficiency in Adobe creative suite', '50$', '2024-12-07', '2024-03-11'),
(4, 'Data Scientist', 'Acme nalytics', 'Wembley', 'Data scientist with ', 'masters in statistics/ mathematics or other fileds', '100$', '2024-03-09', '2024-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `mentorship_support`
--

CREATE TABLE `mentorship_support` (
  `mentorship_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `meeting_frequency` varchar(50) NOT NULL,
  `meeting_platform` varchar(100) NOT NULL,
  `topics_covered` text NOT NULL,
  `next_steps_action_plan` text NOT NULL,
  `next_meeting_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mentorship_support`
--

INSERT INTO `mentorship_support` (`mentorship_id`, `start_date`, `status`, `duration`, `meeting_frequency`, `meeting_platform`, `topics_covered`, `next_steps_action_plan`, `next_meeting_date`) VALUES
(234, '2024-04-12', 'ongoing', '3 weeks', 'twice a week', 'zoom', 'Java, Python, html', 'training on web development', '2024-05-06'),
(23, '2024-12-08', 'ongoing', '3 weeks', 'once per week', 'skype', 'Web development', 'Javascript application', '2024-08-06'),
(45, '2024-07-04', 'ended', '1 month', 'thrice a week', 'Google meet', 'Career advice', 'Career sources', '2024-12-09');

-- --------------------------------------------------------

--
-- Table structure for table `online_forums`
--

CREATE TABLE `online_forums` (
  `forum_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `creator` text NOT NULL,
  `creation_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `online_forums`
--

INSERT INTO `online_forums` (`forum_id`, `title`, `description`, `category`, `creator`, `creation_date`) VALUES
(234, 'Java developers forum', 'A community for java developers to discuss topics', 'Programming', 'experienced Java developer', '2024-03-12'),
(2, 'Java developers', 'Community for java developers t interact', 'Programming', 'Experienced developer', '2024-04-20'),
(3, 'Data Science Q&A', 'Questions and answers forum for data science', 'Data science', 'Data analyst', '2024-04-05'),
(4, 'Web development discussion', 'Web development trends and technologies', 'Web development', 'Web developer', '2024-08-11');

-- --------------------------------------------------------

--
-- Table structure for table `training_materials`
--

CREATE TABLE `training_materials` (
  `training_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `link` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `upload_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training_materials`
--

INSERT INTO `training_materials` (`training_id`, `title`, `description`, `link`, `category`, `upload_date`) VALUES
(234, 'Java programming', 'Itroduction to java basics', 'https://googlemeet.@ac.ke', 'Programming', '2024-04-01'),
(2, 'Python for data science', 'Python fundamentals for data science', 'https://w3schools/pythondatasci//.ke', 'Data science', '2023-09-12'),
(3, 'Introduction to machine learning', 'Basics of machine learning concepts', 'https://codecamp/.machinelearning//.co', 'machine learning', '2024-02-09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`) VALUES
('admin', 1111),
('chey', 1234),
('bobo', 4545);

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

CREATE TABLE `user_profile` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `location` varchar(100) NOT NULL,
  `skills` text NOT NULL,
  `experience` varchar(50) NOT NULL,
  `education` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`user_id`, `full_name`, `email`, `phone_number`, `location`, `skills`, `experience`, `education`) VALUES
(1, 'Sarah Wambui', 'sarawambp@gmail.com', '078967543', 'Ndagani', 'Java, Python, Web development', '5 years', 'BSc Computer science'),
(2, 'Josiah Chege', 'joscalculus@gmail.com', '07889675', 'Embu', 'Software developer', '4 years', 'Masters in Comp Science'),
(3, 'Belden Mautia', 'beldenm@yahoo,com', '076654354', 'Bungoma', 'Web developer', '2 years', 'BSc in Applied Comp sci');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`password`);
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"bookshop\",\"table\":\"reviews\"},{\"db\":\"bookshop\",\"table\":\"orders\"},{\"db\":\"bookshop\",\"table\":\"order_items\"},{\"db\":\"bookshop\",\"table\":\"customers\"},{\"db\":\"bookshop\",\"table\":\"books\"},{\"db\":\"bookshop\",\"table\":\"admins\"},{\"db\":\"task_manager\",\"table\":\"tasks\"},{\"db\":\"bank_management_system\",\"table\":\"accounts\"},{\"db\":\"bank_management_system\",\"table\":\"employees\"},{\"db\":\"bank_management_system\",\"table\":\"users\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2026-05-26 19:37:33', '{\"Console\\/Mode\":\"collapse\",\"Server\\/hide_db\":\"\",\"Server\\/only_db\":\"\",\"NavigationWidth\":242,\"Console\\/EnterExecutes\":true}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `task_manager`
--
CREATE DATABASE IF NOT EXISTS `task_manager` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `task_manager`;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_03_29_123627_create_tasks_table', 2),
(5, '2026_03_29_124823_create_personal_access_tokens_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('hqmq7EryRqJiSEnBUMBvtGsKP4DNkZi3cVUePkHO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic2llZ3ROejNKaHNVZkF6dmJ3MnB5VEdyRU11SlM3Y3NMRk9BV3NiayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774788644),
('szujPNbYDPdSExdGxSl7ePh17fyf0nzZWyJOKFwB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoielhtYVA4QU1yeTFZNXdtOGdUQmZMMFNLa1hqOVloUXF2QzRhUWNWSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774797075);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `priority` enum('low','medium','high') NOT NULL,
  `status` enum('pending','in_progress','done') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `due_date`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Test delete rule', '2026-04-10', 'low', 'pending', '2026-03-29 10:10:44', '2026-03-29 10:10:44'),
(3, 'interview', '2026-03-29', 'high', 'done', '2026-03-29 12:04:17', '2026-03-29 12:04:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
