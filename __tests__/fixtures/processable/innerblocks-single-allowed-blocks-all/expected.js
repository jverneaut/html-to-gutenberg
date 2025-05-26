import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        template={[["custom/first-allowed-block", {}]]}
      ></InnerBlocks>
    </section>
  );
};
