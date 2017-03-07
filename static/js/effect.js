/**
 * Created by ruby on 15/12/24.
 * @mail liyufeng_23@163.com
 */


/**
 * 页面初始效果
 */
function loadDynamicEffect(){
    //页面预处理
    preProcess();
    //显示卡信息
    displayCardInfo();
    //加载银行选择效果
    //selectBankEffect();
    //设置默认属性为checked的wrap样式
    checkedPayWrapStyle();
    //加载支付方式选择效果
    selectPayWayEffect();
    //加载tab选项卡选择效果
    selectTabEffect();
    //设置默认值为active的tab样式
    activeTabStyle();
}

function displayCardInfo()
{

    if($("#b2cDebitBankList ul").length> 0)
    {
        loadCard(8,1,"b2cDebitBankList");
    }
    if($("#b2cCreditBankList ul").length> 0)
    {
        loadCard(1,1,"b2cCreditBankList");
    }
    if($("#b2bBankList ul").length> 0)
    {
        loadCard(7,1,"b2bBankList");
    }
}

/**
 * 页面预处理
 */
function preProcess(){
    //默认隐藏订单详情
    //$(".m-order-info ul li:gt(2)").hide();

    //默认隐藏第一个wrap的顶边
    $(".m-pay-wrap:lt(1)").addClass("m-pay-wrap-fix");

    //绑定显示订单详情按钮
    //$("#orderDetailBtn").click(function(){
    //    if($(".m-order-info ul li:gt(2)").is(":visible"))
    //        $(".m-order-info ul li:gt(2)").hide();
    //    else
    //        $(".m-order-info ul li:gt(2)").show();
    //});
}

/**
 * 选择银行效果
 */
function selectBankEffect(elementId,type){
    $("#"+elementId+" li").each(function(){
        $(this).click(function(){
        	if(type==1)
        	{
        		$(".bank-checked").removeClass("bank-checked");
                $(this).addClass("bank-checked");
        	}else
        	{
        		$(".bank-checked").removeClass("bank-checked");
                $(this).addClass("bank-checked");
        	}
            //setting input radio checked status
            $(".m-bank-list li input[type='radio']").prop('checked',false);
            $(this).children("input[type='radio']").prop("checked",true);
        });
    });
}

/**
 * 为默认选择的支付方式设置样式
 * 依据input[name="payMethod"]的checked值
 */
function checkedPayWrapStyle(){
    //重置样式
    $('.m-pay-mn').css("display","none");
    //$('.m-pay-amt').css("display","none");
    $('.m-pay-wrap').removeClass("sel");
    //设置选中样式
    var radio = $('.m-pay-t input:radio[name="payMethod"]:checked');
    if(radio.val()=='noBankPay')
    {
		loadCardType();
    }
    if(radio.val()=='accountBalancePay')
    {
		chooseAccPay();
    }
    if(radio.val()=='accountQuickPay')
    {
		chooseQuickPay();
    }
    if (radio.val()=="weChatPay"){
        updateWeChatPayQrCode();
    }
    if (radio.val()=="mbQRCodePay"){
    	updatembQrCode();
    }
    if (radio.val()=="alsppay"){
        updateALSPPayQrCode();
    }
    radio.parents('.m-pay-wrap').children('.m-pay-mn').css("display","block");
    radio.parents('.m-pay-wrap').addClass("sel");
}

/**
 * 选择支付方式效果
 */
function selectPayWayEffect(){
    $(".m-pay-t").click(function(){
        if(!$(this).hasClass("alipay")){
        	if(!($(this).children('input:radio[name="payMethod"]').is(":checked")))
        	{
	            $(this).children('input:radio[name="payMethod"]').prop("checked",true);
	            checkedPayWrapStyle();
        	}
        }
    });

    $(".m-pay-t input:radio[name='payMethod']").click(function(){
        if($(this).val() != "aliPay")
            checkedPayWrapStyle();
    });
}

