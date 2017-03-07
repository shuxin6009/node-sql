/**
 * Created by ruby on 15/12/25.
 * @mail liyufeng_23@163.com
 */

/**
 *  按钮事件绑定
 */
function componentEventBind(){

    //借记卡网银支付按钮
    $("#debitBankPayBtn").click(function(){
        var payType1 = $(this).closest("form").find("input[name='payType1']").val();
        if(payType1 == "0"){
            alert("请选择您需要使用的银行！");
        }else{
            openMask();
            document.getElementById("depositBankCardForm").target="_blank";
            $("#depositBankCardForm").submit();
        }
    })

    //贷记卡网银支付按钮
    $("#creditBankPayBtn").click(function(){
        var payType1 = $(this).closest("form").find("input[name='payType1']").val();
        if(payType1 == "0"){
            alert("请选择您需要使用的银行！");
        }else {
            openMask();
            document.getElementById("xBankCardForm").target="_blank";
            $("#xBankCardForm").submit();
        }
    })

    //非银行卡支付表单验证
    $("#noBankPayForm").validate({
        rules:{
            cardType:{isCardType:true},
            faceAmt:{isFaceAmt:true},
            otherAmt:{required:true,isOtherAmt:true},
            cardNo:{required:true},
            cardPwd:{required:true}
        },
        success: "valid",
        submitHandler:function(form){
            openMask2();
            form.submit();
        }
    });

    //借记卡快捷支付-卡bin校验绑定
    $("form[name='shortcutPayForm'] input[name='cardNo']").keyup(function(){
        debitCardBinValidate($(this));
    });

    //信用卡一键支付-卡bin校验绑定
    $("form[name='webShortCutPayForm'] input[name='bankCardNo']").keyup(function(){
        creditCardBinValidate($(this));
    });

    //绑定借记卡快捷支付的卡片效果
    $("form[name='shortcutPayForm']").card({
        containerId:'debitCard',
        cardType:1,
        numberInputName:'cardNo',
        useCardBin:true
    });

    //绑定信用卡一键支付的卡片效果
    $("form[name='webShortCutPayForm']").card({
        containerId:'creditCard',
        cardType:2,
        numberInputName:'bankCardNo',
        expireInputName:'cardExpire'
    });

    //绑定微信支付请求
    $(".m-pay-t").click(function(){
        if($(this).hasClass("wechatpay")){
        	$("#mb_qrcode").empty();
        	$("#alsp_qrcode").empty();
        }else if($(this).hasClass("mbQrCodePay")){
            $("#wechat_qrcode").empty();
            $("#alsp_qrcode").empty();
        }else if($(this).hasClass("alsppay")){
        	$("#mb_qrcode").empty();
        	$("#wechat_qrcode").empty();
//            if(($("#alsp_qrcode").find("img").length)==0)
                updateALSPPayQrCode();
        }else if(!$(this).hasClass("alipay")){
            $("#wechat_qrcode").empty();
            $("#mb_qrcode").empty();
            clearTimeout(pay_search_interval);
        };
    });

    //绑定支付宝支付按钮
    $("#aliPayBtn").click(function(){
        openMask();
        $("#aliPayForm").find("input[name='payType1']").val("15");
        $("#aliPayForm").submit();
    });

	//绑定切换验证
    $("#captchaButton").click(function(){
    	switchCaptcha();
    });
    
    
}

/**
 *  通用验证规则
 */
//信用卡一键支付 - 表单验证规则
jQuery.validator.addMethod("isMobile", function(value, element) {
    return this.optional(element) ||  /^1[0-9]{10}$/.test(value);
}, "请输入正确的手机号码");

jQuery.validator.addMethod("isSMSCode", function(value, element) {
    return this.optional(element) ||  /^[0-9]{6}$/.test(value);
}, "短信验证码输入错误");

jQuery.validator.addMethod("isCardExpire", function(value, element) {
    return this.optional(element) ||  /^(0[1-9]|1[012])(1[6-9]|[2-3][0-9])$/.test(value);
}, "信用卡有效期输入错误");

//非银行卡支付 - 表单验证规则
jQuery.validator.addMethod("isCardType", function(value, element) {
    return this.optional(element) ||  value != "-1";
}, "请选择卡类型");
jQuery.validator.addMethod("isFaceAmt", function(value, element) {
    return this.optional(element) ||  value != "-1";
}, "请选择卡面额");
jQuery.validator.addMethod("isOtherAmt", function(value, element) {
    return this.optional(element) ||  /^[1-9]\d{0,7}$/.test(value);
}, "请输入正确的金额，只能是不大于8位的非零整数");

//other rules
//汉字字符验证
jQuery.validator.addMethod("isChineseCharacter", function(value, element){
    return this.optional(element) || /^([\u4e00-\u9fa5]|[·]){2,15}$/.test(value);
}, "请输入正确的姓名");
//身份证验证
jQuery.validator.addMethod("isIdCardNo", function(value, element){
    return this.optional(element) || /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value);
}, "请输入正确的身份证号");
//借记卡卡验证
jQuery.validator.addMethod("isDebitCard", function(value, element){
    return this.optional(element) || $("form[name='shortcutPayForm'] input[name='bankCode']").val() != "";
}, "该卡不被支持");
//信用卡卡验证
jQuery.validator.addMethod("isCreditCard", function(value, element){
    return this.optional(element) || $("form[name='webShortCutPayForm'] input[name='bankCode']").val() != "";
}, "该卡不被支持");

