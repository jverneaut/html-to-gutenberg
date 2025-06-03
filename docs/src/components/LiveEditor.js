import { useState, useEffect, useRef } from "react";

import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-markup";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import Admonition from "@theme/Admonition";
import Details from "@theme/Details";

import HTMLToGutenberg from "../../../src/HTMLToGutenberg.js";

import processors from "../../../src/processors/index.js";
import printers from "../../../src/printers/index.js";

export default ({
  children,
  title = "Edit this code to see the generated Gutenberg block files.",
  activeTab = "edit.js",
}) => {
  const defaultCode = children.props.children.props.children;

  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState(null);

  const [generatedFiles, setGeneratedFiles] = useState({
    "edit.js": null,
    "index.js": null,
    "render.php": null,
    "block.json": null,
  });

  useEffect(() => {
    (async () => {
      try {
        setError(null);

        const htmlToGutenberg = new HTMLToGutenberg({
          printers,
          processors,
        });

        const files = await htmlToGutenberg.printBlockFromHTMLFileContent(
          code,
          {
            textdomain: "block",
            name: "custom/block",
            title: "Block title",
          },
        );

        setGeneratedFiles(files.files);
      } catch (err) {
        setError(err);
      }
    })();
  }, [code]);

  const codeEditorRef = useRef();

  useEffect(() => {
    const codeEditorPre = codeEditorRef.current.querySelector(
      ".inline-code-editor__editor pre",
    );

    const codeBlockPre =
      codeEditorRef.current.querySelector(".language-html pre");

    const onScroll = (e) => {
      codeBlockPre.scrollLeft = e.target.scrollLeft;
    };

    codeEditorPre.addEventListener("scroll", onScroll);

    return () => {
      codeEditorPre.removeEventListener("scroll", onScroll);
    };
  }, [codeEditorRef.current]);

  return (
    <Details summary="Open the live code editor">
      <div className="side-by-side-editor">
        <div className="side-by-side-editor__input">
          <p dangerouslySetInnerHTML={{ __html: title }}></p>

          <div className="inline-code-editor" ref={codeEditorRef}>
            <CodeBlock title="block.html" language="html">
              {`${code}\n`}
            </CodeBlock>

            <div className="inline-code-editor__editor">
              <CodeBlock>
                <Editor
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => highlight(code, languages.markup)}
                />
              </CodeBlock>
            </div>
          </div>
        </div>

        {error ? (
          <div className="side-by-side-editor__error">
            <Admonition type="danger" title="error">
              <pre>{error.message}</pre>
            </Admonition>
          </div>
        ) : null}

        <div className="side-by-side-editor__output">
          <Tabs>
            <TabItem
              value="edit.js"
              label="edit.js"
              default={activeTab === "index.js"}
            >
              <CodeBlock title="block/edit.js" language="jsx">
                {generatedFiles["edit.js"]}
              </CodeBlock>
            </TabItem>

            <TabItem
              value="render.php"
              label="render.php"
              default={activeTab === "render.php"}
            >
              <CodeBlock title="block/render.php" language="php">
                {generatedFiles["render.php"]}
              </CodeBlock>
            </TabItem>

            <TabItem
              value="block.json"
              label="block.json"
              default={activeTab === "block.json"}
            >
              <CodeBlock title="block/block.json" language="json">
                {generatedFiles["block.json"]}
              </CodeBlock>
            </TabItem>

            <TabItem
              value="index.js"
              label="index.js"
              default={activeTab === "index.js"}
            >
              <CodeBlock title="block/index.js" language="jsx">
                {generatedFiles["index.js"]}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </div>
      </div>
    </Details>
  );
};
