import PrinterBase from "./PrinterBase.js";
import Mustache from "mustache";

import { DATA_BIND_TYPES } from "#constants";

const template = `{{#content}}{{#beforeContent}}
<?php

{{{beforeContent}}}

?>

{{/beforeContent}}
{{{ content }}}
{{/content}}`;

export default class PrinterRenderPHP extends PrinterBase {
  static filename = "render.php";

  print(htmlString) {
    const generateImageDefinitions = (boundImages) =>
      boundImages
        .map(({ key, type, size }) => {
          const imageSize = size ?? "full";

          return [
            type === DATA_BIND_TYPES.attributes
              ? `$${key}_id = $attributes['${key}'] ?? '';`
              : false,
            type === DATA_BIND_TYPES.postMeta
              ? `$${key}_id = get_post_meta(get_the_ID(), '${key}', true) ?? '';`
              : false,
            `$${key} = $${key}_id ? wp_get_attachment_image_src($${key}_id, '${imageSize}') : [''];`,
            `$${key}_src = $${key}[0] ?? '';`,
            `$${key}_srcset = $${key}_id ? wp_get_attachment_image_srcset($${key}_id, '${imageSize}') : '';`,
            `$${key}_sizes = $${key}_id ? wp_get_attachment_image_sizes($${key}_id, '${imageSize}') : '';`,
            `$${key}_alt = $${key}_id ? get_post_meta($${key}_id, '_wp_attachment_image_alt', true) : '';`,
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n");

    const beforeContent = [
      generateImageDefinitions(this.blockData._boundImages),
    ].join("\n\n");

    const renderedTemplate = Mustache.render(template, {
      beforeContent,
      content: htmlString
        ? htmlString
            .split("\n")
            .filter((line) => line.trim() !== "")
            .join("\n")
        : "",
    });

    // Ain't no writing a custom PHP formatter (ᵕ,•ᴗ•)
    return renderedTemplate.length ? renderedTemplate : "";
  }
}
