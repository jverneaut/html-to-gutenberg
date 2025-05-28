import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <div>Displayed everywhere</div>
      <div>Displayed in the editor</div>
    </section>
  );
};
