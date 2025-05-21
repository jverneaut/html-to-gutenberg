---
sidebar_position: 2
---

# Using InnerBlocks

[Gutenberg's `<InnerBlocks />`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#innerblocks) component allows blocks to define content areas where other blocks can be inserted. It is a powerful concept that you should be familiar with before using it in combination with **HTML To Gutenberg**

One goal of this tool is to make working with `InnerBlocks` as seamless and frictionless as possible by allowing you to define them directly in your HTML.

:::tip
If you're new to InnerBlocks, take a moment to learn how they work in native Gutenberg block development before proceeding.
:::

---

## Defining InnerBlocks zones

To define an `InnerBlocks` area in your HTML, simply use a custom `<blocks></blocks>` tag.

```html title="demo-block.html"
<section>
  <blocks></blocks>
</section>
```

This will insert a default `<InnerBlocks />` component in your editor and render its content on the frontend.

## Defining a template

You can define a block template by adding `<block name="namespace/block-name"></block>` elements inside the `<blocks>` tag:

```html title="demo-block.html"
<section>
  <blocks>
    <block name="custom/tag" />
    <block name="core/heading" />
    <block name="core/paragraph" />
  </blocks>
</section>
```

This will automatically set up a template for the `InnerBlocks` area, pre-filling it with the specified blocks.

## Setting default attributes

Each `<block>` element can have default attributes set in multiple ways (in increasing priority order):

- **Inline attributes** (e.g., `title="Hello"`):

```html
<block name="custom/title-block" title="Hello world!" />
```

- **Child `<attribute>` element with value attribute (self-closing)**:

```html
<block name="custom/title-block">
  <attribute name="title" value="Hello world!" />
</block>
```

- **Child `<attribute>` element with HTML**:

```html
<block name="custom/title-block">
  <attribute name="title">Hello world!</attribute>
</block>
```

All three approaches are equivalent. Choose the one that best fits your use case.

## Setting orientation

You can control the orientation of the blocks using the orientation attribute on `<blocks>`:

```html
<blocks orientation="horizontal">
  <!-- -->
</blocks>
```

Possible values: `vertical` (default), `horizontal`.

This is especially useful when using the drag-and-drop blocks rearrangement feature inside the editor for horizontally laid out blocks.

## Restricting allowed blocks

By default, when using `<block>` inside `<blocks>`, the allowed blocks are restricted to only those explicitly listed.

If you want to manually define allowed blocks, use the `allowedBlocks` attribute:

```html
<blocks allowedBlocks="custom/tag core/heading core/paragraph">
  <!-- -->
</blocks>
```

## Locking the template

You can prevent editors from adding, moving, or removing blocks from the area using the templateLock attribute:

```html
<blocks templateLock>
  <!-- -->
</blocks>
```

:::warning One InnerBlocks per block
As per Gutenberg's internal rules, you can only use one `InnerBlocks` zone per custom block. If your block has multiple editable areas, consider creating multiple child blocks that can each use a separate `InnerBlocks` zone, eg. `custom/hero` can have two child blocks `custom/hero-top` and `custom/hero-bottom` that each have separate `InnerBlocks` zones.
:::
