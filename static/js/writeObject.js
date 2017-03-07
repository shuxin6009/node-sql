var _app = navigator.appName;
var rootUrl = "https://trade.mobaopay.com";
function powerConfig(args) {
	var defaults = {"width":300,"height":30,"maxLength":16,"borderColor":"#ffffff", "minLength":5, "maskChar":"*",
	 "accepts":"[:print:]{6,32}", "caption":"Mo\u5b9d\u5bc6\u7801\u8f6f\u4ef6\u76d8", "lang":"zh_CN"};
	for (var p in args) {
		if (args[p] != null) {
			defaults[p] = args[p];
		}
	}
	return defaults;
}

function writePluginObject(oid, clsid, cfg) {
	document.write('<object id="' + oid + '" type="' + clsid
		+ '" width="' + cfg.width + '" height="' + cfg.height
		+ '" style="float:left;display:inline;width:330px;height:25px;line-height:25px; margin-left:35px;outline:none;">');
	for (var name in cfg)
		document.write('<param name="' + name + '" value="' + cfg[name] + '">');	
	document.write('</object>');
};


function writeObject(oid, clsid, cfg) {
	document.write('<object id="' + oid + '" codebase="'+rootUrl+'/ocx/PowerEnterMBPAY.CAB#version=2,3,9,6" classid="' + clsid
			+ '" width="' + cfg.width + '" height="' + cfg.height
			+ '">');
	for (var name in cfg)
		document.write('<param  name="' + name + '" value="' + cfg[name] + '">');
	document.write('</object>');
};



function writeEditObject(oid, cfg) {
	if (!oid || typeof(oid) != "string") {
		alert("writeEditObj Failed: oid are required!");
	} else {
		//if (_app == 'Microsoft Internet Explorer')\\
		if (isIE())
		{
			writeObject(oid+"_ie", "clsid:0E6416C9-19AF-47BC-8433-D2F67DC9D597", powerConfig(cfg));
		}
		else
		{
			writePluginObject(oid+"_noie", "application/x-vnd-csii-powerenter-mbpay", powerConfig(cfg));
			setPEXSetupUrl(oid+"_noie");
		}
	}
};

function writeEditObject1(oid, cfg) {
	if (!oid || typeof(oid) != "string") {
		alert("writeEditObj Failed: oid are required!");
	} else {
		//if (_app == 'Microsoft Internet Explorer')
		if (isIE())
		{
			writeObject(oid+"_ie", "clsid:0E6416C9-19AF-47BC-8433-D2F67DC9D597", powerConfig1(cfg));
		}
		else
		{
			writePluginObject(oid+"_noie", "application/x-vnd-csii-powerenter-mbpay", powerConfig1(cfg));
			setPEXSetupUrl(oid+"_noie");
		}
	}
};


function writePassObject(oid, cfg) {
	if (!oid || typeof(oid) != "string") {
		alert("writePassObj Failed: oid are required!");
	} else {
		//if (_app == 'Microsoft Internet Explorer')
		if (isIE())
		{
			writeObject(oid+"_ie", "clsid:410D8360-EB8D-4C8B-A921-F50EB1B3D11C", powerConfig(cfg));
		}
		else
		{
			writePluginObject(oid+"_noie", "application/x-vnd-csii-powerenter-mbpay", powerConfig(cfg));
			setPEXSetupUrl(oid+"_noie");
		}
	}
};

function writeUtilObject(oid, cfg) {
	if (!oid || typeof(oid) != "string") {
		alert("writeUtilObj Failed: oid are required!");
	} else {
		//if (_app == 'Microsoft Internet Explorer')
		if (isIE())
		{
			writeObject(oid+"_ie", "clsid:0835FF65-1D98-4818-B803-7E67C08E81D7", powerConfig(cfg));
		}
		else
		{
			writePluginObject(oid+"_noie", "application/x-vnd-csii-powerenter-mbpay", powerConfig(cfg));
		}
	}
};
function cleanIBS(id) 
{
	var powerobj = document.getElementById(getObjID(id));
	powerobj.clear();
}

function getIBSInput(id, ts, spanId,massage) 
{
    try 
    {    	
		var powerobj = document.getElementById(getObjID(id));	
		powerobj.setTimestamp(ts);
		var nresult = powerobj.verify();
		if(nresult < 0)
		{			
			var error;
			if(nresult == -1)
			{
				error = "<s></s>内容不能为空";
			}
			else if(nresult == -2)
			{
				error = "<s></s>输入内容必须是3位";
			}
			else if(nresult == -3)
			{
				error = "<s></s>输入内容不合法";
			}
			else
			{
				error = powerobj.lastError(); 
			}
			if(spanId!="")
			{
				PEGetElement(spanId).innerHTML = massage +error;
				$("#"+spanId).fadeIn();
			}
			return null;
		}	
				
		value = powerobj.getValue();
		if(value=="")
		{
			if(spanId!="")
			{
				PEGetElement(spanId).innerHTML= massage+powerobj.lastError();
				$("#"+spanId).fadeIn();
			}
			return null;
		}
		else
		{
			return value;
		}
	}
	catch(e)
	{
		if(spanId!="")
		{
			PEGetElement(spanId).innerHTML= massage +e.message; 
			$("#"+spanId).fadeIn();
		}
	}
	return null;
}

function getPwdInput(id, ts, spanId,massage) 
{
    try 
    {    	
		var powerobj = document.getElementById(getObjID(id));	
		powerobj.setTimestamp(ts);
		var nresult = powerobj.verify();
		if(nresult < 0)
		{			
			var error;
			if(nresult == -1)
			{
				error = "<s></s>内容不能为空";
			}
			else if(nresult == -2)
			{
				error = "<s></s>输入密码至少6位";
			}
			else if(nresult == -3)
			{
				error = "<s></s>输入内容不合法";
			}
			else
			{
				error = powerobj.lastError(); 
			}
			PEGetElement(spanId).innerHTML = massage +error;
			$("#"+spanId).fadeIn();
			return null;
		}	
				
		value = powerobj.getValue();
		if(value=="")
		{
			PEGetElement(spanId).innerHTML= massage+powerobj.lastError();
			return null;
		}
		else
		{
			return value;
		}
	}
	catch(e)
	{
		PEGetElement(spanId).innerHTML= massage +e.message; 
	}
	return null;
}

function getMFMInput(id, ts, spanId,massage) 
{
    try 
    {
		var powerobj = document.getElementById(getObjID(id));	
		powerobj.setTimestamp(ts);
		value = powerobj.getMFM();
		if(value=="")
		{
			PEGetElement(spanId).innerHTML= massage + powerobj.lastError(); 
			return null;
		}
		else
		{
			return value;
		}
	}
	catch(e)
	{
		PEGetElement(spanId).innerHTML= massage + e.message; 
	}
	return null;
}

function PEGetElement(id)
{
	return  window.document.getElementById(id);
}

function getObjID(id)
{
	//if (_app == 'Microsoft Internet Explorer'){
	if (isIE()) {
		id=id+"_ie";
	}else{
		id=id+"_noie";
	}
	return id;
}

function setPEXSetupUrl(oid)
{
	//if (_app != 'Microsoft Internet Explorer')
	if (isIE())
	{
		var powerEnterPlugin = navigator.plugins["PowerEnter Plug-in for MBPAY"];
		
        if(powerEnterPlugin == null)
        	PEGetElement(oid).innerHTML = '<a href="'+rootUrl+'/setup/PowerEnterMBPAY.exe" class="download_install">点击此处下载控件</a>';
        	
	}
}

function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}