import { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { emmetHTML } from "emmet-monaco-es";
import Layout from "@theme/Layout";

import defaultExample from "../examples/default.html";
import innerBlocksExample from "../examples/inner-blocks.html";

const examples = [
  { name: "Default", content: defaultExample },
  { name: "InnerBlocks", content: innerBlocksExample },
];

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
  const [outputFiles, setOutputFiles] = useState([]);

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

  const [value, setValue] = useState("");

  const onChange = async (value) => {
    setValue(value);

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

      setOutputFiles([
        {
          filename: "edit.js",
          content: files["edit.js"],
          language: "javascript",
        },
        {
          filename: "render.php",
          content: files["render.php"],
          language: "php",
        },
        {
          filename: "block.json",
          content: files["block.json"],
          language: "json",
        },
        {
          filename: "index.js",
          content: files["index.js"],
          language: "javascript",
        },
      ]);

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    onChange(defaultExample);
  }, []);

  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  useEffect(() => {
    setValue(examples[selectedExampleIndex].content);
    onChange(examples[selectedExampleIndex].content);
  }, [selectedExampleIndex]);

  return (
    <Layout title="Live Editor">
      <div className="live-editor">
        <div className="live-editor__input">
          <div className="live-editor__select">
            <select
              onChange={(e) =>
                setSelectedExampleIndex(parseInt(e.target.value))
              }
            >
              {examples.map((example, index) => (
                <option key={index} value={index}>
                  {example.name}
                </option>
              ))}
            </select>
          </div>

          <div className="live-editor__code">
            <Editor
              defaultValue={examples[selectedExampleIndex]}
              value={value}
              language="html"
              options={editorOptions}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="live-editor__output">
          <div className="live-editor__tabs">
            {outputFiles.map((outputFile, index) => (
              <button
                key={index}
                onClick={() => setSelectedFileIndex(index)}
                className={[
                  "live-editor__tab",
                  index === selectedFileIndex
                    ? "live-editor__tab--active"
                    : false,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {outputFile.filename}
              </button>
            ))}
          </div>

          <div className="live-editor__code">
            <Editor
              value={outputFiles[selectedFileIndex]?.content}
              language={outputFiles[selectedFileIndex]?.language}
              options={{ ...editorOptions, readOnly: true }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveEditor;
