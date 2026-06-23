-- Performance indexes for common queries
-- Run in phpMyAdmin

-- noi_dung_ngonngu: fast lookup by noi_dung_id + ngonngu
-- (already has unique key)

-- product_ngonngu: fast lookup by product + language
ALTER TABLE `product_ngonngu` ADD INDEX `idx_product_lang` (`product_id`, `ngonngu`);

-- product_attribute_values: fast lookup by product
ALTER TABLE `product_attribute_values` ADD INDEX `idx_pav_product` (`product_id`);
ALTER TABLE `product_attribute_values` ADD INDEX `idx_pav_attribute` (`attribute_id`);

-- media: fast lookup by folder
ALTER TABLE `media` ADD INDEX `idx_media_folder_created` (`folder_id`, `created_at`);

-- brand_ngonngu: fast lookup by brand + language
ALTER TABLE `brand_ngonngu` ADD INDEX `idx_brand_lang` (`brand_id`, `ngonngu`);

-- attribute_ngonngu: fast lookup
ALTER TABLE `attribute_ngonngu` ADD INDEX `idx_attr_lang` (`attribute_id`, `ngonngu`);

-- attribute_value_ngonngu: fast lookup
-- (already has idx_attribute_value and idx_ngonngu, but composite is faster)
ALTER TABLE `attribute_value_ngonngu` ADD INDEX `idx_attrval_lang` (`attribute_value_id`, `ngonngu`);
