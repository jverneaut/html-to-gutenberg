import {
  useBlockProps,
  RichText,
  MediaUpload,
  InnerBlocks,
} from "@wordpress/block-editor";
import { Image } from "@10up/block-components";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps({ className: "container" })}>
      <div className="grid grid-cols-12 px-8 gap-x-6">
        <div className="col-span-6 flex flex-col justify-center">
          <RichText
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
            src="w-full aspect-video rounded-lg"
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
        </div>

        <div className="col-span-12 flex gap-x-6">
          <InnerBlocks
            templateLock
            allowedBlocks={["custom/child-block", "custom/other-child-block"]}
            template={[
              ["custom/child-block", { title: "Title 1", number: 42 }],
              [
                "custom/child-block",
                { title: "<strong>Title 2</strong>", number: 42 },
              ],
              ["custom/other-child-block", { title: "Title 3", number: 42 }],
            ]}
          ></InnerBlocks>
        </div>
      </div>
    </section>
  );
};
