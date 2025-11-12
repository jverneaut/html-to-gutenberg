import {
  useBlockProps,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { ColorSetting } from "@10up/block-components/components/color-settings";

export default ({ attributes, setAttributes }) => {
  return (
    <section
      {...useBlockProps({
        className: "bg-gray-200 p-12",
        style: { backgroundColor: attributes.color },
      })}
    >
      <InspectorControls>
        <PanelBody title="Settings">
          <ColorSetting
            label="Color Setting"
            value={attributes.color}
            onChange={(color) => setAttributes({ color })}
          ></ColorSetting>
        </PanelBody>
      </InspectorControls>

      <div style={{ backgroundColor: attributes.color }} className="p-8">
        The current color is{" "}
        <RichText
          tagName="strong"
          value={attributes.color}
          onChange={(color) => setAttributes({ color })}
          placeholder="Color"
        ></RichText>
      </div>
    </section>
  );
};
