import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataParent extends RootAttributeExtractor {
  static attributeName = "dataParent";
  static blockDataName = "parent";

  transformAttributeValue(attributeValue) {
    return attributeValue.split(" ").filter((str) => str.trim() !== "");
  }
}
