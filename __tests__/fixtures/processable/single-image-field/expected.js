import { useBlockProps, MediaUpload } from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <section {...blockProps}>
      <MediaUpload
        value={attributes.image}
        onSelect={(image) => setAttributes({ image: image.id })}
        render={({ open }) => (
          <Image
            style={{ cursor: "pointer" }}
            onClick={open}
            id={attributes.image}
            onSelect={(image) => setAttributes({ image: image.id })}
          />
        )}
      ></MediaUpload>
    </section>
  );
};