/**
 * 选择tab选项卡效果
 */
function selectTabEffect(){
    $(".tab-nav li").each(function() {
        $(this).click(function () {
            var tabs = $(this).closest(".tab-nav").children("li");
            tabs.removeClass("active");
            $(this).addClass("active");

            //var panels = $(this).closest(".m-tabs").children(".tab-content").children(".tab-panel");
            //panels.css("display", "none");
            //var content = $(this).closest(".m-tabs").children(".tab-content").children(".tab-panel").eq($(this).index());
            //content.css("display", "block");
            var panels = $(this).closest(".m-tabs").find(".tab-panel");
            panels.css("display", "none");
            var content = $(this).closest(".m-tabs").find(".tab-panel").eq($(this).index());
            content.css("display", "block");
        });
    });
}

//设置默认激活的tab样式
function activeTabStyle(){
    $(".tab-nav li").each(function() {
        if($(this).attr("class")=="active"){
            var panels = $(this).closest(".m-tabs").find(".tab-panel");
            panels.css("display", "none");
            var content = $(this).closest(".m-tabs").find(".tab-panel").eq($(this).index());
            content.css("display", "block");
        }
    });
}

/**
 *  打开、关闭遮罩层
 */
function openMask(){$("#mask").css("display","block");$("#fade").css("display","block");}
function closeMask(){$("#mask").css("display","none");$("#fade").css("display","none");}
//非银行支付遮罩层
function openMask2(){$("#mask2").show();$("#fade").show();}

/**
 *  获取卡显示配置信息
 */

function loadCard(payType,tradeChannel,elementId){
    $.ajax({
    	cache:false,
        url:"/standard/gateway/manager.cgi",
        data:{payType:payType,tradeChannel:tradeChannel,m:"getCard"},
        success:function(data){
            if(data!=""){
            	var parsedJson = jQuery.parseJSON(data);
            	for(var i=0;i<parsedJson.length;i++)
            	{
                    if(payType=="8")
                    {
                    	var cardCode="J_"+parsedJson[i].cardCode;
                    	$("#"+elementId+" ul").append(
	                    "<li><input type='radio' value='"+cardCode+"' name='pt' id='"+cardCode+"'><label for='"+cardCode+"'>"
	                    +"<img src='/static/img/bank/"+parsedJson[i].cardCode.toLocaleLowerCase()+".png' alt='"+parsedJson[i].cardName+"'/> </label><i></i></li>");
                    }else if(payType=="7")
                    {
                    	var cardCode=parsedJson[i].cardCode+"_B2B";
	                    $("#"+elementId+" ul").append(
	                    "<li><input type='radio' value='"+parsedJson[i].cardCode+"' name='pt' id='"+cardCode+"'><label for='"+cardCode+"'>"
	                    +"<img src='/static/img/bank/"+parsedJson[i].cardCode.toLocaleLowerCase()+"-b2b.png' alt='"+parsedJson[i].cardName+"'/> </label><i></i></li>");
                    }
                    else if(payType=="1")
                    {
                     $("#"+elementId+" ul").append(
                     "<li><input type='radio' value='"+parsedJson[i].cardCode+"' name='pt' id='"+parsedJson[i].cardCode+"'><label for='"+parsedJson[i].cardCode+"'>"
                     +"<img src='/static/img/bank/"+parsedJson[i].cardCode.toLocaleLowerCase()+".png' alt='"+parsedJson[i].cardName+"'/></label><i></i></li>");
                    }

            	}
            	selectBankEffect(elementId,1);
            	$("#"+elementId+" li").each(function(){
			        $(this).click(function(){
			            //重置所有选项值
			            $("input[name='payType1']").val(0);
			            $("#"+elementId+"").closest("form").find("input[name='payType1']").val(payType);
			        });
			    })
            }
        },
        error:function(){
            alert("加载失败！");
        }
    });
}