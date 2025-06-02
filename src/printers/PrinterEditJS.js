import PrinterBase from "./PrinterBase.js";
import Mustache from "mustache";

import { format } from "prettier";
import parserBabel from "prettier/parser-babel";
import pluginESTree from "prettier/plugins/estree.js";

const template = `{{#content}}
import {
useBlockProps,
{{#_editingMode}}
useBlockEditingMode,
{{/_editingMode}}
{{#_hasInnerBlocks}}
InnerBlocks,
{{/_hasInnerBlocks}}
{{#_hasRichTextImport}}
RichText,
{{/_hasRichTextImport}}
{{#_hasMediaUploadImport}}
MediaUpload,
{{/_hasMediaUploadImport}}
{{#_hasInspectorControlsImport}}
InspectorControls,
{{/_hasInspectorControlsImport}}
{{#_hasBlockControlsImport}}
BlockControls,
{{/_hasBlockControlsImport}}
} from '@wordpress/block-editor';
{{#_hasWordPressComponents}}
import {
{{#_hasPanelBodyImport}}
PanelBody,
{{/_hasPanelBodyImport}}
{{#_hasCheckboxControlImport}}
CheckboxControl,
{{/_hasCheckboxControlImport}}
{{#_hasRadioControlImport}}
RadioControl,
{{/_hasRadioControlImport}}
{{#_hasTextControlImport}}
TextControl,
{{/_hasTextControlImport}}
{{#_hasToggleControlImport}}
ToggleControl,
{{/_hasToggleControlImport}}
{{#_hasSelectControlImport}}
SelectControl,
{{/_hasSelectControlImport}}
{{#_hasToolbarImport}}
Toolbar,
{{/_hasToolbarImport}}
{{#_hasToolbarItemImport}}
ToolbarItem,
{{/_hasToolbarItemImport}}
{{#_hasToolbarGroupImport}}
ToolbarGroup,
{{/_hasToolbarGroupImport}}
{{#_hasToolbarButtonImport}}
ToolbarButton,
{{/_hasToolbarButtonImport}}
} from '@wordpress/components';
{{/_hasWordPressComponents}}
{{#_hasPostMeta}}
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
{{/_hasPostMeta}}
{{#_hasMediaUploadImport}}
import { Image } from "@10up/block-components";
{{/_hasMediaUploadImport}}
{{/content}}
{{#_hasServerSideRender}}
import ServerSideRender from '@wordpress/server-side-render';
{{/_hasServerSideRender}}

{{#editorStyle}}
import './{{{editorStyle}}}';
{{/editorStyle}}

{{#content}}
export default ({{{propsString}}}) => {
{{#_editingMode}}
useBlockEditingMode('{{{_editingMode}}}');
{{/_editingMode}}
{{#_hasPostMeta}}
const postType = useSelect(
  (select) => select("core/editor").getCurrentPostType(),
  [],
);
const [meta, setMeta] = useEntityProp("postType", postType, "meta");
{{/_hasPostMeta}}

return ({{{ content }}})
};
{{/content}}

{{^content}}
export default () => null;
{{/content}}
`;

export default class PrinterEditJS extends PrinterBase {
  static filename = "edit.js";

  async print(htmlString) {
    const props = [
      this.blockData._hasAttributesProps ? "attributes" : false,
      this.blockData._hasAttributesProps ? "setAttributes" : false,
      this.blockData._hasSelected ? "isSelected" : false,
    ].filter(Boolean);

    const propsString = props.length ? `{${props.join(", ")}}` : "";

    const renderedTemplate = Mustache.render(template, {
      content: htmlString,
      propsString,
      ...this.blockData,
    });

    return format(renderedTemplate, {
      parser: "babel",
      plugins: [parserBabel, pluginESTree],
    });
  }
}
