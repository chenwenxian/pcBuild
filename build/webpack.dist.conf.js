var path = require('path')

var utils = require('./utils')
var webpack = require('webpack')

var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')


var config = require('./config')
var fileFolder = config.argv.m;
var projectRoot = config.argv.projectRoot;
var projectDirname = config.argv.projectDirname;
/*var program = require('./program.js')
var fileFolder = program.m*/

//var env = process.env.NODE_ENV === 'testing' ? require('./config/test.env') : config.build.env
var env = 'dist';

//console.log('posix====',path.posix.join('static', 'js/[name].js?[chunkhash]'));
//console.log('posix====',path.posix.join('static', 'js/[id].js?[chunkhash]'));
//console.log(config);

var webpackConfig = merge(baseWebpackConfig, {
    output: config.dist.output[config.dist.commonRemain] || {},
    /*externals: [
        '@common/src/jquery/jquery/1.11.0/jquery-1.11.0'
    ],*/
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
    plugins: [
        //new webpack.IgnorePlugin(/jquery-1.11.0.js/),
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
                from: path.resolve(projectDirname, 'src/'),
                to: './',//config.build.assetsSubDirectory,
                ignore: ['.*', 'entry-*.js', 'commonHead*.js', 'commonFooter*.js', '*.less']
            }
        ]),
        /*new CopyWebpackPlugin([
            {
                from: path.resolve(projectDirname, 'src/lib/'),
                to: './lib/',//config.build.assetsSubDirectory,
                ignore: ['.*', 'entry-*.js']
            }
        ]),*/
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
        /*new webpack.optimize.CommonsChunkPlugin({
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
        }),*/
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

module.exports = webpackConfig






// console.log(webpackConfig.plugins)