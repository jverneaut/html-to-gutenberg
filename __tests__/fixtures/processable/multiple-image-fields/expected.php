<?php

$image_1_id = $attributes['image_1'] ?? '';
$image_1 = $image_1_id ? wp_get_attachment_image_src($image_1_id, 'full') : [''];
$image_1_url = $image_1[0] ?? '';
$image_1_alt = $image_1_id ? get_post_meta($image_1_id, '_wp_attachment_image_alt', true) : '';

$image_2_id = $attributes['image_2'] ?? '';
$image_2 = $image_2_id ? wp_get_attachment_image_src($image_2_id, 'full') : [''];
$image_2_url = $image_2[0] ?? '';
$image_2_alt = $image_2_id ? get_post_meta($image_2_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(); ?>>
  <img src="<?php echo esc_url($image_1[0]); ?>" alt="<?php echo esc_attr($image_1_alt); ?>" />
  <img src="<?php echo esc_url($image_2[0]); ?>" alt="<?php echo esc_attr($image_2_alt); ?>" />
</section>
