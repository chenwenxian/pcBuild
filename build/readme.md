# webpack构架环境
```
	webpack v3.4.1
	node >= v5.10
    npm >=  v3.5.3
``` 
> 备注：在node: v6.4.0 && npm: v3.10.3环境下开发配置的。


# 构建程序
>备注：执行命令环境：在根目录下。

``` bash

# 构建安装依赖
npm install
##公共组件开发 -- common
### common中的entry-生产模式
npm run dist

### common中的commonHead*.js生产模式
npm run dist head

### common中的commonFooter*.js生产模式
npm run dist footer


# tms模版环境
### 启动打包服务器
npm run tms   



##业务开发

### 创建项目基本文件 (xxx表示目录名，比如：test)
npm run project --m xxx 

### 在项目中创建新的html文件 (xxx表示目录名，比如：test；filename表示新建html文件的名字，不需要.html后缀，比如：index_v1)   同时创建对应的js及less文件
npm run project --m xxx name:filename


### 开发模式(xxx表示目录名，比如：test)
npm run dev --m xxx

### 生产模式 (xxx表示目录名，比如：test)
npm run build --m xxx


```

# 目录结构
* webpack
	- build
	- node_modules
	- package.json
	- common
		- dist 发布目录 （固定，不用创建）
		- src
			- assets
				- css
				- img
			- apm
				- commonHead*.js
				- commonFooter*.js
				- ... 
			- jquery
				- jquery
					- 1.7.2
					- 1.11.0 ...
				- plugin
					- lazyload.js
					- mCustomScrollbar.js
					- ...
			- module
				- comment
				- head
			- plugin
				- cookie

	- test
		- dist 发布目录 （固定，不用创建）
		- src 开发目录（固定）
			-	css（固定）
				- img
				- sprite (固定：sprite生成目录：雪碧图&&css)不使用了
				- spriteImg（固定：需要生成雪碧图小icon）不用了
				- spriteImg（固定：生成雪碧图）
			- js （固定）
				- entry-xxx.js (业务入口脚本固定需要“entry-”前缀.)
				- xxx.js (不是入口脚本文件)
				- tpl (选择目录: ejs模板)
					- xxx.ejs or xxx.tpl (ejs模板文件) 
					- xxx.less (考虑开发中...)
		- index.html (开发&&发布模板)
		- index_v2.html (开发&&发布模板)
	- test2
	- test3
	




# 配置功能
* 公共功能	
	- js、jsx、ejs、tpl文件的babel编译：es6->es5
	- ejs、tpl编译成EJS模板
	- js、jsx文件eslint语法检查
	- less编译成css
	- 图片加hash：[name][hash].[ext]，比如“图名.png” -> “图名xxxxxxx.png”
	- [雪碧图生成](https://github.com/youzan/sprite-loader)

* 开发模式（内存环境）
	- 复制src到dist目录（内存）
	- 实时热更新
	

* 生产模式
	- 复制src（除entry-*.js文件外）到dist目录(发布)
	- entry-*.js合并&&压缩
	- 抽离功能js模块成vendor.js文件
	- manifest.js
	- less生成css前缀补全autoprefixer
	- 图片<= 8.192K 生成base64
	







