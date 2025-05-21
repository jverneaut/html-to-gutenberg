---
sidebar_position: 0
---

# Setting up HTML To Gutenberg with Webpack

If you’re using Webpack to build your custom blocks, you can easily integrate **HTML To Gutenberg** into your build process to automatically generate `block.json`, `edit.js`, `render.php` and `index.js` from simple HTML files.

:::warning
This page walks you through how to configure it manually — but keep in mind that **HTML To Gutenberg is only responsible for generating the block files**, not for compiling or bundling them. You should use well-supported tools like [`@wordpress/scripts`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) or your own Webpack setup to build your blocks.
:::

---

## Installation

```bash
npm install @jverneaut/html-to-gutenberg --save-dev
```

## Webpack configuration

Add the plugin to your existing Webpack configuration:

```js title="webpack.config.js"
import HTMLToGutenbergPlugin from "@jverneaut/html-to-gutenberg";

export default {
  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated-blocks",
    }),
  ],
};
```

### Plugin options

| Option                 | Type             | Default          | Description                                                                |
| ---------------------- | ---------------- | ---------------- | -------------------------------------------------------------------------- |
| `inputDirectory`       | `string`         | None             | Source folder for your custom blocks HTML files.                           |
| `outputDirectory?`     | `string`         | `inputDirectory` | Output folder that will contain the generated blocks files.                |
| `engine?`              | `php\|twig\|all` |                  | The rendering engine to use for the frontend.                              |
| `blocksPrefix?`        | `string`         | 'custom'         | Prefix used for block names (e.g., `custom/hero`).                         |
| `removeDeletedBlocks?` | `boolean`        | `false`          | Whether to delete generated blocks if their source HTML files are removed. |

## Example: Full Webpack Configuration

This example can serve as a starting point for developing custom Gutenberg blocks using **HTML To Gutenberg**. It uses the companion `@jverneaut/gutenberg-webpack-plugin` to compile the generated blocks for use in WordPress.

```js title="webpack.config.js"
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
