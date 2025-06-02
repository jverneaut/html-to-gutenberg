import { toHtml } from "hast-util-to-html";

import { DATA_BIND_WITH_OPTIONS_ELEMENTS } from "#constants";
import { getOptions } from "#utils-html/index.js";

export default (node, type) => {
  if (DATA_BIND_WITH_OPTIONS_ELEMENTS.includes(node.tagName)) {
    const options = getOptions(node);

    return {
      type,
      ...(options.length ? { default: options[0].value } : {}),
    };
  } else {
    const defaultValue = node.children
      ? toHtml(node.children)
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .join(" ")
      : null;

    if (defaultValue) {
      return {
        type,
        default: defaultValue,
      };
    }

    return {
      type,
    };
  }
};
