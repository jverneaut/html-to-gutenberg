import { visit } from "unist-util-visit";
import { remove } from "unist-util-remove";
import flatmap from "unist-util-flatmap";

const handleDisplayModes = (ast) => {
  // Remove nodes that are frontend-only
  remove(ast, (node) => {
    return (
      node.properties &&
      node.properties.dataDisplay &&
      node.properties.dataDisplay === "frontend"
    );
  });

  flatmap(ast, (node) => {
    if (
      node.properties &&
      node.properties.dataDisplay &&
      node.properties.dataDisplay === "selected"
    ) {
      return [
        {
          type: "text",
          value: "[IS_SELECTED]",
        },
        node,
        {
          type: "text",
          value: "[/IS_SELECTED]",
        },
      ];
    }

    if (
      node.properties &&
      node.properties.dataDisplay &&
      node.properties.dataDisplay === "not-selected"
    ) {
      return [
        {
          type: "text",
          value: "[IS_NOT_SELECTED]",
        },
        node,
        {
          type: "text",
          value: "[/IS_NOT_SELECTED]",
        },
      ];
    }

    return [node];
  });

  // Delete the dataDisplay property
  visit(ast, "element", (node) => {
    if (node.properties.dataDisplay) {
      delete node.properties.dataDisplay;
    }
  });
};

export default handleDisplayModes;
