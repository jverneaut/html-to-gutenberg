import fs from "fs";
import HTMLToGutenberg from "./HTMLToGutenberg.js";

/** @typedef {import("./schemas/HTMLToGutenbergOptions.js").HTMLToGutenbergOptions} HTMLToGutenbergOptions */

class HTMLToGutenbergPlugin {
  /**
   * @param {HTMLToGutenbergOptions} options
   */
  constructor(options) {
    this.htmlToGutenberg = new HTMLToGutenberg(options);
  }

  async apply(compiler) {
    this.generateAndWriteFiles();

    // Add explicit dependencies to the input directory and HTML files
    compiler.hooks.afterCompile.tap("HTMLToGutenbergPlugin", (compilation) => {
      this.htmlToGutenberg.HTMLFiles.forEach((HTMLFile) => {
        compilation.fileDependencies.add(HTMLFile);
      });

      compilation.contextDependencies.add(this.htmlToGutenberg.inputDirectory);
    });

    // Trigger generateAndWriteFiles on file changes in watch mode
    compiler.hooks.watchRun.tapPromise(
      "HTMLToGutenbergPlugin",
      async (compiler) => {
        const changedFiles = compiler.modifiedFiles || [];

        if (
          [...changedFiles].some((changedFile) =>
            this.htmlToGutenberg.HTMLFiles.includes(changedFile),
          )
        ) {
          await this.generateAndWriteFiles();
        }
      },
    );

    // Trigger maybeRemoveDeletedBlocks on every watch run
    compiler.hooks.watchRun.tapPromise("HTMLToGutenbergPlugin", async () => {
      this.maybeRemoveDeletedBlocks();
    });
  }

  maybeRemoveDeletedBlocks() {
    if (this.htmlToGutenberg.shouldRemoveDeletedBlocks) {
      this.htmlToGutenberg.removeDeletedBlocks();
    }
  }

  async generateAndWriteFiles() {
    const generatedFiles = await this.htmlToGutenberg.generateFiles();
    const filesOverrides = await this.htmlToGutenberg.getFilesOverrides();

    this.htmlToGutenberg.cleanOutputAndWriteFiles([
      ...generatedFiles,
      ...filesOverrides,
    ]);
  }
}

export default HTMLToGutenbergPlugin;
