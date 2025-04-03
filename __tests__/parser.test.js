import fs from "fs";
import path from "path";

const generateFiles = () => {
  return {
    jsx: "",
    twig: "",
    json: "",
  };
};

const FIXTURES_DIR = path.join(__dirname, "fixtures");

describe("HTML Parser", () => {
  const testCases = fs.readdirSync(FIXTURES_DIR);

  testCases.forEach((testCase) => {
    test(`should correctly parse ${testCase}`, () => {
      expect(1).toBe(1);

      const caseDir = path.join(FIXTURES_DIR, testCase);
      const inputHTML = fs.readFileSync(
        path.join(caseDir, "input.html"),
        "utf-8",
      );

      const { json, twig, jsx } = generateFiles(inputHTML);

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
});
