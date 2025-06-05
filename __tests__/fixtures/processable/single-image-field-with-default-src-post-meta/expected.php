<?php

$imageKey_id = get_post_meta(get_the_ID(), 'imageKey', true) ?? '';
$imageKey = $imageKey_id ? wp_get_attachment_image_src($imageKey_id, 'full') : [''];
$imageKey_src = $imageKey[0] ?? '';
$imageKey_srcset = $imageKey_id ? wp_get_attachment_image_srcset($imageKey_id, 'full') : '';
$imageKey_sizes = $imageKey_id ? wp_get_attachment_image_sizes($imageKey_id, 'full') : '';
$imageKey_alt = $imageKey_id ? get_post_meta($imageKey_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(); ?>>
  <img class="w-full h-full object-cover" src="<?php echo empty($imageKey_src) ? 'https://placehold.co/600x400' : esc_url($imageKey_src); ?>" srcset="<?php echo esc_attr($imageKey_srcset); ?>" sizes="<?php echo esc_attr($imageKey_sizes); ?>" alt="<?php echo esc_attr($imageKey_alt); ?>" />
</section>
