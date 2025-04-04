import HTMLToGutenbergPlugin from "../index.js";

export default {
  mode: "production",
  entry: "./index.js",

  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      blocksPrefix: "custom",
      flavor: "twig",
    }),

    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      blocksPrefix: "custom",
      flavor: "php",
    }),
  ],
};
