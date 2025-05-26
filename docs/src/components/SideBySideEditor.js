import { useState, useEffect, useRef } from "react";

import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-markup";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import Admonition from "@theme/Admonition";

import getBlockData from "../../../src/lib/common/getBlockData";

import printEditJS from "../../../src/lib/printEditJS.js";
import printRenderPHP from "../../../src/lib/printRenderPHP.js";
import printBlockJSON from "../../../src/lib/printBlockJSON.js";
import printIndexJS from "../../../src/lib/printIndexJS.js";

export default ({ children }) => {
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

        const blockData = await getBlockData(code, {
          blockName: "custom/block",
          blockSlug: "block",
          blockTitle: "Block",
          blockEngine: "php",
        });

        const [indexJs, editJS, renderPHP, blockJSON] = await Promise.all([
          printIndexJS(blockData),
          printEditJS(blockData),
          printRenderPHP(blockData),
          printBlockJSON(blockData),
        ]);

        setGeneratedFiles({
          "index.js": indexJs,
          "edit.js": editJS,
          "render.php": renderPHP,
          "block.json": blockJSON,
        });
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
    <Admonition type="tip" icon="🛠️" title="Try it live!">
      <div className="side-by-side-editor">
        <div className="side-by-side-editor__input">
          <p>Edit this code to see the generated Gutenberg block files.</p>

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
            <TabItem value="edit.js" label="edit.js">
              <CodeBlock title="block/edit.js" language="jsx">
                {generatedFiles["edit.js"]}
              </CodeBlock>
            </TabItem>

            <TabItem value="render.php" label="render.php">
              <CodeBlock title="block/render.php" language="php">
                {generatedFiles["render.php"]}
              </CodeBlock>
            </TabItem>

            <TabItem value="block.json" label="block.json">
              <CodeBlock title="block/block.json" language="json">
                {generatedFiles["block.json"]}
              </CodeBlock>
            </TabItem>

            <TabItem value="index.js" label="index.js">
              <CodeBlock title="block/index.js" language="jsx">
                {generatedFiles["index.js"]}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </div>
      </div>
    </Admonition>
  );
};
