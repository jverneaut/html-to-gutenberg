import * as glob from "glob";
import path from "path";
import fs from "fs";

import generateAst from "./lib/generateAst.js";

import processTwigAst from "./lib/twig/processTwigAst.js";
import processJsxAst from "./lib/jsx/processJsxAst.js";
import processPHPAst from "./lib/php/processPHPAst.js";

import printTwigAst from "./lib/twig/printTwigAst.js";
import printJsxAst from "./lib/jsx/printJsxAst.js";
import printIndex from "./lib/printIndex.js";
import printBlockJSON from "./lib/printBlockJSON.js";
import printPHPAst from "./lib/php/printPHPAst.js";

class HTMLToGutenbergPlugin {
  /**
   * @param {Object} options - Additional plugin options.
   * @param {string} options.inputDirectory - The directory containing source HTML files.
   * @param {string} options.outputDirectory - The directory where Gutenberg blocks will be generated.
   * @param {string} [options.blocksPrefix="custom"] - The prefix for the generated block names.
   * @param {string} [options.flavor="php"] - The kind of generated render file, either twig or PHP.
   */
  constructor(options = {}) {
    if (!options.inputDirectory) {
      throw new Error("inputDirectory is required");
    }

    this.inputDirectory = options.inputDirectory;
    this.outputDirectory = options.outputDirectory || options.inputDirectory;
    this.blocksPrefix = options.blocksPrefix || "custom";
    this.flavor = options.flavor || "php";
  }

  apply(compiler) {
    this.inputDirectoryPath = path.join(
      compiler.options.context,
      this.inputDirectory,
    );
    this.outputDirectoryPath = path.join(
      compiler.options.context,
      this.outputDirectory,
    );

    this.convertBlocks();

    compiler.hooks.afterCompile.tap("HTMLToGutenbergPlugin", (compilation) => {
      const htmlFiles = this.HTMLFiles;

      htmlFiles.forEach((file) => {
        compilation.fileDependencies.add(file);
      });

      compilation.contextDependencies.add(this.inputDirectoryPath);
    });

    compiler.hooks.watchRun.tapPromise(
      "HTMLToGutenbergPlugin",
      async (comp) => {
        const changedFiles =
          comp.modifiedFiles ||
          (comp.watchFileSystem.watcher &&
            comp.watchFileSystem.watcher.getTimes &&
            Object.keys(comp.watchFileSystem.watcher.getTimes())) ||
          [];

        if (
          [...changedFiles].some((changeFile) =>
            this.HTMLFiles.includes(changeFile),
          )
        ) {
          this.convertBlocks();
        }
      },
    );
  }

  get HTMLFiles() {
    return glob.sync(path.join(this.inputDirectoryPath, "/**/*.html"));
  }

  generateBlockSlug(HTMLFile) {
    const blockSlug = HTMLFile.split("/").reverse()[0].replace(".html", "");
    return blockSlug;
  }

  generateBlockName(HTMLFile) {
    return `${this.blocksPrefix}/${this.generateBlockSlug(HTMLFile)}`;
  }

  generateBlockPath(HTMLFile) {
    return `${this.outputDirectoryPath}/${this.generateBlockSlug(HTMLFile)}`;
  }

  async convertBlocks() {
    try {
      for (const HTMLFile of this.HTMLFiles) {
        const HTMLFileContent = fs.readFileSync(HTMLFile, "utf-8");

        const twigAst = generateAst(HTMLFileContent);
        const jsxAst = generateAst(HTMLFileContent);
        const jsonAst = generateAst(HTMLFileContent);
        const phpAst = await generateAst(HTMLFileContent);
        const phpInitialAst = generateAst(HTMLFileContent);

        processTwigAst(twigAst);
        processJsxAst(jsxAst);
        const processedPHPAst = await processPHPAst(phpAst);

        const outputDirectoryPath = this.generateBlockPath(HTMLFile);
        fs.mkdirSync(outputDirectoryPath, { recursive: true });

        const jsxOutput = await printJsxAst(jsxAst);
        fs.writeFileSync(
          path.join(outputDirectoryPath, "edit.js"),
          jsxOutput,
          "utf-8",
        );

        if (this.flavor === "twig") {
          const twigOutput = await printTwigAst(twigAst);
          fs.writeFileSync(
            path.join(outputDirectoryPath, "render.twig"),
            twigOutput,
            "utf-8",
          );
        }

        if (this.flavor === "php") {
          const phpOutput = await printPHPAst(processedPHPAst, phpInitialAst);
          fs.writeFileSync(
            path.join(outputDirectoryPath, "render.php"),
            phpOutput,
            "utf-8",
          );
        }

        const indexOutput = await printIndex();
        fs.writeFileSync(
          path.join(outputDirectoryPath, "index.js"),
          indexOutput,
          "utf-8",
        );

        const blockName = this.generateBlockName(HTMLFile);
        const blockSlug = this.generateBlockSlug(HTMLFile);

        const blockJsonOutput = await printBlockJSON(
          jsonAst,
          blockName,
          blockSlug,
          this.flavor,
        );

        fs.writeFileSync(
          path.join(outputDirectoryPath, "block.json"),
          blockJsonOutput,
          "utf-8",
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default HTMLToGutenbergPlugin;
