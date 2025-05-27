![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)

<img src="./docs/static/img/logo.svg" alt="HTML To Gutenberg" width="100">

# HTML To Gutenberg

**Create custom Gutenberg blocks from the HTML templates you already have.**

**HTML To Gutenberg** is a tool that transforms a single html file into a fully functional Gutenberg block. With just a few intuitive attributes in your markup, it generates the full block structure — including `edit.js`, `render.php`, `block.json`, and `index.js`.

It’s designed for developers who value simplicity, speed, and control — without sacrificing the native block editor experience.


## Quick start

### 1. Scaffold an HTML To Gutenberg blocks plugin

```bash
cd wp-content/plugins
npx @wordpress/create-block --template html-to-gutenberg-template
```

This sets up everything you need — pre-configured to work with **HTML To Gutenberg**.

### 2. Start development

```bash
cd html-to-gutenberg-blocks # Your block plugin directory
npm run start
```

### 3. Edit the default block

Open `wp-content/plugins/html-to-gutenberg-blocks/src/block.html` and make changes to the default block.

**HTML To Gutenberg** will automatically convert it into a working Gutenberg block.

### 4. Add additional blocks

To create additional blocks, simply add new `.html` files in the src folder.

Each HTML file becomes its own block and is automatically processed by HTML To Gutenberg.

```txt
src/
├── block.html         # Default block (can be safely deleted)
├── hero.html          # Another custom block
├── testimonial.html   # Yet another one
```


> #### Note about blocks deletion
> When you delete an HTML file from src, its corresponding Gutenberg block is removed on the next build.
>
> However, depending on your setup, you may also need to manually delete the removed block folder inside the build/ directory to fully clean it up.

### 5. Activate your plugin

Enable your block in the WordPress admin and drop it into any page or post.

<details>
<summary>Can't see your plugin on the admin?</summary>


> Make sure you set a **title** when generating the plugin with `@wordpress/create-block`. If you don’t, the plugin may not appear in the WordPress plugins page.
>
> If you forgot to add one, open the root PHP file of your plugin and add a `Plugin Name` like so:
>
> ```php
> <?php
>
> /**
>  * Plugin Name:       HTML To Gutenberg Blocks <------ Add a name here
>  * Version:           0.1.0
>  * Requires at least: 6.7
>  * Requires PHP:      7.4
>  * Author:            The WordPress Contributors
>  * License:           GPL-2.0-or-later
>  * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
>  * Text Domain:       textdomain
>  *
>  * @package CreateBlock
>  */
> ```

</details>

### 6. Build for production

```bash
npm run build
```

Bundles and minifies your blocks.


## Documentation

Visit the [official documentation](https://html-to-gutenberg.com).

### Quick links

- [Installation](https://html-to-gutenberg.com/getting-started/installation)
- [Registering blocks](https://html-to-gutenberg.com/getting-started/registering-blocks)
- [Creating a block](https://html-to-gutenberg.com/guides/creating-a-block)
- [Editing content using inline attributes](https://html-to-gutenberg.com/guides/editing-content/using-inline-attributes)
- [Editing content using InnerBlocks](https://html-to-gutenberg.com/guides/editing-content/using-innerblocks)

## Example

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
