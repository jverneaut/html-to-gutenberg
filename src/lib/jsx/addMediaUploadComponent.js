import { visit } from "unist-util-visit";

const addMediaUploadComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute && node.tagName === "img") {
      node.tagName = "MediaUpload";

      node.properties.value = `{attributes.${node.properties.dataAttribute}}`;
      node.properties.onSelect = `{(image) => setAttributes({${node.properties.dataAttribute}: image.id})}`;
      node.properties.render = `{({open}) => <Image style={{ cursor: "pointer", pointerEvents: "all" }} onClick={open} ${node.properties.className ? `class="${node.properties.className.join(" ")}"` : ""} ${node.properties.width ? `width="${node.properties.width}"` : ""} ${node.properties.height ? `height="${node.properties.height}"` : ""} id={attributes.${node.properties.dataAttribute}} onSelect={image => setAttributes({${node.properties.dataAttribute}: image.id})} />}`;

      delete node.properties.className;
      delete node.children;
      delete node.properties.dataAttribute;
      delete node.properties.dataImageSize;
    }
  });
};

export default addMediaUploadComponent;
