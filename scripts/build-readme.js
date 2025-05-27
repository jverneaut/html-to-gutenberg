import fs from "fs";

const template = `![Tests Status](https://github.com/jverneaut/html-to-gutenberg/actions/workflows/test.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jverneaut/html-to-gutenberg)
`;

fs.writeFileSync("README.md", template);
