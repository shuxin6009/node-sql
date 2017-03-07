/**
 * Created by xinyuan6009 on 17-1-15.
 *
 * 启动项目后台服务  支付
 */
var express = require("express");
var mysql = require("mysql");
//引入数据库操作
//var db  = require("./db.js");

var app = express();


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/index', function(req, res) {//首页
    console.info("index我收到了一个消息...");
    //res.send('hello world');
    res.render('index.jade');  //http://localhost:8081/index
});


/**
 * 添加
 */
app.get('/add', function(req, res) {//点击微信支付，提交表单
    var uname = req.query.uname;
    var pwd = req.query.pwd;
    console.info("传入参数: uname:"+uname+" pwd:"+pwd);

    if(uname==undefined||pwd==undefined){
        res.end("用户名或者密码不能为空");
        return;
    }

    //add2Mysql
    var client = getConnection();
    try{
        //执行连接
        client.connect();
        var usr={name:uname,pwd:pwd,email:'zhangsan@gmail.com'};
        client.query('insert into user set ?', usr, function(err, result) {
            if (err) throw err;
            console.log(result);
            console.log('\n');
        });
        //关闭数据库
        client.end();

    }catch (e){
        console.log(e);
        res.end("注册失败");
        return;
    }

    res.end("注册成功");
});

//查询
app.get('/login.html', function(req, res) {//首页

    var uname = req.query.uname;
    var pwd = req.query.pwd;

    console.info("传入参数: uname:"+uname+" pwd:"+pwd);

    var usr={name:uname};
    //add2Mysql
    var client = getConnection();
    //执行连接
    client.connect();
    client.query('select * from user where ?', usr,function(err, rows) {
        if (err) throw err;
        console.log('selected after deleted');
        if(rows.length<1){
            res.end("用户名不存在。。");
            return;
        }
        var dbUserPwd = rows[0].pwd;
        if(pwd===dbUserPwd){
            res.end("恭喜您，登录成功..");
            return;
        }
        res.end("用户名或者密码错误");
        console.log('\n');
    });
    //关闭数据库
    client.end();

});

app.get('/update', function(req, res) {//首页

    var uname = req.query.uname;
    var pwd = req.query.pwd;

    console.info("传入参数: uname:"+uname+" pwd:"+pwd);

    //add2Mysql
    var client = getConnection();
    var sql = "update user set pwd='"+pwd+"' where name='"+uname+"'";
    //执行连接
    client.connect();
    client.query(sql,function(err, rows) {
        if (err) throw err;
        res.end("修改密码成功");
        return ;
    });
    //关闭数据库
    client.end();
});

//删除
app.get('/del', function(req, res) {//首页

    var uname = req.query.uname;
    var pwd = req.query.pwd;

    console.info("传入参数: uname:"+uname+" pwd:"+pwd);

    //add2Mysql
    var client = getConnection();
    var sql = "delete from user where ? ";
    var usr = {name:uname};
    //执行连接
    client.connect();
    client.query(sql,usr,function(err, rows) {
        if (err){
            res.end(JSON.stringify(err));
            throw err;
            return;
        }
        res.end("删除用户成功...");
        return ;
    });
    //关闭数据库
    client.end();
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("服务器已开启，访问地址为 http://%s:%s", host, port)
});

function getConnection(){
    //add2Mysql
    return mysql.createConnection({
        host     : '123.56.146.64',
        user     : 'work',
        password : 'xyMysql2016',
        database : 'lanlan',
        port:'3306'
    });
}