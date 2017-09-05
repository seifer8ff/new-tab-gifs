var Store =  (function() {

	function isExpired(key) {
		var obj = JSON.parse(localStorage.getItem(key));
		var now = new Date().getTime();
		if (now >= obj.expires) {
			return true;
		} else {
			return false;
		}
	}

	function setLocal(key, data, timeToExpire) {
		var obj = {
			data: data,
			expires: new Date().getTime() + timeToExpire
		}
		localStorage.setItem(key, JSON.stringify(obj));
	}

	function getLocal(key) {
		return JSON.parse(localStorage.getItem(key)).data;
	}

	function validateInput(str) {
		return str.trim().replace(/\s+/g,"+");
	}
	

	return {
		setLocal: setLocal,
		getLocal: getLocal,
		isExpired: isExpired,
		validate: validateInput
	}
}());




