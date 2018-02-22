require('./check-versions')();

var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var config = require('./config');
var projectDirname = config.argv.projectDirname;
var fs = require('fs');
/*var npm_config_message = process.env.npm_config_message;
//argv.m = 'test';//argv._[0];
argv.m = (npm_config_message !== '' && npm_config_message !== '%s') ? npm_config_message : false;
//console.log('wenxian', argv.m);
if(typeof argv.m !== 'string'){
  console.log('\x1b[40m \x1b[31m 小主: 您忘记输入目录咯！ \x1b[0m')
  console.log('\x1b[40m \x1b[31m 正确命令1：npm run dev -- xxxx \x1b[0m')
  console.log('\x1b[40m \x1b[31m 正确命令2：npm run build -- xxxx \x1b[0m')
  console.log('\n')
  process.exit();
  return true;
}

var projectRoot = path.resolve(__dirname, '../');
var projectDirname = path.resolve(projectRoot, argv.m);
var entry = {},
    debug = true,//JSON.stringify(JSON.parse(process.env.BUILD_DEV || false)),
    plugin = [];
*/

/*-----------   开始  -------------*/


//console.log("config: ", config);
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn');
var express = require('express');
var proxyMiddleware = require('http-proxy-middleware');


//process.env.NODE_ENV undefined
var webpackConfig = process.env.NODE_ENV === 'testing'
    ? require('./webpack.prod.conf')
    : require('./webpack.dev.conf');


var port = process.env.PORT || config.dev.port;
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
var proxyTable = config.dev.proxyTable;
var app = express();


var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    // quiet: true,
    hot: true,
    stats: {
        colors: true
    }

})
var hotMiddleware = require('webpack-hot-middleware')(compiler)

// var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//     compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//         // console.log('html-webpack-plugin-after-emit');
//         // hotMiddleware.publish({ action: 'overlay' })
//         cb()
//     })
// });


// 将 proxyTable 中的代理请求配置挂在到express服务器上
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    // 格式化options，例如将'www.example.com'变成{ target: 'www.example.com' }
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

//if(fileFolder === 'tms/edit'){
    var questions=[{
            data:213,
            num:444,
            age:12
        },
        {
            data:456,
            num:678,
            age:13
        }];
    app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
       res.header("X-Powered-By",' 3.2.1');
       res.header("Content-Type", "application/json;charset=utf-8");
       next();
    });
    app.get('/api',function(req,res){

        res.status(200)
        res.json(questions)
        
    });
//}

app.use(require('connect-history-api-fallback')());
app.use(devMiddleware);
app.use(hotMiddleware);

//var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
var staticPath = path.posix.join(config.argv.projectDirname, config.dev.assetsSubDirectory);

var staticPath = './build/dist';//path.posix.join('./build', 'static');
app.use(staticPath, express.static('./dist'));


//检测端口号是否被占用
var net = require('net')
function probe(port, callback) {
    var server = net.createServer().listen(port)
    var calledOnce = false
    var timeoutRef = setTimeout(function () {
            calledOnce = true
            callback(false,port)
        }, 2000);
    timeoutRef.unref();
    var connected = false
    server.on('listening', function() {
        clearTimeout(timeoutRef)
        if (server)
            server.close()
        if (!calledOnce) {
            calledOnce = true
            callback(true,port)
        }
    });
    server.on('error', function(err) {
        clearTimeout(timeoutRef);
        var result = true;
        if (err.code === 'EADDRINUSE')
            result = false;
        if (!calledOnce) {
            calledOnce = true;
            callback(result,port);
        }
    });
}
// 被占用时获取新的端口号
var server = null;
function serverfun(_port){
    var pt = _port || __port;
    probe(pt,function(bl,_pt){
        // 端口被占用 bl 返回false
        // _pt：传入的端口号
        if(bl === true){
            openBrowser();
            server = app.listen(port);
        }else{
            port +=1; 
            serverfun(port);
            // console.log("失败")
        }
    });
}
serverfun(port);


var _resolve;
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

function openBrowser(){
    var uri = 'http://localhost:' + port;
    console.log('> Starting dev server...');
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n');
        // when env is testing, don't need open it
        if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
            opn(uri);
        }
        _resolve();
    });
}
function delFUn(){
    var htmlData = "";
    var _entry = config.entryHtmlTpl;
    var projectDirFile = null //projectDirname: /work/work/webpack_v3/test
    var projectDirFileArr = [];
    for(var _delindex in _entry){
        htmlData = fs.readFileSync(_entry[_delindex], {flag: 'r+', encoding: 'utf8'});   
        var linkStr = htmlData.match(/<!-- S codeSCRIPT-->.*?<!-- E codeSCRIPT-->[\r\n]?\ ?/g);
        if(linkStr == null){
            return false;
        }
        var _tempHtmlData = "";
        for(var _index in linkStr){
            _tempHtmlData = htmlData.replace(linkStr[_index], "");
        }     
        var __devHtml = _tempHtmlData;
        fs.writeFileSync(_entry[_delindex], __devHtml);  
    }
}

// var server = app.listen(port)
process.on('SIGINT', function(){
    server.close();
    process.exit(0);  
});
process.on('exit', function () {
    console.log("\n 小的，告辞！！！!");
    delFUn();
});


module.exports = {
    ready: readyPromise,
    close: () => {
        /*var delfile = ((program.m).split("/"))[0];
        del(delfile);*/
        server.close();
    }
}
//process.exit();
//return false ;