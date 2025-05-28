import { globSync } from "glob";
import path from "path";
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

    compiler.hooks.afterCompile.tap("HTMLToGutenbergPlugin", (compiler) => {
      const files = globSync(this.htmlToGutenberg.inputDirectory + "/**/*.*");
      files.forEach((file) => compiler.fileDependencies.add(file));
    });

    compiler.hooks.watchRun.tapPromise(
      "HTMLToGutenbergPlugin",
      async (compiler) => {
        const blocksFolders = this.htmlToGutenberg.HTMLFiles.map((htmlFile) =>
          path.dirname(htmlFile),
        );

        const changedFiles = compiler.modifiedFiles || [];

        if (
          [...changedFiles].some((file) =>
            blocksFolders.includes(path.dirname(file)),
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
