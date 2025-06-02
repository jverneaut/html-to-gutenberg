import ProcessorBase from "#processors/ProcessorBase.js";

export default class GlobalRawExpressions extends ProcessorBase {
  processAllHTMLStrings(htmlString) {
    return htmlString
      .replaceAll('"$$', "")
      .replaceAll('$$"', "")
      .replaceAll("$$$", "");
  }
}
