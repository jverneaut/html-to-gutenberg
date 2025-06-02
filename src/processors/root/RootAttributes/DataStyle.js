import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataStyle extends RootAttributeExtractor {
  static attributeName = "dataStyle";
  static blockDataName = "style";

  transformAttributeValue(attributeValue) {
    const transformedAttributeValue = super.transformAttributeValue(
      attributeValue,
    );

    this.blockData._dependencies.push(transformedAttributeValue);

    return transformedAttributeValue;
  }
}