//借记卡卡BIN验证
var debit_card_sub14= "";
function debitCardBinValidate(target){
    var number = target.val();

    if (/^\d+$/.test(number) && number.length >= 14) {
        if (number.substring(0,14) != debit_card_sub14) {
            $.ajax({
                type:'get',
                url:'/standard/gateway/manager.cgi',
                timeout:5000,
                async:false,
                data:{
                    m:'webValidateCardBin',
                    bankCardNo:target.val()
                },
                cache:false,
                dataType:'json',
                success:function(data) {
                    var bankCode,bankName,cardType;
                    if(data.respCode == "00"){

                        bankCode = data.bankCode;

                        bankName = data.bankName;
                        if(bankName == null) {
                            bankName = "";
                        }

                        if (data.cardType=="1") {
                            closeTip_01();
                            cardType = "借记卡";
                        }else if(data.cardType=="2"){
                            cardType = "信用卡";
                            bankCode = "";
                            showTip_01("您输入的是信用卡号，换张借记卡试试^_^","err");
                        } else {
                            cardType = "其它卡";
                            bankCode = "";
                            showTip_01("系统不支持该卡类型，换张卡试试^_^","err");
                        }
                        setCardInfo(bankCode,bankName,cardType);
                    }else{
                        showTip_01("获取银行卡信息失败！请检查卡号是否正确","err");
                        setCardInfo("","","mobao pay");
                    }
                },
                error:function(){
                    showTip_01("获取银行卡信息失败！","err");
                    setCardInfo("","","mobao pay");
                }
            });

            debit_card_sub14 = number.substring(0,14);
        }
    }else if (number.length < 14) {
        closeTip_01();
        setCardInfo("","","mobao pay");
        debit_card_sub14 = "";
    }
}

function setCardInfo(bankCode,bankName,cardType){
    var $bankCode = $("form[name='shortcutPayForm'] input[name='bankCode']");
    var $bankName = $("#debitCard").find(".bank-name");
    var $cardType = $("#debitCard").find(".name");
    $bankCode.val(bankCode);
    $bankName.text(bankName);
    $cardType.text(cardType);
}

//信用卡卡BIN验证
var credit_card_sub14= "";
function creditCardBinValidate(target){
    var number = target.val();
    var $bankCode = $("form[name='webShortCutPayForm'] input[name='bankCode']");

    if (/^\d+$/.test(number) && number.length >= 14) {
        if (number.substring(0,14) != credit_card_sub14) {
            $.ajax({
                type:'get',
                url:'/standard/gateway/manager.cgi',
                timeout:5000,
                async:false,
                cache:false,
                data:{
                    m:'webValidateCardBin',
                    bankCardNo:target.val()
                },
                dataType:'json',
                success:function(data) {
                    if (data.respCode == "00") {
                        var bankCode = data.bankCode;
                        if (data.cardType == "2" || data.cardType == "5") {
                            if(bankCode == "" || bankCode == null)
                                bankCode = "OTHEBANK";
                        } else {
                            bankCode = "";
                        }
                        $bankCode.val(bankCode);
                    }
                },
                error:function(){
                    showTip_01("获取银行卡信息失败！","err");
                }
            });
            credit_card_sub14 = number.substring(0,14);
        }
    } else if(number.length < 14){
        $bankCode.val("");
        closeTip_01();
        credit_card_sub14 = "";
    }
}


//信用卡一键支付表单验证
function webShortCutPayFormValidate(){
    var baseValidation = $("#webShortCutPayForm").validate({
        rules:{
            bankCardNo:{required:true,rangelength:[14,19],digits:true,isCreditCard:true},
            mobileNo:{required:true,isMobile:true},
            smsCode:{required:true,isSMSCode:true},
            cardExpire:{required:true,isCardExpire:true}
        },
        success: "valid"}).form();

    if(baseValidation){

        var cvn2 =getIBSInput("powerpass2", t ,"", " CVN2错误：");
        var smNo=document.webShortCutPayForm.smNo.value;
        if(cvn2==''||cvn2==null)
        {
            showTip_scp("CVN2码输入不正确！","err")
            return false;
        }else if(smNo==""){
            showTip_scp("请点击获取短信验证码按钮以获取验证码！","err")
            return false;
        }else{
            closeTip_scp();
            $("#shortCutPayBtn").attr("disabled","disabled");
            $("#cardCvn2").val(cvn2);
            $("#webShortCutPayForm").submit();
        }

    }
}

//借记卡快捷支付-获取验证码
function get_sms_code_shortcutPayApply(){
    var $form = $("form[name='shortcutPayForm']");
    var $smsBtn = $("#getDebitShortcutPaySMSBtn");

    var cardNo =  $form.find("input[name='cardNo']").val();
    var bankCode = $form.find("input[name='bankCode']").val();
    var cardName = $form.find("input[name='cardName']").val();
    var idCardNo = $form.find("input[name='idCardNo']").val();
    var mobile = $form.find("input[name='mobile']").val();
    var orderId = $form.find("input[name='orderId']").val();
    var channelType =$form.find("input[name='channelType']").val();

    if(bankCode == "")
    {
        showTip_01("借记卡卡号输入不正确！请核对输入后重新点击获取短信验证码按钮","err");
        return false;
    }
    if(!(/^([\u4e00-\u9fa5]|[·]){2,15}$/).test(cardName))
    {
        showTip_01("持卡人姓名输入不正确！请核对输入后重新点击获取短信验证码按钮","err");
        return false;
    }
    if(!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/).test(idCardNo))
    {
        showTip_01("身份证号码输入不正确！请核对输入后重新点击获取短信验证码按钮","err");
        return false;
    }
    if(!(/^1[0-9]{10}$/).test(mobile))
    {
        showTip_01("银行预留手机号输入错误！请核对输入后重新点击获取短信验证码按钮","err");
        return false;
    }

    $smsBtn.prop("disabled", "disabled");

    var smNo = $form.find("input[name='smNo']").val();
    if(smNo != "" && smNo != "0"){
        $.ajax({
            type:"get",
            url:"/cgi-bin/sms/verify.cgi",
            timeout:5000,
            data:{
                smNo:smNo,
                m:'ereget'
            },
            cache:false,
            success:function(data){
                if(data == "ok"){
                    timer(60,$smsBtn);
                    showTip_01("短信已重新发送","suc");
                }else{
                    showTip_01(strs[1],"err");
                    $smsBtn.removeAttr("disabled");
                }
            },
            error:function(){
                $smsBtn.removeAttr("disabled");
                alert("\u670d\u52a1\u5668\u7e41\u5fd9\u002c\u8bf7\u7a0d\u540e\u518d\u8bd5\uff01");
            }
        });
    }else{
        $.ajax({
            type:"get",
            url:"/standard/gateway/manager.cgi",
            timeout:10000,
            data:{
                cardNo:cardNo,
                cardName:cardName,
                idCardNo:idCardNo,
                mobile:mobile,
                orderId:orderId,
                cardBankCode:'ZJZF',
                channelType:channelType,
                m:'shortcutPayApply'
            },
            cache:false,
            success:function(data){
                var strs = new Array();
                strs = data.split("&#&");
                if (strs[0] == "00"){
                    timer(60,$smsBtn);
                    showTip_01("短信已发送","suc");
                    $("form[name='shortcutPayForm'] input[name='smNo']").val(strs[1]);
                    $form.find("input[name='cardNo']").attr("readonly","readonly");
                    $form.find("input[name='cardName']").attr("readonly","readonly");
                    $form.find("input[name='idCardNo']").attr("readonly","readonly");
                    $form.find("input[name='mobile']").attr("readonly","readonly");
                }else{
                    showTip_01(strs[1],"err");
                    $smsBtn.removeAttr("disabled");
                }
            },
            error:function(){
                $smsBtn.removeAttr("disabled");
                alert("\u670d\u52a1\u5668\u7e41\u5fd9\u002c\u8bf7\u7a0d\u540e\u518d\u8bd5\uff01");
            }
        });
    }

}

