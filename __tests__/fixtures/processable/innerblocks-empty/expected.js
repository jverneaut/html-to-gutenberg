import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

export default () => {
  const blockProps = useBlockProps();

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps);

  return (
    <section {...blockProps} {...innerBlocksProps}>
      {children}
    </section>
  );
};
