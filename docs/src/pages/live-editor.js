import { useState, useEffect } from "react";
import { emmetHTML } from "emmet-monaco-es";

import Editor, { useMonaco } from "@monaco-editor/react";
import Layout from "@theme/Layout";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

import HTMLToGutenberg from "../../../src/HTMLToGutenberg.js";

import processors from "../../../src/processors/index.js";
import printers from "../../../src/printers/index.js";

import defaultExample from "../examples/default.html";
import innerBlocksExample from "../examples/inner-blocks.html";
import serverSideBlockExample from "../examples/server-side-block.html";

const examples = [
  { title: "Default", content: defaultExample },
  { title: "InnerBlocks", content: innerBlocksExample },
  { title: "Server-side Block", content: serverSideBlockExample },
];

const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },

  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  scrollbar: {
    vertical: "hidden",
    horizontal: "hidden",
  },
  overviewRulerBorder: false,
};

const Select = ({ index, setIndex, options }) => {
  const prev = () => {
    setIndex((index - 1 + options.length) % options.length);
  };

  const next = () => {
    setIndex((index + 1) % options.length);
  };

  return (
    <div className="live-editor__select">
      <div className="live-editor__select-title">
        <span>{options[index].title}</span>
        <ChevronDown size={16} />

        <select onChange={(e) => setIndex(parseInt(e.target.value))}>
          {options.map((option, index) => (
            <option key={index} value={index}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div className="live-editor__select-buttons">
        <button
          onClick={prev}
          className="live-editor__select-button live-editor__select-button--prev"
        >
          <ArrowLeft size={16} />
        </button>

        <button
          onClick={next}
          className="live-editor__select-button live-editor__select-button--next"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const FileTabs = ({ index, setIndex, options }) => {
  return (
    <div className="live-editor__files">
      {options.map((option, optionIndex) => (
        <button
          key={optionIndex}
          onClick={() => setIndex(optionIndex)}
          className={[
            "live-editor__file",
            index === optionIndex ? "live-editor__file--selected" : false,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const LiveEditor = () => {
  const monaco = useMonaco();

  const [outputFiles, setOutputFiles] = useState([]);

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

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

  const onResize = () => {
    if (monaco) {
      const editors = monaco.editor.getEditors();

      editors.forEach((editor) => {
        if (editor) {
          editor.layout({});
        }
      });
    }
  };

  useEffect(() => {
    if (monaco) {
      emmetHTML(monaco);
    }

    import("monaco-themes/themes/GitHub Dark.json").then((data) => {
      if (monaco) {
        monaco.editor.defineTheme("github-dark", data);
        monaco.editor.setTheme("github-dark");
      }
    });

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [monaco]);

  return (
    <Layout>
      <div className="live-editor">
        <Select
          index={selectedExampleIndex}
          setIndex={setSelectedExampleIndex}
          options={examples}
        />

        <div className="live-editor__code">
          <div className="live-editor__input">
            <FileTabs index={0} setIndex={() => {}} options={["block.html"]} />

            <div className="live-editor__editor">
              <Editor
                value={value}
                defaultValue={examples[selectedExampleIndex]}
                language="html"
                options={editorOptions}
                onChange={onChange}
                theme="github-dark"
              />
            </div>
          </div>

          <div className="live-editor__output">
            <FileTabs
              index={selectedFileIndex}
              setIndex={setSelectedFileIndex}
              options={["edit.js", "render.php", "block.json", "index.js"]}
            />

            <div className="live-editor__editor">
              <Editor
                value={outputFiles[selectedFileIndex]?.content}
                language={outputFiles[selectedFileIndex]?.language}
                options={{ ...editorOptions, readOnly: true }}
                theme="github-dark"
              />
            </div>

            {error && (
              <div className="live-editor__error">
                <pre>{error}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveEditor;
