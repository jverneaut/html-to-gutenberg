# HTML To Gutenberg

A **WIP** experimental webpack plugin that turns raw html into dynamic Gutenberg Blocks built with React and Twig.

It uses magic attributes like `data-name="title"` to make dom elements editable.

## Features

- RichText component support when adding `data-name="String"` on non img elements
- MediaUpload component support when adding `data-name="String"` on img elements
- Automatic dependency management inside the generated edit components
- Automatic attributes creation inside block.json

## Example

### Input HTML

```html
<section class="container mx-auto px-6">
  <div class="col-span-6 flex flex-col justify-center">
    <h1 data-name="title" class="text-4xl">Hello, Gutenberg!</h1>

    <p data-name="content">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odio
      dolorem obcaecati deserunt totam soluta voluptas.
    </p>
  </div>

  <div class="col-span-6">
    <img class="w-full aspect-video object-cover" data-name="image" />
  </div>
</section>
```

### Generated edit.js file

```jsx
import { MediaUpload, useBlockProps, RichText } from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps({ className: "container mx-auto px-6" })}>
      <div className="col-span-6 flex flex-col justify-center">
        <RichText
          className="text-4xl"
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
          value={attributes.image}
          onSelect={(image) => setAttributes({ image: image.id })}
          render={({ open }) => (
            <Image
              style={{ cursor: "pointer" }}
              onClick={open}
              className="w-full aspect-video object-cover"
              id={attributes.image}
              onSelect={(image) => setAttributes({ image: image.id })}
            />
          )}
        ></MediaUpload>
      </div>
    </section>
  );
};
```

### Generated render.twig file

```twig
<section
  {{
  wrapper_attributes({
    class: 'container mx-auto px-6'
  })
  }}
>
  <div class="col-span-6 flex flex-col justify-center">
    <h1 class="text-4xl">{{ attributes.title }}</h1>

    <p>
      {{ attributes.content }}
    </p>
  </div>

  <div class="col-span-6">
    <img
      class="w-full aspect-video object-cover"
      src="{{ get_image(attributes.image).src }}"
      alt="{{ get_image(attributes.image).alt }}"
    />
  </div>
</section>
```

### Generated block.json file

```json
{
  "name": "custom/demo",
  "title": "Demo",
  "textdomain": "demo",
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "version": "0.1.0",
  "category": "theme",
  "example": {},
  "attributes": {
    "align": { "type": "string", "default": "full" },
    "title": { "type": "string", "default": "Hello, Gutenberg!" },
    "content": {
      "type": "string",
      "default": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odio dolorem obcaecati deserunt totam soluta voluptas."
    },
    "image": { "type": "integer" }
  },
  "supports": { "html": false, "align": ["full"] },
  "editorScript": "file:./index.js",
  "render": "file:./render.twig"
}
```
