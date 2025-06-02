import ProcessorBase from "#processors/ProcessorBase.js";

import InspectorControls from "./InspectorControls.js";
import PanelBody from "./PanelBody.js";
import CheckboxControl from "./CheckboxControl.js";
import RadioControl from "./RadioControl.js";
import SelectControl from "./SelectControl.js";
import TextControl from "./TextControl.js";
import ToggleControl from "./ToggleControl.js";

export default class CustomElementInspectorControls extends ProcessorBase {
  get processors() {
    return [
      InspectorControls,
      PanelBody,
      CheckboxControl,
      RadioControl,
      SelectControl,
      TextControl,
      ToggleControl,
    ];
  }
}
