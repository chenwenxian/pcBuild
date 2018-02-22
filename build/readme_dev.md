# 开发文档

> 备注：jquery版本号是：v1.11.0 <br />
> 本文档详细说明commonHead*.js && commonFooter*.js。<br />
> 涉及到的组件 && 第三方库列表，具体使用请在dome文件目录下查看


## commonHead*.js文件说明

>本脚本包含jquery（默认扩展弹框pop_dialog）、apm、cookies

* apm
	- config obj 基本配置
	- checkloginFun fun 判断是否登录执行callback
	- popBindPhone fun 绑定手机弹框
	- popLogin fun 登录弹框
	- popReg fun 注册弹框
	- ajaxLogOut fun 登出
	- userInfo obj 当前登录用户详细
	- loginReg obj（login脚本之后会废除）
	- observer 观察者模式
	- observerLogOut obj 登出注入观察者模式
	- observerLogin obj登录注入观察者模式
	- observerReg obj 注册注入观察者模式
	- suppor obj 依赖第三方脚本（jquery、cookies）
	- fsrtok fun 生成token方法
	- token fun 后端使用的认证token
	- md5 fun 生成MD5加密
	- tools 工具
		- debug fun
		- done obj 内部记录状态
		- getFlash fun 回去flash对象
		- getStaticApi fun 获取静态地址
		- isLogin fun 判断是否登录返回 true or false
		- isMobile boolean 判断设备是否是移动
		- isVip fun 判断是否vip
* cookies
	- set fun 设置cookies
	- setOneDay fun 设置cookies有效期1天
	- get fun 获取cookies 返回字符串
	- getJSON fun 获取cookies 返回json
	- remove fun 生成cookies
	
* pop_dialog（jquery扩展）
	- pop_alert
	- pop_confirm
	- pop_dialog
	- ...
	
## commonFooter*.js文件说明
> 暂时未添加开发功能，后续补上

## 内部开发组件
	* 评论 comment
	* 绑定手机 bindphone

## jquery扩展
	* 弹框 pop_dialog
	* 焦点图1 jcarousellite
	* 焦点图2 dsTab
	* 焦点图3 rollpic
	* 浮动 jqfloat
	* 懒加载 lazyload
	* 滚动条 mCustomScrollbar
	
	

## 第三方插件
	* 剪贴板复制 ZeroClipboard
	