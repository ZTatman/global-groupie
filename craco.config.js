const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = 'static/cesium';

module.exports = {
    webpack: {
        // alias: {
        //     cesium: path.resolve(__dirname, 'node_modules/@cesium/engine'),
        // },
        plugins: {
            add: [
                new CopyWebpackPlugin({
                    patterns: [
                        { from: path.join(cesiumSource, "Workers"), to: `${cesiumBaseUrl}/Workers`, },
                        { from: path.join(cesiumSource, "ThirdParty"), to: `${cesiumBaseUrl}/ThirdParty`, },
                        { from: path.join(cesiumSource, "Assets"), to: `${cesiumBaseUrl}/Assets`, },
                        { from: path.join(cesiumSource, "Widgets"), to: `${cesiumBaseUrl}/Widgets`, },
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
            return webpackConfig;
        },
    },
};
