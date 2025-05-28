import { useBlockProps } from "@wordpress/block-editor";

import "./editor-style.css";

export default () => {
  return (
    <section {...useBlockProps()}>
      <div>
        I have different styles in the editor and on the frontend, as well as a
        script on the frontend.
      </div>
    </section>
  );
};
