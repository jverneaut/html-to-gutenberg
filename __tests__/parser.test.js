import fs from "fs";
import path, { dirname } from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import generateAst from "../lib/generateAst";

import processTwigAst from "../lib/twig/processTwigAst";
import processJsxAst from "../lib/jsx/processJsxAst";

import printTwigAst from "../lib/twig/printTwigAst.js";
import printJsxAst from "../lib/jsx/printJsxAst.js";

const generateFiles = async (input) => {
  const twigAst = generateAst(input);
  const jsxAst = generateAst(input);

  processTwigAst(twigAst);
  processJsxAst(jsxAst);

  const twigOutput = await printTwigAst(twigAst);
  const jsxOutput = await printJsxAst(jsxAst);

  return {
    jsx: jsxOutput,
    twig: twigOutput,
    json: "",
  };
};

const PROCESSABLE_FIXTURES_DIR = path.join(__dirname, "fixtures/processable");
const UNPROCESSABLE_FIXTURES_DIR = path.join(
  __dirname,
  "fixtures/unprocessable",
);

describe("HTML Parser", () => {
  const processableTestCases = fs.readdirSync(PROCESSABLE_FIXTURES_DIR);
  const unProcessableTestCases = fs.readdirSync(UNPROCESSABLE_FIXTURES_DIR);

  processableTestCases.forEach((testCase) => {
    test(`should correctly parse ${testCase}`, async () => {
      expect(1).toBe(1);

      const caseDir = path.join(PROCESSABLE_FIXTURES_DIR, testCase);
      const inputHTML = fs.readFileSync(
        path.join(caseDir, "input.html"),
        "utf-8",
      );

      const { json, twig, jsx } = await generateFiles(inputHTML);

      const expectedJSONPath = path.join(caseDir, "expected.json");
      if (fs.existsSync(expectedJSONPath)) {
        const expectedJSON = fs.readFileSync(expectedJSONPath, "utf-8");
        expect(json).toEqual(expectedJSON);
      }

      const expectedTwigPath = path.join(caseDir, "expected.twig");
      if (fs.existsSync(expectedTwigPath)) {
        const expectedTwig = fs.readFileSync(expectedTwigPath, "utf-8");
        expect(twig).toEqual(expectedTwig);
      }

      const expectedJsxPath = path.join(caseDir, "expected.js");
      if (fs.existsSync(expectedJsxPath)) {
        const expectedJsx = fs.readFileSync(expectedJsxPath, "utf-8");
        expect(jsx).toEqual(expectedJsx);
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
