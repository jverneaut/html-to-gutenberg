import { visit } from "unist-util-visit";

const preventNestedFields = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName) {
      const nestedField = node.children?.find(
        (child) => child.properties?.dataName,
      );

      if (nestedField) {
        const errorMessage = `Fields cannot be nested.

Context:
  Parent element: <${node.tagName}> with dataName: ${node.properties.dataName}
  Nested element: <${nestedField.tagName}> with dataName: ${nestedField.properties.dataName}
        `;
        throw new Error(errorMessage);
      }
    }
  });
};

export default preventNestedFields;
