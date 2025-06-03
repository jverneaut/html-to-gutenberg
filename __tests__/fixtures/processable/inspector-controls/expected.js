import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
  PanelBody,
  CheckboxControl,
  RadioControl,
  TextControl,
  ToggleControl,
  SelectControl,
} from "@wordpress/components";

export default ({ attributes, setAttributes }) => {
  return (
    <section {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title="Settings">
          <CheckboxControl
            label="Checkbox Field"
            help="Additional help text"
            checked={attributes.checkboxAttribute}
            onChange={(checkboxAttribute) =>
              setAttributes({ checkboxAttribute })
            }
          ></CheckboxControl>

          <RadioControl
            selected={attributes.radioAttribute}
            onChange={(radioAttribute) => setAttributes({ radioAttribute })}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          ></RadioControl>

          <TextControl
            label="Text Field"
            help="Additional help text"
            value={attributes.textAttribute}
            onChange={(textAttribute) => setAttributes({ textAttribute })}
          ></TextControl>

          <ToggleControl
            label="Toggle Field"
            checked={attributes.toggleAttribute}
            onChange={(toggleAttribute) => setAttributes({ toggleAttribute })}
          ></ToggleControl>

          <SelectControl
            label="Select Control"
            value={attributes.selectAttribute}
            onChange={(selectAttribute) => setAttributes({ selectAttribute })}
            options={[
              { label: "Option A", value: "a" },
              { label: "Option B", value: "b" },
              { label: "Option C", value: "c" },
            ]}
          ></SelectControl>
        </PanelBody>
      </InspectorControls>
    </section>
  );
};
