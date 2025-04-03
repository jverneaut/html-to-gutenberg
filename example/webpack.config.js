import HTMLToGutenbergPlugin from "../index.js";

export default {
  mode: "production",
  entry: "./index.js",

  plugins: [
    new HTMLToGutenbergPlugin({
      inputDirectory: "./blocks",
      outputDirectory: "./generated",
      blockPrefix: "custom",
    }),
  ],
};
