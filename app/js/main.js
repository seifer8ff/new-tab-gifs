(function() {

	var settings = {
		singleDisplay: localStorage.getItem("single")
	} 
	

	init();

	
	function init() {
		if (!navigator.onLine) {
			document.body.style.background = "url('img/default.gif') no-repeat center center fixed";
			document.body.style.backgroundSize = "cover";
			return;
		}

		if (settings.singleDisplay) {
			SingleGIF.init();
		} else {
			MultiGIF.init();
		}
	}
}());




