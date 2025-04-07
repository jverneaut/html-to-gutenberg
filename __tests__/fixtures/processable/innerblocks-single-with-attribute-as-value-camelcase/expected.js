import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={["custom/child-block"]}
        template={[
          [
            "custom/child-block",
            { blockTitle: "<strong>Child block</strong> title" },
          ],
        ]}
      ></InnerBlocks>
    </section>
  );
};
