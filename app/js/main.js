(function() {

	var settings = {
		singleDisplay: localStorage.getItem("single"),
		keyword: localStorage.getItem("keyword"),
		currentKeyword: localStorage.getItem("currentKeyword")
	} 
	

	reset();
	init();

	
	function init() {
		var url;

		if (!navigator.onLine) {
			document.body.style.background = "url('img/default.gif') no-repeat center center fixed";
			document.body.style.backgroundSize = "cover";
			return;
		}

		if (settings.keyword) {
			url = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + settings.currentKeyword + "&limit=100&rating=G&lang=en";
		} else {
			url = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=100&rating=G&lang=en";
		}

		if (settings.singleDisplay) {
			SingleGIF.init(url);
		} else {
			MultiGIF.init(url);
		}
	}

	function reset() {
		if (localStorage.getItem("randGIFs") || localStorage.getItem("trendingGIFs")) {
			localStorage.clear();
		}
	}
}());




