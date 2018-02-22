require('./check-versions')();
process.env.NODE_ENV = 'production';

var webpack = require('webpack'),
    merge = require('webpack-merge'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config'),
    webpackConfig = require('./webpack.prod.conf');


var projectRoot = config.argv.projectRoot;
var projectDirname = config.argv.projectDirname;


var ora = require('ora'),
    rm = require('rimraf'),
    chalk = require('chalk');

var webpackConfigMin = merge(webpackConfig, {
    entry: config.entryJsMin,
    output: {
        filename: "[name].min.js",
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        })
    ]
});

webpackConfig = merge(webpackConfig, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                properties: false,
                warnings: false
            },
            output: {
                beautify: true,
                quote_keys: true
            },
            sourceMap: true
        })
    ]
});

var spinner = ora('building for production...');
spinner.start();

//rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
rm(projectDirname+'/dist', err => {
    //console.log(77666, projectRoot+'/build/static');
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
        spinner.stop();
        if (err) throw err
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n')

            console.log(chalk.cyan('  Build complete.\n'));
            // console.log(chalk.yellow(
            //     '  Tip: built files are meant to be served over an HTTP server.\n' +
            //     '  Opening index.html over file:// won\'t work.\n'
            // ));
            /*var delfile = ((program.m).split("/"))[0]
            del(delfile);*/
    });
    webpack(webpackConfigMin, function (err, stats) {});
});

