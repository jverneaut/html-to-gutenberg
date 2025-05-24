import { useBlockProps, useBlockEditingMode } from "@wordpress/block-editor";

export default () => {
  useBlockEditingMode("default");

  return <section {...useBlockProps()}></section>;
};
