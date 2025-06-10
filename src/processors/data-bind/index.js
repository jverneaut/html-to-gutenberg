import ProcessorBase from "#processors/ProcessorBase.js";

import DataBindContentPicker from "./DataBindContentPicker.js";
import DataBindImageProcessor from "./DataBindImage.js";
import DataBindInputProcessor from "./DataBindInput.js";
import DataBindControlsProcessor from "./DataBindControls.js";
import DataBindRichTextProcessor from "./DataBindRichText.js";

export default class DataBind extends ProcessorBase {
  get processors() {
    return [
      DataBindContentPicker,
      DataBindImageProcessor,
      DataBindInputProcessor,
      DataBindControlsProcessor,
      DataBindRichTextProcessor,
    ];
  }
}
