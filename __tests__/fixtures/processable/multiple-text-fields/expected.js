import { useBlockProps, RichText } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <section {...blockProps}>
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
    </section>
  );
};
