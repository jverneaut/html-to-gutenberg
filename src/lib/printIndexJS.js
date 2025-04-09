import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { format } from "prettier";
import Mustache from "mustache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatePath = path.join(__dirname, "../templates/index.js.mustache");
const template = fs.readFileSync(templatePath, "utf-8");

const printIndexJS = async (blockData) => {
  const options = {
    hasInnerBlocks: blockData.innerBlocks.hasInnerBlocks,
  };

  const renderedTemplate = Mustache.render(template, options);

  const formatted = await format(renderedTemplate, {
    parser: "babel",
  });

  return formatted;
};

export default printIndexJS;
