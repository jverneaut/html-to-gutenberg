---
sidebar_position: 1
---

# Registering Gutenberg Blocks with WordPress

Once **HTML To Gutenberg** has generated your block sources (`block.json`, `edit.js`, `render.php`, etc.), you still need to **register and build them** like any other custom Gutenberg blocks.

:::warning
This tool is **not a full build system**. It only generates source files from HTML templates — **you are responsible for registering and compiling** those blocks within your WordPress project.

If you’re not yet familiar with how to develop custom blocks, I strongly recommend reviewing the official [Block Editor Handbook](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/).
:::

---

To register custom blocks built either with `@jverneaut/gutenberg-webpack-plugin` or `wp-scripts`, you can add this function defined in your theme's `functions.php` or a custom plugin:

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
