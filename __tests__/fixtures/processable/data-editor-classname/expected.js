import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return <section {...useBlockProps({ className: "editor" })}></section>;
};
