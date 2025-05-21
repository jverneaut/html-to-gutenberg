---
sidebar_position: 0
---

# Defining text attributes

When developing custom Gutenberg blocks, there are two main approaches to defining editable text areas:

- Use `InnerBlocks` to allow insertion of blocks like `core/paragraph`, giving the user full formatting control.
- Use the `RichText` component to make specific elements inline-editable. This offers less formatting freedom but enables more complex and custom layouts.

**HTML To Gutenberg** supports both approaches. However, the second option (using `RichText`) is often the simplest and is recommended for short-form content like titles, subtitles, descriptions, or tags.

To learn more about using `InnerBlocks` with **HTML To Gutenberg**, please refer to [its dedicated documentation page](/usage/innerblocks.md).

### Adding `data-attribute` attributes to text elements

To make an HTML element editable, add a `data-attribute="name"` attribute to the element. The `name` will become the key for the stored attribute in the block’s saved content.

```html title="demo-block.html"
<section>
  <h2 data-attribute="title">Hello, HTML To Gutenberg!</h2>
</section>
```

This will automatically:

- Create a `title` string attribute in `block.json`.
- Use the `RichText` component in the editor for that element.
- Render the saved content on the frontend in the same place.

You can add multiple text attributes to a single block, but `text attributes cannot be nested inside each other`. If you need nested editable content, consider using `InnerBlocks` with core or custom blocks that support nesting.

### Handling defaults and placeholders

By default, any content inside an element marked with `data-attribute` will be used as the **default value** when the block is added to a page.

For example:

```html title="demo-block.html"
<section>
  <h2 data-attribute="title">Hello, <strong>HTML To Gutenberg!</strong></h2>
</section>
```

Will generate the following attribute definition:

```json title="block.json abstract"
 "attributes": {
    "title": {
      "type": "string",
      "default": "Hello, <strong>HTML To Gutenberg!</strong>"
    },
  },
```

In the editor, if the attribute is empty (e.g., on first insert), a placeholder will be shown. This placeholder is a capitalized version of the attribute name — in this case: `Title`.
