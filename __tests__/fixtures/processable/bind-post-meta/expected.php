<section <?php echo get_block_wrapper_attributes(); ?>>
  <p><?php echo wp_kses_post($attributes['title'] ?? ''); ?></p>
  <p><?php echo wp_kses_post($attributes['title'] ?? ''); ?></p>
  <p><?php echo wp_kses_post(get_post_meta(get_the_ID(), 'test', true)); ?></p>
  <input value="<?= wp_kses_post($attributes['input'] ?? ''); ?>" />
  <input value="<?= wp_kses_post($attributes['attributes.input'] ?? ''); ?>" />
  <input value="<?= wp_kses_post(get_post_meta(get_the_ID(), 'input', true)); ?>" />
  <input type="checkbox" <?= ($attributes['checkbox'] ?? false) ? 'checked' : ''; ?> />
  <input type="checkbox" <?= ($attributes['checkbox'] ?? false) ? 'checked' : ''; ?> />
  <input type="checkbox" <?= get_post_meta(get_the_ID(), 'checkbox', true) ? 'checked' : ''; ?> />
</section>
