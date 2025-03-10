const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoCesiumPlugin = require('craco-cesium');

const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = 'static/cesium';

module.exports = {
  plugins: [
    {
      plugin: CracoCesiumPlugin(),
    },
  ],
  // Simplified ESLint configuration
  eslint: {
    enable: true,
    // Use the new flat config format
    useEslintrc: false,
    // We'll manually run eslint using our npm script
    mode: 'extends',
  },
  webpack: {
    alias: {
      cesium: path.resolve(__dirname, cesiumSource),
      '@': path.resolve(__dirname, './src'), // Add the '@' alias for src
      '@components': path.resolve(__dirname, './src/components'),
      '@spec': path.resolve(__dirname, './spec'),
    },
    plugins: {
      add: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(cesiumSource, 'Workers'),
              to: `${cesiumBaseUrl}/Workers`,
            },
            {
              from: path.join(cesiumSource, 'ThirdParty'),
              to: `${cesiumBaseUrl}/ThirdParty`,
            },
            {
              from: path.join(cesiumSource, 'Assets'),
              to: `${cesiumBaseUrl}/Assets`,
            },
            {
              from: path.join(cesiumSource, 'Widgets'),
              to: `${cesiumBaseUrl}/Widgets`,
            },
          ],
        }),
      ],
    },
    configure: (webpackConfig) => {
      webpackConfig.output.sourcePrefix = '';

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        zlib: false,
      };

      // Add the rule for .m?js files from your simplified config
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
  },
};
