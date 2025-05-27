import * as glob from "glob";
import path from "path";
import fs from "fs";

import getBlockData from "./lib/common/getBlockData.js";

import printBlockJSON from "./lib/printBlockJSON.js";
import printIndexJS from "./lib/printIndexJS.js";
import printEditJS from "./lib/printEditJS.js";
import printRenderPHP from "./lib/printRenderPHP.js";
import printRenderTwig from "./lib/printRenderTwig.js";

import { OptionsSchema } from "./schemas/HTMLToGutenbergOptions.js";

/** @typedef {import("./schemas/HTMLToGutenbergOptions.js").HTMLToGutenbergOptions} HTMLToGutenbergOptions */

class HTMLToGutenberg {
  /**
   * @param {HTMLToGutenbergOptions} options
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

    this.engine = result.data.engine;
    this.shouldRemoveDeletedBlocks = result.data.removeDeletedBlocks;

    this.defaultNamespace = result.data.defaultNamespace;
    this.defaultCategory = result.data.defaultCategory;
    this.defaultIcon = result.data.defaultIcon;
    this.defaultVersion = result.data.defaultVersion;
  }

  get HTMLFiles() {
    return glob.sync(path.join(this.inputDirectory, "/**/*.html"));
  }

  generateBlockSlug(HTMLFile) {
    const blockSlug = HTMLFile.split("/").reverse()[0].replace(".html", "");
    return blockSlug;
  }

  generateBlockName(HTMLFile) {
    return `${this.defaultNamespace}/${this.generateBlockSlug(HTMLFile)}`;
  }

  generateBlockPath(HTMLFile) {
    return path.join(this.outputDirectory, this.generateBlockSlug(HTMLFile));
  }

  generateBlockTitle(HTMLFile) {
    const slug = this.generateBlockSlug(HTMLFile);
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async generateFiles() {
    const generatedFiles = [];

    try {
      for (const HTMLFile of this.HTMLFiles) {
        const files = [];

        const HTMLFileContent = fs.readFileSync(HTMLFile, "utf-8");

        const blockData = await getBlockData(HTMLFileContent, {
          blockName: this.generateBlockName(HTMLFile),
          blockSlug: this.generateBlockSlug(HTMLFile),
          blockTitle: this.generateBlockTitle(HTMLFile),
          blockEngine: this.engine,

          defaultCategory: this.defaultCategory,
          defaultIcon: this.defaultIcon,
          defaultVersion: this.defaultVersion,
        });

        const [indexJS, editJS, blockJSON, renderPHP, renderTwig] =
          await Promise.all([
            printIndexJS(blockData),
            printEditJS(blockData),
            printBlockJSON(blockData),
            printRenderPHP(blockData),
            printRenderTwig(blockData),
          ]);

        files.push({ type: "index", content: indexJS });
        files.push({ type: "edit", content: editJS });
        files.push({ type: "json", content: blockJSON });

        if (["all", "php"].includes(this.engine)) {
          files.push({ type: "php", content: renderPHP });
        }

        if (["all", "twig"].includes(this.engine)) {
          files.push({ type: "twig", content: renderTwig });
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

          case "edit":
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

  removeDeletedBlocks() {
    const blocks = glob.sync(path.join(this.outputDirectory, "/**/block.json"));
    const blockPaths = blocks.map((block) => path.dirname(block));

    const HTMLFiles = this.HTMLFiles;
    const HTMLFilesBlockPaths = HTMLFiles.map((HTMLFile) =>
      this.generateBlockPath(HTMLFile),
    );

    for (const blockPath of blockPaths) {
      if (!HTMLFilesBlockPaths.includes(blockPath)) {
        if (fs.existsSync(blockPath)) {
          fs.rmSync(blockPath, { recursive: true, force: true });
        }
      }
    }
  }
}

export default HTMLToGutenberg;
