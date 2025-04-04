const removeAttributeWrapper = (html, attribute) => {
  const regex = new RegExp(`${attribute}="([^"]+)"`);
  return html.replace(regex, "$1");
};

export default removeAttributeWrapper;
