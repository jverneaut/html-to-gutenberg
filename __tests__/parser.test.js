import fs from "fs";
import path, { dirname } from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import HTMLToGutenberg from "../src/HTMLToGutenberg.js";

const PROCESSABLE_FIXTURES_DIR = path.join(__dirname, "fixtures/processable");
const UNPROCESSABLE_FIXTURES_DIR = path.join(
  __dirname,
  "fixtures/unprocessable",
);

const getGenerateFileByType = (generateFiles, type) =>
  generateFiles[0].files.filter((file) => file.type === type)[0].content;

const generateFiles = async (caseDir) => {
  const htmlToGutenberg = new HTMLToGutenberg({
    inputDirectory: caseDir,
    engine: "all",
  });

  const generatedFiles = await htmlToGutenberg.generateFiles();

  return {
    index: getGenerateFileByType(generatedFiles, "index"),
    edit: getGenerateFileByType(generatedFiles, "edit"),
    php: getGenerateFileByType(generatedFiles, "php"),
    json: getGenerateFileByType(generatedFiles, "json"),
    twig: getGenerateFileByType(generatedFiles, "twig"),
  };
};

describe("HTML Parser", () => {
  const processableTestCases = fs.readdirSync(PROCESSABLE_FIXTURES_DIR);
  const unProcessableTestCases = fs.readdirSync(UNPROCESSABLE_FIXTURES_DIR);

  processableTestCases.forEach((testCase) => {
    test(`should correctly parse ${testCase}`, async () => {
      const caseDir = path.join(PROCESSABLE_FIXTURES_DIR, testCase);

      const { json, twig, edit, php, index } = await generateFiles(caseDir);

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

      const expectedTwigPath = path.join(caseDir, "expected.twig");
      if (fs.existsSync(expectedTwigPath)) {
        const expectedTwig = fs.readFileSync(expectedTwigPath, "utf-8");
        expect(twig).toEqual(expectedTwig);
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
      const inputHTML = fs.readFileSync(
        path.join(UNPROCESSABLE_FIXTURES_DIR, testCase),
        "utf-8",
      );

      await expect(generateFiles(inputHTML)).rejects.toThrow();
    });
  });
});
