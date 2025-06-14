import fs from "fs";
import path, { dirname } from "path";
import * as glob from "glob";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import printers from "#printers/index.js";
import processors from "#processors/index.js";

import HTMLToGutenberg from "../src/HTMLToGutenberg.js";

const PROCESSABLE_FIXTURES_DIR = path.join(__dirname, "fixtures/processable");
const UNPROCESSABLE_FIXTURES_DIR = path.join(
  __dirname,
  "fixtures/unprocessable",
);

const generateFiles = async (htmlFileContent) => {
  const htmlToGutenberg = new HTMLToGutenberg({
    printers,
    processors,
  });

  const generatedFiles = await htmlToGutenberg.printBlockFromHTMLFileContent(
    htmlFileContent,
    {
      name: "custom/input",
      title: "Input",
      textdomain: "input",
    },
  );

  return {
    index: generatedFiles.files["index.js"],
    edit: generatedFiles.files["edit.js"],
    php: generatedFiles.files["render.php"],
    json: generatedFiles.files["block.json"],
  };
};

const generateFilesForDirectory = async (caseDir) => {
  const htmlFile = glob.sync("*.html", { cwd: caseDir, absolute: true })[0];
  const htmlFileContent = fs.readFileSync(htmlFile, "utf-8");

  return generateFiles(htmlFileContent);
};

describe("HTML Parser", () => {
  const processableTestCases = fs.readdirSync(PROCESSABLE_FIXTURES_DIR);
  const unProcessableTestCases = fs.readdirSync(UNPROCESSABLE_FIXTURES_DIR);

  processableTestCases.forEach((testCase) => {
    test(`should correctly parse ${testCase}`, async () => {
      const caseDir = path.join(PROCESSABLE_FIXTURES_DIR, testCase);

      const { json, edit, php, index } =
        await generateFilesForDirectory(caseDir);

      const expectedJSONPath = path.join(caseDir, "expected.json");
      if (fs.existsSync(expectedJSONPath)) {
        const expectedJSON = fs.readFileSync(expectedJSONPath, "utf-8");
        expect(json).toEqual(expectedJSON);
      }

      const expectedJsxPath = path.join(caseDir, "expected.js");
      if (fs.existsSync(expectedJsxPath)) {
        const expectedJsx = fs.readFileSync(expectedJsxPath, "utf-8");
        expect(edit).toEqual(expectedJsx);
      }

      const expectedPHPPath = path.join(caseDir, "expected.php");
      if (fs.existsSync(expectedPHPPath)) {
        const expectedPHP = fs.readFileSync(expectedPHPPath, "utf-8");
        expect(php).toEqual(expectedPHP);
      }

      const expectedIndexPath = path.join(caseDir, "expected.index.js");
      if (fs.existsSync(expectedIndexPath)) {
        const expectedIndex = fs.readFileSync(expectedIndexPath, "utf-8");
        expect(index).toEqual(expectedIndex);
      }
    });
  });

  unProcessableTestCases.forEach((testCase) => {
    test(`should fail to parse ${testCase}`, async () => {
      const htmlFile = path.join(UNPROCESSABLE_FIXTURES_DIR, testCase);
      const htmlFileContent = fs.readFileSync(htmlFile, "utf-8");

      await expect(generateFiles(htmlFileContent)).rejects.toThrow();
    });
  });
});
