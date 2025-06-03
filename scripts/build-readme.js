import fs from "fs";

const convertAdmonitionsToQuotes = (md) => {
  return md.replace(
    /:::([a-zA-Z]+)([^\n]*)\n([\s\S]+?)\n:::/g,
    (_, type, title, content) => {
      type = type.trim().toUpperCase();
      title = title.trim();

      // Prefix each line in the content with "> "
      const quotedContent = content
        .trim()
        .split("\n")
        .map((line) => (line.length ? `> ${line}` : ">"))
        .join("\n");

      return `${title ? `\n> #### ${title}` : ""}\n${quotedContent}`;
    },
  );
};

const convertTemplate = (template) => {
  const convertedTemplate = [convertAdmonitionsToQuotes].reduce(
    (acc, curr) => curr(acc),
    template,
  );

  return convertedTemplate;
};

const introductionTemplate = convertTemplate(
  fs.readFileSync("docs/docs/common/_introduction.md", {
    encoding: "utf-8",
  }),
);

const quickStartTemplate = convertTemplate(
  fs.readFileSync("docs/docs/common/_quick-start.md", {
    encoding: "utf-8",
  }),
);

const exampleTemplate = convertTemplate(
  fs.readFileSync("docs/docs/common/_example.md", {
    encoding: "utf-8",
  }),
);

const template = `![Node LTS](https://img.shields.io/node/v-lts/@jverneaut/html-to-gutenberg)
![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)

<img src="./docs/static/img/logo.svg" alt="HTML To Gutenberg" width="100">

# HTML To Gutenberg

${introductionTemplate}

![HTML To Gutenberg WordCamp Demo](docs/static/img/wordcamp-demo.png)

## Quick start

${quickStartTemplate}

## Documentation

Visit the [official documentation](https://html-to-gutenberg.com).

### Quick links

- [Installation](https://html-to-gutenberg.com/getting-started/installation)
- [Registering blocks](https://html-to-gutenberg.com/getting-started/registering-blocks)
- [Creating a block](https://html-to-gutenberg.com/guides/creating-a-block)
- [Binding data to elements](https://html-to-gutenberg.com/guides/data-binding)
- [Using InnerBlocks](https://html-to-gutenberg.com/guides/innerblocks)
- [Adding InspectorControls](https://html-to-gutenberg.com/guides/inspector-controls)

## Example

${exampleTemplate}`;
fs.writeFileSync("README.md", template);
