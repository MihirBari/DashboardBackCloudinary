-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2024 at 04:43 PM
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
-- Database: `aspadmin`
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
  `paid_status` varchar(255) NOT NULL,
  `product_type` varchar(255) NOT NULL,
  `debitor_paid_by` varchar(255) DEFAULT NULL,
  `total_product` bigint(100) DEFAULT NULL,
  `other_cost` bigint(100) DEFAULT NULL,
  `remark` varchar(255) NOT NULL,
  `company_paid` varchar(255) NOT NULL,
  `payment_mode` varchar(255) NOT NULL,
  `reciept` mediumtext DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `debitors`
--

INSERT INTO `debitors` (`id`, `debitor_name`, `debitor_Date`, `debitor_Amount`, `paid_status`, `product_type`, `debitor_paid_by`, `total_product`, `other_cost`, `remark`, `company_paid`, `payment_mode`, `reciept`, `deleted_at`, `created_at`, `updated_at`) VALUES
(50, 'Mihir', '2024-01-09', 5000, 'yes', '2 Piece', 'Rahil', 566, 543, 'Noice', 'yes', 'By company employee', '[\"j6izxhibmkw3mm8grvxl\"]', NULL, '2024-01-09 20:37:18', '2024-01-10 20:51:23'),
(51, 'Rahil', '2024-01-10', 121213, 'yes', 'Jeans', 'mihir', 566, 543, 'Noice', 'yes', 'UPI', '[\"qu3c1s9pgjbse8nvybko\"]', NULL, '2024-01-10 20:46:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `details`
--

CREATE TABLE `details` (
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `Total_items` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `details`
--

INSERT INTO `details` (`product_id`, `product_name`, `Total_items`, `created_at`) VALUES
('KB12', 'tshirt', 20, '2024-01-08 19:40:42'),
('KB12', 'tshirt', 29, '2024-01-08 19:43:05'),
('AAAAAA', 'hat', 11, '2024-01-08 20:59:43'),
('KB13', 'tshirt', 111, '2024-01-08 21:00:39'),
('AAAAAA', 'hat', 11, '2024-01-08 21:00:54'),
('KB14', 'tshirt', 27, '2024-01-08 21:03:32'),
('KB14', 'tshirt', 20, '2024-01-08 21:06:48'),
('KB12', 'tshirt', 29, '2024-01-08 21:09:10'),
('KB12', 'tshirt', 29, '2024-01-08 21:10:50'),
('KB12', 'tshirt', 29, '2024-01-08 21:10:54'),
('KB11', 'tshirt', 93, '2024-01-08 21:11:04'),
('KB11', 'tshirt', 93, '2024-01-08 21:11:07'),
('KB12', 'tshirt', 29, '2024-01-08 21:11:24'),
('KB11', 'tshirt', 93, '2024-01-08 21:14:11'),
('KB12', 'tshirt', 29, '2024-01-08 21:14:27');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `amount` varchar(255) NOT NULL,
  `paid_status` varchar(255) NOT NULL,
  `paid_by` varchar(255) NOT NULL,
  `remarks` varchar(255) NOT NULL,
  `clearance_status` varchar(255) NOT NULL,
  `payment_mode` varchar(255) NOT NULL,
  `reciept` mediumtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `name`, `date`, `amount`, `paid_status`, `paid_by`, `remarks`, `clearance_status`, `payment_mode`, `reciept`, `created_at`, `updated_at`) VALUES
(2, 'Mihir', '2024-01-10', '45456', 'no', 'Rahil', 'Noicee', 'yes', 'UPI', '[\"vcjk9cwy23eed11zuvgi\"]', '2024-01-03 19:32:01', '2024-01-10 20:15:48'),
(4, 'Mihir', '2024-01-03', '500', 'yes', 'Rahil', 'Noicee', 'yes', 'UPI', NULL, '2024-01-09 20:56:32', NULL),
(7, 'Mihir', '2024-01-10', '5000', 'yes', 'Rahil', 'Noicee', 'yes', 'Cash', '[\"wyxa3aytvxaspyzui7aj\"]', '2024-01-10 18:36:42', '2024-01-10 20:07:53'),
(8, 'ved', '2024-01-12', '123456', 'yes', 'Rahil', 'Noicee', 'yes', 'bank transfer', '[\"sk7mvrjk2whx5nkp2cby\"]', '2024-01-10 18:41:00', NULL),
(9, 'ved', '2024-01-10', '69696', 'yes', 'Mini', 'Noiceee', 'yes', 'Cash', '[\"wsme7cett8atlxeinj9f\"]', '2024-01-10 19:41:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `s` int(11) NOT NULL,
  `m` int(11) NOT NULL,
  `l` int(11) NOT NULL,
  `xl` int(11) NOT NULL,
  `xxl` int(11) NOT NULL,
  `xxxl` int(11) NOT NULL,
  `xxxxl` int(11) NOT NULL,
  `xxxxxl` int(11) NOT NULL,
  `xxxxxxl` int(11) NOT NULL,
  `Stock` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`product_id`, `product_name`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`, `xxxxl`, `xxxxxl`, `xxxxxxl`, `Stock`, `created_at`, `updated_at`) VALUES
('AAA', 'hat', 23, 10, 4, 0, 0, 0, 0, 0, 0, 37, NULL, '2024-01-05 21:06:27'),
('AAAAAA', 'hat', 0, 0, 10, 12, 0, 0, 0, 0, 0, 22, NULL, '2024-01-08 21:00:54'),
('KB05', 'tshirt', 48, 14, 0, 0, 0, 0, 0, 0, 0, 62, NULL, '2024-01-06 15:55:25'),
('KB07', 'tshirt', 23, 88, 0, 0, 33, 0, 0, 0, 0, 144, NULL, '2024-01-08 21:14:40'),
('KB11', 'tshirt', 43, 12, 16, 60, 0, 0, 0, 330, 0, 461, '2024-01-05 21:00:18', '2024-01-08 21:14:11'),
('KB12', 'tshirt', 33, 110, 40, 0, 0, 0, 0, 40, 0, 223, '2024-01-08 19:40:42', '2024-01-08 21:14:31'),
('KB13', 'tshirt', 23, 88, 0, 0, 0, 0, 0, 0, 0, 111, '2024-01-08 21:00:39', NULL),
('KB14', 'tshirt', 23, 4, 0, 0, 0, 0, 0, 0, 0, 27, '2024-01-08 21:03:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `markethistory`
--

CREATE TABLE `markethistory` (
  `id` varchar(255) NOT NULL,
  `place` varchar(255) NOT NULL,
  `percent` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `markethistory`
--

INSERT INTO `markethistory` (`id`, `place`, `percent`, `created_at`) VALUES
('MK4', 'Myntra', 10, '2024-01-09 18:59:07'),
('MK4', 'Myntra', 15, '2024-01-09 18:59:21'),
('MK3', 'flipkart', 2, '2024-01-09 20:57:29');

-- --------------------------------------------------------

--
-- Table structure for table `marketplace`
--

CREATE TABLE `marketplace` (
  `id` varchar(255) NOT NULL,
  `place` varchar(255) NOT NULL,
  `percent` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marketplace`
--

INSERT INTO `marketplace` (`id`, `place`, `percent`, `created_at`, `update_at`) VALUES
('MK1', 'Amazon', 20, '2024-01-07 19:01:28', '2024-01-09 18:52:22'),
('MK2', 'Ajio', 15, '2024-01-07 19:21:25', '2024-01-09 18:52:48'),
('MK3', 'flipkart', 2, '2024-01-07 21:04:16', '2024-01-09 20:57:29'),
('MK4', 'Myntra', 15, '2024-01-09 18:59:07', '2024-01-09 18:59:21');

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
  `Total_items` varchar(255) DEFAULT NULL,
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
(69, 'KB01', 'ved', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Rahil', 5000, 'yes', 'No', '2023-12-26 19:13:20', '2023-12-26 19:13:20'),
(71, 'KB02', 'Mihir', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 's', 'Rahil', 505, 'yes', 'No', '2023-12-28 19:52:16', '2023-12-28 19:52:16'),
(72, 'KB12', 'Mihir', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 's', 'Rahil', 5000, 'yes', 'No', '2024-01-08 19:42:12', '2024-01-08 19:42:12'),
(73, 'KB14', 'Mihir', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 's', 'Rahil', 5000, 'yes', 'No', '2024-01-09 19:16:35', '2024-01-09 19:16:35'),
(74, 'KB02', 'Komal', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 's', 'Rahils', 5000, 'yes', 'No', '2024-01-09 19:26:29', '2024-01-09 19:26:29'),
(75, 'AAAAAAA', 'Mihir', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 's', 'Rahil', 45, 'yes', 'No', '2024-01-09 19:52:56', '2024-01-09 19:52:56'),
(76, 'KB03', 'Mihir', NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'l', 'Rahil', 45, 'yes', 'No', '2024-01-10 21:09:24', '2024-01-10 21:09:24'),
(77, 'AAAA', 'Mihir', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'm', 'VED', 50023, 'yes', 'No', '2024-01-11 19:38:19', '2024-01-11 19:38:19');

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
  `status` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `Description`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`, `xxxxl`, `xxxxxl`, `xxxxxxl`, `Stock`, `product_price`, `Cost_price`, `product_type`, `product_image`, `other_cost`, `Final_cost`, `user_id`, `uuser_id`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
('AAA', 'hat', 'NA', 23, 10, 4, 0, 0, 0, 0, 0, 0, 37, 5353, 99998, '2 Piece', '[\"nf6xwoke24qias3euj9x\",\"x2hi8oig7klw7muxtyop\",\"kjzoapcamwesjuvechd3\"]', 1900, 101898, 50, 50, 'Active', NULL, '2023-12-26 17:47:33', '2024-01-08 21:25:44'),
('AAAA', 'tshirt', 'NA', 23, -2, 0, 5, 0, 0, 0, 0, 0, 26, 3334, 9989, 'cloth', '[\"syvoenbibbcu6sh1hdyl\",\"ajkxmub57dytoml2djzw\",\"slqqiujoxgay1ajuavrw\",\"psugwppcfa9qmtz9cgas\"]', 543, 10532, 50, 50, '0', NULL, '2023-12-26 18:07:37', '2023-12-27 19:34:10'),
('AAAAA', 'tshirt', 'NA', 23, 4, 0, 0, 0, 0, 0, 0, 77, 104, 333, 9989, 'cloth', '[\"lhjcoquhdmbpnsph0zpn\",\"azfcnsvw2ecfdkepxvur\"]', 543, 10532, 50, NULL, '0', NULL, '2023-12-26 20:02:50', NULL),
('AAAAAA', 'hat', 'NA', 0, 0, 5, 6, 0, 0, 0, 0, 0, 11, 333, 9989, 'cloth', '[\"dyg8wbivbdxmw9iidrlp\",\"wmwtstzlvnia1wqbld1v\",\"qw9bls1y3qoonolhmbnd\",\"ek0tsfm9jm1tuxc5wwdr\",\"sxjvn0dbpxad6bvg5o0c\"]', 543, 10532, 50, 50, 'Active', NULL, '2023-12-26 20:06:31', '2024-01-08 21:20:27'),
('AAAAAAA', 'hat', 'NA', 22, 10, 66, 0, 0, 0, 0, 0, 0, 98, 8689, 99996, '2 Piece', '[\"osqxmx8mqpnk9ecjtpmw\",\"ywbdpkyhvcpmpmzb57v2\",\"bmk9fxq8eqdwknvcg2r7\",\"mq5d3yakp4l0yp4zy6ur\"]', 543, 100539, 50, 50, '0', NULL, '2023-12-26 20:15:48', '2023-12-27 19:42:34'),
('KB01', 'tshirt', 'NA', 22, 10, 0, 8, 33, 0, 0, 53, 14, 140, 333, 9989, 'cloth', '[\"nahu4itly4bhcsbz4srf\",\"jt7pd0wds4u407owxuzw\",\"odgncvmjuve06txzqti1\",\"nuihqanskpbi6lx0lgq0\"]', 543, 10532, 50, 50, '0', NULL, '2023-12-26 19:13:01', '2023-12-27 19:59:38'),
('KB02', 'tshirt', 'NA', 6, 4, 10, 0, 0, 0, 0, 0, 0, 20, 333, 9989, 'cloth', '[\"vu2sbkizmzpqeh6jnkbd\",\"zxuqtn7cnsw0nmxbf9mw\",\"vmmx8zegjk0tqtzxdo1c\"]', 543, 10532, 50, NULL, '0', NULL, '2023-12-28 19:01:36', NULL),
('KB03', 'tshirt', 'NA', 23, 4, 4, 5, 0, 0, 0, 66, 0, 102, 333, 555, 'cloth', '[\"ehzec4k51wtsfnbv3esc\",\"fjrn6fmvs5dpnjtksj4u\",\"knh0lm9ac40wm6ffib0g\",\"lyatwvdpiui8crnybi5a\"]', 543, 1098, 50, 50, '0', NULL, '2024-01-01 17:42:38', '2024-01-01 17:42:50'),
('KB04', 'tshirt', 'NA', 23, 4, 0, 6, 0, 0, 0, 0, 0, 33, 333, 9989, 'Jeans', '[\"mkignatwnho9x64lskfe\",\"snsnnk0kk4docmxevfjk\",\"thta8sj0hdka2htb6spc\"]', 543, 10532, 50, 50, 'Active', NULL, '2023-12-30 20:28:17', '2024-01-09 17:45:07'),
('KB05', 'tshirt', 'NA', 24, 10, 0, 0, 0, 0, 0, 0, 0, 34, 450, 350, 'cloth', '[\"kw4m8yozo2ngbngokqht\",\"kxnb2t1xrocogxxdvsug\"]', 450, 800, 50, 50, 'Active', NULL, '2024-01-04 19:05:36', '2024-01-09 17:44:40'),
('KB07', 'tshirt', 'NA', 23, 88, 0, 0, 33, 0, 0, 0, 0, 144, 333, 9989, 'cloth', '[\"oydxw33ugyrs7etcikwb\",\"armoagiyaihslx0snjiw\",\"hwbrfaexkcruyq5afhpg\",\"nl7i7kgxsfptxng7mrvt\"]', 543, 10532, 50, 50, 'Close', NULL, '2024-01-04 18:12:37', '2024-01-08 21:21:02'),
('KB11', 'tshirt', 'NA', 5, 3, 4, 15, 0, 0, 0, 66, 0, 93, 8689, 9989, 'cloth', '[\"irq6z40gjrtdzz7aekcl\",\"gu2yuyxbtclgt3xhxilz\",\"viau1ws2w3nrwwpwnkcw\"]', 5433, 15422, 50, 50, '0', NULL, '2024-01-05 21:00:18', '2024-01-09 17:43:32'),
('KB12', 'tshirt', 'NA', 3, 15, 5, 0, 0, 0, 0, 5, 0, 28, 45053, 9989, 'cloth', '[\"cylkr4d1feurzr5w6idl\"]', 543, 10532, 50, 50, 'Active', NULL, '2024-01-08 19:40:42', '2024-01-09 17:44:10'),
('KB14', 'tshirt', 'NA', 9, 10, 0, 0, 0, 0, 0, 0, 0, 19, 450, 350, 'cloth', '[\"oydxw33ugyrs7etcikwb\",\"armoagiyaihslx0snjiw\",\"hwbrfaexkcruyq5afhpg\",\"nl7i7kgxsfptxng7mrvt\"]', 50, 1900, 2250, 50, 'Active', NULL, '2024-01-08 21:06:48', '2024-01-08 21:25:01');

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
(50, 'Rahil', 'Rahil', NULL, '$2a$10$uiX1atC1FFfAGdBvAvfPIuFJb0gIQ5p2fhWELfHcNjqKnMXscEzCW', NULL, NULL, NULL, NULL, NULL, '2023-12-24 13:47:16', '2023-12-24 13:48:38'),
(51, 'Mihir', 'Mihir', NULL, '$2a$10$ar015ThyCGFunkOjp5/1feKCB/EX0wnyIeO.xaHN..n6um9gpNzL2', NULL, NULL, NULL, NULL, NULL, '2023-12-28 19:05:07', '2023-12-28 19:05:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `debitors`
--
ALTER TABLE `debitors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `marketplace`
--
ALTER TABLE `marketplace`
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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `Order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
