<section <?php echo get_block_wrapper_attributes(); ?>>
  <h1><?php echo wp_kses_post($attributes['title'] ?? ''); ?></h1>
  <p><?php echo wp_kses_post($attributes['content'] ?? ''); ?></p>
</section>
