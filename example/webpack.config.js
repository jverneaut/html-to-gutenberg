import HTMLToGutenbergPlugin from "../index.js";
import GutenbergWebpackPlugin from "@jverneaut/gutenberg-webpack-plugin";

export default {
  entry: "./index.js",

  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      defaultNamespace: "custom",
      removeDeletedBlocks: true, // Deletes blocks in outputDirectory that no longer have a corresponding source HTML file
    }),

    // Optionally use this webpack plugin to build the blocks instead of @wordpress/scripts
    new GutenbergWebpackPlugin("./generated"),
  ],
};
