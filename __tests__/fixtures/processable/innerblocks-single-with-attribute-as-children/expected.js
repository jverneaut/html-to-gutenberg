import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={["custom/child-block"]}
        template={[
          [
            "custom/child-block",
            { title: "<p><strong>Child block</strong> title</p>" },
          ],
        ]}
      ></InnerBlocks>
    </section>
  );
};
