


var path = require('path');
var fse = require('fs-extra');
var config = require('./config');
var fileFolder = config.argv.m;
var projectRoot = config.argv.projectRoot;
var project = config.argv.project;
var projectDirname = config.argv.projectDirname;
var es3ifyPlugin = require('es3ify-webpack-plugin');


//console.log('projectRoot', projectRoot);

var entry = {},
    entryHtmlTpl = [],
    debug = true,//JSON.stringify(JSON.parse(process.env.BUILD_DEV || false)),
    plugin = [];

//console.log('wenxian======', process.env.NODE_ENV);
// process.env.NODE_ENV ==> dev:  development,   build: production


module.exports = {
    //入口文件
    //entry: entry,
    entry: config.entry,
    //watch: true,
    /*entry: {
        //base: ['./test/src/css/style.less'],
        enter: ['./test/src/js/entry-main']
        //'enter': path.join(projectRoot, 'test/src/js/entry-main')
    },*/
    //输出
    output: {
        //path: 'assets',
        path: path.resolve(projectDirname, 'dist'),
        filename: "[name].js",
        //publicPath: 'http://res.weplay.cn/app/www/templates/huya_live/assets/',
        //publicPath: '/',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    externals: [
        'CommonHead',
        'CommonFooter'
    ],
    //plugins: plugin,
    resolve: {
        //根目录遍历
        //root: [path.join(projectRoot, 'src'), path.join(projectRoot, 'node_modules')],
        modules: [path.join(projectRoot, 'node_modules')],//["node_modules"],
        /*alias: {
            server : "aaaa"
        },*/
        alias: {
            '@common': project+ '/common/',
            '@tms': project+ '/tms/',

            //apm
            'CommonHead': project+ '/common/dist/apm/commonHead',
            'CommonFooter': project+ '/common/dist/apm/commonFooter',
            'bindphone': project+ '/common/dist/apm/bindphone',

            //module
            'comment': project+ '/common/dist/module/comment/comment',

            //jquery plugin
            'lazyload': project+ '/common/dist/jquery/plugin/lazyload',
            'rollpic': project+ '/common/dist/jquery/plugin/rollpic',
            'jcarousellite': project+ '/common/dist/jquery/plugin/jcarousellite',
            'dsTab': project+ '/common/dist/jquery/plugin/dsTab',
            'jqfloat': project+ '/common/src/jquery/plugin/jqfloat',
            'zeroClipboard': project+ '/common/src/jquery/plugin/ZeroClipboard',
            'mCustomScrollbar': project+ '/common/dist/jquery/plugin/mCustomScrollbar'

        },
        aliasFields: ["browser"],
        //自动补全后缀
        extensions: ['.js', '.jsx', '.png', '.jpg', '.ejs', '.tpl'],
    },
    plugins: [
        new es3ifyPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx|ejs|tpl)$/,
                exclude: /(node_modules)/,
                //include: path.join(projectDirname, 'src'),
                //loaders: ['babel?optional=runtime']
                use: {
                    loader: 'babel-loader',
                    /*options: {
                        presets: ['env']
                    }*/
                    options: {
                        presets: ['env', 'es2015-loose'],
                        //presets: ['env'],
                        //plugins: ['transform-runtime', 'proxy']
                    }
                }
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    /*options: {
                        attrs: [':data-src']
                    }*/
                }
            },
            {
                test: /\.(ejs|tpl)$/,
                loader: 'ejs-loader?variable=dataTpl',
                /*query: { 
                    variable: 'data',
                    interpolate : '\\{\\{(.+?)\\}\\}', 
                    evaluate : '\\[\\[(.+?)\\]\\]' 
                }*/
            },
            {
                test: /\.(js|jsx)$/,
                //test: /\.js$/,
                exclude: /(node_modules|common)/,
                loader: "eslint-loader",
                options: {
                    failOnWarning: true,
                    failOnError: true,
                }
            }
        ]
    }
};