function timer(secs,target){
    var countdown = setInterval(CountDown, 1000);
    function CountDown() {
        target.attr("disabled", "disabled");
        target.val("(" + secs + "秒后)重新获取短信验证码");
        if (secs == 0) {
            clearInterval(countdown);
            target.val("重发短信验证码");
            target.removeAttr("disabled");
        }
        secs--;
    }
}

//借记卡快捷支付->显示点击获取验证码后的验证提示
function showTip_01(text,tipStyle) {
    var $tip = $("form[name='shortcutPayForm'] .u-tip");
    if( $tip.length== 0 ){
        var $message = $("<div class='u-tip'></div>");
        $("form[name='shortcutPayForm']").prepend($message);
        $message.addClass(tipStyle);
        $message.html("<span></span>" + text);
    }else{
        $tip.removeClass();
        $tip.addClass("u-tip");
        $tip.addClass(tipStyle);
        $tip.html("<span></span>" + text);
    }
}

function closeTip_01(){
    $("form[name='shortcutPayForm'] .u-tip").remove();
}

//借记卡快捷支付 - 表单验证
function debitWebShortCutPayFormValidate(){
    var $payForm = $("form[name='shortcutPayForm']");
    var baseValidation = $payForm.validate({
        rules:{
            cardNo:{required:true, rangelength:[14,19],digits:true,isDebitCard:true},
            cardName:{required:true, isChineseCharacter:true},
            idCardNo:{required:true, isIdCardNo:true},
            mobile:{required:true, isMobile:true},
            smsCode:{required:true, isSMSCode:true}
        },
        success: "valid"}).form();

    if (baseValidation) {
        var smNo = $payForm.find("input[name='smNo']").val();
        if(smNo == "") {
            showTip_01("请点击获取短信验证码按钮以获取验证码！", "err");
            return false;
        }

        var bankCode = $payForm.find("input[name='bankCode']").val();
        if(bankCode == "") {
            showTip_01("表单提交错误，请检查卡号是否输入正确！", "err");
            return false;
        }

        $payForm.submit();
    }
}

/**
 *  加载充值卡类型
 */
function loadCardType(){
	//if ($("#noBankPayForm").length> 0){ 
		var form = $("#noBankPayForm");
	    var merchNo = form.find("input[name='merchNo']").val();
	    if(merchNo!="")
		 {
			$.ajax({
				url:"/standard/gateway/manager.cgi",
				data:{merchNo:merchNo,m:"getBankCardProduct"},
				cache:false,
				success:function(data){
					if(data!=""){
						var array = data.split(",");
						for (var i = 0;i< array.length;i++){
							if(array[i]!="")
							{
								var value=array[i].split("|")[0];
								var name=array[i].split("|")[1];
								var oOption= document.createElement("OPTION");
								oOption.value=value;
								oOption.text=name;
								document.getElementById("cardType").options.add(oOption);
							}
						}
					}
				},
				error:function(){
					alert("加载充值卡类型失败！");
				}
			});
		 }else{
    		alert("加载充值卡类型失败！");
		 }
   // }
}

/**
 *  非银行卡支付 - 其它金额 - 控件控制
 */
function chooseFaceAmt()
{
    var faceAmt =$("#faceAmt").val();

    if(faceAmt=="0")
    {
        $("#otherAmtWrap").css("display","block");
    }else
    {
        $("#otherAmtWrap").css("display","none");
    }
}

/**
 *  查询支付结果
 */
function doSearch(){
    $("#paysearch").submit();
}

//支付结果异步查询任务全局变量
var pay_search_interval;
//获取当前时间戳
var timestamp = new Date().getTime();
/**
 *  生成微信二维码
 */
