import HTMLToGutenbergPlugin from "../index.js";

export default {
  mode: "production",
  entry: "./index.js",

  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      blocksPrefix: "custom",
      engine: "all", // For demonstration purposes only. Use either "twig" or "php" for production environments
    }),
  ],
};
