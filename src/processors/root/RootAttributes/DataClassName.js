import RootAttributeExtractor from "./RootAttributeExtractor.js";

import { parseAttributeExpression } from "#utils-string/index.js";

export default class DataClassName extends RootAttributeExtractor {
  static attributeName = "className";
  static blockDataName = "_className";

  transformAttributeValue(attributeValue) {
    const attributeExpression = parseAttributeExpression(
      attributeValue.join(" "),
      this,
    );

    return attributeExpression;
  }
}
