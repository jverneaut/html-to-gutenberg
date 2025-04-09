import { useBlockProps, MediaUpload } from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <section {...blockProps}>
      <MediaUpload
        value={attributes.image_1}
        onSelect={(image) => setAttributes({ image_1: image.id })}
        render={({ open }) => (
          <Image
            style={{ cursor: "pointer" }}
            onClick={open}
            id={attributes.image_1}
            onSelect={(image) => setAttributes({ image_1: image.id })}
          />
        )}
      ></MediaUpload>
      <MediaUpload
        value={attributes.image_2}
        onSelect={(image) => setAttributes({ image_2: image.id })}
        render={({ open }) => (
          <Image
            style={{ cursor: "pointer" }}
            onClick={open}
            id={attributes.image_2}
            onSelect={(image) => setAttributes({ image_2: image.id })}
          />
        )}
      ></MediaUpload>
    </section>
  );
};
