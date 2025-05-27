import HTMLToGutenbergPlugin from "../index.js";
import GutenbergWebpackPlugin from "@jverneaut/gutenberg-webpack-plugin";

export default {
  mode: "development",
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

  module: {
    rules: [
      {
        // Handle React JSX with babel-loader
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
