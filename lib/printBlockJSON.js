import { visit } from "unist-util-visit";
import { format } from "prettier";
import { toHtml } from "hast-util-to-html";

const printBlockJSON = async (jsxAst, blockSlug) => {
  const attributes = {};

  visit(jsxAst, "element", (node) => {
    if (node.properties.dataName) {
      if (node.tagName === "img") {
        attributes[node.properties.dataName] = { type: "integer" };
      } else {
        attributes[node.properties.dataName] = { type: "string" };
      }

      if (node.children.length) {
        attributes[node.properties.dataName].default = toHtml(node.children)
          .trim()
          .split("\n")
          .map((part) => part.trim())
          .join(" ");
      }
    }
  });

  const blockDefinition = {
    name: `custom/${blockSlug}`,
    title: `${blockSlug.charAt(0).toUpperCase()}${blockSlug.slice(1)}`,
    textdomain: blockSlug,
    $schema: "https://schemas.wp.org/trunk/block.json",
    apiVersion: 3,
    version: "0.1.0",
    category: "theme",
    example: {},
    attributes: {
      align: { type: "string", default: "full" },
      ...attributes,
    },
    supports: { html: false, align: ["full"] },
    editorScript: "file:./index.js",
    render: "file:./render.twig",
  };

  const jsonOutput = await format(JSON.stringify(blockDefinition), {
    parser: "json",
  });

  return jsonOutput;
};

export default printBlockJSON;
