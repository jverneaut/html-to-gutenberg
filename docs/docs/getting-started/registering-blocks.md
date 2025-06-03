# Registering blocks created with HTML To Gutenberg

If you're using `@wordpress/create-block` with the HTML To Gutenberg template, everything is handled for you.

Just activate the plugin, build the block, and you're ready to go — no additional registration required.

## Registering blocks manually

If you’ve manually integrated **HTML To Gutenberg** into a custom theme or Webpack setup, you’ll need to register your blocks yourself to make them available in the WordPress editor.

To register custom blocks built using either `wp-scripts` or `@jverneaut/gutenberg-webpack-plugin`, add the following snippet in your theme’s functions.php file or a custom plugin:

```php title="functions.php"
add_action('init', function () {
    // Update this path to match your build output directory
    $blocks_path = get_stylesheet_directory() . '/dist/blocks';
    $blocks = array_filter(glob($blocks_path . '/**/*'), 'is_dir');

    foreach ($blocks as $block) {
        register_block_type($block);
    }
});
```

:::warning
When using **HTML To Gutenberg** as a webpack plugin, it only generates source files from your `.html` templates.

To make those blocks functional:

- **You must build them** with `wp-scripts` or your custom webpack config.
- **You must register the compiled blocks** with register_block_type().

Simply pointing `register_block_type()` at the generated HTML To Gutenberg files will not work — they are not valid block definitions on their own.
:::
