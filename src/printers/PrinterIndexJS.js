import PrinterBase from "./PrinterBase.js";
import Mustache from "mustache";

import { format } from "prettier";
import parserBabel from "prettier/parser-babel";
import pluginESTree from "prettier/plugins/estree.js";

const template = `import { registerBlockType } from "@wordpress/blocks";
{{#_hasInnerBlocks}}
import { InnerBlocks } from "@wordpress/block-editor";
{{/_hasInnerBlocks}}

{{#style}}
import './{{{style}}}';
{{/style}}

import Edit from "./edit.js";
import metadata from "./block.json";

registerBlockType(metadata.name, {
edit: Edit,
save: () =>
{{#_hasInnerBlocks}}
<InnerBlocks.Content />
{{/_hasInnerBlocks}}
{{^_hasInnerBlocks}}
null
{{/_hasInnerBlocks}}
});
`;

export default class PrinterIndexJS extends PrinterBase {
  static filename = "index.js";
  static skipAst = true;

  async print(htmlString) {
    const renderedTemplate = Mustache.render(template, {
      content: htmlString,
      ...this.blockData,
    });

    return format(renderedTemplate, {
      parser: "babel",
      plugins: [parserBabel, pluginESTree],
    });
  }
}
