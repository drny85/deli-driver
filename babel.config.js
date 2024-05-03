module.exports = function (api) {
  api.cache(true);
  const plugins = ['transform-inline-environment-variables'];

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
