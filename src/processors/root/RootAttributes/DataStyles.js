import RootAttributeExtractor from "./RootAttributeExtractor.js";

import { kebabCaseToTitleCase } from "#string-utils/index.js";

export default class DataStyles extends RootAttributeExtractor {
  static attributeName = "dataStyles";
  static blockDataName = "styles";

  transformAttributeValue(attributeValue) {
    return attributeValue
      .split(" ")
      .filter((string) => string.trim() !== "")
      .map((style, index) => ({
        name: style,
        label: kebabCaseToTitleCase(style),
        ...(index === 0 && { isDefault: true }),
      }));
  }
}
