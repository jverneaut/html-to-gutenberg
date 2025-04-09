import { visit } from "unist-util-visit";

const preventSpecialCharacters = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute) {
      if (/[\s\-]/.test(node.properties.dataAttribute)) {
        const errorMessage = `"data-attribute" attributes should not contain whitespace or dashes (-).

Context:
  Element: <${node.tagName}> with data-attribute: ${node.properties.dataAttribute}
        `;
        throw new Error(errorMessage);
      }
    }
  });
};

export default preventSpecialCharacters;
