import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { parseRawValue } from "#string-utils/index.js";

/**
 * @class CustomElementJSXTransformer
 *
 * Transforms specific custom HTML elements into JSX-compatible elements
 * by updating tag names and mapping attributes.
 *
 * This processor operates only on the AST corresponding to `PrinterEditJS.filename`.
 */
export default class CustomElementJSXTransformer extends ProcessorBase {
  /**
   * @static {string} HTMLTagName
   * The tag name to match in the HTML AST (e.g., 'custom-element').
   */
  static HTMLTagName = "";

  /**
   * @static {string} JSXTagName
   * The JSX tag name to replace the matched HTML tag with (e.g., 'CustomElement').
   */
  static JSXTagName = "";

  /**
   * @static {Array<{ html: string|true, jsx: string|false }>} attributesMapping
   * Defines how to map HTML attributes to JSX props.
   *
   * If `html` is `true`, all unmatched attributes will be collected into a single
   * JSX prop defined by `jsx`.
   * Otherwise, specific attribute names will be renamed from `html` to `jsx`.
   */
  static attributesMapping = [];

  /**
   * Transforms all matching elements in the `PrinterEditJS` AST:
   *
   * - Replaces elements with tag name matching `HTMLTagName` by `JSXTagName`.
   * - Converts or groups attributes based on `attributesMapping`:
   *   - If `html: true` is present in a mapping, collects all *unmapped* attributes
   *     and serializes them as a JSON string into the JSX prop specified by `jsx`.
   *   - If `html` is a string, renames that specific attribute to the corresponding `jsx` key.
   * - Invokes `onMatch(node)` on every transformed element.
   *
   * This method only runs for the AST tied to `PrinterEditJS.filename`.
   *
   * @param {string} filename - The filename of the AST to process.
   */
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        // Only transform nodes with matching HTML tag name
        if (node.tagName === this.constructor.HTMLTagName) {
          // Rename the tag to the target JSX tag name
          node.tagName = this.constructor.JSXTagName;

          // First pass: group unmapped attributes under a JSX prop (html: true case)
          this.constructor.attributesMapping.forEach((attributeMapping) => {
            if (attributeMapping.html === true) {
              const attributeValue = {};

              Object.keys(node.properties).forEach((propertyKey) => {
                if (
                  !this.constructor.attributesMapping
                    .map((attributeMapping) => attributeMapping.html)
                    .includes(propertyKey)
                ) {
                  attributeValue[propertyKey] = parseRawValue(
                    node.properties[propertyKey],
                  );

                  delete node.properties[propertyKey];
                }
              });

              if (attributeMapping.jsx) {
                // Assign grouped properties to the JSX attribute with internal templating syntax
                node.properties[attributeMapping.jsx] =
                  `$\${${JSON.stringify(attributeValue)}}$$`;
              }
            }
          });

          // Second pass: rename specific attributes as defined
          this.constructor.attributesMapping.forEach((attributeMapping) => {
            if (attributeMapping.html !== true) {
              Object.keys(node.properties).forEach((propertyKey) => {
                if (attributeMapping.html === propertyKey) {
                  node.properties[attributeMapping.jsx] =
                    node.properties[attributeMapping.html];

                  delete node.properties[attributeMapping.html];
                }
              });
            }
          });

          this.onMatch(node);
        }
      });
    }
  }

  onMatch(node) {}
}
