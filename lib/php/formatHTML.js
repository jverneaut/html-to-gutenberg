import { toHtml } from "hast-util-to-html";
import { format } from "prettier";

import generateAst from "../generateAst.js";

const formatHTML = async (ast) => {
  const html = toHtml(ast);
  const formattedHTML = await format(html, { parser: "html" });

  return generateAst(formattedHTML);
};

export default formatHTML;
