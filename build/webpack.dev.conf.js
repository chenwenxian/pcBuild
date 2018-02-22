

var webpack = require('webpack');
//var utils = require('./utils');
var path = require('path');
var fse = require('fs-extra');
var merge = require('webpack-merge');
var SpritesmithPlugin = require('webpack-spritesmith');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var baseWebpackConfig = require('./webpack.base.conf');

var config = require('./config');
var fileFolder = config.argv.m;
var project = config.argv.project;
var projectRoot = config.argv.projectRoot;
var projectDirname = config.argv.projectDirname;


console.log('wenxina....', projectRoot);

var plugins = [
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env': config.dev.env
    }),
    //OccurrenceOrderPlugin默认已经启动，可以不用new
    //new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    /*new SpritesmithPlugin({
        src: {
            cwd: path.resolve(projectDirname, 'src/css/spriteImg'),
            glob: '*.png'
        },
        target: {
            image: path.resolve(projectDirname, 'src/css/sprite/sprite.png'),
            css: path.resolve(projectDirname, 'src/css/sprite/sprite.css')
        },
        apiOptions: {
            cssImageRef: './sprite.png'
        },
        spritesmithOptions: {
            algorithm: 'top-down'
        }
    }),*/
    /*new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    }),*/
    /*new HtmlWebpackPlugin({
        filename: 'index.html',
        template: projectDirname+'/index.html',
        inject: false,//不需要构建工具加js
        //chunks: ["manifest", "vendor" , 'dist/js/entry-main']
    }),*/
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin([
        {
            from: path.resolve(projectDirname, 'src/'),
            to: 'dist',//config.build.assetsSubDirectory,
            ignore: ['.*']
        }
    ]),
    new CopyWebpackPlugin([
        {
            from: path.resolve(project, 'common/dist'),
            //from: path.resolve(projectRoot, 'common/dist'),
            to: 'common/dist',//config.build.assetsSubDirectory,
            ignore: ['.*']
        }
    ]),
    new CopyWebpackPlugin([   //这个操作主要是为了防止报错
        {
            from: path.resolve(projectRoot, 'build/temp/js'),
            to: 'dist',//config.build.assetsSubDirectory,
            ignore: ['.*']
        }
    ]),
    // new CopyWebpackPlugin([  //这个操作主要是为了防止报错
    //     {
    //         from: path.resolve(projectRoot, 'build/temp/css'),
    //         to: 'static/css',//config.build.assetsSubDirectory,
    //         ignore: ['.*']
    //     }
    // ]),
    // extract css into its own file
    //http://localhost:8081/static/css/static/css/style.css
    new ExtractTextPlugin({
        filename: '[name].css' // http://localhost:8081/static/css/style.css
    }),
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true
        }
    }),
];

/*相对目录是从执行命令环境的目录开始，所以需要./build/dev-client*/
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});
Object.keys(config.entryHtmlTpl).forEach(function (name) {

    //http://www.51xiaolian.com/q-358.html
    //http://www.jianshu.com/p/2c849a445a91
    var conf = {
        /*minify: {
            ignoreCustomFragments: [ /${[a-zA-Z]*?}/]
        },*/

        filename: name+'.html',
        template: config.entryHtmlTpl[name],
        inject: false,//不需要构建工具加js
        //chunks: ["manifest", "vendor" , 'dist/js/entry-main']
    };
    plugins.push(new HtmlWebpackPlugin(conf));
});

//fileFolder
//  tms/edit

//projectRoot
//  /work/work/AipaiPlatformTemplates/templates/aipai_platform/pc_v2

//projectDirname
//  /work/work/AipaiPlatformTemplates/templates/aipai_platform/pc_v2/tms/edit

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

module.exports = merge(baseWebpackConfig, {
    plugins: plugins,
    module: {
        //rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
        loaders: [
            {
                test: /\.(less|css)$/,
                exclude: /(node_modules)/,
                loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules)/,
                //loader: 'url?limit=8192'
                use: [
                    /*{
                        loader: 'url-loader',
                        options: {
                          limit: 8192
                        }
                    },*/
                    {
                        loader: 'file-loader',
                        options: {
                            useRelativePath: true,
                            //outputPath: 'static',
                            name: '[name][hash].[ext]',
                            //name: '[path][name].[ext]?[hash]',
                            //publicPath: ''
                        }  
                    }
                ]
            },
        ]
        /*loaders: [
            {
                test: /\.(less|css)$/,
                exclude: /(node_modules)/,
                //loader: 'style!css!autoprefixer!less',
                use: [
                    { loader: ExtractTextPlugin.extract("style-loader, css-loader") },
                    { loader: "css-loader" },
                    { loader: "autoprefixer-loader" },
                    { loader: "less-loader" },
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules)/,
                //loader: 'url?limit=8192'
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                          limit: 8192
                        }
                    }
                ]
            }
        ]*/
    },
    devtool: 'eval',
    /*// cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]*/
});










