<?php

$image_id = $attributes['image'];
$image = $image_id ? wp_get_attachment_image_src($image_id, 'full') : [''];
$image_url = $image[0] ?? '';
$image_alt = $image_id ? get_post_meta($image_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(); ?>>
  <img src="<?php echo esc_url($image[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>" />
</section>
