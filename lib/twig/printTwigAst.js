import { toHtml } from "hast-util-to-html";
import { format } from "prettier";

const stripWrapperAttributesTag = (html) =>
  html.replace(
    /wrapperAttributes="(\{\{\s*wrapper_attributes\((?:[^(){}]|\{[^{}]*\})*\)\s*\}\})"/g,
    "$1",
  );

const replaceEscapedChars = (html) =>
  html.replaceAll("&#x22;", "'").replaceAll("&#x27;", "'");

const printTwigAst = async (ast) => {
  const html = [replaceEscapedChars, stripWrapperAttributesTag].reduce(
    (acc, curr) => curr(acc),
    toHtml(ast, { closeSelfClosing: true }),
  );

  const formatted = await format(html, {
    parser: "twig",
    plugins: ["@zackad/prettier-plugin-twig"],
  });

  return formatted;
};

export default printTwigAst;
