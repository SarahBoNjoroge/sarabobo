-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2025 at 09:38 AM
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
-- Database: `bookshop`
--

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
(6, 'admin45', '$2y$10$Ic/Mm4HOTyQeZXD45h6xxuqE3WlEhmzRY/L3BB9N2dbV8G8tOQ06i', '2025-07-08 11:25:00'),
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
(1, 'Creative Arts and Sports Learner\'s Book Grade 8', 'Kenya Institute of Curriculum Development (KICD)', 500.00, 70, 'This learner-centered book is designed to engage Grade 8 students in the exploration of Visual Arts, Performing Arts, and Physical Education. The content supports the Competency-Based Curriculum (CBC) and encourages creativity, critical thinking, collaboration, and active participation.', '2025-06-03 08:01:32', '	creative_arts_grade8.jpeg', NULL, NULL, NULL),
(2, 'Spotlight Pre-Technical Studies Learner\'s Book Grade 9', 'Spotlight Publishers (Kenya)', 500.00, 90, 'The Spotlight Pre-Technical Studies Learner’s Book for Grade 9 is a comprehensive course book developed in line with the Competency-Based Curriculum (CBC). It equips learners with foundational knowledge, values, and practical skills in various technical fields, preparing them for future specialization and hands-on innovation.', '2025-06-08 08:13:23', 'spotlight_pretech_grade9.jpeg', NULL, NULL, NULL),
(3, 'Fasihi Simulizi Gredi ya 7,8 na 9', 'oxford', 700.00, 20, 'Fasihi Simulizi Gredi ya 7, 8 na 9 ni kitabu cha kipekee kilichoandaliwa kwa uangalifu ili kuendeleza uelewa wa wanafunzi kuhusu fasihi simulizi katika kiwango cha msingi. Kitabu hiki kinachambua vipengele mbalimbali vya fasihi simulizi kama vile methali, hadithi za kihistoria, nyimbo, nahau, na methali. Kina mazoezi ya kuibua ubunifu, kukuza lugha, na kuhimiza ushirikiano wa kikundi darasani.\r\n\r\nLengo kuu ni kukuza ustadi wa kusikiliza, kuzungumza, kusoma, na kuandika kwa kutumia maudhui ya kijadi yanayohusiana na maisha ya kila siku ya wanafunzi. Kinafuata kikamilifu mtaala mpya wa elimu (CBC) nchini Kenya na kinafaa sana kwa walimu na wanafunzi.', '2025-06-06 11:51:30', 'Fasihi Simulizi Gredi ya 7,8 na 9.jpeg', NULL, NULL, NULL),
(4, 'Let\'s Do Mathematical Activities Grade 2', 'Kenya Literature Bureau (KLB)', 450.00, 9, 'Let’s Do Mathematical Activities Grade 2 is a well-structured course book that introduces Grade 2 learners to essential mathematical concepts through engaging activities, colorful illustrations, and real-life applications. The book follows the Competency-Based Curriculum (CBC) and focuses on developing critical thinking, problem-solving skills, and a strong numerical foundation.\r\n\r\nThe activities are learner-centered, encourage exploration, and are designed to help pupils apply mathematical ideas in everyday life. Topics covered include numbers, measurements, shapes, patterns, and data handling, all aligned with the Grade 2 curriculum.', '2025-06-11 11:53:21', 'Let\'s Do Mathematical Activities Grade 2.jpeg', NULL, NULL, NULL),
(5, 'Oxford 360° Atlas for Junior School', 'Oxford University Press (OUP)', 850.00, 27, 'The Oxford 360° Atlas for Junior School is a visually engaging and curriculum-aligned atlas designed specifically for learners in upper primary. It combines clear, up-to-date maps with informative graphics, photos, and fact boxes to support social studies, geography, and environmental learning.\r\n\r\nWith user-friendly layouts and simplified explanations, this atlas nurtures map-reading skills, global awareness, and appreciation of Kenya’s physical and political features. It also covers regional and world maps, climate zones, and global environmental challenges in an age-appropriate way.\r\n\r\n', '2025-06-19 11:56:08', 'Oxford 360° Atlas for Junior School.jpeg\r\n', NULL, NULL, NULL),
(6, 'Everyday Science and Technology Grade 4', 'Kenya Literature Bureau (KLB)', 600.00, 45, 'Everyday Science and Technology Grade 4 is part of the Competency-Based Curriculum (CBC) series approved by KICD. This book introduces learners to scientific and technological concepts through everyday experiences.\r\n\r\nThe content is structured to encourage exploration, observation, and problem-solving through interactive activities and real-life examples. It integrates digital literacy, environmental awareness, and innovation, preparing learners to understand and apply science in their daily lives.\r\n\r\n', '2025-06-11 11:58:03', 'Everyday Science and Technology.jpeg', NULL, NULL, NULL),
(7, 'faewgf', 'wergfrew', 536.00, 6677, 'gtdhbfd', '2025-07-08 11:59:21', 'book_686d0819a192b5.96165389.png', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `username`, `email`, `password`, `created_at`, `reset_token`, `reset_token_expiry`) VALUES
(123, 'bobo3', 'bobo@gmail.com', 'bobo123', '2025-06-02 12:34:26', NULL, NULL),
(124, 'bobo1', 'bobo1@example.com', 'bobo14', '2025-06-09 07:00:00', NULL, NULL),
(125, 'jane_doe', 'jane@example.com', 'jane4', '2025-06-09 07:05:00', NULL, NULL),
(126, 'johnny', 'john@example.com', 'john78', '2025-06-09 07:10:00', NULL, NULL),
(127, 'admin', 'admin@example.com', 'admin 34', '2025-06-09 07:15:00', NULL, NULL),
(129, '', 'sarah@gmail.com', '$2y$10$tjHmEAaijO/aj6aly36Tku8eN/wWXCWup798FzpDUN3asUhumjSpC', '2025-06-09 13:12:54', NULL, NULL),
(130, 'sarah', 'bobo4@gmail.com', '$2y$10$8A1XGKh9Vh0rfTQCktq2SexvDPZaf03xvZpEXONOoJK033DAu5NQu', '2025-06-11 10:17:58', NULL, NULL),
(131, 'admin5', 'sarahnjoroge2988@gmail.com', '$2y$10$PPMtbqX3VmfLYqO32BK28O67n/bcXGFtR3.sjTmQwJE66YIobsnsm', '2025-06-16 08:31:47', NULL, NULL),
(132, 'laban', 'laban@gmail.com', '$2y$10$ZB/FGuWALpbPD9gMbIYbXuVLWRAViRcPj6AgMBcinQTDXu/.UGRWm', '2025-06-16 08:46:27', NULL, NULL),
(133, 'kay', 'kay67@gmail.com', '$2y$10$qNNx1cGA6dmSZxhMog6gwu9.60VoYP/EFFrzq6LjRYC3wOS8A8Ede', '2025-06-16 08:59:41', NULL, NULL),
(134, 'hbdgh', 'gbtrd@gmail.com', '$2y$10$Zjd3faMbYoNgKclewvQOjuCerwZT5pzdBXgyFfRZphrpK2UkxKhWW', '2025-06-16 09:00:17', NULL, NULL),
(135, 'fdghtrg', 'gtrgtrgt@gmail.com', '$2y$10$jky5K/jJZxDQHC70HRZswurfOVH4JDVR12YW/GeMgQp7dEqPtYYne', '2025-06-16 09:06:16', NULL, NULL),
(136, 'gad', 'gad@gmail.com', '$2y$10$0rcYj6vNL54s6N8h/JR.6eCqlaDpTeRQ0eAraE5p.YEyZmnexr0XO', '2025-06-19 07:49:14', NULL, NULL),
(137, 'hdhy', 'hsgth@gmail.com', '$2y$10$KsoL7sCFe5qZ5Jt3UtTKS.yydzj0UluOqYeJJfqdRP0pk8sHfAZpC', '2025-06-19 09:25:56', NULL, NULL),
(138, 'bobo890', 'bobo890@gmail.com', '$2y$10$V3C6mxleQhZAXgQzkvhafevT4p/99MXDmqlAEWO6tMwzFneq3mA3W', '2025-06-19 10:42:21', NULL, NULL),
(139, 'bobo8900', 'bobo89000@gmail.com', '$2y$10$3CQaTH8/lhUz0J50Hn9jR.AZJSLir/rcRrVIOuyoiLrdX5Pe8k3.u', '2025-06-19 10:43:51', NULL, NULL),
(140, 'juyfju', 'jhnytjty@gmail.com', '$2y$10$FaCZ1.IDdTMeCxH5V45xEuK3Y0mz1U6YJXWXkXRQ.oQYVWJ8Z0AXa', '2025-06-19 10:45:34', NULL, NULL),
(141, 'jane', 'jane@gmail.com', '$2y$10$QRnMCkIaNVVVweXpHiSrpOyU.Qm7pN3usSfTJBdCkne0iO8QNzHyW', '2025-06-19 10:48:20', NULL, NULL),
(142, 'admin', 'kaddddel@gmail.com', '$2y$10$/KZxpHT8Je8fVCKEZd.7Uu.iBMp94X.Z.FJLXB0LiimND/JwGK0oK', '2025-07-03 07:47:07', NULL, NULL),
(143, 'ben', 'ben@gmail.com', '$2y$10$p8n8bnrOIFoJXoyixNKWC.6eaXanwSgngJkx7U.qAaZkt27/UTPXa', '2025-07-08 08:34:49', NULL, NULL),
(144, 'jyne', 'jyne@gmail.com', '$2y$10$gX01LIdXfpNO03h0zYPapenSbjR09r3bujyxDxQx/oyFe4MIcqtk.', '2025-07-08 09:18:49', NULL, NULL),
(145, 'sarah', 'sarahnjoroge729@gmail.com', '$2y$10$J0/icSWpToaQ26kmnUyRguhUiO6NB5cPmnZmiLxz9siCn9BQYyMHe', '2025-07-09 09:10:32', '9b258bde071464a852ff18aac58cfe3b', '2025-07-15 10:25:35'),
(146, 'adminr', 'adminr@gmail.com', '$2y$10$jyGCQ8vCKqmIeTm4jMkCQOkJCp904UHqdVq8whx9XfyczBv0N7hO2', '2025-07-09 09:22:23', NULL, NULL),
(147, 'adminyu', 'gfzsdgresa@gmail.com', '$2y$10$bb/.18WrPIhFX40q8s6b9ObPgIoCHD7KayTu1RegALuuonLD3BtC.', '2025-07-14 10:26:57', NULL, NULL),
(148, 'adminnn', 'adminnn@gmail.com', '$2y$10$0pLGbsqyi3uswF50sZtaD.GdhDLd2SC14co7lmkMh/KW4amJ/33H.', '2025-07-14 10:34:55', NULL, NULL),
(149, 'adminmn', 'adminmn@gmail.com', '$2y$10$yyPSOzbZ0TpMuDu.3E07Pu3gV4vCrDy6TeXLxnVDSa2ydwnMRPpeO', '2025-07-14 10:35:23', NULL, NULL),
(150, 'wambu', 'wambu@gmail.com', '$2y$10$FP6M/OCdyUmJTbSYhPY2sOgr2NmctT74w6xtC05LKaD.8DFFCeHl6', '2025-07-14 10:41:16', NULL, NULL),
(151, 'adminszfarf', 'aefraq@GMAIL.COM', '$2y$10$XnE5kkMqmZP0mTrLVr7xLuoOebtCSg/ZUTwWl6FUHzme.Sum8zNBm', '2025-07-17 07:35:13', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `order_date`, `total_amount`, `address`) VALUES
(71, 123, '2025-07-09 14:07:57', 1200.00, 'kitui'),
(72, 123, '2025-07-09 14:09:01', 400.00, 'kitui'),
(73, 123, '2025-07-09 14:16:38', 500.00, 'haiti'),
(74, 151, '2025-07-17 09:35:43', 554.00, 'WQDR');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `type` enum('book','stationery') DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_id`, `type`, `quantity`, `price`, `total_price`) VALUES
(109, 72, 1, 'stationery', 2, 200.00, 400.00),
(110, 73, 1, 'book', 1, 500.00, 500.00),
(111, 74, 2, 'stationery', 1, 554.00, 554.00);

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
(4, 123, 'you need to update your system\n', 5, '2025-07-09 11:47:16');

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
(1, 'Modelling_clay', 'Unlock your creativity with this high-quality, non-toxic modelling clay. Perfect for school projects, arts & crafts, or stress relief, this clay is soft, easy to mold, and comes in vibrant colors. Ideal for children, students, hobbyists, and professionals alike.', 200.00, 'Modelling clay.jpeg', '2025-06-16 07:22:07'),
(2, 'bobo', 'gthdetrghtyht', 554.00, '686d04dbde904.png', '2025-07-08 11:45:31'),
(3, 'fdeqfd', 'bgdbg', 55.00, '686d0a09a11c7.png', '2025-07-08 12:07:37'),
(4, 'fhydutrhy', 'hgfhgfd', 5654.00, '686d1131cbd3c_Screenshot 2025-06-05 152935.png', '2025-07-08 12:38:09'),
(5, 'Sarah ', 'hhhg', 65.00, '686d1348c5868_Screenshot 2025-07-08 121136.png', '2025-07-08 12:47:04');

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stationery`
--
ALTER TABLE `stationery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
