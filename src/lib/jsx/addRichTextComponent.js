import { visit } from "unist-util-visit";
import * as utils from "../common/utils.js";

const addRichTextComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute && node.tagName !== "img") {
      const initialTagName = node.tagName;
      node.tagName = "RichText";

      node.properties.tagName = initialTagName;
      node.properties.value = `{attributes.${node.properties.dataAttribute}}`;
      node.properties.onChange = `{${node.properties.dataAttribute} => setAttributes({ ${node.properties.dataAttribute} })}`;
      node.properties.placeholder = utils.camelCaseToSentenceCase(
        node.properties.dataAttribute,
      );

      delete node.children;
      delete node.properties.dataAttribute;
    }
  });
};

export default addRichTextComponent;
