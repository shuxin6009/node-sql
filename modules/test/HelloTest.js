/**
 * Created by xinyuan6009 on 17-1-15.
 *
 * 这是一个测试服务代码111
 */

var express = require("express");
var jade = require("jade");

var app = express();


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
     console.info("我收到了一个消息...");
    res.send('hello world');
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})