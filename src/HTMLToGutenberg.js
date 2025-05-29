import * as glob from "glob";
import path from "path";
import fs from "fs";

import getBlockData from "./lib/common/getBlockData.js";

import printBlockJSON from "./lib/printBlockJSON.js";
import printIndexJS from "./lib/printIndexJS.js";
import printEditJS from "./lib/printEditJS.js";
import printRenderPHP from "./lib/printRenderPHP.js";

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
        const HTMLFileContent = fs.readFileSync(HTMLFile, "utf-8");

        const blockData = await getBlockData(HTMLFileContent, {
          blockName: this.generateBlockName(HTMLFile),
          blockSlug: this.generateBlockSlug(HTMLFile),
          blockTitle: this.generateBlockTitle(HTMLFile),

          defaultCategory: this.defaultCategory,
          defaultIcon: this.defaultIcon,
          defaultVersion: this.defaultVersion,
        });

        const [indexJS, editJS, blockJSON, renderPHP] = await Promise.all([
          printIndexJS(blockData),
          printEditJS(blockData),
          printBlockJSON(blockData),
          printRenderPHP(blockData),
        ]);

        const blockPath = this.generateBlockPath(HTMLFile);

        generatedFiles.push({
          filename: "index.js",
          content: indexJS,
          blockPath,
        });

        generatedFiles.push({
          filename: "edit.js",
          content: editJS,
          blockPath,
        });

        generatedFiles.push({
          filename: "block.json",
          content: blockJSON,
          blockPath,
        });

        generatedFiles.push({
          filename: "render.php",
          content: renderPHP,
          blockPath,
        });
      }
    } catch (err) {
      throw new Error(err);
    }

    return generatedFiles;
  }

  async getFilesOverrides() {
    const overrides = [];

    const htmlFiles = this.HTMLFiles.map((htmlPath) => ({
      fullPath: path.resolve(htmlPath),
      baseName: path.basename(htmlPath, ".html"),
      dir: path.dirname(htmlPath),
    }));

    const htmlFilesMap = new Map();
    for (const { baseName, dir } of htmlFiles) {
      htmlFilesMap.set(path.join(dir, baseName), true);
    }

    const allFiles = glob.sync(path.join(this.inputDirectory, "/**/*"));

    for (const file of allFiles) {
      const resolved = path.resolve(file);

      if (resolved.endsWith(".html")) continue;

      const filename = path.basename(file);
      const dirname = path.dirname(file);

      const match = filename.match(/^(.+?)\.(.+?)\.(.+)$/);
      if (!match) continue;

      const [_, blockSlug, innerName, ext] = match;
      const htmlFileKey = path.join(dirname, blockSlug);

      if (!htmlFilesMap.has(htmlFileKey)) continue;

      const blockPath = path.join(this.outputDirectory, blockSlug);
      const content = fs.readFileSync(resolved, "utf-8");

      overrides.push({
        filename: `${innerName}.${ext}`,
        content,
        blockPath,
      });
    }

    return overrides;
  }

  createDirectoryIfNotExists(directoryPath) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } catch {}
  }

  cleanDirectory(directoryPath) {
    const filesInDirectory = fs.readdirSync(directoryPath);

    for (const file of filesInDirectory) {
      if (!["block.json", "edit.js", "index.js", "render.php"].includes(file)) {
        fs.unlinkSync(path.join(directoryPath, file), (err) => {
          if (err) throw err;
        });
      }
    }
  }

  cleanOutputAndWriteFiles(files) {
    const blockPaths = new Set(files.map((file) => file.blockPath));

    blockPaths.forEach((blockPath) => {
      this.createDirectoryIfNotExists(blockPath);
      this.cleanDirectory(blockPath);
    });

    files.forEach((file) => {
      const { blockPath, filename, content } = file;
      fs.writeFileSync(path.join(blockPath, filename), content, "utf-8");
    });
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
