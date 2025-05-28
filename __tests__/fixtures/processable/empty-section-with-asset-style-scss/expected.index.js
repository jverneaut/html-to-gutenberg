import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";

import Edit from "./edit.js";
import metadata from "./block.json";

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => null,
});
