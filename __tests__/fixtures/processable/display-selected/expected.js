import { useBlockProps } from "@wordpress/block-editor";

export default ({ isSelected }) => {
  return (
    <section {...useBlockProps()}>
      <div>Displayed everywhere</div>
      {isSelected && (
        <div>Displayed in the editor when the block is selected</div>
      )}
    </section>
  );
};
