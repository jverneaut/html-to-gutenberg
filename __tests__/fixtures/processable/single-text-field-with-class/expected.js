import { useBlockProps, RichText } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <RichText
        className="text-3xl font-semibold"
        tagName="h1"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
      ></RichText>
    </section>
  );
};
