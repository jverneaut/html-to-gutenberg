import { useBlockProps, RichText } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <section {...blockProps}>
      <RichText
        className="text-3xl font-semibold"
        tagName="h1"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
      ></RichText>
    </section>
  );
};
