export const DATA_BIND_INPUT_ELEMENTS = ["input", "textarea", "select"];
export const DATA_BIND_IMAGE_ELEMENTS = ["img"];

export const DATA_BIND_CONTROLS_ELEMENTS = [
  "checkbox-control",
  "radio-control",
  "text-control",
  "toggle-control",
  "select-control",
  "toolbar-button",
];

export const DATA_BIND_WITH_OPTIONS_ELEMENTS = [
  "select",
  "select-control",
  "radio-control",
];

export const DATA_BIND_NON_RICH_TEXT_ELEMENTS = [
  ...DATA_BIND_INPUT_ELEMENTS,
  ...DATA_BIND_IMAGE_ELEMENTS,
  ...DATA_BIND_CONTROLS_ELEMENTS,
];

export const DATA_BIND_TYPES = {
  attributes: "attributes",
  postMeta: "postMeta",
  postTitle: "post.title",
};
