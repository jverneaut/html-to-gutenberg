import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return <section {...useBlockProps({ style: { color: "red" } })}></section>;
};
