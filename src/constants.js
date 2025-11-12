export const DATA_BIND_INPUT_ELEMENTS = ["input", "textarea", "select"];
export const DATA_BIND_IMAGE_ELEMENTS = ["img"];

export const DATA_BIND_CONTROLS_ELEMENTS = [
  "checkbox-control",
  "radio-control",
  "text-control",
  "toggle-control",
  "select-control",
  "toolbar-button",
  "toolbar-dropdown-menu",
];

export const DATA_BIND_WITH_OPTIONS_ELEMENTS = [
  "select",
  "select-control",
  "radio-control",
  "toolbar-dropdown-menu",
];

export const DATA_BIND_CONTENT_PICKER_ELEMENT = "content-picker";
export const DATA_BIND_IFRAME_ELEMENT = "iframe";
export const DATA_BIND_COLOR_SETTING_ELEMENT = "color-setting";

export const DATA_BIND_NON_RICH_TEXT_ELEMENTS = [
  ...DATA_BIND_INPUT_ELEMENTS,
  ...DATA_BIND_IMAGE_ELEMENTS,
  ...DATA_BIND_CONTROLS_ELEMENTS,
  DATA_BIND_CONTENT_PICKER_ELEMENT,
  DATA_BIND_IFRAME_ELEMENT,
  DATA_BIND_COLOR_SETTING_ELEMENT,
];

export const DATA_BIND_TYPES = {
  attributes: "attributes",
  postMeta: "postMeta",
  postTitle: "post.title",
};
