const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
    webpack: config => {
        config.entry.main = [
            './src/index.ts'
        ];

        config.resolve = {
            extensions: ['.ts', '.js', '.json'],
            plugins: [
                new TsConfigPathsPlugin()
            ]
        };

        config.module.rules.push({
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        });

        return config;
    }
}
