![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)

# HTML To Gutenberg

A Webpack plugin and CLI that generates dynamic Gutenberg blocks built with React and either PHP or Twig, from a single HTML file.

Instead of manually coding both React and PHP/Twig components, simply write an HTML file with some special attributes, and this plugin will automatically generate all necessary files for you:

- ✅ **React-based** `edit.js` for the WordPress editor
- ✅ **Frontend rendering with** `render.php` by default
- ✅ Or use **Twig-based** `render.twig` if you prefer (recommended!)
- ✅ **block.json** with automatically defined attributes
- ✅ **index.js** to register the block type

https://github.com/user-attachments/assets/d9ee9410-9529-4664-a7a4-82b0eb1ad306

This plugin now **defaults to PHP rendering**, making it more compatible with typical WordPress projects.

However, if you're working with **Timber, Bedrock**, or just want a more **frontend-friendly templating experience**, you can enable Twig rendering by setting:

```js
new HTMLToGutenbergPlugin({
  ...
  engine: "twig", // Enables render.twig instead of render.php
});
```

👉 Personally, **I highly recommend Twig** for rendering blocks. It feels closer to HTML, is easier to read and write, and is much nicer to maintain—especially if you're a front-end developer.

> For a full Twig-based Gutenberg-ready setup, check out my other project [gutenberg-tailwindcss-bedrock-timber-twig](https://github.com/jverneaut/gutenberg-tailwindcss-bedrock-timber-twig/)

## ✨ Features

- **Automatic Gutenberg block generation** from simple HTML
- **Use attributes** (`data-attribute="title"`, etc.) to define editable fields
- **Supports RichText and MediaUpload**:
  - Non-`<img>` elements with `data-attribute="something"` → **Editable RichText**
  - `<img>` elements with `data-attribute="something"` → **Image selection via MediaUpload**
- **Fully automates block.json attributes creation**
- **Add additional styles** via the `data-styles="primary secondary"` attribute on the root block element
- **InnerBlocks handling** with `<blocks>` and `<block>` elements
- **Automatic `style` strings to JS objects conversion** for `edit.js`
- **Supports both PHP and Twig** for frontend rendering

## 📦 Installation

```sh
npm install --save-dev @jverneaut/html-to-gutenberg
npm install --save-dev @10up/block-components # Required for the <Image /> edit.js component
```

## ⚙️ Webpack Configuration

This plugin is designed to work with Webpack. Here's how to integrate it:

```js
// webpack.config.js
import HTMLToGutenbergPlugin from "@jverneaut/html-to-gutenberg";

export default {
  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks", // Your source HTML files
      outputDirectory: "./generated-blocks", // Where generated Gutenberg blocks will be placed
      blocksPrefix: "custom", // Blocks namespace

      // Optional: switch to Twig-based rendering (recommended)
      engine: "twig", // either 'php' (default) or 'twig'
      removeDeletedBlocks: true, // Deletes blocks in outputDirectory that no longer have a corresponding source HTML file (default: false)
    }),
  ],
};
```

📌 This setup will:

- Scan `blocks/` for `.html` files
- Generate Gutenberg blocks inside `generated-blocks/`

> **Note: These blocks still need to be bundled and registered with WordPress before use.**

### Minimal full setup example using Webpack and PHP

#### Webpack configuration

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

#### Registering Blocks in PHP

Add the following to your theme’s `functions.php` file or a custom plugin to automatically register the generated blocks with WordPress:

```php
add_action('init', function () {
    $blocks_path = get_stylesheet_directory() . '/dist/blocks';
    $blocks = array_filter(glob($blocks_path . '/**/*'), 'is_dir');

    foreach ($blocks as $block) {
        register_block_type($block);
    }
});
```

This is a lightweight, automatic setup. Feel free to adapt it to your specific workflow — other approaches might suit your project better.

## CLI

```sh
Usage: npx @jverneaut/html-to-gutenberg [options]

A Webpack plugin and CLI that generates dynamic Gutenberg blocks built with React and either PHP or Twig, from a single HTML file.

Options:
  -V, --version        output the version number
  -i, --input <path>   HTML blocks input path (default: ".")
  -o, --output <path>  Gutenberg blocks output path
  -p, --prefix <type>  Blocks namespace (default: "custom")
  -e, --engine <type>  Engine (either "php", "twig" or "all") (default: "php")
  -w, --watch          Watch the input directory for changes and regenerate blocks
  -h, --help           display help for command
```

## 🚀 Quick Start (Example Project)

**An example** is available in the `example/` folder. You can test it by running:

```sh
cd example
npm install
npm run dev
```

You can then edit `demo-block.html` and see the generated block inside `example/generated/demo-block`. It is setup to output both `render.php` as well as `render.twig` for demonstration purposes.

## Usage

Full documentation available at [html-to-gutenberg.com](https://html-to-gutenberg.com)

## Example

### 📝 Input HTML

```html
<section
  class="container"
  data-styles="primary secondary"
  data-parent="custom/parent-block"
>
  <div class="grid grid-cols-12 px-8 gap-x-6">
    <div class="col-span-6 flex flex-col justify-center">
      <h1 data-attribute="title">Hello, <strong>Gutenberg!</strong></h1>

      <p data-attribute="content">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        facere deleniti nam magni. Aspernatur, obcaecati fuga.
      </p>
    </div>

    <div class="col-span-6">
      <img data-attribute="image" src="w-full aspect-video rounded-lg" />
    </div>

    <div class="col-span-12 flex gap-x-6">
      <blocks templateLock>
        <block name="custom/child-block" title="Title 1" number="42"></block>
        <block name="custom/child-block">
          <attribute name="title"><strong>Title 2</strong></attribute>
          <attribute name="number">42</attribute>
        </block>
        <block name="custom/other-child-block">
          <attribute name="title" value="Title 3"></attribute>
          <attribute name="number" value="42"></attribute>
        </block>
      </blocks>
    </div>
  </div>
</section>
```

### 🔄 Generated files

✅ `edit.js` **(for Gutenberg editor)**

```jsx
import {
  useBlockProps,
  RichText,
  MediaUpload,
  InnerBlocks,
} from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps({ className: "container" })}>
      <div className="grid grid-cols-12 px-8 gap-x-6">
        <div className="col-span-6 flex flex-col justify-center">
          <RichText
            tagName="h1"
            value={attributes.title}
            onChange={(title) => setAttributes({ title })}
          ></RichText>

          <RichText
            tagName="p"
            value={attributes.content}
            onChange={(content) => setAttributes({ content })}
          ></RichText>
        </div>

        <div className="col-span-6">
          <MediaUpload
            src="w-full aspect-video rounded-lg"
            value={attributes.image}
            onSelect={(image) => setAttributes({ image: image.id })}
            render={({ open }) => (
              <Image
                style={{ cursor: "pointer" }}
                onClick={open}
                id={attributes.image}
                onSelect={(image) => setAttributes({ image: image.id })}
              />
            )}
          ></MediaUpload>
        </div>

        <div className="col-span-12 flex gap-x-6">
          <InnerBlocks
            allowedBlocks={["custom/child-block", "custom/other-child-block"]}
            template={[
              ["custom/child-block", { title: "Title 1", number: 42 }],
              [
                "custom/child-block",
                { title: "<strong>Title 2</strong>", number: 42 },
              ],
              ["custom/other-child-block", { title: "Title 3", number: 42 }],
            ]}
            templateLock
          ></InnerBlocks>
        </div>
      </div>
    </section>
  );
};
```

✅ `render.php` **(for frontend rendering)**

```php
<?php

$image = wp_get_attachment_image_src($attributes['image'], 'full');
$image_alt = get_post_meta($attributes['image'], '_wp_attachment_image_alt', true);

?>

<section <?php echo get_block_wrapper_attributes(['class' => 'container']); ?>>
  <div class="grid grid-cols-12 px-8 gap-x-6">
    <div class="col-span-6 flex flex-col justify-center">
      <h1><?php echo wp_kses_post($attributes['title'] ?? ''); ?></h1>

      <p><?php echo wp_kses_post($attributes['content'] ?? ''); ?></p>
    </div>

    <div class="col-span-6">
      <img src="<?php echo esc_url($image[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>" />
    </div>

    <div class="col-span-12 flex gap-x-6">
      <?php echo $content; ?>
    </div>
  </div>
</section>
```

✅ `render.twig` **(for frontend rendering)**

```twig
<section
  {{
  wrapper_attributes({
    class: 'container'
  })
  }}
>
  <div class="grid grid-cols-12 px-8 gap-x-6">
    <div class="col-span-6 flex flex-col justify-center">
      <h1>{{ attributes.title }}</h1>

      <p>
        {{ attributes.content }}
      </p>
    </div>

    <div class="col-span-6">
      <img
        src="{{ get_image(attributes.image).src }}"
        alt="{{ get_image(attributes.image).alt }}"
      />
    </div>

    <div class="col-span-12 flex gap-x-6">
      {{ content }}
    </div>
  </div>
</section>
```

✅ `block.json` **(auto-generated block metadata)**

```json
{
  "name": "custom/demo-block",
  "title": "Demo Block",
  "textdomain": "demo-block",
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "version": "0.1.0",
  "category": "theme",
  "example": {},
  "styles": [
    { "name": "primary", "label": "Primary", "isDefault": true },
    { "name": "secondary", "label": "Secondary" }
  ],
  "parent": ["custom/parent-block"],
  "attributes": {
    "align": { "type": "string", "default": "full" },
    "title": {
      "type": "string",
      "default": "Hello, <strong>Gutenberg!</strong>"
    },
    "content": {
      "type": "string",
      "default": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis facere deleniti nam magni. Aspernatur, obcaecati fuga."
    },
    "image": { "type": "integer" }
  },
  "supports": { "html": false, "align": ["full"] },
  "editorScript": "file:./index.js",
  "render": "file:./render.twig", // if using Twig engine
  "render": "file:./render.php" // if using PHP engine
}
```

✅ `index.js` **(register the block type)**

```js
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import Edit from "./edit.js";
import metadata from "./block.json";

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => <InnerBlocks.Content />,
});
```

## ❓ FAQ

### Can I add more fields beyond RichText and MediaUpload?

Right now, the plugin auto-generates fields for text and images as well as InnerBlocks. Support for additional fields may come later based on my experience building production sites with this tool.

### Should generated blocks be versioned, or should the source HTML file be?

That depends on your strategy:

- **Versioning the source HTML files only:**

  You treat the `.html` files as **the single source of truth**, and let this plugin regenerate the entire block every time. This is ideal when using this plugin as a **build tool**, fully automating block creation and updates. You don’t version the generated files—just the `.html`.

- **Versioning the generated files only:**

  You use the HTML input files as a **block scaffolding tool**, generate the files once, delete or ignore the `.html` files, and then **manually edit the generated React/Twig/PHP code**. This approach gives you more control over customization at the cost of automation.

👉 Choose the one that fits your workflow best—**automated generation** vs **manual control**.

### Why would I choose Twig instead of PHP for rendering blocks?

Personally, I find **Twig much friendlier** for templating. It’s closer to HTML, which makes it easier to read, write, and maintain—especially for front-end developers.

On top of that, **writing code generation for Twig is simpler** than for PHP. Since the syntax is less verbose and more structured, it’s a better fit for the kind of programmatic output this plugin produces.

### How do I use the Twig-generated blocks inside my project?

Check out [gutenberg-tailwindcss-bedrock-timber-twig](https://github.com/jverneaut/gutenberg-tailwindcss-bedrock-timber-twig/) — a companion project that enables you to use **Twig as the rendering engine for Gutenberg blocks**.

This setup uses Timber and integrates tightly with TailwindCSS and Bedrock, giving you full control over the front-end and a seamless Twig-based authoring experience.

> I plan to release this integration as a standalone package in the future to make it easier to use in other projects.
