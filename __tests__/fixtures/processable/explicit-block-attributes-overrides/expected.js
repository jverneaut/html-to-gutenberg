import { useBlockProps, RichText } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <RichText
        tagName="h2"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
        placeholder="Title"
      ></RichText>
    </section>
  );
};
