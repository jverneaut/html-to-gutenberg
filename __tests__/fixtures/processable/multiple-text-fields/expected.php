<section <?php echo get_block_wrapper_attributes(); ?>>
  <h1><?php echo esc_html($attributes['title'] ?? ''); ?></h1>
  <p><?php echo esc_html($attributes['content'] ?? ''); ?></p>
</section>
