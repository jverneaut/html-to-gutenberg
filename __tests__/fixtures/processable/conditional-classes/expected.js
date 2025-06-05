import { useBlockProps } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  const [meta, setMeta] = useEntityProp("postType", postType, "meta");

  return (
    <section {...useBlockProps()}>
      <div
        className={`hero ${attributes.test} hero--${attributes.heroType} ${attributes.isChecked ? "yes" : "no"}`}
      ></div>

      <div className={`flex flex-col--${meta.reversed ? "reverse" : ""}`}></div>
    </section>
  );
};
