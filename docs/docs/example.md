---
sidebar_position: 1
---

# Example

Want to see what **HTML To Gutenberg** actually does?

:::tip
This example is taken from the [example directory inside the project](https://github.com/jverneaut/html-to-gutenberg/tree/main/example). Clone it locally and modify the HTML file to explore how changes are reflected in the generated Gutenberg block.
:::

## Input: `demo-block.html`

Here’s a simple HTML snippet annotated with `data-attributes` and `<blocks>` declarations that serves as the only source file to generate a block.

From this single file, **HTML To Gutenberg** generates a fully functional, editable, and front-end-ready Gutenberg block.

```html title="demo-block.html"
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

## `block.json` (generated)

**Defines the block's identity and behavior:**

- The block’s `name`, `title`, and `textdomain` are derived from the HTML filename.
- Attributes are automatically extracted from `data-attribute` declarations.
- Style variations and parent relationships are detected from `data-styles` and `data-parent``
- Output includes everything needed to register the block with WordPress.

```json title="demo-block/block.json (generated)"
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
  "render": "file:./render.php"
}
```

## `edit.js` (generated)

**Handles how the block appears and behaves inside the WordPress editor:**

- Elements marked with `data-attribute` are converted into Gutenberg components (`RichText`, `MediaUpload`, etc.).
- Custom child blocks inside `<blocks>` are turned into a locked (optional) `InnerBlocks` template.
- You can immediately preview and edit the block inside the editor with accurate structure and styles.

```jsx title="demo-block/edit.js (generated)"
import {
  useBlockProps,
  InnerBlocks,
  RichText,
  MediaUpload,
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
                style={{ cursor: "pointer", pointerEvents: "all" }}
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

## `render.php` (generated)

**Used to render the block on the frontend (and optionally, in the editor):**

- PHP templates reflect the structure of your original HTML.
- Attribute values are inserted, escaped, and rendered server-side.
- Media fields like images are converted to their corresponding WordPress PHP helpers.

```php title="demo-block/render.php (generated)"
<?php

$image_id = $attributes['image'] ?? '';
$image = $image_id ? wp_get_attachment_image_src($image_id, 'full') : [''];
$image_url = $image[0] ?? '';
$image_alt = $image_id ? get_post_meta($image_id, '_wp_attachment_image_alt', true) : '';

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

## `index.js` (generated)

**Registers the block with WordPress:**

- Loads the `block.json` metadata.
- Connects the editor interface via `edit.js`.
- Uses `InnerBlocks.Content` in the editor to serialize and save inner block content

```js title="demo-block/index.js (generated)"
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import Edit from "./edit.js";
import metadata from "./block.json";

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => <InnerBlocks.Content />,
});
```
