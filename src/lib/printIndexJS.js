import { format } from "prettier";
import parserBabel from "prettier/parser-babel";
import pluginESTree from "prettier/plugins/estree.js";
import Mustache from "mustache";

const template = `import { registerBlockType } from "@wordpress/blocks";
{{#hasInnerBlocks}}
import { InnerBlocks } from "@wordpress/block-editor";
{{/hasInnerBlocks}}

import Edit from "./edit.js";
import metadata from "./block.json";

registerBlockType(metadata.name, {
edit: Edit,
save: () =>
{{#hasInnerBlocks}}
<InnerBlocks.Content />
{{/hasInnerBlocks}}
{{^hasInnerBlocks}}
null
{{/hasInnerBlocks}}
});
`;

const printIndexJS = async (blockData) => {
  const options = {
    hasInnerBlocks: blockData.innerBlocks.hasInnerBlocks,
  };

  const renderedTemplate = Mustache.render(template, options);

  const formatted = await format(renderedTemplate, {
    parser: "babel",
    plugins: [parserBabel, pluginESTree],
  });

  return formatted;
};

export default printIndexJS;
