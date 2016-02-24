import FastClick from 'fastclick'; // 引用第三方库的方式
console.log(FastClick.attach);

let img = require('./pic.png');
console.log('image : ',img);

let b = require('./b');
console.log('b : ',b);
console.log('abc');

let x = require('./index.scss'); // 开发工具会自动编译
console.log('x : ',x.oooo); // scss 被编译解析后，x对象包含了内部的selector（已经被重新命名）
