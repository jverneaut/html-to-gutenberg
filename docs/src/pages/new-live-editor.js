import { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { emmetHTML } from "emmet-monaco-es";
import Layout from "@theme/Layout";

import defaultExample from "../examples/default.html";

import HTMLToGutenberg from "../../../src/HTMLToGutenberg.js";

import processors from "../../../src/processors/index.js";
import printers from "../../../src/printers/index.js";

const editorOptions = {
  minimap: { enabled: false },

  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  scrollbar: {
    vertical: "hidden",
    horizontal: "hidden",
  },
  overviewRulerBorder: false,
};

const LiveEditor = () => {
  const [outputFiles, setOutputFiles] = useState({
    "/render.php": "",
    "/block.json": "",
    "/index.js": "",
    "/edit.js": "",
  });

  const [error, setError] = useState("");

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      emmetHTML(monaco);
    }

    const onResize = () => {
      const editors = monaco.editor.getEditors();
      editors.forEach((editor) => {
        editor.layout({});
      });
    };

    import("monaco-themes/themes/GitHub Light.json").then((data) => {
      if (monaco) {
        monaco.editor.defineTheme("github-light", data);
        monaco.editor.setTheme("github-light");
      }
    });

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [monaco]);

  const onChange = async (value) => {
    try {
      const htmlToGutenberg = new HTMLToGutenberg({
        printers,
        processors,
      });

      const { files } = await htmlToGutenberg.printBlockFromHTMLFileContent(
        value,
        {
          name: "custom/block",
          title: "Block",
          textdomain: "block",
        },
      );

      setOutputFiles({
        "/render.php": files["render.php"],
        "/block.json": files["block.json"],
        "/index.js": files["index.js"],
        "/edit.js": files["edit.js"],
      });

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    onChange(defaultExample);
  }, []);

  return (
    <Layout title="Live Editor">
      <div className="live-editor">
        <div className="live-editor__input">
          <div className="live-editor__code">
            <Editor
              defaultValue={defaultExample}
              defaultLanguage="html"
              options={editorOptions}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="live-editor__output">
          <div className="live-editor__tabs"></div>
          <div className="live-editor__code">
            <Editor
              value={outputFiles["/edit.js"]}
              defaultLanguage="javascript"
              options={{ ...editorOptions, readOnly: true }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveEditor;
