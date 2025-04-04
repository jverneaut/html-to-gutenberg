![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)

# HTML To Gutenberg

A Webpack plugin that turns raw HTML into dynamic Gutenberg blocks built with React and Twig.

Instead of manually coding both React and Twig components, simply write an HTML file with some special attributes, and this plugin will automatically generate all necessary files for you:

- ✅ **React-based edit.js** for the WordPress editor
- ✅ **Twig-based render.twig** for frontend rendering
- ✅ **block.json** with automatically defined attributes
- ✅ **index.js** to register the block type


https://github.com/user-attachments/assets/d9ee9410-9529-4664-a7a4-82b0eb1ad306


This plugin **renders blocks with Twig instead of PHP**, making it ideal for projects using Timber and integrates seamlessly with my other project:
👉 [gutenberg-tailwindcss-bedrock-timber-twig](https://github.com/jverneaut/gutenberg-tailwindcss-bedrock-timber-twig/)

## ✨ Features

- **Automatic Gutenberg block generation** from simple HTML
- **Use attributes** (`data-name="title"`, etc.) to define editable fields
- **Supports RichText and MediaUpload**:
  - Non-`<img>` elements with `data-name="something"` → **Editable RichText**
  - `<img>` elements with `data-name="something"` → **Image selection via MediaUpload**
- **Fully automates block.json attributes creation**
- **InnerBlocks handling** with `<blocks>` and `<block>` elements

## 📦 Installation

```sh
npm install --save-dev @jverneaut/html-to-gutenberg
```

## ⚙️ Webpack Configuration

This plugin is designed to work with Webpack. Here's how to integrate it:

```js
// webpack.config.js
import HTMLToGutenbergPlugin from "@jverneaut/html-to-gutenberg";

export default {
  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "blocks", // Your source HTML files
      outputDirectory: "generated-blocks", // Where generated Gutenberg blocks will be placed
      blocksPrefix: "custom", // Blocks namespace
    }),
  ],
};
```

📌 This setup will:

- Scan `blocks/` for `.html` files
- Generate Gutenberg blocks inside `generated-blocks/`

## 🚀 Quick Start (Example Project)

**An example** is available in the `example/` folder. You can test it by running:

```sh
cd example
npm install
npm run dev
```

## Example

### 📝 Input HTML

```html
<section class="container">
  <div class="grid grid-cols-12 px-8 gap-x-6">
    <div class="col-span-6 flex flex-col justify-center">
      <h1 data-name="title">Hello, <strong>Gutenberg!</strong></h1>

      <p data-name="content">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        facere deleniti nam magni. Aspernatur, obcaecati fuga.
      </p>
    </div>

    <div class="col-span-6">
      <img data-name="image" src="w-full aspect-video rounded-lg" />
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
  "render": "file:./render.twig"
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

Right now, the plugin auto-generates fields for text and images as well as InnerBlocks. Support for additional fiels may come later based on my experience building production sites with this tool.

### Should generated blocks be versioned, or should the source HTML file be?

That depends on your strategy:

- **Versioning the source HTML files only:**

  You treat the `.html` files as **the single source of truth**, and let this plugin regenerate the entire block every time. This is ideal when using this plugin as a **build tool**, fully automating block creation and updates. You don’t version the generated files—just the `.html`.

- **Versioning the generated files only:**

  You use the HTML input files as a **block scaffolding tool**, generate the files once, delete or ignore the `.html` files, and then **manually edit the generated React/Twig code**. This approach gives you more control over customization at the cost of automation.

👉 Choose the one that fits your workflow best—**automated generation** vs **manual control**.

### Why Twig instead of PHP for rendering blocks?

Personally, I find **Twig much friendlier** for templating. It’s closer to HTML, which makes it easier to read, write, and maintain—especially for front-end developers.

On top of that, **writing code generation for Twig is simpler** than for PHP. Since the syntax is less verbose and more structured, it’s a better fit for the kind of programmatic output this plugin produces.

### How do I use the Twig-generated blocks inside my project?

Check out [gutenberg-tailwindcss-bedrock-timber-twig](https://github.com/jverneaut/gutenberg-tailwindcss-bedrock-timber-twig/) — a companion project that enables you to use **Twig as the rendering engine for Gutenberg blocks**.

This setup uses Timber and integrates tightly with TailwindCSS and Bedrock, giving you full control over the front-end and a seamless Twig-based authoring experience.

> I plan to release this integration as a standalone package in the future to make it easier to use in other projects.
