-- Create noi_dung table
CREATE TABLE `noi_dung` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `danduong_id` int DEFAULT NULL,
  `type` varchar(50) DEFAULT 'section',
  `thumbnail_id` bigint UNSIGNED DEFAULT NULL,
  `thutu` int DEFAULT 0,
  `trangthai` tinyint DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_danduong` (`danduong_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_noidung_danduong` FOREIGN KEY (`danduong_id`) REFERENCES `danduong` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_noidung_thumbnail` FOREIGN KEY (`thumbnail_id`) REFERENCES `media` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create noi_dung_ngonngu table
CREATE TABLE `noi_dung_ngonngu` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `noi_dung_id` bigint UNSIGNED NOT NULL,
  `ngonngu` varchar(10) NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `noi_dung_json` longtext,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `noi_dung_ngonngu_unique` (`noi_dung_id`, `ngonngu`),
  CONSTRAINT `fk_noidungnn_noidung` FOREIGN KEY (`noi_dung_id`) REFERENCES `noi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_noidungnn_ngonngu` FOREIGN KEY (`ngonngu`) REFERENCES `ngonngu` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
