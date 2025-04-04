<?php

$image = wp_get_attachment_image_src($attributes['image'], 'full');
$image_alt = get_post_meta($attributes['image'], '_wp_attachment_image_alt', true);
?>

<section <?php echo get_block_wrapper_attributes(['class' => 'container']); ?>>
  <div class="grid grid-cols-12 px-8 gap-x-6">
    <div class="col-span-6 flex flex-col justify-center">
      <h1><?php echo wp_kses_post($attributes['title'] ?? ''); ?></h1>

      <p><?php echo wp_kses_post($attributes['content'] ?? ''); ?></p>
    </div>

    <div class="col-span-6">
      <img src="<?php echo esc_url($image[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>" />
    </div>

    <div class="col-span-12 flex gap-x-6">
      <?php echo $content; ?>
    </div>
  </div>
</section>
