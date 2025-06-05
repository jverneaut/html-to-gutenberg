import fs from "fs-extra";
import path from "path";
import fastGlob from "fast-glob";

import HTMLToGutenberg from "./HTMLToGutenberg.js";

import processors from "#processors/index.js";
import printers from "#printers/index.js";

export default class HTMLToGutenbergProcessor {
  constructor({
    inputDirectory,
    outputDirectory,

    defaultNamespace = "custom",
    defaultCategory = "theme",
    defaultVersion = "0.1.0",
    defaultIcon = null,
  }) {
    this.inputDirectory = inputDirectory;
    this.outputDirectory = outputDirectory;

    this.defaultNamespace = defaultNamespace;

    this.htmlToGutenberg = new HTMLToGutenberg({
      printers,
      processors,

      defaultNamespace,
      defaultCategory,
      defaultVersion,
      defaultIcon,
    });
  }

  async processBlocks(context, changedFiles = []) {
    if (!changedFiles.length) {
      fs.rmSync(path.join(context, this.outputDirectory), {
        recursive: true,
        force: true,
      });
    }

    const blocksDefinition = await this.getBlocksDefinition(changedFiles);

    for (const blockDefinition of blocksDefinition) {
      await this.processBlock(blockDefinition);
    }
  }

  async processBlock({ blockName, htmlFile, overrides }) {
    const htmlContent = await fs.readFile(htmlFile, "utf-8");

    const result = await this.htmlToGutenberg.printBlockFromHTMLFileContent(
      htmlContent,
      {
        name: `${this.defaultNamespace}/${blockName}`,
        textdomain: blockName,
        title: blockName
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      },
    );

    const targetDir = path.join(this.outputDirectory, blockName);

    await fs.ensureDir(targetDir);

    for (const [filename, content] of Object.entries(result.files)) {
      const outPath = path.join(targetDir, filename);
      await fs.outputFile(outPath, content);
    }

    for (const { name, file } of overrides) {
      const outputPath = path.join(targetDir, name);
      await fs.copyFile(file, outputPath);
    }
  }

  async getBlocksDefinition(changedFiles = []) {
    const blocksDefinition = [];

    const htmlFiles = await fastGlob(["**/*.html"], {
      cwd: this.inputDirectory,
      absolute: true,
    });

    const htmlFilesToProcess = changedFiles.length
      ? htmlFiles.filter((htmlFile) =>
          changedFiles.some(
            (changedFile) =>
              path.basename(changedFile) === path.basename(htmlFile),
          ),
        )
      : htmlFiles;

    for (const htmlFile of htmlFilesToProcess) {
      const dirname = path.dirname(htmlFile);
      const baseFolder = path.basename(dirname);
      const baseName = path.basename(htmlFile, ".html");

      const isFolderBlock = baseName === "index";
      const blockName = isFolderBlock ? baseFolder : baseName;

      const overridesFiles = await fastGlob(
        [`${isFolderBlock ? "*.!(html)" : `${baseName}.*.!(.html)`}`],
        {
          cwd: dirname,
          absolute: true,
        },
      );

      const overrides = overridesFiles.map((file) => ({
        name: isFolderBlock
          ? path.basename(file)
          : file.split(".").slice(1).join("."),
        file,
      }));

      blocksDefinition.push({
        dirname,
        isFolderBlock,
        blockName,
        htmlFile: htmlFile,
        overrides,
      });
    }

    return blocksDefinition;
  }
}
