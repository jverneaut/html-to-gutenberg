import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  const blockProps = useBlockProps({ className: "container" });

  return <section {...blockProps}></section>;
};