updateWeChatPayQrCode = function () {
    var $form = $("form[name='weChatPayForm']");
    var $rotate = $("<div style='color: #87c4a3;margin-right: 15px;' class='la-ball-clip-rotate la-3x'><div></div></div>");
    $("#wechat_qrcode").removeClass("f-shadow-02");
    $("#wechat_qrcode").empty().html($rotate);
    if(($("#wechat_qrcode").find("img").length)!=0)
	{
    	return;
	}
    $.ajax({
        url:'/standard/gateway/manager.cgi',
        data:{
            orderId:$form.find("input[name='orderId']").val(),
            channelType:$form.find("input[name='channelType']").val(),
            bankCode:'WXSP',
            payType:'16',
            amt:$form.find("input[name='amt']").val(),
            merchNo:$form.find("input[name='merchNo']").val(),
            __token:$form.find("input[name='__token']").val(),
            __long:'ZElJ4R73oucRitV1',
            m:'getCodeUrl'
        },
        dataType:'json',
        cache:false,
        timeout:20000,
        success:function(data) {
            if(data.respCode == "00" && data.codeUrl != "") {
                var options = {
                    render: 'image',
                    ecLevel: 'H',
                    minVersion: parseInt(1, 10),
                    color: '#333333',
                    bgColor: '#ffffff',
                    text: Base64.decode(data.codeUrl),
                    size: parseInt(165, 10),
                    radius: parseInt(40, 10) * 0.01,
                    quiet: parseInt(2, 10),
                    mode: parseInt(4, 10),

                    //label: '',
                    //labelsize: parseInt(11, 10) * 0.01,
                    //fontname: '',
                    //fontcolor: '',

                    image:$("#wechat-img-buffer")[0],
                    imagesize: parseInt(26, 10) * 0.01
                };
                //clean content element
                $("#wechat_qrcode").empty().qrcode(options);
                //add shadow style
                $("#wechat_qrcode").addClass("f-shadow-02");
                //start search pay status task
                if(pay_search_interval != "" &&!pay_search_interval == undefined && pay_search_interval != null)
            	{
                	 clearTimeout(pay_search_interval);
            	}
                pay_search_interval = setInterval(function(){paySearchAsync("wechatpay");},8000);
            }
            else{
            	updateWechatpayQrCodeErrorMessage("",data.respDesc);
            }
        },
        error:function() {
        	updateWechatpayQrCodeErrorMessage("","服务器应答错误");
        }
    });

}

/**
 * 微信二维码错误消息提示
 */
updateWechatpayQrCodeErrorMessage = function(title,content){
    var title = "生成二维码出错了/(ㄒoㄒ)/~~";
    $("#wechatPayWrap").empty();
    var $messageWrap = $("<div class='m-alert warning'></div>");
    var $title = $("<p><span></span>"+ title +"</p>");
    var $content = $("<p class='reason'>"+ content +"</p>");

    $messageWrap.append($title);
    $messageWrap.append($content);

    $("#wechatPayWrap").append($messageWrap);
}

/**
 *  生成支付宝二维码
 */
updateALSPPayQrCode = function () {
    var $form = $("form[name='alspPayForm']");
    var $rotate = $("<div style='color: #87c4a3;margin-right: 15px;' class='la-ball-clip-rotate la-3x'><div></div></div>");
    $("#alsp_qrcode").removeClass("f-shadow-02");
    $("#alsp_qrcode").empty().html($rotate);

    $.ajax({
        url:'/standard/gateway/manager.cgi',
        data:{
            orderId:$form.find("input[name='orderId']").val(),
            channelType:$form.find("input[name='channelType']").val(),
            bankCode:'ALSP',
            payType:'15',
            amt:$form.find("input[name='amt']").val(),
            merchNo:$form.find("input[name='merchNo']").val(),
            __token:$form.find("input[name='__token']").val(),
            __long:'ZElJ4R73oucRitV2',
            m:'getCodeUrl'
        },
        dataType:'json',
        cache:false,
        timeout:20000,
        success:function(data) {
            if(data.respCode == "00" && data.codeUrl != "") {
                var options = {
                    render: 'image',
                    ecLevel: 'H',
                    minVersion: parseInt(1, 10),
                    color: '#333333',
                    bgColor: '#ffffff',
                    text: Base64.decode(data.codeUrl),
                    size: parseInt(165, 10),
                    radius: parseInt(40, 10) * 0.01,
                    quiet: parseInt(2, 10),
                    mode: parseInt(4, 10),

                    //label: '',
                    //labelsize: parseInt(11, 10) * 0.01,
                    //fontname: '',
                    //fontcolor: '',

                    image:$("#alsp-img-buffer")[0],
                    imagesize: parseInt(26, 10) * 0.01
                };
                //clean content element
                $("#alsp_qrcode").empty().qrcode(options);
                //add shadow style
                $("#alsp_qrcode").addClass("f-shadow-02");
                //start search pay status task
                if(pay_search_interval != "" &&!pay_search_interval == undefined && pay_search_interval != null)
            	{
                	 clearTimeout(pay_search_interval);
            	}
                pay_search_interval = setInterval(function(){paySearchAsync("alsppay");},8000);
            }
            else{
                updateALSPQrCodeErrorMessage("",data.respDesc);
            }
        },
        error:function() {
            updateALSPQrCodeErrorMessage("","服务器应答错误");
        }
    });
}

/**
 * 支付宝二维码错误消息提示
 */
updateALSPQrCodeErrorMessage = function(title,content){
    var title = "生成二维码出错了/(ㄒoㄒ)/~~";
    $("#alspPayWrap").empty();
    var $messageWrap = $("<div class='m-alert warning'></div>");
    var $title = $("<p><span></span>"+ title +"</p>");
    var $content = $("<p class='reason'>"+ content +"</p>");

    $messageWrap.append($title);
    $messageWrap.append($content);

    $("#alspPayWrap").append($messageWrap);
}

/**
 * 初始化微信二维码
 * 当微信支付选项默认处于选中状态时
 */
function init_wechat_pay(){
    if ( $("#choosePayType").val() == "5" ) {
        $(".m-pay-t").unbind("click");
    }
    var radio = $('.m-pay-t input:radio[name="payMethod"]:checked');
    if ( radio.val() == "weChatPay" ){
        updateWeChatPayQrCode();
    }
}

/**
 * async order pay status search
 */
