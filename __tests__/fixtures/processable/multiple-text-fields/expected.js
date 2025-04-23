import { useBlockProps, RichText } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <RichText
        tagName="h1"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
        placeholder="Title"
      ></RichText>
      <RichText
        tagName="p"
        value={attributes.content}
        onChange={(content) => setAttributes({ content })}
        placeholder="Content"
      ></RichText>
    </section>
  );
};
