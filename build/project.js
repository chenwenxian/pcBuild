require('./check-versions')();
process.env.NODE_ENV = 'production';

var webpack = require('webpack'),
    path = require('path'),
    fs = require('fs');

var npm_config_message = process.env.npm_config_message;
var fileFolder = (process.env.npm_lifecycle_event === 'dist') ? 'common' : ((npm_config_message !== '' && npm_config_message !== '%s') ? npm_config_message : false);    
// console.log(fileFolder);
var projectRoot = path.resolve(__dirname,"../"); 
var projectDirname = projectRoot+"/"+fileFolder;

let folderStr =  fileFolder.split("/");
let folderStrLen = folderStr.length;
let newPath = "";
for(let i = 0; i<folderStrLen; i++){
    newPath += "/"+folderStr[i];  
    if(!fs.existsSync(projectRoot + newPath)){
        fs.mkdirSync(projectRoot + newPath);
    }
}

var fileFolderArrLength = fileFolder.split("/").length; //获取目录层级
var fileFolderName = fileFolder;
var chalk = require('chalk');

//创建目录 
function mkdirFile(data){
    // data = {
    //     file : "",   //创建的文件名
    //     callfun : function(){   //回调函数
    //     }
    // }
    if(!fs.existsSync(projectDirname+'/'+data.file)){
        fs.mkdir(projectDirname+'/'+data.file,function(err){ 
            if(typeof data.callfun != "undefined"){
                var clickfun = data.callfun;
                clickfun();
            }
        }); 
    }else{
        if(typeof data.callfun != "undefined"){
            var clickfun = data.callfun;
            clickfun();
        }
        console.log("文件存在了，不能重新创建了 😥  "+data.file);
    };
}

//写入内容到文件中，不会追加,如果文件没有即会立即创建
function writeFile(data){
    // data = {
    //     directory : "",   //文件目录
    //     fileName : "",    //文件名
    //     content : "",   //文件内容
    //     callfun : function(){   //回调函数
    //     }
    // }
    // console.log(projectDirname+'/'+data.directory+'/'+data.fileName);
    if(!fs.existsSync( projectDirname+'/'+data.directory+'/'+data.fileName)){ //判断不存在才创建
        fs.writeFile(projectDirname+'/'+data.directory+'/'+data.fileName, data.content, function (err) {
            if (err) {console.log(err);} 
            if(typeof data.callfun != "undefined"){
                var clickfun = data.callfun;
                clickfun();
            }
        });
    }else{
        if(typeof data.callfun != "undefined"){
            var clickfun = data.callfun;
            clickfun();
        }
        console.log("文件存在了，不能重新创建了 😥  "+data.fileName);
    }; 
    
}

var fileSrcData = {
    file : "src",
    callfun : function(){
        mkdirFile({
            file:"src/css",
            callfun : function(){
                mkdirFile({file:"src/css/img"});                
                mkdirFile({file:"src/css/sprite"});
                mkdirFile({file:"src/css/spriteImg"});
                writeFile({
                        directory : "src/css",   //文件目录
                        fileName : "index.less",    //文件名
                        content : "",   //文件内容                        
                });
            }
        });
        mkdirFile({
            file:"src/js",
            callfun : function(){
                mkdirFile({file:"src/js/tpl"});
                writeFile({
                    directory : "src/js",   //文件目录
                    fileName : "entry-index.js",    //文件名
                    content :   "import { $, cookies } from 'CommonHead';\n"+
                                "// import comment from '@common/src/module/comment/comment';\n"+
                                "import head from '@common/src/module/head/entry-head.js';\n"+
                                "import Apm from '@common/src/apm/apm';\n"+
                                "let apm = new Apm({$: $, cookies: cookies});",                      
                });
            }
        });        
    }
};
// var fileStaticData = {
//     file : "static",
//     callfun : function(){
//         writeFile({
//             directory : "static",   //文件目录
//             fileName : "manifest.js",    //文件名
//             content : "",   //文件内容                        
//         });
//         writeFile({
//             directory : "static",   //文件目录
//             fileName : "vendor.js",    //文件名
//             content : "",   //文件内容                        
//         });
//     }
// };
// mkdirFile(fileStaticData);

