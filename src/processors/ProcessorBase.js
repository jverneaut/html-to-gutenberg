import getDefaultBlockData from "../getDefaultBlockData.js";

/**
 * @class ProcessorBase
 *
 * Base class for processors that operate on block data and
 * HTML Abstract Syntax Trees (ASTs).
 *
 * This class supports composition by managing a list of child
 * processors defined by the `processors` getter.
 * It delegates processing calls to these child processors,
 * enabling modular and reusable processing logic.
 */
export default class ProcessorBase {
  /**
   * Creates a ProcessorBase instance.
   *
   * @param {Object} blockData - The block metadata and state shared across processors.
   *                             Defaults to a fresh default block data object.
   * @param {Object<string, any>} asts - A map of filenames to ASTs for processing.
   *                                     Defaults to an empty object.
   */
  constructor(blockData = getDefaultBlockData(), asts = {}) {
    this.blockData = blockData;
    this.asts = asts;

    /**
     * Instances of child processors.
     * Created by mapping the `processors` getter and
     * instantiating each child processor with shared blockData and asts.
     *
     * @type {ProcessorBase[]}
     */
    this.processorsInstances = this.processors.map(
      (Processor) => new Processor(this.blockData, this.asts),
    );
  }

  /**
   * Child processors to be instantiated and delegated to.
   * Override this getter in subclasses to define child processors.
   *
   * @returns {Array<Function>} An array of ProcessorBase subclasses (constructors).
   */
  get processors() {
    return [];
  }

  /**
   * Processes ASTs corresponding to a specific printer filename.
   * Delegates the call to all child processors.
   *
   * @param {string} printerFilename - The filename of the printer whose AST should be processed.
   */
  processAstByFilename(printerFilename) {
    this.processorsInstances.forEach((processorInstance) => {
      processorInstance.processAstByFilename(printerFilename);
    });
  }

  /**
   * Runs global AST processing on all ASTs.
   * Delegates the call to all child processors.
   */
  processAllAsts() {
    this.processorsInstances.forEach((processorInstance) => {
      processorInstance.processAllAsts();
    });
  }

  /**
   * Processes an HTML string corresponding to a specific printer filename.
   * Passes the HTML string through all child processors sequentially.
   *
   * @param {string} printerFilename - The printer filename for context.
   * @param {string} htmlString - The HTML string to process.
   * @returns {string} The processed HTML string after all child processors ran.
   */
  processHTMLStringByFilename(printerFilename, htmlString) {
    const processedHtmlString = this.processorsInstances.reduce(
      (processedHtmlString, processorInstance) =>
        processorInstance.processHTMLStringByFilename(
          printerFilename,
          processedHtmlString,
        ),
      htmlString,
    );

    return processedHtmlString;
  }

  /**
   * Processes an HTML string globally (not tied to any filename).
   * Passes the HTML string through all child processors sequentially.
   *
   * @param {string} htmlString - The HTML string to process.
   * @returns {string} The processed HTML string after all child processors ran.
   */
  processAllHTMLStrings(htmlString) {
    const processedHtmlString = this.processorsInstances.reduce(
      (processedHtmlString, processorInstance) =>
        processorInstance.processAllHTMLStrings(processedHtmlString),
      htmlString,
    );

    return processedHtmlString;
  }
}
