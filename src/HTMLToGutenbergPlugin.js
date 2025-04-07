import HTMLToGutenberg from "./HTMLToGutenberg.js";
import { OptionsSchema } from "./schemas/HTMLToGutenbergOptions.js";

class HTMLToGutenbergPlugin {
  /**
   * @param {import("zod").infer<typeof OptionsSchema>} options
   */
  constructor(options) {
    this.htmlToGutenberg = new HTMLToGutenberg(options);
  }

  async apply(compiler) {
    this.generateAndWriteFiles();

    compiler.hooks.afterCompile.tap("HTMLToGutenbergPlugin", (compilation) => {
      this.htmlToGutenberg.HTMLFiles.forEach((HTMLFile) => {
        compilation.fileDependencies.add(HTMLFile);
      });

      compilation.contextDependencies.add(this.htmlToGutenberg.inputDirectory);
    });

    compiler.hooks.watchRun.tapPromise(
      "HTMLToGutenbergPlugin",
      async (compiler) => {
        const changedFiles = compiler.modifiedFiles || [];

        if (
          [...changedFiles].some((changeFile) =>
            this.htmlToGutenberg.HTMLFiles.includes(changeFile),
          )
        ) {
          await this.generateAndWriteFiles();
        }
      },
    );
  }

  async generateAndWriteFiles() {
    const generatedFiles = await this.htmlToGutenberg.generateFiles();
    this.htmlToGutenberg.writeFiles(generatedFiles);
  }
}

export default HTMLToGutenbergPlugin;
