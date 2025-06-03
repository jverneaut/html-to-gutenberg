import { useBlockProps } from "@wordpress/block-editor";
import ServerSideRender from "@wordpress/server-side-render";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <ServerSideRender
        block="custom/server-side-rendered"
        attributes={attributes}
      ></ServerSideRender>
    </section>
  );
};
