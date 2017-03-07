/**
 * Created by xinyuan6009 on 17-1-15.
 */

function AutoPage(){
    document.documentElement.style.fontSize = document.documentElement.clientWidth * 100 / 640 + 'px';
}
window.onresize=AutoPage;
/*TGMobileShare({
 shareDesc:'梦幻诛仙震撼来袭，感恩回馈、大礼包等你来！', //不设置或设置为空时，页面有Description，则调取Description
 shareImgUrl:'http://game.gtimg.cn/static/images/mhzx/m/web201607m/bg/logo.png', //分享图片尺寸200*200，且填写绝对路径
 });*/
//弹窗
var PopName=null;
function gE(e) {
    return document.querySelector(e)
}
function pop(e) {
    if (PopName != null) {
        hidePopOk(PopName);
    }if (!gE('#pop-mask')) {
        gE(e).style.display = "block";
        PopName=e;
        var popH = gE(e).offsetHeight,
            popW = gE(e).offsetWidth;
        gE(e).style.cssText = "position:fixed;left:50%;display:block;top:50%;z-index:999;"+"margin-left:-"+popW/2+"px;"+"margin-top:-"+popH/2+"px;"
        var bgObj = document.createElement("div");
        bgObj.setAttribute('id', 'pop-mask');
        document.body.appendChild(bgObj);
        var conH = document.body.scrollHeight,
            viewH = document.documentElement.clientHeight;
        if (conH > viewH) {
            gE('#pop-mask').style.height = conH + "px";
        } else {
            gE('#pop-mask').style.height = viewH + "px";
        }
        hidePop(e);
    }
}
function hidePop(e) {
    gE('#pop-mask').addEventListener('click', function() {
        gE(e).style.display = "none";
        var bgObj = gE("#pop-mask");
        document.body.removeChild(bgObj);
        PopName=null;
    });
}
function hidePopOk(e) {
    gE(e).style.display = "none";
    var bgObj = gE("#pop-mask");
    document.body.removeChild(bgObj);
    PopName = null;
}

function getRandomNum() {//获取随机数
    $.ajax({
        type : "get",
        url : "../../getRandomNum",
        dataType : "json",
        success : function(json){
            console.log(json);
            $('#number b').text(json["result"]);
        },
        error:function(){
            alert('failed');
        }
    });
    /*$.ajax({//跨域获取
        type : "get",
        url : "http://116.255.167.222:8080/anysdk-admin/test/getNum.html",
        dataType : "jsonp",
        jsonp: "callbackparam",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonpCallback:"ajaxTestFn",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        success : function(json){
            $('#number b').text(json["num"]);
        },
        error:function(){
            alert('fail');
        }
    });*/
}

