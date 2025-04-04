import { visit } from "unist-util-visit";

const preventDuplicateInnerBlocks = (ast) => {
  let numberOfInnerBlocks = 0;

  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      numberOfInnerBlocks++;
    }
  });

  if (numberOfInnerBlocks > 1) {
    const errorMessage = "Blocks cannot have multiple InnerBlocks components";
    throw new Error(errorMessage);
  }
};

export default preventDuplicateInnerBlocks;
