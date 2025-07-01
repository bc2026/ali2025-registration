// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.allowedHosts = "all"; // ← This line fixes the error
    return devServerConfig;
  },
};
