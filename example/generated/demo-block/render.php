<?php

$image_id = $attributes['image'] ?? '';
$image = $image_id ? wp_get_attachment_image_src($image_id, 'full') : [''];
$image_src = $image[0] ?? '';
$image_srcset = $image_id ? wp_get_attachment_image_srcset($image_id, 'full') : '';
$image_sizes = $image_id ? wp_get_attachment_image_sizes($image_id, 'full') : '';
$image_alt = $image_id ? get_post_meta($image_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(['class' => 'container']); ?>>
  <div class="grid grid-cols-12 px-8 gap-x-6">
    <div class="col-span-6 flex flex-col justify-center">
      <h1><?php echo wp_kses_post($attributes['title'] ?? ''); ?></h1>

      <p><?php echo wp_kses_post($attributes['content'] ?? ''); ?></p>
    </div>

    <div class="col-span-6">
      <img src="<?php echo esc_url($image_src); ?>" srcset="<?php echo esc_attr($image_srcset); ?>" sizes="<?php echo esc_attr($image_sizes); ?>" alt="<?php echo esc_attr($image_alt); ?>" />
    </div>

    <div class="col-span-12 flex gap-x-6">
      <?php echo $content; ?>
    </div>
  </div>
</section>
