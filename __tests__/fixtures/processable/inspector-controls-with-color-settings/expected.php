<section <?php echo get_block_wrapper_attributes(['class' => 'bg-gray-200 p-12', 'style' => "background-color: " . (($attributes['color'] ?? ''))]); ?>>
  <div style="<?= "background-color: " . (($attributes['color'] ?? '')); ?>" class="p-8">
    The current color is <strong><?php echo wp_kses_post($attributes['color'] ?? ''); ?></strong>
  </div>
</section>
