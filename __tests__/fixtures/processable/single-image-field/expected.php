<?php

$image = wp_get_attachment_image_src($attributes['image'], 'full');
$image_alt = get_post_meta($attributes['image'], '_wp_attachment_image_alt', true);
?>

<section <?php echo get_block_wrapper_attributes(); ?>>
  <img src="<?php echo esc_url($image[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>" />
</section>
