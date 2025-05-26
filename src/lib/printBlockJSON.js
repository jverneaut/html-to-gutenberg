import { format } from "prettier";
import pluginESTree from "prettier/plugins/estree.js";
import pluginBabel from "prettier/plugins/babel.js";

import * as utils from "./common/utils.js";

const printBlockJSON = async (blockData) => {
  const hasStyles = blockData.rootElement.styles?.length > 0;

  // Convert styles array eg. ["default", "primary"] to styles object.
  // Sets the first style as default.
  const styles = hasStyles
    ? {
        styles: blockData.rootElement.styles.map((style, index) => ({
          name: style,
          label: utils.kebabCaseToTitleCase(style),
          ...(index === 0 && { isDefault: true }),
        })),
      }
    : {};

  // Remove internal attributes starting with _, eg. _internalType
  const attributes = Object.fromEntries(
    Object.entries(blockData.attributes).map(([key, value]) => {
      const filteredValue = Object.fromEntries(
        Object.entries(value).filter(([k]) => !k.startsWith("_")),
      );
      return [key, filteredValue];
    }),
  );

  const blockDefinition = {
    name: blockData.name,
    title: blockData.title,
    textdomain: blockData.slug,
    ...(blockData.description
      ? {
          description: blockData.description,
        }
      : {}),
    $schema: "https://schemas.wp.org/trunk/block.json",
    apiVersion: 3,
    version: "0.1.0",
    category: "theme",
    example: {},
    ...styles,
    ...(blockData.rootElement.parent
      ? { parent: blockData.rootElement.parent }
      : {}),
    attributes: {
      align: { type: "string", default: "full" },
      ...attributes,
    },
    supports: {
      html: false,
      align: ["full"],
    },
    editorScript: "file:./index.js",
    render: `file:./render.${blockData.engine === "all" ? "php" : blockData.engine}`,
  };

  const formatted = await format(JSON.stringify(blockDefinition), {
    parser: "json",
    plugins: [pluginESTree, pluginBabel],
  });

  return formatted;
};

export default printBlockJSON;
