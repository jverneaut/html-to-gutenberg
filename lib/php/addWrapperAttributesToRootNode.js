import { visit } from "unist-util-visit";

import extractRootElementClassName from "../common/extractRootElementClassName.js";

const addWrapperAttributesToRootNode = (ast) => {
  const rootElementClassName = extractRootElementClassName(ast);

  visit(ast, "root", (node) => {
    if (node.type === "root") {
      const childrenElements = node.children.filter(
        (el) => el.type === "element",
      );

      if (childrenElements.length) {
        const rootElement = childrenElements[0];

        const wrapperAttributesString = `<?php echo get_block_wrapper_attributes(['class' => 'container']); ?>`;
        rootElement.properties.wrapperAttributes = wrapperAttributesString;
      }
    }
  });
};

export default addWrapperAttributesToRootNode;
