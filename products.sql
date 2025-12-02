-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 02 déc. 2025 à 08:38
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `products`
--

-- --------------------------------------------------------

--
-- Structure de la table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cart_userId_key` (`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cart`
--

INSERT INTO `cart` (`id`, `userId`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
CREATE TABLE IF NOT EXISTS `cartitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `quantity` int NOT NULL,
  `productSizeId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CartItem_cartId_fkey` (`cartId`),
  KEY `CartItem_productSizeId_fkey` (`productSizeId`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cartitem`
--

INSERT INTO `cartitem` (`id`, `cartId`, `quantity`, `productSizeId`) VALUES
(16, 1, 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `type`) VALUES
(1, 'T-shirt'),
(2, 'Pull'),
(3, 'Pantalon'),
(4, 'Knites');

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Product_categoryId_fkey` (`categoryId`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `createdAt`, `updatedAt`, `categoryId`) VALUES
(1, 'T-shirt oversize', 'T-shirt oversize unisexe au confort exceptionnel. Coupe ample, manches larges et tissu doux pour un look décontracté et moderne. Parfait pour un style streetwear ou casual.', 40, '2025-11-13 14:15:18.000', '2025-11-13 14:15:18.000', 1),
(2, 'T-shirt slim', 'T-shirt slim unisexe, coupe ajustée qui met en valeur la silhouette. Tissu doux et extensible pour un confort optimal au quotidien.', 40, '2025-11-13 14:15:55.000', '2025-11-13 14:15:55.000', 1),
(3, 'Pull', 'Pull unisexe confortable, doux au toucher et idéal pour la mi-saison. Coupe régulière et finitions soignées pour un look simple et polyvalent.', 80, '2025-11-13 14:17:32.000', '2025-11-13 14:17:32.000', 2),
(4, 'Knite streetwear', 'Parfait pour un look affûté. Matière stretch et coupe qui colle juste ce qu’il faut, idéal pour un outfit propre et maîtrisé.', 80, '2025-12-01 08:32:32.024', '2025-12-01 08:40:41.057', 4);

-- --------------------------------------------------------

--
-- Structure de la table `productsize`
--

DROP TABLE IF EXISTS `productsize`;
CREATE TABLE IF NOT EXISTS `productsize` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `sizeId` int NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductSize_productId_sizeId_key` (`productId`,`sizeId`),
  KEY `ProductSize_sizeId_fkey` (`sizeId`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `productsize`
--

INSERT INTO `productsize` (`id`, `productId`, `sizeId`, `stock`) VALUES
(1, 1, 1, 2),
(2, 1, 2, 3),
(3, 1, 3, 3),
(4, 2, 3, 2),
(5, 3, 1, 2),
(6, 4, 1, 10),
(7, 4, 2, 5);

-- --------------------------------------------------------

--
-- Structure de la table `size`
--

DROP TABLE IF EXISTS `size`;
CREATE TABLE IF NOT EXISTS `size` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Size_name_key` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `size`
--

INSERT INTO `size` (`id`, `name`) VALUES
(1, 'XS'),
(2, 'S'),
(3, 'M'),
(4, 'L'),
(5, 'XL'),
(6, 'XXL');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'test@test.com', '$2b$10$Pfs83K4ppuatOoEF1QG4fO/9ZY3wcmIT2Hd5TaoCLGFGA/0CiZFhe', 'ADMIN', '2025-11-13 13:18:18.499', '2025-11-13 13:18:18.499'),
(2, 'user@test.com', '$2b$10$NNpPr4Yv8XWgao3UCJ5W8.S0DveXjkFhaB3Luy/qfBCd3F87Xr6fW', 'USER', '2025-12-02 08:19:55.065', '2025-12-02 08:19:55.065');

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('38725568-9992-4cf2-bc08-e086859a9504', 'b4773ce803fd64daaec8522737dec76ad9e323501afb19c563f2e720c330d0b9', '2025-11-13 13:14:16.547', '20251021130737_init_products_table', NULL, NULL, '2025-11-13 13:14:16.539', 1),
('246ecf1b-6915-42b0-b394-bdd2ce96c06f', '391953fbee1e5eb0df8d4ba974ff6c9a3277d4c578df9631eb5f02de8ce3dd8f', '2025-11-13 13:14:16.555', '20251023090934_add_user_auth', NULL, NULL, '2025-11-13 13:14:16.547', 1),
('3a1d3237-ccab-4593-ab14-4209f3bf60a2', '72e564ef5b0b5af8e3e266303f7b81c4263d13a35af2503947df5efe3a74b051', '2025-11-13 13:14:16.578', '20251113091407_product_name_to_non_unique', NULL, NULL, '2025-11-13 13:14:16.555', 1),
('a1278750-5c74-4422-b9cb-689329dab92e', 'ce697aab55a82d8aca9bd2e79260326712ca00ca758722cfabe095ce91beace9', '2025-11-13 13:14:16.641', '20251113105010_categoryproduct_create', NULL, NULL, '2025-11-13 13:14:16.578', 1),
('ecf03b63-db4c-4943-a9de-60b8457ab4a8', 'c8eabaea6155c3d7c862fe738dfa4b30769d8669d9962eb438518834d6825aba', '2025-11-13 14:00:09.491', '20251113140009_change_category_to_non_unique', NULL, NULL, '2025-11-13 14:00:09.419', 1),
('54c14c85-3605-4bae-9632-1c803688e0ba', '1afe9ca57bf0cd011201c81e393cb1b2136ba268605cb5af0064a3cb9224ca20', '2025-12-01 08:00:55.860', '20251201080055_add_cart', NULL, NULL, '2025-12-01 08:00:55.760', 1),
('bdff26b7-b92f-4490-be8f-337f12325c10', '2c308e6bfb1106cd44942537a5bfee84298c5f42532118fa3064d7eb7193e268', '2025-12-01 08:17:28.853', '20251201081728_add_variants', NULL, NULL, '2025-12-01 08:17:28.661', 1),
('bb9ea7e2-a5a8-4797-9785-542a72581c41', '56908ecec420f27197cb45716549f68b0cb2032df303c990ae58153d9d26fce5', '2025-12-01 09:03:59.097', '20251201090358_cart_use_productsize', NULL, NULL, '2025-12-01 09:03:58.901', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
