import * as glob from "glob";
import path from "path";
import fs from "fs";

import generateAst from "../lib/generateAst.js";

import processTwigAst from "../lib/twig/processTwigAst.js";
import processJsxAst from "../lib/jsx/processJsxAst.js";
import processPHPAst from "../lib/php/processPHPAst.js";

import printTwigAst from "../lib/twig/printTwigAst.js";
import printJsxAst from "../lib/jsx/printJsxAst.js";
import printIndex from "../lib/printIndex.js";
import printBlockJSON from "../lib/printBlockJSON.js";
import printPHPAst from "../lib/php/printPHPAst.js";

import { OptionsSchema } from "./schemas/HTMLToGutenbergOptions.js";

class HTMLToGutenberg {
  /**
   * @param {import("zod").infer<typeof OptionsSchema>} options
   */
  constructor(options) {
    const result = OptionsSchema.safeParse(options);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.length ? issue.path.join(".") : "(options)";
        throw new Error(`• ${path}: ${issue.message}`);
      }

      throw new Error("Invalid HTMLToGutenberg options");
    }

    this.inputDirectory = result.data.inputDirectory;
    this.outputDirectory =
      result.data.outputDirectory || result.data.inputDirectory;
    this.blocksPrefix = result.data.blocksPrefix;
    this.engine = result.data.engine;
  }

  get HTMLFiles() {
    return glob.sync(path.join(this.inputDirectory, "/**/*.html"));
  }

  generateBlockSlug(HTMLFile) {
    const blockSlug = HTMLFile.split("/").reverse()[0].replace(".html", "");
    return blockSlug;
  }

  generateBlockName(HTMLFile) {
    return `${this.blocksPrefix}/${this.generateBlockSlug(HTMLFile)}`;
  }

  generateBlockPath(HTMLFile) {
    return path.join(this.outputDirectory, this.generateBlockSlug(HTMLFile));
  }

  async generateFiles() {
    const generatedFiles = [];

    try {
      for (const HTMLFile of this.HTMLFiles) {
        const files = [];

        const HTMLFileContent = fs.readFileSync(HTMLFile, "utf-8");

        // Generate index.js file
        const indexFileContent = await printIndex();
        files.push({
          type: "index",
          content: indexFileContent,
        });

        // Generate edit.js file
        const jsxAst = generateAst(HTMLFileContent);
        processJsxAst(jsxAst);

        const jsxFileContent = await printJsxAst(jsxAst);
        files.push({
          type: "jsx",
          content: jsxFileContent,
        });

        // Generate block.json file
        const jsonAst = generateAst(HTMLFileContent);

        const blockName = this.generateBlockName(HTMLFile);
        const blockSlug = this.generateBlockSlug(HTMLFile);

        const blockJsonFileCotent = await printBlockJSON(
          jsonAst,
          blockName,
          blockSlug,
          this.engine,
        );

        files.push({
          type: "json",
          content: blockJsonFileCotent,
        });

        if (["php", "all"].includes(this.engine)) {
          // Generate render.php file
          const phpAst = await generateAst(HTMLFileContent);
          const phpInitialAst = generateAst(HTMLFileContent);

          const processedPHPAst = await processPHPAst(phpAst);
          const phpFileContent = await printPHPAst(
            processedPHPAst,
            phpInitialAst,
          );

          files.push({
            type: "php",
            content: phpFileContent,
          });
        }

        if (["twig", "all"].includes(this.engine)) {
          // Generate render.twig file
          const twigAst = generateAst(HTMLFileContent);
          processTwigAst(twigAst);

          const twigFileContent = await printTwigAst(twigAst);
          files.push({
            type: "twig",
            content: twigFileContent,
          });
        }

        generatedFiles.push({
          source: HTMLFile,
          files,
        });
      }
    } catch (err) {
      throw new Error(err);
    }

    return generatedFiles;
  }

  createDirectoryIfNotExists(directoryPath) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } catch {}
  }

  writeFiles(generatedFiles) {
    const generatedBlocksPaths = [];

    generatedFiles.forEach((generatedFile) => {
      const blockPath = this.generateBlockPath(generatedFile.source);
      this.createDirectoryIfNotExists(blockPath);

      generatedBlocksPaths.push(blockPath);

      generatedFile.files.forEach(({ type, content }) => {
        switch (type) {
          case "index":
            fs.writeFileSync(
              path.join(blockPath, "index.js"),
              content,
              "utf-8",
            );
            break;

          case "jsx":
            fs.writeFileSync(path.join(blockPath, "edit.js"), content, "utf-8");
            break;

          case "json":
            fs.writeFileSync(
              path.join(blockPath, "block.json"),
              content,
              "utf-8",
            );
            break;

          case "php":
            fs.writeFileSync(
              path.join(blockPath, "render.php"),
              content,
              "utf-8",
            );
            break;

          case "twig":
            fs.writeFileSync(
              path.join(blockPath, "render.twig"),
              content,
              "utf-8",
            );
            break;
        }
      });
    });

    return generatedBlocksPaths;
  }
}

export default HTMLToGutenberg;
