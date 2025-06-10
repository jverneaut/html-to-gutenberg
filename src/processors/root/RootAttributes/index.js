import ProcessorBase from "#processors/ProcessorBase.js";

import DataAlign from "./DataAlign.js";
import DataBlockName from "./DataBlockName.js";
import DataCategory from "./DataCategory.js";
import DataClassName from "./DataClassName.js";
import DataDescription from "./DataDescription.js";
import DataEditingMode from "./DataEditingMode.js";
import DataEditorClassName from "./DataEditorClassName.js";
import DataEditorStyle from "./DataEditorStyle.js";
import DataIcon from "./DataIcon.js";
import DataParent from "./DataParent.js";
import DataStyle from "./DataStyle.js";
import DataStyles from "./DataStyles.js";
import DataTitle from "./DataTitle.js";
import DataVersion from "./DataVersion.js";
import DataViewScript from "./DataViewScript.js";

export default class RootAttributes extends ProcessorBase {
  get processors() {
    return [
      DataAlign,
      DataBlockName,
      DataCategory,
      DataClassName,
      DataDescription,
      DataEditingMode,
      DataEditorClassName,
      DataEditorStyle,
      DataIcon,
      DataParent,
      DataStyle,
      DataStyles,
      DataTitle,
      DataVersion,
      DataViewScript,
    ];
  }
}
