import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

export default class GlobalJSXAttributes extends ProcessorBase {
  processHTMLStringByFilename(filename, htmlString) {
    if (filename === PrinterEditJS.filename) {
      // FIXME: This is very brittle in my opinion, maybe we should look into proper estree manipulation
      return (
        htmlString
          // React uses class instead of className
          .replaceAll("class=", "className=")
          // Remove attributes that contains a ":", like xml:space, this is not valid JSX
          .replace(/(\s)([^=\s"]*):([^=\s"]*)=/g, "$1$2$3=")
          // Capitalize the first letter of event handlers, like onChange, onClick, etc.
          .replace(/\s(on[a-z]+)=/g, (_, event) => {
            const reactEvent =
              "on" + event.charAt(2).toUpperCase() + event.slice(3);
            return ` ${reactEvent}=`;
          })
      );
    }

    return htmlString;
  }
}