paySearchAsync = function(type){
    var interval = (new Date().getTime() - timestamp)/(1000 * 60);
    if ( interval <= 30 ) {
        var $form = $("form[name='paysearch_async']");
        $.ajax({
            url:'/standard/gateway/pay.cgi',
            data:{
                amt:$form.find("input[name='amt']").val(),
                platformID:$form.find("input[name='platformID']").val(),
                orderId:$form.find("input[name='orderId']").val(),
                __token:$form.find("input[name='__token']").val(),
                m:'moboPaySearchAsync'
            },
            dataType:'json',
            cache:false,
            timeout:5000,
            success:function(data){
                if (data.respCode == "00") {
                    if (data.status != "0") {
                    	if("wechatpay"==type)
                    	{
                    		$("form[name='wechatPayResultForm']").submit();
                    	}else if("mbQrCodePay"==type)
                    	{
                    		if (data.status == "1"||data.status == "2") {
                    			$("form[name='mbQRCodePayResultForm']").submit();
                    		}
                    	}else if("alsppay"==type){
                    		$("form[name='alspPayResultForm']").submit();
                    	}
                    }
                }
            }
        });
    } else {
        clearTimeout(pay_search_interval);
    };
}


/**
 *  生成Mo宝二维码
 */
updatembQrCode = function () {
    var $form = $("form[name='mbQRCodePayForm']");
    var $rotate = $("<div style='color: #87c4a3;margin-right: 15px;' class='la-ball-clip-rotate la-3x'><div></div></div>");
    $("#mb_qrcode").removeClass("f-shadow-02");
    $("#mb_qrcode").empty().html($rotate);

    $.ajax({
        url:'/standard/gateway/manager.cgi',
        data:{
            orderId:$form.find("input[name='orderId']").val(),
            channelType:$form.find("input[name='channelType']").val(),
            amt:$form.find("input[name='amt']").val(),
            tradeSummary:$form.find("input[name='tradeSummary']").val(),
            merchName:$form.find("input[name='merchName']").val(),
            bankCode:'WXSP',
            amt:$form.find("input[name='amt']").val(),
            merchNo:$form.find("input[name='merchNo']").val(),
            __token:$form.find("input[name='__token']").val(),
            __long:'ZElJ4R73oucRitV1',
            m:'getMoBaoPayCodeUrl'
        },
        dataType:'json',
        cache:false,
        timeout:10000,
        success:function(data) {
            if(data.respCode == "00" && data.codeUrl != "") {
                var options = {
                    render: 'image',
                    ecLevel: 'H',
                    minVersion: parseInt(1, 10),
                    color: '#333333',
                    bgColor: '#ffffff',
                    text: Base64.decode(data.codeUrl),
                    size: parseInt(165, 10),
                    radius: parseInt(40, 10) * 0.01,
                    quiet: parseInt(2, 10),
                    mode: parseInt(4, 10),

                    //label: '',
                    //labelsize: parseInt(11, 10) * 0.01,
                    //fontname: '',
                    //fontcolor: '',

                    image:$("#img-buffer")[0],
                    imagesize: parseInt(26, 10) * 0.01
                };
                //clean content element
                $("#mb_qrcode").empty().qrcode(options);
                //add shadow style
                $("#mb_qrcode").addClass("f-shadow-02");
                //start search pay status task
                if(pay_search_interval != "" &&!pay_search_interval == undefined && pay_search_interval != null)
            	{
                	 clearTimeout(pay_search_interval);
            	}
                pay_search_interval = setInterval(function(){paySearchAsync("mbQrCodePay");},8000);
                //pay_search_interval = setInterval(paySearchAsync,8000);
            }
            else{
                updateMBQrCodeErrorMessage("",data.respDesc);
            }
        },
        error:function() {
        	updateMBQrCodeErrorMessage("","服务器应答错误");
        }
    });

}

/**
 * Mo宝二维码错误消息提示
 */
updateMBQrCodeErrorMessage = function(title,content){
    var title = "生成二维码出错了/(ㄒoㄒ)/~~";
    $("#mbQRCodePayWrap").empty();
    var $messageWrap = $("<div class='m-alert warning'></div>");
    var $title = $("<p><span></span>"+ title +"</p>");
    var $content = $("<p class='reason'>"+ content +"</p>");

    $messageWrap.append($title);
    $messageWrap.append($content);

    $("#mbQRCodePayWrap").append($messageWrap);
}
/**
 * 显示登录框
 */
function showDiv(){
	$("#popDiv").fadeIn();
	$("#popIframe").fadeIn();
	$("#bg").fadeIn();
	//document.getElementById('popDiv').style.display='block';  
	//document.getElementById('popIframe').style.display='block';  
	//document.getElementById('bg').style.display='block';  
}
/**
 * 隐藏登录框
 */
