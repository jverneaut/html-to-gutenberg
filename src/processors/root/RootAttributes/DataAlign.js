import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataAlign extends RootAttributeExtractor {
  static attributeName = "dataAlign";
  static blockDataName = "_align";

  transformAttributeValue(attributeValue) {
    if (attributeValue.trim() === "false") {
      return [];
    }

    return attributeValue.split(" ").filter((string) => string.trim() !== "");
  }
}
