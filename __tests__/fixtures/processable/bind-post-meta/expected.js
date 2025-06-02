import { useBlockProps, RichText } from "@wordpress/block-editor";
import { SelectControl } from "@wordpress/components";
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
      <RichText
        tagName="p"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
        placeholder="Title"
      ></RichText>
      <RichText
        tagName="p"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
        placeholder="Title"
      ></RichText>
      <RichText
        tagName="p"
        value={meta.test}
        onChange={(test) => setMeta({ ...meta, test })}
        placeholder="Test"
      ></RichText>

      <input
        value={attributes.input}
        onChange={(e) => setAttributes({ input: e.target.value })}
      />
      <input
        value={attributes.input}
        onChange={(e) => setAttributes({ input: e.target.value })}
      />
      <input
        value={meta.input}
        onChange={(e) => setMeta({ ...meta, input: e.target.value })}
      />

      <input
        type="checkbox"
        checked={attributes.checkbox}
        onChange={(e) => setAttributes({ checkbox: e.target.checked })}
      />
      <input
        type="checkbox"
        checked={attributes.checkbox}
        onChange={(e) => setAttributes({ checkbox: e.target.checked })}
      />
      <input
        type="checkbox"
        checked={meta.checkbox}
        onChange={(e) => setMeta({ ...meta, checkbox: e.target.checked })}
      />

      <SelectControl
        value={attributes.select}
        onChange={(select) => setAttributes({ select })}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
          { label: "C", value: "c" },
        ]}
      ></SelectControl>

      <SelectControl
        value={attributes.select}
        onChange={(select) => setAttributes({ select })}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
          { label: "C", value: "c" },
        ]}
      ></SelectControl>

      <SelectControl
        value={meta.select}
        onChange={(select) => setMeta({ ...meta, select })}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
          { label: "C", value: "c" },
        ]}
      ></SelectControl>
    </section>
  );
};
