import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={["custom/child-block"]}
        template={[["custom/child-block"]]}
        templateLock
      ></InnerBlocks>
    </section>
  );
};
