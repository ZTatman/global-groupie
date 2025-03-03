const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoCesiumPlugin = require('craco-cesium');

const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = 'static/cesium';

module.exports = {
    plugins: [
        {
            plugin: CracoCesiumPlugin()
        }
    ],
    webpack: {
        alias: {
            cesium: path.resolve(__dirname, cesiumSource),
        },
        plugins: {
            add: [
                new CopyWebpackPlugin({
                    patterns: [
                        { from: path.join(cesiumSource, "Workers"), to: `${cesiumBaseUrl}/Workers` },
                        { from: path.join(cesiumSource, "ThirdParty"), to: `${cesiumBaseUrl}/ThirdParty` },
                        { from: path.join(cesiumSource, "Assets"), to: `${cesiumBaseUrl}/Assets` },
                        { from: path.join(cesiumSource, "Widgets"), to: `${cesiumBaseUrl}/Widgets` },
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
                zlib: false
            };
            
            return webpackConfig;
        }
    }
};
