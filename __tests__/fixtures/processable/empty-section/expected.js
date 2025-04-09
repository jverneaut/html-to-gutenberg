import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  const blockProps = useBlockProps();

  return <section {...blockProps}></section>;
};
