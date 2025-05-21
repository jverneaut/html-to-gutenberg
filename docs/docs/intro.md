---
sidebar_position: 1
---

# HTML To Gutenberg

**HTML To Gutenberg** is a webpack plugin and CLI tool that helps you create Gutenberg blocks for WordPress **from raw HTML** quickly and without writing a single line of React.

It parses your HTML, extracts block structure, attributes, and inner content, and generates all the boilerplate you’d normally have to write manually:
`block.json`, `edit.js`, `index.js`, `render.php` (or `render.twig`).

The goal: **save time, reduce errors, and make custom block development accessible to everyone.**

Pictured bellow is what a custom blocks based website editing experience can you look like (taken from my WordCamp Talk about HTML To Gutenberg):

![HTML To Gutenberg WordCamp Demo](/img/wordcamp-demo.png)

## What can you use it for?

HTML To Gutenberg is perfect if you want to:

- Convert static HTML components into Gutenberg blocks
- Speed up the creation of custom blocks for client projects or themes
- Avoid repetitive coding of attributes, inner blocks, and markup logic
- Use server-side rendering (PHP or Twig) with consistent block markup
- Prototype and iterate on block designs quickly

It works great whether you're a freelance developer, an agency building custom themes, or a product team maintaining a block library.

:::warning
While the aim of this tool is to ease the development of custom Gutenberg blocks, some previous knowledge of custom Gutenberg blocks development is required to take full advantage of it as a lot of its concepts and conventions come straight from Gutenberg components.

Appart from the official WordPress Blocks Development documentation, a good place to learn the ins and outs of Gutenberg is [10up Block Editor Best Practices](https://gutenberg.10up.com/) website which provides great insights about the usage of Gutenberg to build websites.
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

Build the custom blocks with whatever configuration you already have in place, or alternatively use the `@jverneaut/gutenberg-webpack-plugin` plugin to ease the setup.

```bash
npm install @jverneaut/gutenberg-webpack-plugin
```

Example webpack setup with this configuration:

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

Add the following to your theme’s `functions.php` file or a custom plugin to automatically register the generated blocks with WordPress:

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
