---
sidebar_position: 0
---

# HTML To Gutenberg

## What is HTML To Gutenberg

**HTML To Gutenberg** is a webpack plugin and CLI tool that helps you create Gutenberg blocks for WordPress **from raw HTML** quickly and without writing a single line of React.

It parses your HTML, extracts block structure, attributes, and inner content, and generates all the boilerplate you’d normally have to write manually:
`block.json`, `edit.js`, `index.js`, `render.php` (or `render.twig`).

The goal: **save time, reduce errors, and make custom block development accessible to everyone.**

Here's what the editing experience can look like for a site built entirely with custom blocks (from my WordCamp talk):

![HTML To Gutenberg WordCamp Demo](/img/wordcamp-demo.png)

## What can you use it for?

HTML To Gutenberg is great when you want to:

- Convert static HTML components into Gutenberg blocks
- Quickly create custom blocks for client projects or themes
- Skip the repetitive setup of attributes and inner blocks
- Use server-side rendering (PHP or Twig) with a single source of markup shared between the editor and the frontend — no duplication, just one file to maintain
- Prototype and iterate on block designs faster

It works great whether you're a freelance developer, an agency building custom themes, or a product team maintaining a block library.

:::warning
While this tool simplifies Gutenberg development, it assumes **basic familiarity with custom block concepts**. Many conventions are based on Gutenberg’s component model.

If you're new to Gutenberg development, start with the [official documentation](https://developer.wordpress.org/block-editor/) and the excellent [10up Block Editor Best Practices](https://gutenberg.10up.com/).
:::

## Quick start

### 1. Install the webpack plugin

```bash
npm install @jverneaut/html-to-gutenberg
```

### 2. Add the webpack plugin to your existing webpack configuration

```js
// webpack.config.js
import HTMLToGutenbergPlugin from "@jverneaut/html-to-gutenberg";

export default {
  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks", // Your source HTML files
      outputDirectory: "./generated-blocks", // Where generated Gutenberg blocks will be placed
      blocksPrefix: "custom", // Blocks namespace
    }),
  ],
};
```

### 3. Write your custom blocks as HTML files inside your input directory

```html
<!-- blocks/hero.html -->
<section class="container">
  <h2 data-attribute="title">Hello, HTML To Gutenberg!</h2>
</section>
```

### 4.Build the generated blocks

Use your own build setup, or install the helper plugin:

```bash
npm install @jverneaut/gutenberg-webpack-plugin
```

Then update your Webpack config:

```js
// webpack.config.js
import HTMLToGutenbergPlugin from "@jverneaut/html-to-gutenberg";
import GutenbergWebpackPlugin from "@jverneaut/gutenberg-webpack-plugin";

export default {
  mode: "development",
  entry: "./index.js", // Your main entry point for non-Gutenberg scripts

  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks", // Source folder for your custom blocks HTML
      outputDirectory: "./generated-blocks", // Where transformed blocks will be output
    }),

    new GutenbergWebpackPlugin("./generated-blocks"), // Registers the generated blocks
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
```

### 5. Register the generated blocks

Add this to your theme’s `functions.php` or a custom plugin:

```php
add_action('init', function () {
    # Change this path depending on your blocks building configuration
    $blocks_path = get_stylesheet_directory() . '/dist/blocks';
    $blocks = array_filter(glob($blocks_path . '/**/*'), 'is_dir');

    foreach ($blocks as $block) {
        register_block_type($block);
    }
});
```
