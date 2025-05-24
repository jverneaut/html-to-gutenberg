import { useBlockProps, useBlockEditingMode } from "@wordpress/block-editor";

export default () => {
  useBlockEditingMode("contentOnly");

  return <section {...useBlockProps()}></section>;
};
