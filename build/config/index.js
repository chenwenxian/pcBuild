var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var npm_config_message = process.env.npm_config_message;

var commonRemain = '';
if(process.env.npm_lifecycle_event === 'dist'){
    commonRemain = JSON.parse(process.env.npm_config_argv).remain[0] || '';//commonRemain => head or footer or ''
}


//fileFolder: test or test/xx
var fileFolder = (process.env.npm_lifecycle_event === 'dist') ? 'common' : ((npm_config_message !== '' && npm_config_message !== '%s') ? npm_config_message : false);
var projectRoot = path.resolve(__dirname, '../../'); // projectRoot: /work/work/webpack_v3/

if(!fileFolder){
    console.log('\x1b[40m \x1b[31m 小主: 您忘记输入目录咯！ \x1b[0m');
    console.log("正确命令1：npm run dev --m xxxx");
    console.log("正确命令2：npm run build --m xxxx");
    process.exit();
    return false;
}else if(!fs.existsSync(path.resolve(projectRoot, fileFolder))){//fs.exists已经废除了
    console.log('\x1b[40m \x1b[31m 小哥，我很无奈，目录找不到！！！ \x1b[0m');
    process.exit();
    return false;
}
var projectDirname = path.resolve(projectRoot, fileFolder); //projectDirname: /work/work/webpack_v3/test
//__dirname : /work/work/webpack_v3/build/config
var entry = {},
    entryJsMin = {},
    entryHtmlTpl = {};
console.log("准备调试该目录："+projectDirname+"文件夹 ");