function closeDiv(isClean,formId){ 
	$("#popDiv").hide();
	$("#popIframe").hide();
	$("#bg").hide();
//	document.getElementById('popDiv').style.display='none';  
//	document.getElementById('bg').style.display='none';  
//	document.getElementById('popIframe').style.display='none';
	if(isClean)
	{
		$("#"+formId).find("input[name='accounts']").val();
		$("#"+formId).find("input[name='captchaCode']").val();
		cleanIBS("login_powerpass");
	}
	
}  
function switchCaptcha(){ 
	$("#captcha").attr("src","/standard/gateway/manager.cgi?m=captcha&time="+ new Date().getTime());
}
function login() {
	var mobileRule = /^1[0-9]{10}$/;
	var emailRule = /^[a-zA-Z0-9_\.\$-]{1,20}@[a-zA-Z0-9]{1,10}(\.[a-zA-Z0-9]{1,5}){1,3}$/;
	var accounts =$("#loginForm").find("input[name='accounts']").val();
	var captchaCode = $("#loginForm").find("input[name='captchaCode']").val();
	var orderId = $("#loginForm").find("input[name='orderId']").val();
	var checkFlag= $("#loginForm").find("input[name='checkFlag']").val();
	if(accounts==""||accounts=="手机号码或电子邮箱")
	{
		$("#login_error").css("display","block"); 
		$("#login_error").html("账户名不能为空");
	    return false;
	}
	if(!mobileRule.test(trim(accounts)) && ! emailRule.test(trim(accounts))){
	  	$("#login_error").css("display","block"); 
		$("#login_error").html("账户名应为手机号码或电子邮箱地址");
	    return false;
	}
	var pwd =getPwdInput("login_powerpass", ts ,"login_error", "登录密码输入错误：");
	if(pwd==''||pwd==null)
	{
	    return false;
	}
	if(captchaCode==''||!(/^[a-zA-Z0-9]{4}$/).test(captchaCode))
	{
		$("#login_error").css("display","block"); 
		$("#login_error").html("验证码输入错误");
	    return false;
	}
	if(pwd!=null&&accounts!=""&&captchaCode!=""){
		$.ajax({
            type:"get",
            url:"/standard/gateway/manager.cgi",
            timeout:10000,
            cache:false,
            data:{
                captchaCode:captchaCode,
                accounts:accounts,
                mngPin:pwd,
                orderId:orderId,
                checkFlag:checkFlag,
                productType:$("#loginForm").find("input[name='productType']").val(),
                __token:$("#loginForm").find("input[name='__token']").val(),
                m:'accountLogin'
            },
            success:function(data){
            	
				if(data!=""){
					var obj = jQuery.parseJSON(data); 
					var respCode = obj.respCode;
					if (respCode == "00") {
						closeDiv(true,'loginForm');
						var accName = obj.Name;
						var accNo = obj.accNo;
						var mobile = obj.Phone;
						var email = obj.Email;
						
						          
						$("#otherPayTypeDiv").hide();
						$("#accountPayDiv").fadeIn();
						$("#chooseLoginDiv").hide();
						$("#chooseOtherPayType").fadeIn();
						/** 账户余额支付  **/
						var form = $("#accBalancePay");
						var tradeAmt = form.find("input[name='amt']").val();
						$("#useableAmt").html(obj.usableAmt);
						form.find("input[name='mobile']").val(mobile);
						form.find("input[name='email']").val(email);
						form.find("input[name='internalIdentity']").val(accNo);
						form.find("input[name='accounts']").val(accounts);
						if(accSub(obj.usableAmt,tradeAmt)<0)
						{
							$("#balancePayDiv").html("余额不够支付产品，请选用其他支付方式");
						}
						/** 账户余额支付  **/
						/** 账户快捷支付  **/
						var form1 = $("#accQuickPay");
						form1.find("input[name='internalIdentity']").val(accNo);
						form1.find("input[name='accounts']").val(accounts);
						/** 账户快捷支付  **/
						$(".m-top-nav").html("您好，"+accounts+"|"+$(".m-top-nav").html());
						$("#otherPayTypeDiv").hide();
						$("#accountPayDiv").fadeIn();
						$("#chooseLoginDiv").hide();
						$("#chooseOtherPayType").fadeIn();
						
					}else {
						var respDesc = obj.respDesc;
						if(respCode == "21"||respCode == "49"||respCode == "48")
						{
							var url="https://person.mobaopay.com/view/mobo/findPWD.jsp";
							respDesc =respDesc+"。<a href=\""+url+"\" target=\"blank\">找回登录密码</a>"
						}
						$("#login_error").css("display","block"); 
						$("#login_error").html(respDesc);
						switchCaptcha();
						
					}
					$("#captchaCode").val("");
					cleanIBS("login_powerpass");
				}
            },
            error:function(){
           		 $("#login_error").css("display","block"); 
				 $("#login_error").html("系统异常，请稍后操作");
				 cleanIBS("login_powerpass");
            }
        });
	}
}
function chooseAccPay() {
	var form = $("#accBalancePay");
	var accounts =form.find("input[name='accounts']").val();
	var orderId = form.find("input[name='orderId']").val();
	var checkFlag = form.find("input[name='checkFlag']").val();
	if(accounts=="")
	{
		$("#balancePayDiv").html("系统异常");
	    return false;
	}
	if(accounts!=""){
		$.ajax({
            type:"get",
            url:"/standard/gateway/manager.cgi",
            timeout:10000,
            cache:false,
            async:false,
            data:{
                accounts:accounts,
                orderId:orderId,
                checkFlag:checkFlag,
                m:'chooseAccPay'
            },
            success:function(data){
				if(data!=""){
					var obj = jQuery.parseJSON(data); 
					var respCode = obj.respCode;
					if (respCode == "00") {
						closeDiv(false,'');
						var smType =obj.smType;
						var smNo = obj.smNo;
						var accName = obj.accName;
						var accNo = obj.accNo;
						var mobile = obj.Mobile;
						var email = obj.Email;
						var tradeAmt = form.find("input[name='amt']").val();
						$("#useableAmt").html(obj.useableAmt);
						//$("#mobile").val(mobile);
						//$("#email").val(email);
						//$("#internalIdentity").val(accNo);
						if(accSub(obj.useableAmt,tradeAmt)>=0)
						{
							if(smType!="1")
							{
								form.find("input[name='smNo']").val("");
								form.find("input[name='smType']").val("");
							}else
							{
								form.find("input[name='smNo']").val(smNo);
								form.find("input[name='smType']").val(smType);
								$("#smsCodeDiv").fadeIn();
								if($("#code_button3").prop("disabled") ==false)
								{
									timer(60,$("#code_button3"));
								}
							}
						}else
						{
						 	$("#balancePayDiv").html("余额不够支付产品，请选用其他支付方式");
						}
						$("#otherPayTypeDiv").hide();
						$("#accountPayDiv").fadeIn();
						$("#chooseLoginDiv").hide();
						$("#chooseOtherPayType").fadeIn();
					}else {
						var respDesc = obj.respDesc;
						$("#balancePayDiv").html(respDesc);
						
					}
				}
            },
            error:function(){
            	$("#balancePayDiv").html("系统异常");
            }
        });
	}
}
function chooseQuickPay() {
	var form = $("#accQuickPay");
	var internalIdentity =form.find("input[name='internalIdentity']").val();
	var accounts =form.find("input[name='accounts']").val();
	var orderId = form.find("input[name='orderId']").val();
	var checkFlag = form.find("input[name='checkFlag']").val();
	if(accounts=="")
	{
		$("#balancePayDiv").html("系统异常");
	    return false;
	}
	if(accounts!=""){
		$.ajax({
            type:"get",
            url:"/standard/gateway/manager.cgi",
            timeout:10000,
            cache:false,
            async:false,
            data:{
                accounts:accounts,
                orderId:orderId,
                checkFlag:checkFlag,
                accNo:internalIdentity,
                m:'chooseAccQuickPay'
            },
            success:function(data){
				if(data!=""){
					var obj = jQuery.parseJSON(data); 
					var respCode = obj.respCode;
					if (respCode == "00") {
						closeDiv(false,'');
						var debitBankCount=0;
						var creditBankCount=0;
						var detailData= obj.resultData.detailData;
						if(detailData.length==0)
						{
							messageShow("accQuickPay_errorInfo","请开通快捷支付","err");
						}else
						{
							$("#accQuickPayDebitBankList ul").html("");
							$("#accQuickPayCreditBankList ul").html("");
							$.each(detailData, function (index, o) {
								if(o.cardType==1)
								{
									debitBankCount=debitBankCount+1;
									$("#accQuickPayDebitBankList ul").append(
						                    "<li><input type='radio' value='"+o.bankCode+"' name='pt' id='K_"+o.bankCode+"_J_"+index+"' bankCardNo='"+o.bankCardNo+"'><label for='K_"+o.bankCode+"_J'>"
						                    +"<img src='/static/img/bank/"+o.bankCode.toLocaleLowerCase()+".png' alt=''/><span>"+o.coverBankCardNo+"</span></label><i></i></li>");
								}else
								{
									creditBankCount=creditBankCount+1;
									$("#accQuickPayCreditBankList ul").append(
						                    "<li><input type='radio' value='"+o.bankCode+"' name='pt' id='K_"+o.bankCode+"_X_"+index+"' bankCardNo='"+o.bankCardNo+"'><label for='K_"+o.bankCode+"_X'>"
						                    +"<img src='/static/img/bank/"+o.bankCode.toLocaleLowerCase()+".png' alt=''/><span>"+o.coverBankCardNo+"</span></label><i></i></li>");
								}
								
							});
							$("#accQuickPay_bankInfo").append("<br style=\"clear:both\">");
							selectBankEffect("accQuickPayDebitBankList",2);
							selectBankEffect("accQuickPayCreditBankList",2);
							$("#accQuickPayDebitBankList li").each(function(){
						        $(this).click(function(){
						        	form.find("input[name='debitBankCardNo']").val($(this).children("input[type='radio']").attr("bankCardNo"));
						        	form.find("input[name='creditBankCardNo']").val("");
						        	form.find("input[name='cardType']").val(1);
						        });
						    })
						    $("#accQuickPayCreditBankList li").each(function(){
						        $(this).click(function(){
						        	form.find("input[name='creditBankCardNo']").val($(this).children("input[type='radio']").attr("bankCardNo"));
						        	form.find("input[name='debitBankCardNo']").val("");
						        	form.find("input[name='cardType']").val(2);
						        });
						    })
						}
						form.find("input[name='debitBankCount']").val(debitBankCount);
						form.find("input[name='creditBankCount']").val(creditBankCount);
						if(debitBankCount==0)
						{
						
							$("#accQuickPayDebitBankList ul").html("没有开通借记卡快捷支付,<a href='https://person.mobaopay.com'>开通快捷支付</a>");
						}
						if(creditBankCount==0)
						{
							$("#accQuickPayCreditBankList ul").html("没有开通借记卡快捷支付,<a href='https://person.mobaopay.com'>开通快捷支付</a>");
						}
						chooseCardType("");
						var smType =obj.smType;
						var smNo = obj.smNo;
						if(smType!="1")
						{
							form.find("input[name='smNo']").val("");
							form.find("input[name='smType']").val("");
						}else
						{
							form.find("input[name='smNo']").val(smNo);
							form.find("input[name='smType']").val(smType);
							$("#smsCodeDiv_quickPay").fadeIn();
							if($("#code_button4").prop("disabled") ==false)
							{
								timer(60,$("#code_button4"));
							}
						}
					}else {
						var respDesc = obj.respDesc;
						messageShow("accQuickPay_errorInfo",respDesc,"err");
					}
				}
            },
            error:function(){
            	messageShow("accQuickPay_errorInfo","系统异常!","err");
            }
        });
	}
}
function doQuickPay() {
	var form = $("#accQuickPay");
	var pwd =getPwdInput("accQuickpay_password", ts ,"accQuickPay_errorInfo", "支付密码输入错误：");	
	var smType=form.find("input[name='smType']").val();
	var cardType=form.find("input[name='cardType']").val();
	var bankCardNo="";
	var cardCvn2 ="";	
	var cardExpire="";
	
	if(cardType==2)
	{
		bankCardNo=form.find("input[name='creditBankCardNo']").val();
		if(bankCardNo=="")
		{
			messageShow("accQuickPay_errorInfo","请选择支付的银行卡!","err");
			return false;
		}
		cardCvn2 =getIBSInput("accQuickpay_cardCvn2", ts ,"accQuickPay_errorInfo", "CVN2输入错误：");	
		cardExpire=form.find("input[name='cardExpire']").val();
		if(cardExpire==""||cardExpire==null)
		{
			messageShow("accQuickPay_errorInfo","请输入信用卡有效期!","err");
			return false;
		}
	    if(!(/^(0[1-9]|1[012])(1[6-9]|[2-3][0-9])$/.test(cardExpire))){
	    	messageShow("accQuickPay_errorInfo","信用卡有效期输入错误!","err");
	        return false;
	    }
		if(cardCvn2==""||cardCvn2==null)
		{
			messageShow("accQuickPay_errorInfo","请输入信用卡CVN2!","err");
			return false;
		}
		//if(!(/^[0-9]{3}$/.test(cardCvn2))){
		//	messageShow("accQuickPay_errorInfo","CVN2输入不正确!","err");
	    //    return false;
	    //}
		
	}else
	{
		bankCardNo=form.find("input[name='debitBankCardNo']").val();
		if(bankCardNo=="")
		{
			messageShow("accQuickPay_errorInfo","请选择支付的银行卡!","err");
			return false;
		}
	}
	if(pwd==''||pwd==null)
	{
	    return false;
	}
	if(smType==1)
	{
		var smsCode = form.find("input[name='smsCode']").val();
		if(smsCode=="")
		{
			messageShow("accQuickPay_errorInfo","短信验证码不能为空","err");
			return false;
		}
		if(smsCode.length!=6)
		{
			messageShow("accQuickPay_errorInfo","短信验证码只能是6位数字","err");
			return false;
		}
	}
	form.find("input[name='password']").val(pwd);
	form.find("input[name='cardCvn2']").val(cardCvn2);
	$.ajax({
        type:"post",
        url:"/standard/gateway/pay.cgi",
        timeout:10000,
        cache:false,
        data:$("#accQuickPay").serialize(),
        success:function(data){
        	if (!data.match("^\{(.+:.+,*){1,}\}$"))
			{
			   document.write(data);
			}
			else
			{
            	var jsonData = jQuery.parseJSON(data);
            	if (jsonData.respCode != "00") {
					messageShow("accQuickPay_errorInfo",jsonData.respDesc,"err");
				}
			}
        },
        error:function(){
			messageShow("","支付失败！","err");
        }
    });
}
function _getReSendSmsCode(formId,smNoId,objId,messageId)
{		
	var form = $("#"+formId);
	var obj = $("#"+objId);
	var smNo = form.find("input[name='"+smNoId+"']").val();
	$.ajax({
        type:"get",
        url:"/cgi-bin/sms/verify.cgi",
        timeout:10000,
        cache:false,
        data:{
            smNo:smNo,
            m:'ereget'
        },
        success:function(data){
			if (data == "ok") {
				timer(60,obj);
				messageShow(messageId,"手机短信验证码发送成功！","suc");
			}else
			{
				messageShow(messageId,"手机短信验证码发送失败！","err");
			}
        },
        error:function(){
			messageShow(messageId,"手机短信验证码发送失败！","err");
        }
    });
}
function moboWebPay()
{
	var form = $("#accBalancePay");
	var pwd =getPwdInput("afert_powerpass", ts ,"accBalancePay_errorInfo", "支付密码输入错误：");	
	var smType=form.find("input[name='smType']").val();
	if(pwd==''||pwd==null)
	{
	    return false;
	}
	if(smType==1)
	{
		var smsCode = form.find("input[name='smsCode']").val();
		if(smsCode=="")
		{
			messageShow("accBalancePay_errorInfo","短信验证码不能为空","err");
			return false;
		}
		if(smsCode.length!=6)
		{
			messageShow("accBalancePay_errorInfo","短信验证码只能是6位数字","err");
			return false;
		}
	}
	form.find("input[name='password']").val(pwd);
	$.ajax({
        type:"get",
        url:"/standard/gateway/pay.cgi",
        timeout:10000,
        cache:false,
        data:$("#accBalancePay").serialize(),
        success:function(data){
        	if (!data.match("^\{(.+:.+,*){1,}\}$"))
			{
			   document.write(data);
			}
			else
			{
            	var jsonData = jQuery.parseJSON(data);
            	if (jsonData.respCode != "00") {
					messageShow("accBalancePay_errorInfo",jsonData.respDesc,"err");
				}
			}
        },
        error:function(){
			messageShow("","支付失败！","err");
        }
    });
}
function messageShow(messageId,message,type)
{
	$("#"+messageId).attr("class","u-tip f-hidden");
    $("#"+messageId).addClass(type);
    $("#"+messageId).css("display","block");
    $("#"+messageId).html("<span></span>"+message);
    setTimeout(function(){messageClose(messageId);},3000); 
}
function messageClose(messageId)
{
	$("#"+messageId).css("display","none");
}

