/**
 * Created by ruby on 2016/3/16.
 * mail: liyufeng_23@163.com
 */

/**
 * Virtual Card Plugin
 */
(function ($){
    jQuery.fn.card = function(options) {
        options = $.extend({
            containerId:'',
            //1=借记卡; 2=贷记卡
            cardType:1,
            numberInputName:'number',
            expireInputName:'expire'
        },options);

        var make = function() {

            var $this = $(this);

            var $container = null;

            if (options.containerId != "" || options.containerId != null) {
                $container = $("#"+options.containerId);
            }

            var $number = $this.find("input[name='"+ options.numberInputName +"']");
            var $expire = $this.find("input[name='"+ options.expireInputName +"']");

            switch (options.cardType) {
                case 1: {
                    showDebitCard();
                    break;
                };

                case 2: {
                    showCreditCard();
                    break;
                };
            }

            function showDebitCard() {

                var content = '\
                <div class="front">\
                    <div class="lower">\
                        <div class="bank-name display"></div>\
                        <div class="number display">•••• •••• •••• •••• •••</div> \
                        <div class="name display">mobao pay</div>\
                    </div> \
                </div>\
                ';

                var $vCard = $("<div class='m-card-wrap blue'></div>");
                $vCard.html(content);
                $container.append($vCard);

                //事件绑定
                $number.focus(function() {
                    $container.find(".m-card-wrap").fadeIn();
                    $container.find(".front").show();
                    $container.find(".number").addClass("focus");
                });

                $number.blur(function() {
                    $container.find(".number").removeClass("focus");
                });

                $number.keyup(function() {
                    formatNumber($(this).val());
                });
            }

            function showCreditCard() {
                var content = '\
                <div class="front">\
                    <div class="lower">\
                        <div class="shiny"></div>\
                        <div class="number display">•••• •••• •••• •••• •••</div> \
                        <div class="name display">mobao pay</div>\
                        <div class="expiry display" data-before="month/year">••/••</div>\
                    </div> \
                </div>\
                <div class="back">\
                    <div class="bar"></div>\
                    <div class="sign"></div>\
                    <div class="cvc display">•••</div>\
                </div>\
                ';

                var $vCard = $("<div class='m-card-wrap'></div>");
                $vCard.html(content);
                $container.append($vCard);

                $number.focus(function(){
                    $container.find(".m-card-wrap").fadeIn();
                    $container.find(".back").hide();
                    $container.find(".front").show();
                    $container.find(".number").addClass("focus");
                });

                $number.blur(function(){
                    $container.find(".number").removeClass("focus");
                });

                $expire.focus(function(){
                    $container.find(".m-card-wrap").fadeIn();
                    $container.find(".back").hide();
                    $container.find(".front").show()
                    $container.find(".expiry").addClass("focus");
                });

                $expire.blur(function(){
                    $container.find(".expiry").removeClass("focus");
                });

                $number.keyup(function(){
                    formatNumber($(this).val());
                });

                $expire.keyup(function(){
                    var ex = $(this).val();
                    var len = ex.length;

                    var _temp = "";

                    for(var i=0; i<len; i++){
                        if(i==1){
                            _temp = _temp + ex.charAt(i) + "/";
                        }else{
                            _temp = _temp +ex.charAt(i);
                        }
                    }

                    $container.find(".expiry").text(_temp);

                    if(len == 0){
                        $container.find(".expiry").text("••/••");
                    }
                });
            }

            function formatNumber(value){
                var cv = value;
                var len = cv.length;

                var _temp = "";

                for(var i=0; i<len; i++) {
                    if(i==3 || i==7 || i==11 || i==15){
                        _temp = _temp + cv.charAt(i) + " ";
                    }else{
                        _temp = _temp + cv.charAt(i);
                    }
                }
                $container.find(".number").text(_temp);
                if(len == 0) {
                    $container.find(".number").text("•••• •••• •••• •••• •••");
                }
            }

        };

        return this.each(make);
    };



})(jQuery);