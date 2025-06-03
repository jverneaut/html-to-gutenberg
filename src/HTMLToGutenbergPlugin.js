import path from "path";

import HTMLToGutenbergProcessor from "./HTMLToGutenbergProcessor.js";

export default class HtmlToGutenbergPlugin {
  constructor({
    inputDirectory,
    outputDirectory,

    defaultNamespace = "custom",
    defaultCategory = "theme",
    defaultVersion = "0.1.0",
    defaultIcon = null,
  }) {
    this.inputDirectory = inputDirectory;

    this.htmlToGutenbergProcessor = new HTMLToGutenbergProcessor({
      inputDirectory,
      outputDirectory,

      defaultNamespace,
      defaultCategory,
      defaultVersion,
      defaultIcon,
    });
  }

  async apply(compiler) {
    compiler.hooks.beforeRun.tapPromise(this.constructor.name, async () => {
      await this.htmlToGutenbergProcessor.processBlocks(compiler.context);
    });

    compiler.hooks.watchRun.tapPromise(
      this.constructor.name,
      async (compilation) => {
        const changedFiles = [
          ...(compilation.modifiedFiles || []),
          ...(compilation.removedFiles || []),
        ];

        const inputDirectory = path.join(
          compilation.context,
          this.inputDirectory,
        );

        if (
          changedFiles.length === 0 ||
          [...changedFiles].some(
            (changedFile) => changedFile.indexOf(inputDirectory) === 0,
          )
        ) {
          await this.htmlToGutenbergProcessor.processBlocks(compiler.context);
        }
      },
    );

    compiler.hooks.afterCompile.tapPromise(
      this.constructor.name,
      async (compilation) => {
        const blocksDefinition =
          await this.htmlToGutenbergProcessor.getBlocksDefinition();

        compilation.contextDependencies.add(
          path.join(compiler.context, this.inputDirectory),
        );

        blocksDefinition.forEach((blockDefinition) => {
          compilation.fileDependencies.add(blockDefinition.htmlFile);

          blockDefinition.overrides.forEach((override) => {
            compilation.fileDependencies.add(override.file);
          });
        });
      },
    );
  }
}