var isStrStatic = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dist') ? '' : 'dist';
var webpackHot = 'webpack-hot-middleware/client'
function walk(dir) {
    dir = dir || '.';

    //var directory = path.join(projectRoot, './'+fileFolder+'/src', dir);
    var secondaryFile = (dir.split('/'))[0] || '';//二级目录比如：static or src
    var directory = path.join(projectRoot, './'+fileFolder, dir).replace(/\\/g, '/');
    var relativePath = path.join(fileFolder, dir);// test/src/ or test/src/css or test/src/css/img
    //path.join(__dirname, '../src/build/')
    //var entryDirectory = path.join(projectRoot, dir);//不用
    fse.readdirSync(directory)
        .forEach(function(file) {
     
        var fullpath = path.join(directory, file);

        //数据
        var stat = fse.statSync(fullpath);
        var __writeFile = "";
        //.vue
        var extname = path.extname(fullpath);//.js
        if (stat.isFile()) {
            var basename = path.basename(fullpath);//polyfill.js
            // path.basename(file, extname) //polyfill
            //  'dist/css/css-style': './test/src/css/style.less',


          /*  commonRemain : head  or footer  or ''
            head  commonHead.js
            footer commonFooter.js
            '' entry-*/
            var ruleJs = ((commonRemain === 'head' && basename.match(/^commonHead/ig)) || (commonRemain === 'footer' && basename.match(/^commonFooter/ig)) || (commonRemain === '' && basename.match(/^entry-/ig)));

            if(extname === ".js" && ruleJs && secondaryFile === "src"){//只对src做js编译
                //var entryFile = path.join(directory, basename); //绝对路径
                var entryFile = './'+path.join(relativePath, basename);//相对路径
                var name = isStrStatic+path.join(dir, path.basename(file, extname)).replace('src', '');
                //name: test/src/js/entry-main
                //entryFile: /work/work/webpack_v2/test/src/js/entry-main.js
                if(process.env.NODE_ENV !== 'production'){
                    __writeFile = path.join(__dirname,"../../"+entryFile);   
                    fs.readFile(__writeFile, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
                        if(err) {console.error(err);return;}
                        var htmlData = data;
                        var strHot = new RegExp("//添加热加载api判断添加可以删除");
                        if(!strHot.test(htmlData)){    //正则判读是否存在
                            fs.appendFile(__writeFile, '\n//添加热加载api判断添加可以删除\nif(module.hot){module.hot.accept();}', function () {
                                console.log(entryFile+"文件成功添加热加载");
                            });
                        }
                    });
                }
                

                if( process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dist' ){
                    entry[name] = entryFile;
                }else{//开发模式+热更新
                    entry[name] = [webpackHot,entryFile];
                }
                //ie8.Js
                entryJsMin[name] = entryFile;
                   
                // requestHandlerFun(entryFile);
            }else if(extname === ".less" && secondaryFile === "src"){//只对src做less编译
                var entryFile = './'+path.join(relativePath, basename);
                var name = isStrStatic+path.join(dir, path.basename(file, extname)).replace('src', '');
                
                if( process.env.NODE_ENV === 'production'){
                    entry[name] = entryFile;
                }else{
                    entry[name] = [webpackHot,entryFile];
                }
                /*var entryFile = './'+path.join(relativePath, basename);
                var name = path.join(dir, path.basename(file, extname)).replace('src', '');
                entry[name] = entryFile;*/

            }else if(extname === ".html"){
                //var entryFile = './'+path.join(relativePath, basename);//相对路径
                var entryFile = fullpath;//相对路径
                var name = path.join(dir, path.basename(file, extname)),
                    __writeFile = entryFile;   
                
                if(process.env.NODE_ENV === 'production'){
                    fs.readFile(__writeFile, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
                        var htmlData = data;  //获取html模板
                        var _tempHtmlData = htmlData;
                        var linkStr = htmlData.match(/<!-- S codeSCRIPT-->.*?<!-- E codeSCRIPT-->[\r\n]?\ ?/g);
                        if(linkStr == null){
                            return false;
                        }
                        for(var _index in linkStr){
                            _tempHtmlData = _tempHtmlData.replace(linkStr[_index], "");
                        }
                        __devHtml = _tempHtmlData;
                        writeFileFun(__devHtml)          
                    });
                }else{
                    var __devHtml = "";
                    fs.readFile(__writeFile, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
                        if(err) {console.error(err);return;}
                        var htmlData = data;  //获取html模板
                        var _tempHtmlData = htmlData;
                        var linkStr = htmlData.match(/<link href=\"\.\/dist\/css\/.*?\.css".*?\/>/g);
                        var delScriptStr = htmlData.match(/<!-- S codeSCRIPT-->.*?<!-- E codeSCRIPT-->[\r\n]?\ ?/g);
                        var srcArr = [];
                        if(linkStr == null){
                            return false;
                        }
                        for(var _indexdel in delScriptStr){
                            _tempHtmlData = _tempHtmlData.replace(delScriptStr[_indexdel], "");
                        }
                        for(var _index in linkStr){
                            var _hrefStr = linkStr[_index].match(/href="(.*?)"/ig);
                            var _hrefItem = _hrefStr[0].match(/"(.*?)"/ig);
                            var _replHref = _hrefItem[0].replace(/\.css/, ".js");
                            var jsSrc = '<script src='+_replHref+' type="text/javascript"></script>';
                            var _replStr = linkStr[_index]+"\n<!-- S codeSCRIPT-->"+jsSrc+"<!-- E codeSCRIPT-->";
                            _tempHtmlData = _tempHtmlData.replace(linkStr[_index], _replStr);
                        }
                        __devHtml = _tempHtmlData;
                        writeFileFun(__devHtml)                      
                    });
                    
                }
                function writeFileFun(__devHtml){
                    fs.writeFile(__writeFile, __devHtml, function (err) {
                        if(err) {console.error(err); return false;} 
                        console.log("css热替换已加载");
                    });
                }
                entryHtmlTpl[name] = entryFile;
            }

            //测试less
            //entry['static/css/style']= './test/static/css/style.less';
        } else if (stat.isDirectory() && file !== 'dist') {
            var subdir = path.join(dir, file).replace(/\\/g, '/');
            walk(subdir);
        }
    });
}
walk();




module.exports = {
    entryJsMin: entryJsMin,
    entry: entry,
    entryHtmlTpl: entryHtmlTpl,
    argv: {
        m: fileFolder,
        projectRoot: projectRoot,
        project: projectRoot+'/'+(fileFolder.split("/"))[0],
        projectDirname: projectDirname,

    },
    dev: {
        env: require('./dev.env'),
        port: 8081,
        autoOpenBrowser: true,
        assetsSubDirectory: 'dist',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    },
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../../dist/'+fileFolder+'/index.html'),
        assetsRoot: path.resolve(__dirname, '../../dist/'+fileFolder),
        assetsSubDirectory: 'dist',
        // assetsPublicPath: 'http://m.aipai.com/'+'aipai_platform/mobile/m_ticket/index/static/'+fileFolder+'/',
        assetsPublicPath: './',    
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dist: {
        commonRemain: commonRemain,
        output: {
            head: {
                publicPath: './',
                library: 'CommonHead',
                libraryTarget: 'umd'
            },
            footer: {
                publicPath: './',
                library: 'CommonFooter',
                libraryTarget: 'umd'
            },

        }
    }
}

