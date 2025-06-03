import RootAttributeExtractor from "./RootAttributeExtractor.js";

export default class DataEditorStyle extends RootAttributeExtractor {
  static attributeName = "dataEditorStyle";
  static blockDataName = "editorStyle";

  transformAttributeValue(attributeValue) {
    const transformedAttributeValue = super.transformAttributeValue(
      attributeValue,
    );

    this.blockData._dependencies.push(transformedAttributeValue);

    return transformedAttributeValue;
  }
}
