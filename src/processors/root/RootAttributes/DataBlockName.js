import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataBlockName extends RootAttributeExtractor {
  static attributeName = "dataName";
  static blockDataName = "name";

  transformAttributeValue(attributeValue) {
    this.blockData.textdomain = attributeValue.split("/")[1];

    return attributeValue;
  }
}
