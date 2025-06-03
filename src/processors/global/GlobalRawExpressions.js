import ProcessorBase from "#processors/ProcessorBase.js";

export default class GlobalRawExpressions extends ProcessorBase {
  processAllHTMLStrings(htmlString) {
    return htmlString
      .replace(/\s*[^\s=]+="_\$\$/g, " ") // PHP escape sequence to remove attr="_$$
      .replaceAll('"$$', "")
      .replaceAll('$$"', "")
      .replaceAll("$$$", "");
  }
}
