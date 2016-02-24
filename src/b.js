console.log('bbbbbbbbbbbbbbb----------------hhhgggjjjoooooooo');
let jpg = require('./images/xxxx.jpg');
// 非./assets/内的资源，不论存在多少子目录，构建的时候都会进行hash运算，生成新的文件名放到./build/的跟下面(本例中xxxx.jpg因为文件过小，已经被转换为base64使用，所以在./build/下找不到相对应的文件，具体参看下面的例子)
// 注：相同的图片不管存在多少个，最终也只会生成一个文件（因为hash值一样）
console.log('jpg : ',jpg);

let png = require('./images/pic2.png');
console.log('png : ',png);
