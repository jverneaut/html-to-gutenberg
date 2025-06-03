import getDefaultBlockData from "./getDefaultBlockData.js";

import getASTFromHTMLFile from "./getASTFromHTMLFile.js";
import getHTMLStringFromAST from "./getHTMLStringFromAST.js";

export default class HTMLToGutenberg {
  constructor({
    printers = [],
    processors = [],
    defaultNamespace = "custom",
    defaultCategory = "theme",
    defaultVersion = "0.1.0",
    defaultIcon = null,
  }) {
    this.defaultNamespace = defaultNamespace;
    this.defaultCategory = defaultCategory;
    this.defaultIcon = defaultIcon;
    this.defaultVersion = defaultVersion;

    this.printers = printers;
    this.processors = processors;
  }

  async printBlockFromHTMLFileContent(HTMLFileContent, blockData = {}) {
    // Generate an AST from the HTML file content
    const ast = getASTFromHTMLFile(HTMLFileContent);

    // Create default sealed block metadata (namespace, category, _internals, etc.)
    const defaultBlockData = getDefaultBlockData({
      namespace: this.defaultNamespace,
      category: this.defaultCategory,
      version: this.defaultVersion,
      icon: this.defaultIcon,
      ...blockData,
    });

    const printerInstances = this.printers.map(
      (Printer) => new Printer(defaultBlockData),
    );

    const activePrinterInstances = printerInstances.filter(
      (printerInstance) => !printerInstance.constructor.skipAst,
    );

    // Create a deep copy of the AST for each printer that needs it
    const asts = activePrinterInstances.reduce(
      (asts, printerInstance) => ({
        ...asts,
        [printerInstance.constructor.filename]: structuredClone(ast),
      }),
      {},
    );

    // Instantiate all the processors with the same mutable block data and the individual ASTs
    const processorsInstances = this.processors.map(
      (Processor) => new Processor(defaultBlockData, asts),
    );

    // First, process each ASTs based on the printers filename
    activePrinterInstances.forEach((printerInstance) => {
      processorsInstances.forEach((processor) => {
        processor.processAstByFilename(printerInstance.constructor.filename);
      });
    });

    // Then, run additional global AST processing on them
    processorsInstances.forEach((processor) => {
      processor.processAllAsts();
    });

    // At this stage, no further modification is allowed on the block data
    Object.freeze(defaultBlockData);

    // Generate intermediate HTML representations of the ASTs and apply string processing on them
    const processedHTMLStrings = activePrinterInstances.reduce(
      (processedHTMLStrings, printerInstance) => ({
        ...processedHTMLStrings,
        [printerInstance.constructor.filename]: processorsInstances.reduce(
          (processedHTMLString, processorInstance) =>
            processorInstance.processAllHTMLStrings(
              processorInstance.processHTMLStringByFilename(
                printerInstance.constructor.filename,
                processedHTMLString,
              ),
            ),
          getHTMLStringFromAST(asts[printerInstance.constructor.filename]),
        ),
      }),
      {},
    );

    const printedFiles = {};

    // We generate the final output from the intermediate HTML representations
    for (const printerInstance of printerInstances) {
      const filename = printerInstance.constructor.filename;
      const content = printerInstance.constructor.skipAst
        ? false
        : processedHTMLStrings[filename];

      printedFiles[filename] = await printerInstance.print(content);
    }

    return {
      files: printedFiles,
      dependencies: defaultBlockData._dependencies,
    };
  }
}
