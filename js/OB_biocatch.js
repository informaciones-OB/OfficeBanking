var OB_RUTA = "https://bcdn-7b4df495.santander.cl/scripts/7b4df495/7b4df495.js";

var GET_BROWSERINFO = function () {
	var ua = navigator.userAgent, tem,
		_Mbwr = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(_Mbwr[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return "MSIE " + (tem[1] || "");
	}
	if (_Mbwr[1] === "Chrome") {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem !== null) {
			return tem.slice(1).join(" ").replace("OPR", "Opera");
		}
	}
	_Mbwr = _Mbwr[2] ? [_Mbwr[1], _Mbwr[2]] : [navigator.appName, navigator.appVersion, "-?"];
	if ( (ua.match(/version\/(\d+)/i)) !== null) {
    tem = ua.match(/version\/(\d+)/i);
		_Mbwr.splice(1, 1, tem[1]);
	}
	return _Mbwr.join(" ");
};

//Base REGEX
var GO2_REGEXCI = function (format, data) {
	var str = String(data);
	return str.match(format, "i") ? true : false;
}


//Determina si no es MSIE
var IS_IE = function () {
	var browserName = GET_BROWSERINFO();
	var format = /[IE*]/;
	return GO2_REGEXCI(format, browserName);

}

function loadScript(callback, async_mode) {
	var script = document.createElement("script");
	var callback_mode = true;

	script.type = "text/javascript";

	// Check async mode parameter v3
	if (async_mode === undefined || typeof async_mode != 'boolean') {
		console.log(
			'loadScript: Invalid value or missing async parameter, script will be loaded in synchronous mode')
		async_mode = false;
	}
	script.async = async_mode;

	if (callback === undefined || typeof callback != 'function') {
		console.log(
			'loadScript: Missing callback function, script will be loaded without callback action')
		callback_mode = false;
	}

	// Prepare script to run callback function when loaded
	if (script.readyState) { //IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" ||
				script.readyState == "complete") {
				script.onreadystatechange = null;
				console.log('loadScript: successfully loaded');
				if (callback_mode) callback();
			}
		};
	} else { //Others
		script.onload = function () {
			console.log('loadScript: successfully loaded');
			if (callback_mode) callback();
		};
	}
	script.src = OB_RUTA;
	document.getElementsByTagName("head")[0].appendChild(script);
};

/*control de carga para DEFAULT.HTM*/
if (!IS_IE()) {

	loadScript(function () {
		cdApi.resetSessionNumber();
		cdApi.changeContext('LOGIN');
	}, true);
}
