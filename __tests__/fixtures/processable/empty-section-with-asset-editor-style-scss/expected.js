import { useBlockProps } from "@wordpress/block-editor";

import "./editor.css";

export default () => {
  return <section {...useBlockProps()}></section>;
};
