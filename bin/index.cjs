#!/usr/bin/env node

const { program } = require("commander");
const chokidar = require("chokidar");
const chalk = require("chalk").default;

const packageJSON = require("../package.json");

const HTMLToGutenberg = require("../src/HTMLToGutenberg.js").default;

program
  .name("npx " + packageJSON.name.split("/")[1])
  .description(packageJSON.description)
  .version(packageJSON.version)

  .option("-i, --input <path>", "HTML blocks input path", ".")
  .option("-o, --output <path>", "Gutenberg blocks output path")
  .option("-p, --prefix <type>", "Blocks namespace", "custom")
  .option(
    "-e, --engine <type>",
    'Engine (either "php", "twig" or "all")',
    "php",
  )
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
  engine: options.engine,
};

const htmlToGutenberg = new HTMLToGutenberg(htmlToGutenbergOptions);

const generateAndWriteFiles = async () => {
  try {
    if (options.watch) {
      console.clear();
    }

    console.log(chalk.cyan("Generating Gutenberg blocks..."));
    const generatedFiles = await htmlToGutenberg.generateFiles();

    console.log(chalk.cyan("Writing generated files..."));
    const generatedBlocksPaths = htmlToGutenberg.writeFiles(generatedFiles);

    console.log(chalk.green("Block generation complete."));
    generatedBlocksPaths.forEach((path, index) => {
      console.log(
        chalk.green("\t✓") + chalk.dim(` ${index + 1}. ${chalk.bold(path)}`),
      );
    });
  } catch (error) {
    console.error(chalk.red("Error occurred:"), chalk.red(error.message));
  }
};

// If the watch option is set, use chokidar to watch for changes
if (options.watch) {
  console.log(
    chalk.yellow(
      `Watching for changes in ${htmlToGutenberg.inputDirectory}...`,
    ),
  );
  const watcher = chokidar.watch(htmlToGutenberg.inputDirectory, {
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
