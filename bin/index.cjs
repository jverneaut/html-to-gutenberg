#!/usr/bin/env node

const { program } = require("commander");
const chokidar = require("chokidar");

const packageJSON = require("../package.json");

const HTMLToGutenberg = require("../src/HTMLToGutenberg.js").default;

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)

  .option("-i, --input <path>", "HTML blocks input path", ".")
  .option("-o, --output <path>", "Gutenberg blocks output path", "")
  .option("-p, --prefix <type>", "Blocks namespace", "custom")
  .option("-f, --flavor <type>", 'Flavor (either "php" or "twig")', "php")
  .option(
    "-w, --watch",
    "Watch the input directory for changes and regenerate blocks",
  );

program.parse();

const options = program.opts();

const htmlToGutenbergOptions = {
  inputDirectory: options.input,
  outputDirectory: options.output || options.input,
  blocksPrefix: options.prefix,
  flavor: options.flavor,
};

const htmlToGutenberg = new HTMLToGutenberg(htmlToGutenbergOptions);

const generateAndWriteFiles = async () => {
  try {
    console.log("Generating Gutenberg blocks...");
    const generatedFiles = await htmlToGutenberg.generateFiles();

    console.log("Writing generated files...");
    htmlToGutenberg.writeFiles(generatedFiles);

    console.log("Block generation complete!");
  } catch (error) {
    console.error("Error occurred:", error.message);
    process.exit(1); // Exit with an error code
  }
};

// If the watch option is set, use chokidar to watch for changes
if (options.watch) {
  console.log(`Watching for changes in ${htmlToGutenberg.inputDirectory}...`);
  const watcher = chokidar.watch(htmlToGutenberg.inputDirectory, {
    persistent: true,
    ignored: /node_modules|\.git/,
  });

  watcher.on("change", (path) => {
    if (path.indexOf(".html") > -1) {
      console.log(`File changed: ${path}`);
      generateAndWriteFiles(); // Regenerate blocks when a file changes
    }
  });

  watcher.on("error", (error) => {
    console.error("Watch error:", error);
  });

  generateAndWriteFiles();
} else {
  // If watch is not enabled, run the script once
  generateAndWriteFiles();
}
