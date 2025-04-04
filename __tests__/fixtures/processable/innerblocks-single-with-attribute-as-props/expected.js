import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={["custom/child-block"]}
        template={[
          [
            "custom/child-block",
            { title: "Title", description: "<p>Description</p>" },
          ],
        ]}
      ></InnerBlocks>
    </section>
  );
};
