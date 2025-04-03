import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { format } from "prettier";
import Mustache from "mustache";

const template = fs.readFileSync(
  path.join(__dirname, "../templates/index.js.mustache"),
  "utf-8",
);

const printIndex = async () => {
  const renderedTemplate = Mustache.render(template);

  const formattedTemplate = await format(renderedTemplate, { parser: "babel" });
  return formattedTemplate;
};

export default printIndex;
