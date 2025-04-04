import { toHtml } from "hast-util-to-html";
import { format } from "prettier";

import removeAttributeWrapper from "../common/removeAttributeWrapper.js";

const replaceEscapedChars = (html) =>
  html.replaceAll("&#x22;", "'").replaceAll("&#x27;", "'");

const printTwigAst = async (ast) => {
  const html = [
    replaceEscapedChars,
    (html) => removeAttributeWrapper(html, "wrapperAttributes"),
  ].reduce((acc, curr) => curr(acc), toHtml(ast, { closeSelfClosing: true }));

  const formatted = await format(html, {
    parser: "twig",
    plugins: ["@zackad/prettier-plugin-twig"],
  });

  return formatted;
};

export default printTwigAst;
