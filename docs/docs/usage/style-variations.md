---
sidebar_position: 3
---

# Defining style variations

Gutenberg allows blocks to define visual **style variations** that editors can toggle in the block settings panel. These styles can be used to switch between different appearances of a block (e.g., "default", "primary", "secondary").

With **HTML To Gutenberg**, you can define these variations directly in your HTML using the `data-styles` attribute on the block's root element.

---

## Usage

To register multiple style variations for a block, add the `data-styles` attribute to the top-level element of your HTML and list the style names separated by spaces:

```html title="demo-block.html"
<section data-styles="default primary secondary"></section>
```

This will automatically:

- Register three style options: `default`, `primary`, and `secondary`
- Allow editors to toggle between them in the block settings sidebar
- Add a corresponding class name (e.g., `is-style-primary`) to the block's wrapper on the editor and the frontend

You can then use CSS to style your block based on the selected block style.
