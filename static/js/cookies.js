/**
 * Created by yuanyuan on 2017/1/6.
 */

/**
 * 获取cookies值
 * @param key
 * @returns {string}
 */
function getCookiesValueByKey(key) {
    var target = key + "=";
    if (document.cookie.length > 0)
    {
        var start = document.cookie.indexOf(target);
        if (start != -1)
        {
            start += target.length;
           var  end = document.cookie.indexOf(";", start);
            if (end == -1) end = document.cookie.length;
        }
    }
    return document.cookie.substring(start, end);
}

/**
 * 设置cookies值
 * @param key
 * @param value
 */
function setCookiesValueBy(key,value) {
    document.cookie = document.cookie||key+ '=' + value;
}