//创建 html
function createHtml(htmlmod){
    fs.readFile(projectRoot+"/build/index.html", {flag: 'r+', encoding: 'utf8'}, function (err, data) {
        if(err) {console.error(err);return;}
        // writeFileFun(__devHtml)  
        var linkStr = data.match(/\$\{被替换为目录层级\}\$/g);
        var nameStr = data.match(/\$\{替换为文件的名字\}\$/g);
        var floderStr = data.match(/\$\{替换为文件夹层级\}\$/g);
        var htmlStr = data.match(/\<\!\-\-\$\{被替换页面主要内容\}\$\-\-\>/g);
        
        var replaceStr = "";
        for (var _lenIndex = 0; _lenIndex<fileFolderArrLength;_lenIndex++){
            replaceStr += "../";
        }
        var _tempHtmlData = data;
        for(var linkStr_index in linkStr){
            _tempHtmlData = _tempHtmlData.replace(linkStr[linkStr_index], replaceStr);
        } 
        for(var nameStr_index in nameStr){
            _tempHtmlData = _tempHtmlData.replace(nameStr[nameStr_index], htmlmod);
        } 

        _tempHtmlData = _tempHtmlData.replace(floderStr, fileFolderName);
        _tempHtmlData = _tempHtmlData.replace(htmlStr, "");        
        // console.log(_tempHtmlData);   
        writeFile({
            directory : "",   //文件目录
            fileName : htmlmod+".html",    //文件名
            content : _tempHtmlData,   //文件内容    
            callfun : function(){
                console.log("项目创建完成，开始加班吧！！！😏 😏");            
            }                  
        });                    
    });
}

function getArgvFun(){   //获取传入的参数，查看是否创建的类型
    var _getArgv = JSON.parse(process.env.npm_config_argv).remain[0] || '';//commonRemain => head or footer or ''
    var allArgv =  JSON.parse(process.env.npm_config_argv).original;
    var replaceStr = new RegExp(":"),
        _getArgvArr = [];
    for(var allArgvI = 0;allArgvI<allArgv.length;allArgvI++){
        if(replaceStr.test(allArgv[allArgvI])){
            _getArgvArr.push(allArgv[allArgvI]);
        }
    }
    var para=_getArgvArr;
        _getArgvObj = {};
    for(var i=0,len=_getArgvArr.length;i<len;i++){
        var temp=_getArgvArr[i].split(":");
        _getArgvObj[temp[0]] = temp[1];
    }
    //npm run project --m zt/2017/project name: index_v2
    //name 参数表示新建html模版的名字   不需要加后缀
    //有name参数时表示创建新的html模版，不创建css及js
    if(_getArgvObj.name != undefined){     //只创建html
        createHtml(_getArgvObj.name);
        writeFile({
            directory : "src/js",   //文件目录
            fileName : "entry-"+_getArgvObj.name+".js",    //文件名
            content :   "import { $, cookies } from 'CommonHead';\n"+
                        "// import comment from '@common/src/module/comment/comment';\n"+
                        "import head from '@common/src/module/head/entry-head.js';\n"+
                        "import Apm from '@common/src/apm/apm';\n"+
                        "let apm = new Apm({$: $, cookies: cookies});",                      
        });
        writeFile({
            directory : "src/css",   //文件目录
            fileName : _getArgvObj.name+".less",    //文件名
            content : "",   //文件内容                        
    });
    }else{  //创建项目基本文件
        mkdirFile(fileSrcData);
        createHtml("index");
        console.log(chalk.magenta(
            '可通过如下命令创建新的html模版：\n'+
            'name参数表示新建html模版的名字 不需要加后缀\n'+
            '有name参数时表示创建新的html模版，不会创建css及js'
        ));
        console.log(chalk.red(
            'npm run project --m xxxx name:index_v2\n'
        ));
    }
}
getArgvFun();



