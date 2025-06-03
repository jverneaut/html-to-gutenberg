import getDefaultBlockData from "../getDefaultBlockData.js";

/**
 * @class PrinterBase
 *
 * Base class for all printer implementations used in the HTML To Gutenberg pipeline.
 * A printer is responsible for generating the final file output (e.g., `block.json`, `render.php`)
 * from an intermediate HTML string representation or other data.
 *
 * Extend this class to implement a custom printer.
 */
export default class PrinterBase {
  /**
   * @static
   * @type {?string}
   *
   * The output filename this printer is responsible for generating.
   * Must be set by subclasses.
   */
  static filename = null;

  /**
   * @static
   * @type {boolean}
   *
   * Whether this printer requires access to the AST.
   * If `true`, the AST is not passed or processed for this printer.
   */
  static skipAst = false;

  /**
   * @constructor
   * @param {Object} blockData - The block metadata shared across printers and processors.
   *                             Defaults to a new block object via `getDefaultBlockData()`.
   *
   * @throws {Error} If `filename` is not defined on the subclass.
   */
  constructor(blockData = getDefaultBlockData()) {
    if (!this.constructor.filename) {
      throw new Error("Printer must define a static 'filename' property.");
    }

    this.blockData = blockData;
  }

  /**
   * Generates the file content based on the provided HTML string.
   * Override this method in subclasses to customize the output.
   *
   * @param {string} htmlString - The processed HTML string.
   * @returns {string|Promise<string>} The final file content.
   */
  print(htmlString) {
    return htmlString;
  }
}
