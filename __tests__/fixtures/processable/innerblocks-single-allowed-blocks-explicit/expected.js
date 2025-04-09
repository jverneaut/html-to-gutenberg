import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

export default () => {
  const blockProps = useBlockProps();

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks: [
      "custom/first-allowed-block",
      "custom/second-allowed-block",
    ],
    template: [["custom/first-allowed-block"]],
  });

  return (
    <section {...blockProps} {...innerBlocksProps}>
      {children}
    </section>
  );
};
