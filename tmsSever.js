var PORT = 30102;


var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./build/config/mine').types;
var path=require('path');
var express = require('express');
var app = express();
var opn = require('opn');
var path = require('path');
var htmlBeautifier = require('js-beautify');
var querystring = require("querystring");
var cmd=require('node-cmd');


//获取文件加的根目录
var projectRoot = path.resolve(__dirname); 

//获取当前年份作为大文件夹的名字
const myDate = new Date();
const year = myDate.getFullYear();

//定义对应的生成的专题目录
const tmsPath = 'aa/layoutit/'+year+'/';
const ztPath = 'bb/layoutit/'+year+'/';

//返回的数据
let returnAjaxMsg = [];

let server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

    if (pathname.charAt(pathname.length - 1) == "/") {
        //如果访问目录
        pathname += "index.html"; //指定为默认网页
    }
    var realPath = path.join("./",pathname);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    let postData = "";
    request.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    request.addListener("end", function () {
        //接口判断
        if(handleNodeApi.init({request, pathname, response, realPath, ext, postData})){
            return false;
        }
        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                response.write("<style>p{font-size:60px;text-align:center;line-height:300px;}</style><p>404</p>");
                response.end();
            } else {
                rendering.init({response,realPath,ext,request})
            }
        });
        response.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8"
        });
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
const _url = 'http://localhost:'+PORT+'/tms/edit/';
opn(_url);
//判断对象是否为空
function isEmptyObject(obj) {
    　　for (var name in obj) {
        　　　　return false;//返回false，不为空对象
    　　}
    　　return true;//返回true，为空对象
}

//处理接口
const handleNodeApi = {
    config: {
        pathname: null,
        request: null,
        response: null,
        realPath: null,
        ext: null,
        params: null, 
        postData: null,       
    },
    init: function(opt){
        // console.log(name)
        let {request, pathname, response, realPath, ext, postData} = opt;
        let urlArr = pathname.split("/"),
            getDataName = urlArr[urlArr.length-1];
        if(pathname === "/sendDataApi" && getDataName === "sendDataApi"){
            handleNodeApi.config.pathname = pathname;
            handleNodeApi.config.request = request;
            handleNodeApi.config.response = response;
            handleNodeApi.config.realPath = realPath;
            handleNodeApi.config.ext = ext;
            handleNodeApi.config.postData = postData;
            handleNodeApi.handleParams();
            return true;
        }
    },
    handleParams: function(){
        let request = handleNodeApi.config.request;

        let postData = handleNodeApi.config.postData;
        let params = "";
        if(postData == ""){  //get
            params = url.parse(request.url, true).query;           
        }else{  //post
            params = querystring.parse(postData);
        }
        let response = handleNodeApi.config.response;
        let questions={
            code: 0,
            msg: "成功处理数据",
            data: []
        };
        if(isEmptyObject(params)){
            response.writeHead(200, {
                'Content-Type': 'application/json;charset=utf-8'
            });
            questions.code = "-1";
            questions.msg = "参数错误！";
            response.write(JSON.stringify(questions));
            response.end();
        }else{
            /*
            * folderName    文件夹名字
            * htmlCode      html代码
            * moduleId      组件Id
            *
            */
            //http://localhost:30102/sendDataApi?folderName=cfm&htmlCode=%27%3Cdiv%20class=%22container-fluid%22%3E%20%3Cdiv%20class=%22row-fluid%22%3E%20%3Cdiv%20class=%22span12%22%3E%20%3C!--S%20%E5%BC%80%E5%8F%91%E7%BB%84%E4%BB%B6--%3E%20%3Cdiv%20class=%22module3%22%3E%20module3%20%3C/div%3E%20%3C!--E%20%E5%BC%80%E5%8F%91%E7%BB%84%E4%BB%B6--%3E%20%3C!--S%20%E5%BC%80%E5%8F%91%E7%BB%84%E4%BB%B6--%3E%20%3Cdiv%20class=%22module4%22%3E%20module4%20%3C/div%3E%20%3C!--E%20%E5%BC%80%E5%8F%91%E7%BB%84%E4%BB%B6--%3E%20%3C!--S%20%E5%BC%80%E5%8F%91%E7%BB%84%E4%BB%B6--%3E%20%3Cdiv%20class=%22module5%22%3E%20module5%20%3C/div%3E%20%3C!--E%20%E5%BC%80%E5%8F%91%E7%BB%84%E4%BB%B6--%3E%20%3C/div%3E%20%3C/div%3E%20%3C/div%3E%27&moduleId=[%270_1%27,%270_2%27]
            questions.data.push(params);

            buildFile.init(params);
            // console.log(params.folderName);

            
           
        }
    },

    returnData: function(){
        let Verification = buildFile.rerefolderNameTree().length
        let response = handleNodeApi.config.response;   
        if(returnAjaxMsg.length != Verification) return false;
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf-8'
        });
        response.write(JSON.stringify(returnAjaxMsg));
        response.end();
    }
}

