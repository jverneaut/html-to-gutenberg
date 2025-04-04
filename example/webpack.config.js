import HTMLToGutenbergPlugin from "../index.js";

export default {
  mode: "production",
  entry: "./index.js",

  plugins: [
    // Build blocks with twig rendering
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      blocksPrefix: "custom",
      flavor: "twig",
    }),

    // Build blocks with PHP rendering
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      blocksPrefix: "custom",
      flavor: "php",
    }),
  ],
};
