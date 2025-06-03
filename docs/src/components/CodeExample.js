import { useState, useEffect } from "react";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

import HTMLToGutenberg from "../../../src/HTMLToGutenberg.js";

import processors from "../../../src/processors/index.js";
import printers from "../../../src/printers/index.js";

export default ({
  children,
  filename = "block.html",
  activeTab = "block.html",
}) => {
  const code = children.props.children.props.children;

  const [generatedFiles, setGeneratedFiles] = useState({
    "edit.js": null,
    "index.js": null,
    "render.php": null,
    "block.json": null,
  });

  const blockSlug = filename.split(".")[0];
  const blockName = `custom/${blockSlug}`;
  const blockTitle = blockSlug.charAt(0).toUpperCase() + blockSlug.slice(1);

  useEffect(() => {
    (async () => {
      const htmlToGutenberg = new HTMLToGutenberg({
        printers,
        processors,
      });

      const { files } = await htmlToGutenberg.printBlockFromHTMLFileContent(
        code,
        {
          textdomain: blockSlug,
          name: blockName,
          title: blockTitle,
        },
      );

      setGeneratedFiles(files);
    })();
  }, []);

  return (
    <Tabs>
      <TabItem
        value="block.html"
        label={filename}
        default={activeTab === "block.html"}
      >
        <CodeBlock title={filename} language="html">
          {code}
        </CodeBlock>
      </TabItem>

      <TabItem
        value="edit.js"
        label="edit.js"
        default={activeTab === "edit.js"}
      >
        <CodeBlock title={`${blockSlug}/edit.js`} language="jsx">
          {generatedFiles["edit.js"]}
        </CodeBlock>
      </TabItem>

      <TabItem
        value="render.php"
        label="render.php"
        default={activeTab === "render.php"}
      >
        <CodeBlock title={`${blockSlug}/render.php`} language="php">
          {generatedFiles["render.php"]}
        </CodeBlock>
      </TabItem>

      <TabItem
        value="block.json"
        label="block.json"
        default={activeTab === "block.json"}
      >
        <CodeBlock title={`${blockSlug}/block.json`} language="json">
          {generatedFiles["block.json"]}
        </CodeBlock>
      </TabItem>

      <TabItem
        value="index.js"
        label="index.js"
        default={activeTab === "index.js"}
      >
        <CodeBlock title={`${blockSlug}/index.js`} language="jsx">
          {generatedFiles["index.js"]}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};
