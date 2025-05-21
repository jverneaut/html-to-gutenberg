---
sidebar_position: 4
---

# Parent/child blocks relationships

In Gutenberg, it's possible to restrict a block so it can only be used as a child of specific parent blocks. This is useful for ensuring that blocks are only inserted in the appropriate context, such as inside layout components or complex structures.

With **HTML To Gutenberg**, you can define this relationship directly in your HTML by using the `data-parent` attribute on the block’s root `<section>` element:

```html
<section data-parent="custom/parent-1 custom/parent-2">
  <!-- -->
</section>
```

In this example:

- The block will only be available inside the `custom/parent-1` and `custom/parent-2` blocks.
- It will **not appear in the default block inserter**, reducing clutter and guiding editors to use the block where it makes sense.

This feature is particularly helpful when building reusable block patterns where child blocks are tightly coupled to specific parent blocks — for example, a slider block with dedicated slider card elements.
