#!/usr/bin/env node

const { program } = require("commander");
const chokidar = require("chokidar");
const chalk = require("chalk").default;

const packageJSON = require("../package.json");

const HTMLToGutenbergProcessor =
  require("../src/HTMLToGutenbergProcessor.js").default;

program
  .name("npx " + packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)

  .option("-i, --input <path>", "HTML blocks input path", ".")
  .option("-o, --output <path>", "Gutenberg blocks output path")
  .option("-p, --prefix <type>", "Blocks namespace", "custom")
  .option(
    "-w, --watch",
    "Watch the input directory for changes and regenerate blocks",
  );

program.parse();

const options = program.opts();

const htmlToGutenbergProcessorOptions = {
  inputDirectory: options.input,
  outputDirectory: options.output || options.input,
  defaultNamespace: options.defaultNamespace,
};

const htmlToGutenbergProcessor = new HTMLToGutenbergProcessor(
  htmlToGutenbergProcessorOptions,
);

const generateAndWriteFiles = async () => {
  try {
    if (options.watch) {
      console.clear();
    }

    console.log(chalk.cyan("Generating Gutenberg blocks..."));
    await htmlToGutenbergProcessor.processBlocks(__dirname);

    console.log(chalk.green("✓ Block generation complete."));
  } catch (error) {
    console.error(chalk.red("Error occurred:"), chalk.red(error.message));
  }
};

// If the watch option is set, use chokidar to watch for changes
if (options.watch) {
  console.log(
    chalk.yellow(`Watching for changes in ${htmlToGutenbergProcessor}...`),
  );
  const watcher = chokidar.watch(htmlToGutenbergProcessor.inputDirectory, {
    persistent: true,
    ignored: /node_modules|\.git/,
  });

  watcher.on("change", (path) => {
    if (path.indexOf(".html") > -1) {
      console.log(chalk.magenta(`File changed: ${path}`));
      generateAndWriteFiles(); // Regenerate blocks when a file changes
    }
  });

  watcher.on("error", (error) => {
    console.error(chalk.red("Watch error:"), chalk.red(error));
  });

  generateAndWriteFiles();
} else {
  // If watch is not enabled, run the script once
  generateAndWriteFiles();
}
