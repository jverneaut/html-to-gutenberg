![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)

# HTML To Gutenberg

A Webpack plugin that turns raw HTML into dynamic Gutenberg blocks built with React and Twig.

Instead of manually coding both React and Twig components, simply write an HTML file with some special attributes, and this plugin will automatically generate all necessary files for you:

- ✅ **React-based edit.js** for the WordPress editor
- ✅ **Twig-based render.twig** for frontend rendering
- ✅ **block.json** with automatically defined attributes
- ✅ **index.js** to register the block type

This plugin **renders blocks with Twig instead of PHP**, making it ideal for projects using Timber and integrates seamlessly with my other project:
👉 [gutenberg-tailwindcss-bedrock-timber-twig](https://github.com/jverneaut/gutenberg-tailwindcss-bedrock-timber-twig/)

## ✨ Features

- **Automatic Gutenberg block generation** from simple HTML
- **Use attributes** (`data-name="title"`, etc.) to define editable fields
- **Supports RichText and MediaUpload**:
  - Non-`<img>` elements with `data-name="something"` → **Editable RichText**
  - `<img>` elements with `data-name="something"` → **Image selection via MediaUpload**
- **Fully automates block.json attributes creation**

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
  </div>
</section>
```

### 🔄 Generated files

✅ `edit.js` **(for Gutenberg editor)**

```jsx
import { useBlockProps, RichText, MediaUpload } from "@wordpress/block-editor";
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
