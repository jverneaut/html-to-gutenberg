Visit the [official documentation](https://html-to-gutenberg.com) to try this code in a live interactive editor.

#### block.html

```html
<section
  class="py-20 bg-blue-200"
  data-parent="custom/parent-block"
  data-editing-mode="contentOnly"
>
  <div class="container">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6">
        <h2 class="text-2xl" data-attribute="section_title">
          I am editable – awesome, right?
        </h2>
        <img
          class="aspect-square object-cover"
          data-attribute="section_image"
        />
      </div>

      <div class="col-span-12 md:col-span-6">
        <blocks allowedBlocks="all" templateLock="all">
          <block name="core/group">
            <block name="core/heading" level="3"></block>
            <block name="core/paragraph">
              <attribute name="content">
                Lorem ipsum dolor sit amet consectetur.
              </attribute>
            </block>
          </block>
        </blocks>
      </div>
    </div>
  </div>
</section>
```

#### block/edit.js

```jsx
import {
  useBlockProps,
  useBlockEditingMode,
  InnerBlocks,
  RichText,
  MediaUpload,
} from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  useBlockEditingMode("contentOnly");

  return (
    <section {...useBlockProps({ className: "py-20 bg-blue-200" })}>
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <RichText
              className="text-2xl"
              tagName="h2"
              value={attributes.section_title}
              onChange={(section_title) => setAttributes({ section_title })}
              placeholder="Section title"
            ></RichText>
            <MediaUpload
              value={attributes.section_image}
              onSelect={(image) => setAttributes({ section_image: image.id })}
              render={({ open }) => (
                <Image
                  style={{ cursor: "pointer", pointerEvents: "all" }}
                  onClick={open}
                  className="aspect-square object-cover"
                  id={attributes.section_image}
                  onSelect={(image) =>
                    setAttributes({ section_image: image.id })
                  }
                />
              )}
            ></MediaUpload>
          </div>

          <div className="col-span-12 md:col-span-6">
            <InnerBlocks
              template={[
                [
                  "core/group",
                  {},
                  [
                    ["core/heading", { level: 3 }],
                    [
                      "core/paragraph",
                      { content: "Lorem ipsum dolor sit amet consectetur." },
                    ],
                  ],
                ],
              ]}
              templateLock="all"
            ></InnerBlocks>
          </div>
        </div>
      </div>
    </section>
  );
};
```

#### block/render.php

```php
<?php

$section_image_id = $attributes['section_image'] ?? '';
$section_image = $section_image_id ? wp_get_attachment_image_src($section_image_id, 'full') : [''];
$section_image_src = $section_image[0] ?? '';
$section_image_srcset = $section_image_id ? wp_get_attachment_image_srcset($section_image_id, 'full') : '';
$section_image_sizes = $section_image_id ? wp_get_attachment_image_sizes($section_image_id, 'full') : '';
$section_image_alt = $section_image_id ? get_post_meta($section_image_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(['class' => 'py-20 bg-blue-200']); ?>>
  <div class="container">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6">
        <h2 class="text-2xl"><?php echo wp_kses_post($attributes['section_title'] ?? ''); ?></h2>
        <img class="aspect-square object-cover" src="<?php echo esc_url($section_image_src); ?>" srcset="<?php echo esc_attr($section_image_srcset); ?>" sizes="<?php echo esc_attr($section_image_sizes); ?>" alt="<?php echo esc_attr($section_image_alt); ?>" />
      </div>

      <div class="col-span-12 md:col-span-6">
        <?php echo $content; ?>
      </div>
    </div>
  </div>
</section>
```

#### block/block.json

```json
{
  "name": "custom/block",
  "title": "Block",
  "textdomain": "block",
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "example": {},
  "parent": ["custom/parent-block"],
  "attributes": {
    "align": { "type": "string", "default": "full" },
    "section_title": {
      "type": "string",
      "default": "I am editable – awesome, right?"
    },
    "section_image": { "type": "integer" }
  },
  "supports": { "html": false, "align": ["full"] },
  "editorScript": "file:./index.js",
  "render": "file:./render.php"
}
```

#### block/index.js

```jsx
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import Edit from "./edit.js";
import metadata from "./block.json";

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => <InnerBlocks.Content />,
});
```
