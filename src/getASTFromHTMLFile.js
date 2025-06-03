import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";
import { source } from "unist-util-source";

export default (HTMLFile) => {
  const ast = unified()
    .use(rehypeParse, { fragment: true, verbose: true })
    .parse(HTMLFile);

  // Remove all comments
  remove(ast, "comment");

  // Attempt to restore original attribute casing from source
  visit(ast, "element", (node) => {
    if (!node.properties || !node.data?.position?.properties) return;

    const originalAttributes = node.data.position.properties;
    const updatedProperties = {};

    for (const [key, value] of Object.entries(node.properties)) {
      const original = source(HTMLFile, originalAttributes[key]);

      if (!original) {
        updatedProperties[key] = value;
        continue;
      }

      const [rawAttrName] = original.split("=");
      const isSameAttrLowercase =
        rawAttrName && rawAttrName.toLowerCase() === key && rawAttrName !== key;

      if (isSameAttrLowercase) {
        updatedProperties[rawAttrName] = value;
      } else {
        updatedProperties[key] = value;
      }
    }

    node.properties = updatedProperties;
  });

  return ast;
};
