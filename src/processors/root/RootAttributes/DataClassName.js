import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataClassName extends RootAttributeExtractor {
  static attributeName = "className";
  static blockDataName = "_className";

  transformAttributeValue(attributeValue) {
    return attributeValue.join(" ");
  }
}
