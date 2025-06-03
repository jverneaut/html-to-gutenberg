import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataViewScript extends RootAttributeExtractor {
  static attributeName = "dataViewScript";
  static blockDataName = "viewScript";

  transformAttributeValue(attributeValue) {
    const transformedAttributeValue = super.transformAttributeValue(
      attributeValue,
    );

    this.blockData._dependencies.push(transformedAttributeValue);

    return transformedAttributeValue;
  }
}
