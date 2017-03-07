/**
 * Created by xinyuan6009 on 17-1-15.
 *
 * 启动项目后台服务  支付
 */
var express = require("express");
var app = express();
var jade = require("jade");
var path = require("path");
//var gamePay = require("modules/pay/gamePay.js");//引用js文件

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.set('view engine', 'jade');//设置默认的模板引擎
app.set('views',path.join(__dirname,'view'));//3 设置视图的对应目录  view先被渲染
app.use(express.static(path.join(__dirname,'static/images')));//图片
app.use(express.static(path.join(__dirname,'static/css')));
app.use(express.static(path.join(__dirname,'static/js')));
app.engine('jade', jade.__express);

//res.render('视图的路径', { 返回的数据名称：返回的数据内容}); //4 向特定路径的视图返回数据
// respond with "hello world" when a GET request is made to the homepage

app.get('/index', function(req, res) {//首页
    console.info("index我收到了一个消息...");
    //res.send('hello world');
    res.render('index.jade');  //http://localhost:8081/index
});

/*
* totalRandomNum  获取总数，刷新页面随机递增
* */
var totalRandomNum = 0;
app.get('/getRandomNum', function(req, res) {//点击微信支付，提交表单
    //gamePay.getRandomNum(req,res);//调用js文件的函数
    console.info("getRandomNum收到消息了");
    totalRandomNum = totalRandomNum + Math.round(Math.random() * 3) ;//随机增加0-3
    res.locals.totalRandomNum = totalRandomNum;
    res.send({result:totalRandomNum});  //
});
var gift;
app.post('/pay', function(req, res) {//点击微信支付，提交表单
   // gamePay.toGamePayPage(req,res);//调用js文件的函数

    console.info("pay收到消息了"+req.body);
    var gameDist = req.body.gameDist;
    var serverId = req.body.serverId;
     gift = req.body.gift;
    var roleName = req.body.roleName;
    res.locals.gameDist=gameDist;
    res.locals.serverId=serverId;
    res.locals.gift=gift;
    res.locals.roleName=roleName;
    res.render('pay.jade',{'gift':gift});
});

app.post('/weixinPay', function(req, res) {//点击确认微信支付
   // gamePay.pays(req,res);//调用js文件的函数
    console.info("weixinpay收到消息...");
    var phone = req.body.phone;
    console.info('phone---'+phone);
    res.locals.phone = phone;
    res.locals.gift = gift;
    if (phone == '1') {
        console.log(111);
        res.render('weixinPayForPhone.jade',{'phone':phone,'gift':gift});
    } else {
        console.log('000');
        res.render('weixinPay.jade',{'phone':phone,'gift':gift});
    }
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("服务器已开启，访问地址为 http://%s:%s", host, port)
});