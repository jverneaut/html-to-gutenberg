import { useBlockProps, MediaUpload } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import { Image } from "@10up/block-components/components/image";

export default ({ attributes, setAttributes }) => {
  const postType = useSelect(
    (select) => select("core/editor").getCurrentPostType(),
    [],
  );

  const [meta, setMeta] = useEntityProp("postType", postType, "meta");

  return (
    <section {...useBlockProps()}>
      <MediaUpload
        value={attributes.image_1}
        onSelect={(image) => setAttributes({ image_1: image.id })}
        render={({ open }) => (
          <Image
            style={{ cursor: "pointer", pointerEvents: "all" }}
            onClick={open}
            id={attributes.image_1}
            onSelect={(image) => setAttributes({ image_1: image.id })}
          />
        )}
      ></MediaUpload>
      <MediaUpload
        value={meta.image_2}
        onSelect={(image) => setMeta({ ...meta, image_2: image.id })}
        render={({ open }) => (
          <Image
            style={{ cursor: "pointer", pointerEvents: "all" }}
            onClick={open}
            id={meta.image_2}
            onSelect={(image) => setMeta({ ...meta, image_2: image.id })}
          />
        )}
      ></MediaUpload>
    </section>
  );
};
