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

import path from "path";
import HTMLToGutenbergPlugin from "@jverneaut/html-to-gutenberg";

export default {
  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "blocks", // Your source HTML files
      outputDirectory: "generated-blocks", // Where generated Gutenberg blocks will be placed
      blockPrefix: "custom", // Block namespace
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
<section class="container mx-auto px-6">
  <div class="col-span-6 flex flex-col justify-center">
    <h1 data-name="title" class="text-4xl">Hello, Gutenberg!</h1>

    <p data-name="content">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odio
      dolorem obcaecati deserunt totam soluta voluptas.
    </p>
  </div>

  <div class="col-span-6">
    <img class="w-full aspect-video object-cover" data-name="image" />
  </div>
</section>
```

### 🔄 Generated files

✅ `edit.js` **(for Gutenberg editor)**

```jsx
import { MediaUpload, useBlockProps, RichText } from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps({ className: "container mx-auto px-6" })}>
      <div className="col-span-6 flex flex-col justify-center">
        <RichText
          className="text-4xl"
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
          value={attributes.image}
          onSelect={(image) => setAttributes({ image: image.id })}
          render={({ open }) => (
            <Image
              style={{ cursor: "pointer" }}
              onClick={open}
              className="w-full aspect-video object-cover"
              id={attributes.image}
              onSelect={(image) => setAttributes({ image: image.id })}
            />
          )}
        ></MediaUpload>
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
    class: 'container mx-auto px-6'
  })
  }}
>
  <div class="col-span-6 flex flex-col justify-center">
    <h1 class="text-4xl">{{ attributes.title }}</h1>

    <p>
      {{ attributes.content }}
    </p>
  </div>

  <div class="col-span-6">
    <img
      class="w-full aspect-video object-cover"
      src="{{ get_image(attributes.image).src }}"
      alt="{{ get_image(attributes.image).alt }}"
    />
  </div>
</section>
```

✅ `block.json` **(auto-generated block metadata)**

```json
{
  "name": "custom/demo",
  "title": "Demo",
  "textdomain": "demo",
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "version": "0.1.0",
  "category": "theme",
  "example": {},
  "attributes": {
    "align": { "type": "string", "default": "full" },
    "title": { "type": "string", "default": "Hello, Gutenberg!" },
    "content": {
      "type": "string",
      "default": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odio dolorem obcaecati deserunt totam soluta voluptas."
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
