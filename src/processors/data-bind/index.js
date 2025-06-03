import ProcessorBase from "#processors/ProcessorBase.js";

import DataBindImageProcessor from "./DataBindImage.js";
import DataBindInputProcessor from "./DataBindInput.js";
import DataBindInspectorControlsProcessor from "./DataBindInspectorControls.js";
import DataBindRichTextProcessor from "./DataBindRichText.js";

export default class DataBind extends ProcessorBase {
  get processors() {
    return [
      DataBindImageProcessor,
      DataBindInputProcessor,
      DataBindInspectorControlsProcessor,
      DataBindRichTextProcessor,
    ];
  }
}
