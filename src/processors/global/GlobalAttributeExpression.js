import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { visit } from "unist-util-visit";
import { parseExpressionAt } from "acorn";

import { getDataBindInfo } from "#utils-string/index.js";
import { DATA_BIND_TYPES } from "#constants";

const parseDslString = (input) => {
  const result = [];
  const regex = /\{([^}]*)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      result.push({
        type: "text",
        value: input.slice(lastIndex, match.index),
      });
    }

    result.push({
      type: "expression",
      value: match[1].trim(),
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    result.push({
      type: "text",
      value: input.slice(lastIndex),
    });
  }

  return result;
};

const extractReferences = (expr) => {
  const refs = [];

  const walk = (node, path = []) => {
    switch (node.type) {
      case "Identifier":
        refs.push(path.concat(node.name).join("."));
        break;
      case "MemberExpression":
        if (node.computed) return;
        const parts = [];
        let cur = node;
        while (cur.type === "MemberExpression") {
          if (cur.property.type !== "Identifier" || cur.computed) return;
          parts.unshift(cur.property.name);
          cur = cur.object;
        }
        if (cur.type === "Identifier") {
          parts.unshift(cur.name);
          refs.push(parts.join("."));
        }
        break;
      case "ConditionalExpression":
        walk(node.test);
        walk(node.consequent);
        walk(node.alternate);
        break;
      case "BinaryExpression":
      case "LogicalExpression":
        walk(node.left);
        walk(node.right);
        break;
      case "CallExpression":
        walk(node.callee);
        node.arguments.forEach(walk);
        break;
      default:
        break;
    }
  };

  try {
    const ast = parseExpressionAt(expr, 0, { ecmaVersion: 2020 });
    walk(ast);
  } catch (e) {
    console.error("Parse error:", e.message);
  }

  return [...new Set(refs)];
};

const mapReferenceToJS = (ref, instance) => {
  const dataBindInfo = getDataBindInfo(ref);

  if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
    instance.blockData._hasAttributesProps = true;

    return `attributes.${dataBindInfo.key}`;
  }

  if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
    instance.blockData._hasPostType = true;
    instance.blockData._hasPostMeta = true;

    return `meta.${dataBindInfo.key}`;
  }

  if (dataBindInfo.type === DATA_BIND_TYPES.postTitle) {
    instance.blockData._hasPostType = true;
    instance.blockData._hasPostTitle = true;

    return `postTitle`;
  }

  return ref;
};

const mapReferenceToPhp = (ref) => {
  const dataBindInfo = getDataBindInfo(ref);

  if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
    return `($attributes['${dataBindInfo.key}'] ?? '')`;
  }

  if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
    return `(get_post_meta(get_the_ID(), '${dataBindInfo.key}', true))`;
  }

  if (dataBindInfo.type === DATA_BIND_TYPES.postTitle) {
    return `(get_the_title())`;
  }

  return ref;
};

const printJs = (ir, referenceMap) => {
  return (
    "`" +
    ir
      .map((part) => {
        if (part.type === "text") {
          return part.value.replace(/[`\\$]/g, "\\$&");
        }

        let expr = part.value;
        for (const ref of Object.keys(referenceMap)) {
          expr = expr.replaceAll(ref, referenceMap[ref]);
        }

        return `\${${expr}}`;
      })
      .join("") +
    "`"
  );
};

const printPhp = (ir, referenceMap = {}) => {
  return ir
    .map((part) => {
      if (part.type === "text") {
        return `"${part.value}"`;
      }

      let expr = part.value;
      for (const ref of Object.keys(referenceMap)) {
        expr = expr.replaceAll(ref, referenceMap[ref]);
      }

      return `(${expr})`;
    })
    .join(" . ");
};

export default class GlobalAttributeExpression extends ProcessorBase {
  processAstByFilename(filename) {
    if (
      filename === PrinterEditJS.filename ||
      filename === PrinterRenderPHP.filename
    ) {
      visit(this.asts[filename], "element", (node) => {
        Object.entries(node.properties).forEach(([key, value]) => {
          if (typeof value === "boolean") return;

          const attrValue = Array.isArray(value) ? value.join(" ") : value;

          if (!attrValue || typeof attrValue !== "string") return;
          if (attrValue.startsWith("$$")) return;

          const ir = parseDslString(attrValue);

          const hasExpression = ir.some((part) => part.type === "expression");
          if (!hasExpression) return;

          const allRefs = ir
            .filter((p) => p.type === "expression")
            .flatMap((p) => extractReferences(p.value));

          const jsReferenceMap = Object.fromEntries(
            [...new Set(allRefs)].map((r) => [r, mapReferenceToJS(r, this)]),
          );

          const phpReferenceMap = Object.fromEntries(
            [...new Set(allRefs)].map((r) => [r, mapReferenceToPhp(r)]),
          );

          const jsValue = "$${" + printJs(ir, jsReferenceMap) + "}$$";
          const phpValue = "<?= " + printPhp(ir, phpReferenceMap) + "; ?>";

          if (filename === PrinterEditJS.filename) {
            node.properties[key] = jsValue;
          }

          if (filename === PrinterRenderPHP.filename) {
            node.properties[key] = phpValue;
          }
        });
      });
    }
  }
}
