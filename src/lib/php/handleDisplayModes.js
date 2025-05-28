import { visit } from "unist-util-visit";
import { remove } from "unist-util-remove";

const addTextLookup = (ast) => {
  // Remove nodes that are editor-only
  remove(ast, (node) => {
    return (
      node.properties &&
      node.properties.dataDisplay &&
      ["editor", "selected", "not-selected"].includes(
        node.properties.dataDisplay,
      )
    );
  });

  // Delete the dataDisplay property
  visit(ast, "element", (node) => {
    if (node.properties.dataDisplay) {
      delete node.properties.dataDisplay;
    }
  });
};

export default addTextLookup;
