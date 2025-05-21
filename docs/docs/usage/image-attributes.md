---
sidebar_position: 1
---

# Defining image attributes

When developing custom Gutenberg blocks, there are two common ways to make images editable by editors:

- Use `InnerBlocks` with the default `core/image` block, giving editors full control over alignment, captions, and styling.
- Use the `MediaUpload` component to make an image element inline-editable. This offers fewer layout options for editors, but gives developers full control over image placement and markup.

**HTML To Gutenberg** supports both approaches. However, the second option (using `MediaUpload`) is generally easier to implement and is recommended for most use cases.

:::warning
**HTML To Gutenberg** uses the `<Image />` component from [10up's blocks-component library](https://github.com/10up/block-components) to simplify working with images in the editor.

By combining `<MediaUpload />` with `<Image />`, the generated blocks allow editors to click on an image and directly open the WordPress Media Library to change it.

Make sure to install the package in your project when working with images:

```bash
npm install @10up/block-components --save-dev
```

:::

## Adding `data-attribute` attributes to image elements

To make an image editable:

- Remove any existing `src` and `alt` attributes.
- Add a `data-attribute="name"` attribute where `name` becomes the key used to store the image ID in the block’s attributes.

Example:

```html title="demo-block.html"
<section>
  <img data-attribute="portrait" />
</section>
```

This will automatically:

- Add a `portrait` attribute to block.json.
- Use the appropriate components to enable image selection in the editor.
- Render the selected image on the frontend.

## Using custom image sizes

You can define the image size to use when rendering by adding the `data-image-size` attribute.

```html title="demo-block.html"
<section>
  <img data-attribute="image" data-image-size="medium" />
</section>
```

This creates an `image` attribute that stores the image ID and renders the image using WordPress's `medium` size.

The generated PHP code will look like this:

```php title="generated/demo-block/render.php"
<?php

$image_id = $attributes['image'] ?? '';
$image = $image_id ? wp_get_attachment_image_src($image_id, 'medium') : [''];
$image_src = $image[0] ?? '';
$image_srcset = $image_id ? wp_get_attachment_image_srcset($image_id, 'medium') : '';
$image_sizes = $image_id ? wp_get_attachment_image_sizes($image_id, 'medium') : '';
$image_alt = $image_id ? get_post_meta($image_id, '_wp_attachment_image_alt', true) : '';

?>

<section <?php echo get_block_wrapper_attributes(); ?>>
  <img src="<?php echo esc_url($image_src); ?>" srcset="<?php echo esc_attr($image_srcset); ?>" sizes="<?php echo esc_attr($image_sizes); ?>" alt="<?php echo esc_attr($image_alt); ?>" />
</section>
```
