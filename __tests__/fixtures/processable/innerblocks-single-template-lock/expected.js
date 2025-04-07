import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        templateLock
        allowedBlocks={["custom/child-block"]}
        template={[["custom/child-block"]]}
      ></InnerBlocks>
    </section>
  );
};