function otherPayType()
{
	$("#otherPayTypeDiv").fadeIn();
	$("#accountPayDiv").hide();
	$("#chooseMoBaoPayDiv").fadeIn();
	$("#chooseOtherPayType").hide();
}
function mobaopay()
{
	$("#otherPayTypeDiv").hide();
	$("#accountPayDiv").fadeIn();
	$("#chooseMoBaoPayDiv").hide();
	$("#chooseOtherPayType").fadeIn();
	
}


function chooseCardType(cardType)
{
	var form = $("#accQuickPay");
	var active=form.find("input[name='cardType']").val();
	if(cardType=="")
	{
		cardType=active;
	}
	if(cardType==1)
	{
		var count=$("#accQuickPay").find("input[name='debitBankCount']").val();
		if(count==0)
		{
			$("#accQuickPay_div").hide();
		}else
		{
			$("#accQuickPay_div").fadeIn();
		}
	}else
	{
		var count=$("#accQuickPay").find("input[name='creditBankCount']").val();
		if(count==0)
		{
			$("#accQuickPay_Credit_div").hide();
		}else
		{
			$("#accQuickPay_Credit_div").fadeIn();
		}
		if(count==0)
		{
			$("#accQuickPay_div").hide();
		}else
		{
			$("#accQuickPay_div").fadeIn();
		}
		
	}
	form.find("input[name='cardType']").val(cardType);
}
function trim(str){ //删除左右两端的空格
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

function accSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
	    r1 = arg1.toString().split(".")[1].length;
	}
	catch (e) {
	    r1 = 0;
	}
	try {
	    r2 = arg2.toString().split(".")[1].length;
	}
	catch (e) {
	    r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}