import { toHtml } from "hast-util-to-html";
import he from "he";

export default (ast) => {
  // "he" decodes escaped characters
  return he.decode(toHtml(ast, { closeSelfClosing: true }));
};
