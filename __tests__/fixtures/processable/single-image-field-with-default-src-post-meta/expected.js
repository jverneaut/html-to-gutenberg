import { useBlockProps, MediaUpload } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import { Image } from "@10up/block-components/components/image";

export default () => {
  const postType = useSelect(
    (select) => select("core/editor").getCurrentPostType(),
    [],
  );

  const [meta, setMeta] = useEntityProp("postType", postType, "meta");

  return (
    <section {...useBlockProps()}>
      <MediaUpload
        value={meta.imageKey}
        onSelect={(image) => setMeta({ ...meta, imageKey: image.id })}
        render={({ open }) =>
          meta.imageKey ? (
            <Image
              style={{ cursor: "pointer", pointerEvents: "all" }}
              onClick={open}
              className="w-full h-full object-cover"
              id={meta.imageKey}
              onSelect={(image) => setMeta({ ...meta, imageKey: image.id })}
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
