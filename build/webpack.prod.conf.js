var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var utils = require('./utils');
var webpack = require('webpack');

var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');


var config = require('./config')
var fileFolder = config.argv.m;
var projectRoot = config.argv.projectRoot;
var projectDirname = config.argv.projectDirname;
/*var program = require('./program.js')
var fileFolder = program.m*/

var env = process.env.NODE_ENV === 'testing' ? require('./config/test.env') : config.build.env


//console.log('posix====',path.posix.join('static', 'js/[name].js?[chunkhash]'));
//console.log('posix====',path.posix.join('static', 'js/[id].js?[chunkhash]'));
// console.log(process.env.NODE_ENV);
// console.log(config);
// console.log(path.resolve(projectDirname, 'src/lib/'));

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        /*rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        }),*/
        loaders: [
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "autoprefixer-loader"]
                })
            },
            {
                test: /\.less$/,
                exclude: /(node_modules)/,
                //include: [path.resolve(projectDirname, './static')],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", {
                        loader: "sprite-loader",
                        options: {
                            cssImagePath: "./spriteImg/",
                            outputPath: "../src/css/spriteImg/",
                        }
                    }, "less-loader", "autoprefixer-loader"]
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules)/,
                //loader: 'url?limit=8192'
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            useRelativePath: true,
                            name: '[name].[ext]?[hash]',
                            publicPath: '../'
                        }
                    },

                    /*{
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            useRelativePath: true,
                            //outputPath: 'static',
                            name: '[name][hash].[ext]',
                            //name: '[path][name].[ext]?[hash]',
                            publicPath: '../'
                        }  
                    }*/

                ]
            }
        ]
    },
    //devtool: config.build.productionSourceMap ? '#source-map' : false,
    /*output: {
        //path: config.build.assetsRoot,//   '/work/work/webpack_v3/dist/test'
        //path: config.argv.projectDirname,
        //filename: //utils.assetsPath('js/[name].js?[chunkhash]'),
        path: config.argv.projectDirname,
        filename: "[name].js",
        //chunkFilename: utils.assetsPath('js/[id].js?[chunkhash]')
    },*/
    plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                properties: false,
                warnings: false
            },
            output: {
                beautify: true,
                quote_keys: true
            },
            sourceMap: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),*/
        new CopyWebpackPlugin([
            {
                from: path.resolve(projectDirname, 'src/css/'),
                to: './css/',//config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(projectDirname, 'src/lib/'),
        //         to: './lib/',//config.build.assetsSubDirectory,
        //         ignore: ['.*', 'entry-*.js']
        //     }
        // ]),
        /*new CopyWebpackPlugin([
            {
                from: path.resolve(projectDirname, 'src/'),
                to: './',//config.build.assetsSubDirectory,
                ignore: [ '.*', 'entry-*.js']
            }
        ]),*/
        // extract css into its own file
        new ExtractTextPlugin({
            filename: '[name].css?[chunkhash]'//utils.assetsPath('css/[name].css?[chunkhash]')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //   filename: process.env.NODE_ENV === 'testing'
        //     ? 'index.html'
        //     : config.build.index,
        //   template: 'index.html',
        //   inject: false
        // }),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                  module.resource &&
                  /\.js$/.test(module.resource) &&
                  module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                  ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // copy custom static assets
        /*new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ])*/
        
    ]
})

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if(fs.existsSync(path.resolve(projectDirname, 'src/lib/'))){//判断  src/lib/文件夹存在
    webpackConfig.plugins.push(
        new CopyWebpackPlugin([
            {
                from: path.resolve(projectDirname, 'src/lib/'),
                to: './lib/',//config.build.assetsSubDirectory,
                ignore: ['.*', 'entry-*.js']
            }
        ])
    );
}

if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}



var tmsModuleJson = {
    config: {
        tmsModule: []
    },
    walk: function(dir){
        var _ts = this;
        dir = dir || '.';
        var directory = path.join(projectDirname, '../module/', dir);
        fse.readdirSync(directory).forEach(function(file, wenxian) {

            var fullpath = path.join(directory, file);

            //数据
            var stat = fse.statSync(fullpath);
            //.vue
            var extname = path.extname(fullpath);

            //console.log(wenxian, extname);

            if(stat.isFile()){
                if(extname === '.html'){
                    var vueContent = fse.readFileSync(fullpath, {encoding: 'utf8'});
                    var mConfig = '';

                    var moduleContent = '';
                    var moduleCodeList = [];

                    var moduleData = {};
                    var moduleDataCur = {};
                    var moduleConfig = '';
                   
                    vueContent.replace(/\[configStart\][\d\D]*\[configEnd\]/g, function() { 
                        mConfig = String(arguments[0].replace(/\n/g,'').replace(/ /g,'').replace(/\[configStart\]/,'').replace(/\[configEnd\]/,''));
                    });

                    vueContent.replace(/\<!-- moduleCodeStart --\>[\d\D]*\<!-- moduleCodeEnd --\>/g, function() { 
                        moduleContent = String(arguments[0].replace(/\n/g,'').replace(/\<!-- moduleCodeStart --\>/,'').replace(/\<!-- moduleCodeEnd --\>/,'').replace(/(^\s*)|(\s*$)/g, ""));
                        moduleCodeList = moduleContent.split("<!-- moduleCode -->");
                        if(moduleCodeList[0].length <=0){moduleCodeList.splice(0,1);}
                    });

                    moduleData= JSON.parse(mConfig);
                    moduleData.data=[];
                    //处理一个栏目数据列表
                    for(let i=0; i<moduleCodeList.length; i++){
                        moduleCodeList[i] = moduleCodeList[i].replace(/\[moduleConfigStart\][\d\D]*\[moduleConfigEnd\]/g, function() { 
                            moduleConfig = String(arguments[0].replace(/\n/g,'').replace(/ /g,'').replace(/\[moduleConfigStart\]/,'').replace(/\[moduleConfigEnd\]/,''));
                            return '';
                        }).replace(/\<!----\>/g, "").replace(/(^\s*)|(\s*$)/g, "");
                        moduleDataCur = JSON.parse(moduleConfig);
                        moduleDataCur.module = moduleCodeList[i]
                        moduleData.data.push(moduleDataCur);
                        if(i >= moduleCodeList.length-1){
                            _ts.config.tmsModule.push(moduleData);
                        }
                    }
                    //console.log(' _ts.tmsModule-----', JSON.stringify(_ts.config.tmsModule));
                    _ts.buildJsonContent(JSON.stringify(_ts.config.tmsModule));
                }
            } else if (stat.isDirectory() && file !== 'src' && file !== 'dist') {
                var subdir = path.join(dir, file);
                _ts.walk(subdir);
            }
        });
    },
    buildJsonContent: function(content){
        //var entryFile = path.join(projectDirname, '../build/tmsModuleJs.js');
        //var tmsModuleJson = 'var tmsModuleJson = '+content+';';
        var entryFile = path.join(projectDirname, '/src/js/tmsModuleJson.json')
        fse.outputFileSync(entryFile, content);
    }
};

if(fileFolder === 'tms/edit'){
    //生成TMS组件js文件
    tmsModuleJson.walk();
}

module.exports = webpackConfig


// console.log(webpackConfig.plugins)