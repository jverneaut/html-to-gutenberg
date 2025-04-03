import { visit } from "unist-util-visit";

const addRichTextComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName && node.tagName !== "img") {
      const initialTagName = node.tagName;
      node.tagName = "RichText";

      node.properties.tagName = initialTagName;
      node.properties.value = `{attributes.${node.properties.dataName}}`;
      node.properties.onChange = `{${node.properties.dataName} => setAttributes({ ${node.properties.dataName} })}`;

      delete node.children;
      delete node.properties.dataName;
    }
  });
};

export default addRichTextComponent;
