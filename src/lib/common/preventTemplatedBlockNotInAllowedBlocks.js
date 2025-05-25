import { visit } from "unist-util-visit";

const preventTemplatedBlockNotInAllowedBlocks = (ast) => {
  visit(ast, "element", (node) => {
    if (
      node.properties.allowedBlocks !== undefined &&
      node.properties.allowedBlocks !== "all"
    ) {
      const allowedBlocks = [
        ...new Set(
          node.properties.allowedBlocks.split(" ").map((block) => block.trim()),
        ),
      ];

      const childBlocks = node.children.filter((el) => el.tagName === "block");

      childBlocks.forEach((childBlock) => {
        if (!allowedBlocks.includes(childBlock.properties.name)) {
          const errorMessage = `Templated block not in allowedBlocks.

Context:
  Templated block: <${childBlock.properties.name}>
  allowedBlocks: [<${allowedBlocks.map((el) => `"${el}"`).join(", ")}]`;
          throw new Error(errorMessage);
        }
      });
    }
  });
};

export default preventTemplatedBlockNotInAllowedBlocks;
