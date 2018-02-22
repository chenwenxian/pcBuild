# Babel下的ES6兼容性与规范
> 备注可以参考[Babel下的ES6兼容性与规范](http://imweb.io/topic/561f9352883ae3ed25e400f5)<br />
> 实际支持情况在本文档详细说明

## ES6新特性在Babel下的兼容性列表
| ES6特性 |  兼容性  |
|--------|-------|
| `增强的对象字面量` |  部分支持，IE8不支持  |
| `proxy` | 待定 |
| `Promise` | 不支持 |
| `iterator, generator` | 不支持 |
| 箭头函数 |  支持  |
|  类的声明和继承  |  支持   |
| 字符串模板 | 支持 |
|  解构  |  支持  |
|参数默认值，不定参数，拓展参数|支持|
| let与const | 支持 |
| for of | 支持 |
| 模块 module、Symbol | 支持 |
| import / export default  | 支持 |



## 兼容代码示例
1.1 箭头函数（支持）

```javascript
var fn= (v=>console.log(v));
fn('箭头操作符');
```

1.2 类的声明和继承（支持）

```javascript
//类的定义
class Animal {
    //ES6中新型构造器
    constructor(name) {
        this.name = name;
    }
    //实例方法
    sayName() {
        console.log('My name is '+this.name);
    }
}
//类的继承
class Programmer extends Animal {
    constructor(name) {
        //直接调用父类构造器进行初始化
        super(name);
    }
    program() {
        console.log("I'm coding...");
    }
}
//测试我们的类
var animal=new Animal('dummy'),
wayou=new Programmer('wayou');

animal.sayName();//输出 ‘My name is dummy’
wayou.sayName();//输出 ‘My name is wayou’
wayou.program();//输出 ‘I'm coding...’
```

1.3 增强的对象字面量(部分支持、IE8不支持)

```javascript
//通过对象字面量创建对象
var human = {
    breathe() {
        console.log('breathing...');
    }
};
var worker = {
    __proto__: human, //设置此对象的原型为human,相当于继承human
    company: 'freelancer',
    work() {
        console.log('working...');
    }
};
human.breathe();//输出 ‘breathing...’
//调用继承来的breathe方法
worker.breathe();//输出 ‘breathing...’
```

1.4 字符串模板（支持）

```javascript
//产生一个随机数
var num=Math.random();
console.log(`your num is ${num}`);
```

1.5 解构（支持）

```javascript
//产生一个随机数
var [name,gender,age]=['wayou','male','secrect'];//数组解构
console.log('name:'+name+', age:'+age);//输出： name:wayou, age:secrect
```
1.6 参数默认值，不定参数，拓展参数

```javascript
//参数默认值
function sayHello(age, name='dude'){
    console.log(`Hello ${name}`);
}
sayHello(12);
sayHello(88, 'wen');

//不定参数: 将所有参数相加的函数
function add(...x){
    return x.reduce((m,n)=>m+n);
}
//传递任意个数的参数
console.log(add(1,2,3));//输出：6
console.log(add(1,2,3,4,5));//输出：15

//扩展参数
var people=['Wayou','John','Sherlock'];
function sayHello(people1,people2,people3){
    console.log(`Hello ${people1},${people2},${people3}`);
}
//但是我们将一个数组以拓展参数的形式传递，它能很好地映射到每个单独的参数
sayHello(...people);//输出：Hello Wayou,John,Sherlock

//而在以前，如果需要传递数组当参数，我们需要使用函数的apply方法
sayHello.apply(null,people);//输出：Hello Wayou,John,Sherlock

```

1.7 let与const（支持）

1.8 for of（支持）

```javascript
var someArray = [ "a", "b", "c" ];

for (let v of someArray) {
    console.log(v);//输出 a,b,c
}
```

1.9  iterator, generator(不支持)

```javascript
var ids = {
  *[Symbol.iterator]: function () {
    var index = 0;

    return {
      next: function () {
        return { value: 'id-' + index++, done: false };
      }
    };
  }
};
```
1.10 模块 module、Symbol、 proxy（支持）

```javascript
// ES6模块
import { stat, exists, readFile } from 'fs';

//Symbol
let s = Symbol();
var s1 = Symbol('foo');
var s2 = Symbol('bar');
console.log('支持Symbol');
console.log(typeof s);
console.log(s1.toString()); // "Symbol(foo)"
console.log(s2.toString()); // "Symbol(bar)"

//proxy
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});
proxy.time // 35
proxy.name // 35
proxy.title // 35
console.log(proxy.time, proxy.name, proxy.title);
```
1.11 Promise（不支持）

```javascript
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'donev');
  });
}

timeout(100).then((value) => {
  console.log(value);
});
```

