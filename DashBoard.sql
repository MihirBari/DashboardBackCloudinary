-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2023 at 10:30 PM
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
-- Database: `DashBoard`
--

-- --------------------------------------------------------

--
-- Table structure for table `debitors`
--

CREATE TABLE `debitors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `debitor_name` varchar(100) DEFAULT NULL,
  `debitor_Date` date DEFAULT NULL,
  `debitor_Amount` bigint(100) DEFAULT NULL,
  `debitor_paid_by` varchar(255) DEFAULT NULL,
  `total_product` bigint(100) DEFAULT NULL,
  `other_cost` bigint(100) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_id` int(11) NOT NULL,
  `Order_item_id` int(11) NOT NULL,
  `Creditor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `Order_id` int(11) NOT NULL,
  `product_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `creditor_name` varchar(2048) NOT NULL,
  `s` int(11) DEFAULT NULL,
  `m` int(11) DEFAULT NULL,
  `l` int(11) DEFAULT NULL,
  `xl` int(11) DEFAULT NULL,
  `xxl` int(11) DEFAULT NULL,
  `xxxl` int(11) DEFAULT NULL,
  `xxxxl` int(11) DEFAULT NULL,
  `xxxxxl` int(11) DEFAULT NULL,
  `xxxxxxl` int(11) DEFAULT NULL,
  `Total_items` int(11) DEFAULT NULL,
  `paid_by` varchar(255) NOT NULL,
  `amount_sold` int(11) DEFAULT NULL,
  `amount_condition` varchar(2048) NOT NULL,
  `returned` varchar(2048) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`Order_id`, `product_id`, `creditor_name`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`, `xxxxl`, `xxxxxl`, `xxxxxxl`, `Total_items`, `paid_by`, `amount_sold`, `amount_condition`, `returned`, `created_at`, `update_at`) VALUES
(69, 'KB01', 'ved', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Rahil', 5000, 'yes', 'No', '2023-12-26 19:13:20', '2023-12-26 19:13:20');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `s` bigint(100) NOT NULL,
  `m` bigint(100) NOT NULL,
  `l` bigint(100) NOT NULL,
  `xl` bigint(100) NOT NULL,
  `xxl` bigint(100) NOT NULL,
  `xxxl` bigint(100) NOT NULL,
  `xxxxl` bigint(100) NOT NULL,
  `xxxxxl` bigint(100) NOT NULL,
  `xxxxxxl` bigint(100) NOT NULL,
  `Stock` bigint(255) DEFAULT NULL,
  `product_price` bigint(20) NOT NULL,
  `Cost_price` bigint(20) NOT NULL,
  `product_type` varchar(255) NOT NULL,
  `product_image` mediumtext DEFAULT NULL,
  `other_cost` int(11) NOT NULL,
  `Final_cost` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `uuser_id` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `Description`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`, `xxxxl`, `xxxxxl`, `xxxxxxl`, `Stock`, `product_price`, `Cost_price`, `product_type`, `product_image`, `other_cost`, `Final_cost`, `user_id`, `uuser_id`, `deleted_at`, `created_at`, `updated_at`) VALUES
('AAA', 'hat', 'NA', 23, 10, 1, 0, 0, 0, 0, 0, 0, 34, 5353, 99998, '2 Piece', '[\"nf6xwoke24qias3euj9x\",\"x2hi8oig7klw7muxtyop\",\"kjzoapcamwesjuvechd3\"]', 1900, 101898, 50, NULL, NULL, '2023-12-26 17:47:33', NULL),
('AAAA', 'tshirt', 'NA', 23, 4, 0, 5, 0, 0, 0, 0, 0, 32, 3334, 9989, 'cloth', '[\"syvoenbibbcu6sh1hdyl\",\"ajkxmub57dytoml2djzw\",\"slqqiujoxgay1ajuavrw\",\"psugwppcfa9qmtz9cgas\"]', 543, 10532, 50, 50, NULL, '2023-12-26 18:07:37', '2023-12-26 19:57:22'),
('AAAAA', 'tshirt', 'NA', 23, 4, 0, 0, 0, 0, 0, 0, 77, 104, 333, 9989, 'cloth', '[\"lhjcoquhdmbpnsph0zpn\",\"azfcnsvw2ecfdkepxvur\"]', 543, 10532, 50, NULL, NULL, '2023-12-26 20:02:50', NULL),
('AAAAAA', 'hat', 'NA', 0, 0, 5, 6, 0, 0, 0, 0, 0, 11, 333, 9989, 'cloth', '[\"dyg8wbivbdxmw9iidrlp\",\"wmwtstzlvnia1wqbld1v\",\"qw9bls1y3qoonolhmbnd\",\"ek0tsfm9jm1tuxc5wwdr\",\"sxjvn0dbpxad6bvg5o0c\"]', 543, 10532, 50, NULL, NULL, '2023-12-26 20:06:31', NULL),
('AAAAAAA', 'hat', 'NA', 23, 10, 66, 0, 0, 0, 0, 0, 0, 99, 8689, 99996, '2 Piece', '[\"osqxmx8mqpnk9ecjtpmw\",\"ywbdpkyhvcpmpmzb57v2\",\"bmk9fxq8eqdwknvcg2r7\",\"mq5d3yakp4l0yp4zy6ur\"]', 543, 100539, 50, NULL, NULL, '2023-12-26 20:15:48', NULL),
('KB01', 'tshirt', 'NA', 22, 10, 0, 8, 33, 0, 0, 53, 0, 126, 333, 9989, 'cloth', '[\"bsy3v37qyycfiw48fsge\",\"kyzrcvfkkworxcgnd6gl\",\"ktxd8rqvetushi5ji4c3\",\"nvpqb9mqnxnl4ijuywao\",\"nabloji4tob0l9wkktlw\"]', 543, 10532, 50, 50, NULL, '2023-12-26 19:13:01', '2023-12-26 19:54:04');

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
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `signature` varchar(2048) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `signature`, `remember_token`, `created_at`, `updated_at`) VALUES
(50, 'Rahil', 'Rahil', NULL, '$2a$10$uiX1atC1FFfAGdBvAvfPIuFJb0gIQ5p2fhWELfHcNjqKnMXscEzCW', NULL, NULL, NULL, NULL, NULL, '2023-12-24 13:47:16', '2023-12-24 13:48:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `debitors`
--
ALTER TABLE `debitors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`Order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `product_id` (`product_id`);

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
-- AUTO_INCREMENT for table `debitors`
--
ALTER TABLE `debitors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `Order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
