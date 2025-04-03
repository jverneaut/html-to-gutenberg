import * as glob from "glob";
import path from "path";
import fs from "fs";

import generateAst from "./lib/generateAst.js";

import processTwigAst from "./lib/twig/processTwigAst.js";
import processJsxAst from "./lib/jsx/processJsxAst.js";

import printTwigAst from "./lib/twig/printTwigAst.js";
import printJsxAst from "./lib/jsx/printJsxAst.js";
import printIndex from "./lib/printIndex.js";
import printBlockJSON from "./lib/printBlockJSON.js";

class HTMLToGutenbergPlugin {
  constructor(inputDirectory, outputDirectory) {
    this.inputDirectory = inputDirectory;
    this.outputDirectory = outputDirectory;
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
    return `custom/${this.generateBlockSlug(HTMLFile)}`;
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

        processTwigAst(twigAst);
        processJsxAst(jsxAst);

        const outputDirectoryPath = this.generateBlockPath(HTMLFile);
        fs.mkdirSync(outputDirectoryPath, { recursive: true });

        const jsxOutput = await printJsxAst(jsxAst);
        fs.writeFileSync(
          path.join(outputDirectoryPath, "edit.js"),
          jsxOutput,
          "utf-8",
        );

        const twigOutput = await printTwigAst(twigAst);
        fs.writeFileSync(
          path.join(outputDirectoryPath, "render.twig"),
          twigOutput,
          "utf-8",
        );

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
