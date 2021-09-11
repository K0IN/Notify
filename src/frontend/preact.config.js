module.exports = function (config, env) {
    if (env.isProd) {
        config.devtool = false; // disable sourcemaps
    }
}