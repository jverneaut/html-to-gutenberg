<section <?php echo get_block_wrapper_attributes(); ?>>
  <h1><?php echo wp_kses_post($attributes['title'] ?? ''); ?></h1>
  <p><?php echo wp_kses_post($attributes['content'] ?? ''); ?></p>
  <p><?php echo wp_kses_post($attributes['kebab_case'] ?? ''); ?></p>
  <p><?php echo wp_kses_post($attributes['camelCase'] ?? ''); ?></p>
</section>
