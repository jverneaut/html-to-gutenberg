import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { parseRootAttribute, deleteRootAttribute } from "#html-utils/index.js";

/**
 * @class RootAttributeExtractor
 * @extends ProcessorBase
 *
 * A reusable AST processor that:
 * 1. Extracts a specific root-level HTML attribute (e.g., `data-name="value"`)
 * 2. Transforms and stores the extracted value into the shared `blockData` object.
 * 3. Optionally removes the attribute from all ASTs after extraction.
 *
 * Subclasses should define:
 * - `static attributeName`: The HTML attribute to extract from the root node.
 * - `static blockDataName`: The property name to assign the transformed value to in `blockData`.
 */
export default class RootAttributeExtractor extends ProcessorBase {
  /**
   * @static
   * @type {string}
   * The name of the HTML attribute to extract from the root node (e.g., `data-name`).
   * Must be overridden by subclasses.
   */
  static attributeName = "";

  /**
   * @static
   * @type {string}
   * The key under which to store the transformed value in `blockData`.
   * Must be overridden by subclasses.
   */
  static blockDataName = "";

  constructor(blockData, asts) {
    super(blockData, asts);

    if (!this.constructor.attributeName) {
      throw new Error(
        `${this.constructor.name}: static attributeName must be defined.`,
      );
    }

    if (!this.constructor.blockDataName) {
      throw new Error(
        `${this.constructor.name}: static blockDataName must be defined.`,
      );
    }
  }

  /**
   * Processes the AST for a specific printer filename.
   * If the file is associated with `PrinterEditJS`, attempts to extract the root attribute,
   * optionally transform it, and store it in `blockData`.
   *
   * @param {string} printerFilename - The filename of the printer whose AST is being processed.
   */
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      const attributeValue = parseRootAttribute(
        this.asts[printerFilename],
        this.constructor.attributeName,
      );

      if (attributeValue) {
        this.blockData[this.constructor.blockDataName] =
          this.transformAttributeValue(attributeValue);
      }
    }
  }

  /**
   * Removes the target root attribute from all ASTs.
   * This is called after all per-file AST processing is complete.
   */
  processAllAsts() {
    Object.values(this.asts).forEach((ast) => {
      deleteRootAttribute(ast, this.constructor.attributeName);
    });
  }

  /**
   * Optionally transforms the extracted attribute value before storing it in `blockData`.
   * Override in subclasses for custom transformations.
   *
   * @param {string} attributeValue - The raw value of the HTML attribute.
   * @returns {*} The transformed value to be stored in `blockData`.
   */
  transformAttributeValue(attributeValue) {
    return attributeValue;
  }
}
