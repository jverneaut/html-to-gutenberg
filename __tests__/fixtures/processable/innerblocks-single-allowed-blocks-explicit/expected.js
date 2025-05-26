import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={[
          "custom/first-allowed-block",
          "custom/second-allowed-block",
        ]}
        template={[["custom/first-allowed-block", {}]]}
      ></InnerBlocks>
    </section>
  );
};
