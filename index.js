import generateAst from "./lib/generateAst.js";

import processTwigAst from "./lib/twig/processTwigAst.js";
import processJsxAst from "./lib/jsx/processJsxAst.js";

import printTwigAst from "./lib/twig/printTwigAst.js";
import printJsxAst from "./lib/jsx/printJsxAst.js";

const input =
  "<section><h1 class='text-h2' data-test='test' data-name='title'>Hello, World!</h1><img data-name='image'></section>";

const twigAst = generateAst(input);
const jsxAst = generateAst(input);

processTwigAst(twigAst);
processJsxAst(jsxAst);

(async () => {
  const twigOutput = await printTwigAst(twigAst);
  const jsxOutput = await printJsxAst(jsxAst);

  console.log({ twigOutput, jsxOutput });
})();
