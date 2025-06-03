Visit the [official documentation](https://html-to-gutenberg.com) to try this code in a live interactive editor.

#### block.html

```html
<section
  class="py-20 bg-blue-200"
  data-parent="custom/parent-block"
  data-editing-mode="contentOnly"
>
  <inspector-controls>
    <panel-body title="Settings">
      <select-control data-bind="postType" label="Post Type">
        <select-control-option value="posts">Posts</select-control-option>
        <select-control-option value="pages">Pages</select-control-option>
      </select-control>
    </panel-body>
  </inspector-controls>

  <div class="container">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6">
        <h2 class="text-2xl" data-bind="sectionTitle">
          Edit me inside the editor
        </h2>
        <img class="aspect-square object-cover" data-bind="sectionImage" />
      </div>

      <div class="col-span-12 md:col-span-6">
        <inner-blocks allowedBlocks="all" templateLock="all">
          <inner-block name="core/group">
            <inner-block name="core/heading" level="3"></inner-block>
            <inner-block name="core/paragraph">
              <block-attribute name="content">
                Lorem ipsum dolor sit amet consectetur.
              </block-attribute>
            </inner-block>
          </inner-block>
        </inner-blocks>
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
  InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import { Image } from "@10up/block-components/components/image";

export default ({ attributes, setAttributes }) => {
  useBlockEditingMode("contentOnly");

  return (
    <section {...useBlockProps({ className: "py-20 bg-blue-200" })}>
      <InspectorControls>
        <PanelBody title="Settings">
          <SelectControl
            label="Post Type"
            value={attributes.postType}
            onChange={(postType) => setAttributes({ postType })}
            options={[
              { label: "Posts", value: "posts" },
              { label: "Pages", value: "pages" },
            ]}
          ></SelectControl>
        </PanelBody>
      </InspectorControls>

      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <RichText
              className="text-2xl"
              tagName="h2"
              value={attributes.sectionTitle}
              onChange={(sectionTitle) => setAttributes({ sectionTitle })}
              placeholder="Section title"
            ></RichText>
            <MediaUpload
              value={attributes.sectionImage}
              onSelect={(image) => setAttributes({ sectionImage: image.id })}
              render={({ open }) => (
                <Image
                  style={{ cursor: "pointer", pointerEvents: "all" }}
                  onClick={open}
                  className="aspect-square object-cover"
                  id={attributes.sectionImage}
                  onSelect={(image) =>
                    setAttributes({ sectionImage: image.id })
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

$sectionImage_id = $attributes['sectionImage'] ?? '';
$sectionImage = $sectionImage_id ? wp_get_attachment_image_src($sectionImage_id, 'full') : [''];
$sectionImage_src = $sectionImage[0] ?? '';
$sectionImage_srcset = $sectionImage_id ? wp_get_attachment_image_srcset($sectionImage_id, 'full') : '';
$sectionImage_sizes = $sectionImage_id ? wp_get_attachment_image_sizes($sectionImage_id, 'full') : '';
$sectionImage_alt = $sectionImage_id ? get_post_meta($sectionImage_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(['class' => 'py-20 bg-blue-200']); ?>>
  <div class="container">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6">
        <h2 class="text-2xl"><?php echo wp_kses_post($attributes['sectionTitle'] ?? ''); ?></h2>
        <img class="aspect-square object-cover" src="<?php echo esc_url($sectionImage_src); ?>" srcset="<?php echo esc_attr($sectionImage_srcset); ?>" sizes="<?php echo esc_attr($sectionImage_sizes); ?>" alt="<?php echo esc_attr($sectionImage_alt); ?>" />
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
  "version": "0.1.0",
  "category": "theme",
  "example": {},
  "parent": ["custom/parent-block"],
  "attributes": {
    "align": { "type": "string", "default": "full" },
    "sectionImage": { "type": "integer" },
    "postType": { "type": "string", "default": "posts" },
    "sectionTitle": { "type": "string", "default": "Edit me inside the editor" }
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
