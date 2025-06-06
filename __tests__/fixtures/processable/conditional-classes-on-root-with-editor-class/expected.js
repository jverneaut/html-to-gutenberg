import { useBlockProps } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  return (
    <section
      {...useBlockProps({
        className: `${`hero ${attributes.test} hero--${attributes.heroType} ${attributes.isChecked ? "yes" : "no"}`} editor-class`,
      })}
    ></section>
  );
};
