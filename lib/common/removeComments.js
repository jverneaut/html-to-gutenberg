import { remove } from "unist-util-remove";

const removeComments = (ast) => {
  remove(ast, "comment");
};

export default removeComments;
