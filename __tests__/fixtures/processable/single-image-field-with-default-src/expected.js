import { useBlockProps, MediaUpload } from "@wordpress/block-editor";
import { Image } from "@10up/block-components/components/image";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <MediaUpload
        value={attributes.image}
        onSelect={(image) => setAttributes({ image: image.id })}
        render={({ open }) =>
          attributes.image ? (
            <Image
              style={{ cursor: "pointer", pointerEvents: "all" }}
              onClick={open}
              className="w-full h-full object-cover"
              id={attributes.image}
              onSelect={(image) => setAttributes({ image: image.id })}
            />
          ) : (
            <img
              src="https://placehold.co/600x400"
              style={{ cursor: "pointer", pointerEvents: "all" }}
              onClick={open}
              className="w-full h-full object-cover"
            />
          )
        }
      ></MediaUpload>
    </section>
  );
};