function apart() {/*判断访问终端*/
    var u;
    var browser = {
        /*判断访问终端*/
        versions: function () {
            u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, /*IE内核*/
                presto: u.indexOf('Presto') > -1, /*opera内核*/
                webKit: u.indexOf('AppleWebKit') > -1, /*苹果、谷歌内核*/
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, /*火狐内核*/
                mobile: !!u.match(/AppleWebKit.*Mobile.*/i), /*是否为移动终端*/
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i), /*ios终端*/
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, /*android终端或者uc浏览器*/
                iPhone: u.indexOf('iPhone') > -1, /*是否为iPhone或者QQHD浏览器*/
                iPad: u.indexOf('iPad') > -1, /*是否iPad*/
                webApp: u.indexOf('Safari') == -1 /*是否web应该程序，没有头部与底部*/
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    console.log(browser);
    if (u.match(/AppleWebKit.*Mobile.*/i)) {
        window.phone = 1;
    }else{
        window.phone = 0;
    }
}

var userArr = [
    'lk****a6',
    '离家的****gtrt',
    '135****9877',
    'gg****bn',
    'xin****9',
    '金雨****123',
    'vv****992',
    '189****4567',
    'lk****a6',
    'd4d****gtrt',
    '135****9877',
    'gg****bn',
    'xin****9',
    '布拉格****234',
    'vv****992',
    '150****6008',
    'lk****a6',
    '热带****一把火',
    '189****8865',
    'gg****bn',
    '李白****9',
    '张****66',
    'po****992',
    'lk****a6',
    '热带****一把火',
    '189****1504',
    'gg****bn',
    '苦苦****9',
    '孤独的****012',
    'po****992',
    'lk****a6',
    'red****gg',
    '189****1504',
    'cool****boy',
    '夜色的黑****9',
    '136****5094',
    'po****3344',
    'sw****555'
];
//随机显示不同用户获奖数据  随意8个或多个
function getRandomUser() {
    var length_ = userArr.length;
    for(var i=0;i<length_;i++){
        var randomNum = Math.round(length_ * Math.random());
        $('marquee span.user').eq(i).text(userArr[randomNum]);
    }
}

function payss() {//首页 点击确认订单
    if(document.getElementById('yxq').value=="") {
        alert("请选择游戏区");
        return false;
    }
    if(document.getElementById('fwq').value=="") {
        alert("请选择服务器");
        return false;
    }
    var jin = document.getElementById('amts').value;
    if(jin=="") {
        alert("请选择充值礼包");
        return false;
    }
    if(document.getElementById('jsm').value=="") {
        alert("请输入角色名");
        return false;
    }else{
        informNumber();
    }
}

$('#confirm').on('click',function () {//点击确认订单
    payss();
});
$('#jsm').on('blur',function () {//输入角色名鼠标聚焦移开
    //informNumber();
});
/*
 * 输入角色名限制 至少输入2个中文字符或4个英文字符；最多6个中文字符或12个英文字符
 */
window.gift = '';
function informNumber() {
    var roleName = $('#jsm');
    var val = roleName.val() ;
    var length_ = val.length;
    console.log('总长度——'+length_);
    var cnChar = val.match(/[^\x00-\x80]/g);//利用match方法检索出中文字符并返回一个存放中文的数组
    if(length_>12){//总长度大于12
        alert('最多输入6个中文字符或12个英文字符!');
        return false;
    }
    if(cnChar!=null){//如果有中文字符
        var cnLen = cnChar.length;//算出中文的字符长度
        var engLen = length_ - cnLen; //差额为英文字符长度
        if(engLen<=0&&cnLen<2){//没有英文，并且少于2个中文，
            alert('请输入至少2个中文或4个英文！');
            return false;
        }else if(cnLen>6){//不管有没有英文，中文大于6个
            alert('最多输入6个中文字符或12个英文字符!');
            return false;
        }
    }else{//如果没有中文字符
        if(length_<4){//少于4个英文
            alert('请输入至少2个中文或4个英文！');
            return false;
        }
    }

    var gameDist = $('select[name=gameDist]').val();
    var serverId = $('select[name=serverId]').val();
    gift = $('select[name=gift]').val();
    var roleName = $('select[name=roleName]').val();
    var param = {
        gameDist:gameDist,
        serverId:serverId,
        gift:gift,
        roleName:roleName
    };
    window.gift = gift;  //大礼包在微信支付页面需要用
    //支付不同金额，跳转不同页面
    localStorage.payMoney = $('#amts').val();
    var msgs = document.getElementById('yxq').value + document.getElementById('fwq').value ;
    document.getElementById('msg').value=msgs;
    document.getElementById('myform').submit();
}


function toPay(gift) {//支付页面 获取不同支付二维码图片
    //根据不同礼包加载不同图片
    var img = '';
    gift = gift + '';//变成字符串
    switch (gift) {
        case '100':
            img = 'wx100.png';
            break;
        case '200':
            img = 'wx200.png';
            break;
        case '300':
            img = 'wx300.png';
            break;
        case '500':
            img = 'wx500.png';
            break;
        case '888':
            img = 'wx888.png';
            break;
    }
    $('img#wechat-img-buffer').attr('src', img);
}
