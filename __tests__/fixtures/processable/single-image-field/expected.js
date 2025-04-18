import { useBlockProps, MediaUpload } from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <MediaUpload
        value={attributes.image}
        onSelect={(image) => setAttributes({ image: image.id })}
        render={({ open }) => (
          <Image
            style={{ cursor: "pointer", pointerEvents: "all" }}
            onClick={open}
            id={attributes.image}
            onSelect={(image) => setAttributes({ image: image.id })}
          />
        )}
      ></MediaUpload>
    </section>
  );
};
