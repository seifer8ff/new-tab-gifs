(function() {

	var settings = {
		singleDisplay: localStorage.getItem("single"),
		keyword: localStorage.getItem("keyword"),
		currentKeyword: localStorage.getItem("currentKeyword"),
		URL
	} 
	

	init();

	
	function init() {
		if (!navigator.onLine) {
			document.body.style.background = "url('img/default.gif') no-repeat center center fixed";
			document.body.style.backgroundSize = "cover";
			return;
		}

		if (settings.keyword) {
			settings.URL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + settings.currentKeyword;
		} else {
			settings.URL = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";
		}

		if (settings.singleDisplay) {
			SingleGIF.init(settings.URL);
		} else {
			MultiGIF.init(settings.URL);
		}
	}
}());




