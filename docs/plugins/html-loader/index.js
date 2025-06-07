module.exports = function (context, options) {
  return {
    name: "html-loader",
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.html$/,
              use: "raw-loader",
            },
          ],
        },
      };
    },
  };
};
