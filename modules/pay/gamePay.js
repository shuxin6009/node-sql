/**
 * Created by xinyuan6009 on 17-1-15.
 */

/**
 * 跳转到
 * @param req
 * @param res
 */
/*var express = require("express");
var app = express();*/

//var module = require('module');

module.exports.toGamePayPage = function (req, res) {//跳转到确认微信支付页面
    console.info("收到消息了");
    var gameDist = req.body.gameDist;
    var serverId = req.body.serverId;
    var gift = req.body.gift;
    var roleName = req.body.roleName;
    res.locals.gameDist=gameDist;
    res.locals.serverId=serverId;
    res.locals.gift=gift;
    res.locals.roleName=roleName;
    res.render('pay.jade');
}

