<?php

$image_1 = wp_get_attachment_image_src($attributes['image_1'], 'full');
$image_1_alt = get_post_meta($attributes['image_1'], '_wp_attachment_image_alt', true);

$image_2 = wp_get_attachment_image_src($attributes['image_2'], 'full');
$image_2_alt = get_post_meta($attributes['image_2'], '_wp_attachment_image_alt', true);
?>

<section <?php echo get_block_wrapper_attributes(); ?>>
  <img src="<?php echo esc_url($image_1[0]); ?>" alt="<?php echo esc_attr($image_1_alt); ?>" />
  <img src="<?php echo esc_url($image_2[0]); ?>" alt="<?php echo esc_attr($image_2_alt); ?>" />
</section>
