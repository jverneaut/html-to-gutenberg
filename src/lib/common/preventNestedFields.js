import { visit } from "unist-util-visit";

const preventNestedFields = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute) {
      const nestedField = node.children?.find(
        (child) => child.properties?.dataAttribute,
      );

      if (nestedField) {
        const errorMessage = `Fields cannot be nested.

Context:
  Parent element: <${node.tagName}> with dataAttribute: ${node.properties.dataAttribute}
  Nested element: <${nestedField.tagName}> with dataAttribute: ${nestedField.properties.dataAttribute}
        `;
        throw new Error(errorMessage);
      }
    }
  });
};

export default preventNestedFields;
