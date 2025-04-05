module.exports = function override(config, env) {
  const babelLoader = config.module.rules
    .find(rule => Array.isArray(rule.oneOf)).oneOf
    .find(rule => rule.loader && rule.loader.includes('babel-loader'));

  if (babelLoader) {
    babelLoader.options.plugins = [
      ...(babelLoader.options.plugins || []),
      '@babel/plugin-proposal-optional-chaining',
    ];
  }

  return config;
};

