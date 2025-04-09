import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={["custom/child-block"]}
        template={[
          ["custom/child-block", { title: "Has priority over value" }],
        ]}
      ></InnerBlocks>
    </section>
  );
};