//处理渲染
const rendering = {
    config: {
        request: null,
        response: null,
        realPath: null,
        params: null,
        ext: null,
    },
    init: function(opt){
        let {response,realPath,ext,request} = opt;
        let _ts = this;
        _ts.config.response = response;
        _ts.config.realPath = realPath;
        _ts.config.ext = ext;
        _ts.config.request = request;
        _ts.handle();
    },
    handle: function(){
        let _ts = this;
        let response = _ts.config.response;
        let realPath = _ts.config.realPath;
        let ext = _ts.config.ext;
        let request = _ts.config.request;
        let params = url.parse(request.url, true).query;
    

        fs.readFile(realPath, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end(err);
            } else {
                // console.log(realPath)
                var contentType = mine[ext] || "text/plain";
                // console.log( mine[ext]);
                response.writeHead(200, {
                    'Content-Type': contentType
                });
    
                response.write(file, "binary");
                response.end();
            }
        });
    }
};

//创建文件
function writeFile(data){
    // data = {
    //     fileName : "",    //文件路径
    //     content : "",   //文件内容
    //     callfun : function(){   //回调函数
    //     }
    // }
    if(!fs.existsSync( data.fileName)){ //判断不存在才创建
        fs.writeFile(data.fileName, data.content, function (err) {
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
    }; 
    
}

//创建目录 
function mkdirFile(data){
    // data = {
    //     file : "",   //创建的文件路径及文件名
    //     callfun : function(){   //回调函数
    //     }
    // }
    // console.log(data.file);
    if(!fs.existsSync(data.file)){
        fs.mkdir(data.file,function(err){ 
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
    };
}


//生成对应的src文件及内容
const buildFile = {
    config: {
        folderName: null,
        htmlCode: null,
        moduleId: null,
        folderIndexName: 1,
        folderNameTemp: null,
        isfirst : true,
    },
    init: function(params){
        const _ts = this;

        let {folderName, htmlCode, moduleId} = params;
        _ts.config.folderName = folderName;
        _ts.config.htmlCode = htmlCode;
        _ts.config.moduleId = moduleId;
        _ts.config.folderNameTemp = folderName;
        _ts.config.folderIndexName = 1;
        _ts.config.isfirst = true;

        _ts.buildFolder();
    },

    //返回两两个目录
    rerefolderNameTree: function(){
        const _ts = this;
        return [
                    tmsPath + `${_ts.config.folderNameTemp}`, 
                    ztPath + `${_ts.config.folderNameTemp}`, 
                ];
    },

    //创建目录 
    buildFolder: function(){
        const _ts = this;
        const folderArr = this.rerefolderNameTree();
                        // 
        const folderArrLen = folderArr.length;
        
        var promise = new Promise(function(resolve,rejeact){
            for(let j = 0; j<folderArrLen; j++){
                let folderStr =  folderArr[j].split("/");
                let folderStrLen = folderStr.length-1;
                let newPath = "";
                for(let i = 0; i<folderStrLen; i++){
                    newPath += "/"+folderStr[i];  
                    if(!fs.existsSync(projectRoot + newPath)){
                        fs.mkdirSync(projectRoot + newPath);
                    }
                }
            }
            resolve();
        });
        promise.then(function(){
            if(!fs.existsSync(projectRoot + '/' + ztPath + `${_ts.config.folderNameTemp}`)){
                for(let i = 0;i<folderArrLen;i++){
                    fs.mkdir(projectRoot + '/' +folderArr[i] , function(err){ 
                        _ts.buildHtml([`${projectRoot}/${folderArr[i]}`,folderArr[i]]);
                        _ts.buildSrcFolder([`${projectRoot}/${folderArr[i]}`,folderArr[i]]);
                    }); 
                }
            }else{
                _ts.config.folderNameTemp = _ts.config.folderName + "_" + _ts.config.folderIndexName;
                _ts.config.folderIndexName += 1;
                _ts.buildFolder();
            };
        });
        
    },

    //创建html文件
    buildHtml: function(data){
        let [lineProjectRoot,linefolderArr] = data;
        let _ts = this;
        let htmlCode = _ts.config.htmlCode;
        // console.log(path);
        // console.log(projectRoot);
        // console.log(_ts.config.htmlCode);
        
        fs.readFile(projectRoot+"/build/index.html", {flag: 'r+', encoding: 'utf8'}, function (err, data) {
            if(err) {console.error(err);return;}
            // writeFileFun(__devHtml)  
            var linkStr = data.match(/\$\{被替换为目录层级\}\$/g);
            var nameStr = data.match(/\$\{替换为文件的名字\}\$/g);
            var floderStr = data.match(/\$\{替换为文件夹层级\}\$/g);
            var htmlStr = data.match(/\<\!\-\-\$\{被替换页面主要内容\}\$\-\-\>/g);
            
            var replaceStr = "";
            
            // console.log(linefolderArr.length);
            for (var _lenIndex = 0; _lenIndex<linefolderArr.split("/").length;_lenIndex++){
                replaceStr += "../";
            }
            var _tempHtmlData = data;
            for(var linkStr_index in linkStr){
                _tempHtmlData = _tempHtmlData.replace(linkStr[linkStr_index], replaceStr);
            } 
            for(var nameStr_index in nameStr){
                _tempHtmlData = _tempHtmlData.replace(nameStr[nameStr_index], "index");
            } 
    
            _tempHtmlData = _tempHtmlData.replace(floderStr, linefolderArr);
            htmlCode = htmlBeautifier.html(htmlCode);
            _tempHtmlData = _tempHtmlData.replace(htmlStr, htmlCode);        
            // console.log(_tempHtmlData);   

            writeFile({
                fileName: lineProjectRoot+"/index.html",    //文件名
                content: _tempHtmlData,   //文件内容                  
            });     
                           
        });
    },

    //创建src文件夹
    buildSrcFolder: function(data){
        let [lineProjectRoot,linefolderArr] = data;
        let _ts = this;

        // console.log(lineProjectRoot,linefolderArr);
        const fileSrcData = {
            file : lineProjectRoot + "/src",
            callfun : function(){
                mkdirFile({
                    file: lineProjectRoot + "/src/css",
                    callfun : function(){
                        // mkdirFile({file: lineProjectRoot + "/src/css/img"});                
                        // mkdirFile({file: lineProjectRoot + "/src/css/sprite"});
                        // mkdirFile({file: lineProjectRoot + "/src/css/spriteImg"});
                        writeFile({
                                fileName : lineProjectRoot + "/src/css" + "/index.less",    //文件名
                                content : "",   //文件内容      
                                callfun : function(){

                                    _ts.handleModuleId({
                                        fileName: lineProjectRoot + "/src/css" + "/index.less",
                                        type: "css",
                                        linefolderArr :linefolderArr,
                                    });
                                }     
                        });
                    }
                });
                mkdirFile({
                    file: lineProjectRoot + "/src/js",
                    callfun : function(){
                        // mkdirFile({file: lineProjectRoot + "/src/js/tpl"});
                        writeFile({
                            fileName : lineProjectRoot + "/src/js" + "/entry-index.js",    //文件名
                            content :   "import { $, cookies } from 'CommonHead';\n"+
                                        "// import comment from '@common/src/module/comment/comment';\n"+
                                        "import head from '@common/src/module/head/entry-head.js';\n"+
                                        "import Apm from '@common/src/apm/apm';\n"+
                                        "let apm = new Apm({$: $, cookies: cookies});",   
                            callfun : function(){
                                _ts.handleModuleId({
                                    fileName: lineProjectRoot + "/src/js" + "/entry-index.js",
                                    type: "js",
                                    linefolderArr :linefolderArr,                                    
                                });
                            }                     
                        });
                    }
                });        
            }
        };
        mkdirFile(fileSrcData);
    },

    //处理组件id
    handleModuleId: function(data){
        let {fileName, type, linefolderArr} = data;
        let _ts = this;
        let moduleId = this.config.moduleId;

        const cssModulePath = projectRoot + "/tms/module/src/css/module/";
        const jsModulePath = projectRoot + "/tms/module/src/js/module/";
        // console.log(fileName,type,moduleId,projectRoot);
        // console.log(typeof moduleId);
        // console.log(cssModulePath);
        let ModuleArr=[];
        moduleId = eval(moduleId);
        
        if(type == "css"){
            for(let i=0; i<moduleId.length; i++){
                ModuleArr.push( `${cssModulePath}${moduleId[i]}.less`);
            }
            _ts.copyModulefile({fileName,ModuleArr, linefolderArr, type});
        }
        if(type == "js"){
            for(let i=0; i<moduleId.length; i++){
                ModuleArr.push( `${jsModulePath}${moduleId[i]}.js`);
            }
            _ts.copyModulefile({fileName, ModuleArr, linefolderArr, type});
        }
    },

    //复制组件代码
    copyModulefile: function(data){
        let {fileName, ModuleArr, linefolderArr, type} = data;
        fs.readFile(fileName, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
            if(err) {console.error(err);return;}
                  
        });
        let fileMain = "";
        fileMain += fs.readFileSync(fileName,{flag: 'r+', encoding: 'utf8'});
        fileMain += '\n\n';

        let regExpStr =  new RegExp("codeJsStart");
        let replaceStr = "import { $, cookies, apm } from 'CommonHead';";
        

        let tempHtml = "";
        for(let i = 0; i<ModuleArr.length; i++){
            tempHtml = fs.readFileSync(ModuleArr[i],{flag: 'r+', encoding: 'utf8'});
            if(regExpStr.test(tempHtml)){
                let linkStr = tempHtml.match(/\/\*codeJsStart\*\/([\s\S]*)(?=\/\*codeJsEnd\*\/)/g);  
                linkStr = linkStr[0].replace("/*codeJsStart*/","");
                fileMain += linkStr;
                fileMain += '\n\n';
            }else{
                tempHtml = tempHtml.replace(replaceStr,"");
                fileMain += tempHtml;
                fileMain += '\n\n';
            }
            
        }
        
        if(type == "css"){
            fs.writeFileSync(fileName, htmlBeautifier.css(fileMain));                    
        }
        if(type == "js"){
            fs.writeFileSync(fileName, htmlBeautifier.js(fileMain));        
        }
        
        //获取打包目录
        this.buildProject();
    },

    //打包压缩项目
    buildProject: function(){
        const _ts = this;
        let isfirst =  _ts.config.isfirst;   
        if(!isfirst){return false;}
        _ts.config.isfirst = false;
        let rerefolderNameTree = this.rerefolderNameTree();
        
        setTimeout(()=>{
            for(let i =0; i<rerefolderNameTree.length; i++){
                // cmd.run();            
                cmd.get(
                    'npm run build --m '+rerefolderNameTree[i],
                    function(err, data, stderr){
                        if (!err) {
                            console.log('创建成功'+rerefolderNameTree[i])
                            returnAjaxMsg.push('创建成功:'+rerefolderNameTree[i])
                        }else{
                            console.log('error', err)
                            returnAjaxMsg.push('创建失败:'+ err)                        
                        }
                        handleNodeApi.returnData();
                    }
                );
            }
            
        },1000);
    }

}



