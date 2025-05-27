import fs from "fs";

const convertAdmonitions = (md) => {
  return md.replace(
    /:::([a-zA-Z]+)([^\n]*)\n([\s\S]+?)\n:::/g,
    (_, type, title, content) => {
      type = type.trim().toUpperCase();
      title = title.trim();

      const headerLine = `[!${type}]  `;

      // Prefix each line in the content with "> "
      const quotedContent = content
        .trim()
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");

      return `> ${headerLine}${title ? `\n> ## ${title}` : ""}\n${quotedContent}`;
    },
  );
};

const convertTemplate = (template) => {
  const convertedTemplate = [convertAdmonitions].reduce(
    (acc, curr) => curr(acc),
    template,
  );

  return convertedTemplate;
};

const quickStartTemplate = convertTemplate(
  fs.readFileSync("docs/docs/common/_quick-start.md", {
    encoding: "utf-8",
  }),
);

const template = `![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)

## Quick start

${quickStartTemplate}`;

fs.writeFileSync("README.md", template);
