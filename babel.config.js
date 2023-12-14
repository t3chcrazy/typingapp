module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-syntax-jsx",
      [
        'module:react-native-dotenv',
        {
          moduleName: 'react-native-dotenv',
          verbose: false,
        },
      ],
      "react-native-reanimated/plugin"
    ]
  };
};