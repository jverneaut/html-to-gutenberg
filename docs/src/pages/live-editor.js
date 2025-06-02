import { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { useColorMode } from "@docusaurus/theme-common";

import {
  useActiveCode,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";

import HTMLToGutenberg from "../../../src/HTMLToGutenberg.js";

import processors from "../../../src/processors/index.js";
import printers from "../../../src/printers/index.js";

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
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      theme={colorMode}
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
      const htmlToGutenberg = new HTMLToGutenberg({
        printers,
        processors,
      });

      const { files } = await htmlToGutenberg.printBlockFromHTMLFileContent(
        inputFiles["/block.html"],
        {
          name: "custom/block",
          title: "Block",
          textdomain: "block",
        },
      );

      sandpack.updateFile("/render.php", files["render.php"]);
      sandpack.updateFile("/edit.js", files["edit.js"]);
      sandpack.updateFile("/block.json", files["block.json"]);
      sandpack.updateFile("/index.js", files["index.js"]);
    } catch (err) {
      console.log(err);
    }

    sandpack.setActiveFile(activeFile);
  };

  useEffect(() => {
    updateFiles();
  }, [inputFiles["/block.html"], sandpack.editorState]);

  return <SandpackCodeEditor showTabs readOnly />;
};

const LiveEditorOutput = ({ inputFiles }) => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      theme={colorMode}
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

const defaultFileValue = `<section class="py-20 bg-blue-200" data-parent="custom/parent-block" data-editing-mode="contentOnly">
  <inspector-controls>
    <panel-body title="Settings">
      <select-control data-bind="postType" label="Post Type">
        <select-control-option value="posts">Posts</select-control-option>
        <select-control-option value="pages">Pages</select-control-option>
      </select-control>
    </panel-body>
  </inspector-controls>

  <div class="container">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6">
        <h2 class="text-2xl" data-bind="sectionTitle">Edit me inside the editor</h2>
        <img class="aspect-square object-cover" data-bind="sectionImage" />
      </div>

      <div class="col-span-12 md:col-span-6">
        <inner-blocks allowedBlocks="all" templateLock="all">
          <inner-block name="core/group">
            <inner-block name="core/heading" level="3"></inner-block>
            <inner-block name="core/paragraph">
              <block-attribute name="content">
                Lorem ipsum dolor sit amet consectetur.
              </block-attribute>
            </inner-block>
          </inner-block>
        </inner-blocks>
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
