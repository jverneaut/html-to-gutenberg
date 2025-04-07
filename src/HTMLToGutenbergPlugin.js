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
      compilation.contextDependencies.add(this.htmlToGutenberg.inputDirectory);
    });

    compiler.hooks.watchRun.tapPromise("HTMLToGutenbergPlugin", async () => {
      await this.generateAndWriteFiles();
    });
  }

  async generateAndWriteFiles() {
    const generatedFiles = await this.htmlToGutenberg.generateFiles();
    this.htmlToGutenberg.writeFiles(generatedFiles);
  }
}

export default HTMLToGutenbergPlugin;
