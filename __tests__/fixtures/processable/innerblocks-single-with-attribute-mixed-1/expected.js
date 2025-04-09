import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

export default () => {
  const blockProps = useBlockProps();

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks: ["custom/child-block"],
    template: [["custom/child-block", { title: "Has priority over value" }]],
  });

  return (
    <section {...blockProps} {...innerBlocksProps}>
      {children}
    </section>
  );
};
