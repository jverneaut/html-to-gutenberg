import { useState, useEffect } from "react";
import Layout from "@theme/Layout";

import {
  useActiveCode,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";

import getBlockData from "../../../src/lib/common/getBlockData.js";

import printEditJS from "../../../src/lib/printEditJS.js";
import printRenderPHP from "../../../src/lib/printRenderPHP.js";
import printBlockJSON from "../../../src/lib/printBlockJSON.js";
import printIndexJS from "../../../src/lib/printIndexJS.js";

const LiveEditorInputEditor = ({ setInputFiles }) => {
  const { code } = useActiveCode();

  useEffect(() => {
    setInputFiles({
      "/block.html": code,
    });
  }, [code]);

  return <SandpackCodeEditor showLineNumbers showTabs />;
};

const LiveEditorInput = ({ inputFiles, setInputFiles }) => {
  return (
    <SandpackProvider
      files={inputFiles}
      customSetup={{
        entry: "/block.html",
      }}
    >
      <SandpackLayout>
        <LiveEditorInputEditor setInputFiles={setInputFiles} />
      </SandpackLayout>
    </SandpackProvider>
  );
};

const LiveEditorOutputEditor = ({ inputFiles }) => {
  const { sandpack } = useSandpack();

  const updateFiles = async () => {
    const activeFile = sandpack.activeFile;

    try {
      const blockData = await getBlockData(inputFiles["/block.html"], {
        blockName: "custom/block",
        blockSlug: "block",
        blockTitle: "Block",
      });

      const [indexJs, editJS, renderPHP, blockJSON] = await Promise.all([
        printIndexJS(blockData),
        printEditJS(blockData),
        printRenderPHP(blockData),
        printBlockJSON(blockData),
      ]);

      sandpack.updateFile("/render.php", renderPHP);
      sandpack.updateFile("/edit.js", editJS);
      sandpack.updateFile("/block.json", blockJSON);
      sandpack.updateFile("/index.js", indexJs, false);
    } catch (err) {}

    sandpack.setActiveFile(activeFile);
  };

  useEffect(() => {
    updateFiles();
  }, [inputFiles["/block.html"], sandpack.editorState]);

  return <SandpackCodeEditor showTabs readOnly />;
};

const LiveEditorOutput = ({ inputFiles }) => {
  return (
    <SandpackProvider
      files={{
        "/render.php": "",
        "/block.json": "",
        "/index.js": "",
        "/edit.js": "",
      }}
      options={{
        visibleFiles: ["/edit.js", "/render.php", "/block.json", "index.js"],
        activeFile: "/edit.js",
      }}
    >
      <SandpackLayout>
        <LiveEditorOutputEditor inputFiles={inputFiles} />
      </SandpackLayout>
    </SandpackProvider>
  );
};

const defaultFileValue = ` <section class="py-20 bg-blue-200" data-parent="custom/parent-block" data-editing-mode="contentOnly">
  <div class="container">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6">
        <h2 class="text-2xl" data-attribute="section_title">I am editable – awesome, right?</h2>
        <img class="aspect-square object-cover" data-attribute="section_image" />
      </div>

      <div class="col-span-12 md:col-span-6">
        <blocks allowedBlocks="all" templateLock="all">
          <block name="core/group">
            <block name="core/heading" level="3"></block>
            <block name="core/paragraph">
              <attribute name="content">
                Lorem ipsum dolor sit amet consectetur.
              </attribute>
            </block>
          </block>
        </blocks>
      </div>
    </div>
  </div>
</section>`;

const LiveEditorPage = () => {
  const [inputFiles, setInputFiles] = useState({
    "/block.html": defaultFileValue,
  });

  return (
    <Layout title="Live Editor">
      <div className="live-editor-layout">
        <LiveEditorInput
          inputFiles={inputFiles}
          setInputFiles={setInputFiles}
        />

        <LiveEditorOutput inputFiles={inputFiles} />
      </div>
    </Layout>
  );
};

export default LiveEditorPage;
