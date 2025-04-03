import { visit } from "unist-util-visit";

const preventSpecialCharacters = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName) {
      if (/[\s\-]/.test(node.properties.dataName)) {
        const errorMessage = `"data-name" attributes should not contain whitespace or dashes (-).

Context:
  Element: <${node.tagName}> with dataName: ${node.properties.dataName}
        `;
        throw new Error(errorMessage);
      }
    }
  });
};

export default preventSpecialCharacters;
