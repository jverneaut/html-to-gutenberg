import { useState, useEffect } from "react";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

import getBlockData from "../../../src/lib/common/getBlockData";

import printEditJS from "../../../src/lib/printEditJS.js";
import printRenderPHP from "../../../src/lib/printRenderPHP.js";
import printBlockJSON from "../../../src/lib/printBlockJSON.js";

export default ({ children }) => {
  const code = children.props.children.props.children;

  const [generatedFiles, setGeneratedFiles] = useState({
    "edit.js": null,
    "render.php": null,
    "block.json": null,
  });

  useEffect(() => {
    (async () => {
      const blockData = await getBlockData(code, {
        blockName: "custom/block",
        blockSlug: "block",
        blockTitle: "Block",
        blockEngine: "php",
      });

      const [editJS, renderPHP, blockJSON] = await Promise.all([
        printEditJS(blockData),
        printRenderPHP(blockData),
        printBlockJSON(blockData),
      ]);

      setGeneratedFiles({
        "edit.js": editJS,
        "render.php": renderPHP,
        "block.json": blockJSON,
      });
    })();
  }, []);

  return (
    <Tabs>
      <TabItem value="block.html" label="block.html" default>
        <CodeBlock title="block.html" language="html">
          {code}
        </CodeBlock>
      </TabItem>

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
    </Tabs>
  );
};
