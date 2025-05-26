---
sidebar_position: 0
---

# Styling Gutenberg blocks with TailwindCSS

As Gutenberg blocks made with HTML To Gutenberg are simple HTML files, TailwindCSS works out of the box with it without any extra configuration. It is a perfect candidate to use when working with custom blocks, as the styles are self contained inside the HTML markup and as such doesn't require any extra css files along them.

However, there are some Gutenberg particularities that can make working with it a little bit harder at times, especially when using it with InnerBlocks as the editor adds extra elements to make them work.

Bellow are some snippets that I use on every projects that make my life a lot easier.

## Styling InnerBlocks with TailwindCSS

```css
@custom-variant wp-list-layout {
  &:not(:has(.block-editor-block-list__layout)) {
    @slot;
  }

  :has(.block-editor-block-list__layout) {
    .block-editor-block-list__layout {
      @slot;
    }
  }
}
```

## Styling core blocks with TailwindCSS

### Styling the core/button block

To style the core/button block, I use this selector which allows targeting the link inside the block.

```css
:root :where(.wp-element-button, .wp-block-button__link) {
  @apply ...;
}
```

When applying transitions to a button that changes its label position, it can be useful to prevent the animation from running inside the editor to facilitate the editing experience.

I use this style to make the transition so long that it doesn't disrupt the editing experience.

```css
.block-editor-iframe__html .wp-element-button,
.block-editor-iframe__html .wp-block-button__link {
  &,
  &::after,
  &::before,
  * {
    transition-duration: 999s;
  }
}
```
