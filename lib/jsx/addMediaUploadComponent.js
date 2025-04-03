import { visit } from "unist-util-visit";

const addMediaUploadComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName && node.tagName === "img") {
      node.tagName = "MediaUpload";

      node.properties.value = `{attributes.${node.properties.dataName}}`;
      node.properties.onSelect = `{(image) => setAttributes({${node.properties.dataName}: image.id})}`;
      node.properties.render = `{({open}) => <Image style={{ cursor: "pointer" }} onClick={open} ${node.properties.className ? `class="${node.properties.className.join(" ")}"` : ""} ${node.properties.width ? `width="${node.properties.width}"` : ""} ${node.properties.height ? `height="${node.properties.height}"` : ""} id={attributes.${node.properties.dataName}} onSelect={image => setAttributes({${node.properties.dataName}: image.id})} />}`;

      delete node.properties.className;
      delete node.children;
      delete node.properties.dataName;
    }
  });
};

export default addMediaUploadComponent;
