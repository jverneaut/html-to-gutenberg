import { useBlockProps } from "@wordpress/block-editor";
import { ContentPicker } from "@10up/block-components/components/content-picker";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <ContentPicker
        content={attributes.posts}
        onPickChange={(posts) => setAttributes({ posts })}
        contentTypes={["post", "page"]}
        maxContentItems={5}
      ></ContentPicker>
    </section>
  );
};
