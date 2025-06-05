<section <?php echo get_block_wrapper_attributes(); ?>>
  <div class="<?= "hero " . (($attributes['test'] ?? '')) . " hero--" . (($attributes['heroType'] ?? '')) . " " . (($attributes['isChecked'] ?? '') ? 'yes' : 'no'); ?>"></div>
  <div class="<?= "flex flex-col--" . ((get_post_meta(get_the_ID(), 'reversed', true)) ? 'reverse' : ''); ?>"></div>
</section>
