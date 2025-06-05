import { useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";

export default ({ attributes, setAttributes }) => {
  const postType = useSelect(
    (select) => select("core/editor").getCurrentPostType(),
    [],
  );

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
