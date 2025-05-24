import { useBlockProps, useBlockEditingMode } from "@wordpress/block-editor";

export default () => {
  useBlockEditingMode("disabled");

  return <section {...useBlockProps()}></section>;
};
