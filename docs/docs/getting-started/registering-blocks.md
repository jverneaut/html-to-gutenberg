# Registering Blocks

If you're using `@wordpress/create-block` to use HTML To Gutenberg, everything is taken care of by the template. Simply activate the plugin, build the block and you're ready to go.

## Registering blocks manually

If you manually integrated HTML To Gutenberg to your theme or an existing webpack configuration, you need to make the blocks available to Gutenberg.

To register custom blocks built either with `wp-scripts` or `@jverneaut/gutenberg-webpack-plugin`, you can add this function defined in your theme's `functions.php` or a custom plugin:

```php title="functions.php"
add_action('init', function () {
    # Change this path depending on your blocks building configuration
    $blocks_path = get_stylesheet_directory() . '/dist/blocks';
    $blocks = array_filter(glob($blocks_path . '/**/*'), 'is_dir');

    foreach ($blocks as $block) {
        register_block_type($block);
    }
});
```

:::warning
When used as a webpack plugin, the generated blocks still need to be compiled using either `wp-scripts` or a custom webpack implementation. Pointing register_block_type to the generated HTML To Gutenberg bocks will not work. It only generates source files from HTML templates — **you are responsible for registering and compiling** those blocks within your WordPress project.
:::
