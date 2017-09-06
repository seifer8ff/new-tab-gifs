var SingleGIF =  (function() {

	var settings = {
		keyword: Store.validate(localStorage.getItem("keyword") || "cat"),
		storedGIFs: localStorage.getItem("randGIFs"),
		URL: "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=cat&limit=50&offset=0&rating=G&lang=en"
	} 
	settings.URL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + settings.keyword + "&limit=50&offset=0&rating=G&lang=en";
	
	function init() {
		if (localStorage.getItem("randGIFs")) {
			if (!Store.isExpired("randGIFs")) {
				var gifs = Store.getLocal("randGIFs");
				var randGIF = gifs[Math.floor(Math.random() * gifs.length)];
				return addGIFToBody(randGIF);
			} else {
				localStorage.removeItem("randGIFs");
			}
		} 

		XHR.makeRequest("GET", settings.URL)
		.catch(err => {
			// error response from api
			console.log("request error - status: " + err.status);
			console.log(err);
		})
		.then(response => {
			return JSON.parse(response);
		})
		.catch(err => {
			console.log("error parsing response");
		})
		.then(response => {
			console.log(response);
			return Array.from(response.data);
		})
		.then(gifs => {
			Store.setLocal("randGIFs", gifs, 60 * 60 * 1000);
			return gifs[Math.floor(Math.random() * gifs.length)];
		})
		.then(gif => {
			return addGIFToBody(gif);
		})
	}

	function addGIFToBody(gif) {
		var url;
		var copyGIF = new Image();
		console.log(gif);
		console.log("gif size= " + gif.images.original.size);
		// downsample large gifs to speed up load time
		if (gif.images.original.size > 1000000 && gif.images.downsized_small.url) {
			url = gif.images.downsized_small.url;
		} else if (gif.images.original.size > 1000000 && gif.images.fixed_height_downsampled.url) {
			url = gif.images.fixed_height_downsampled.url;
		} else {
			url = gif.images.original.url;
		}
		// add GIF as background image for proper resizing/zooming
		document.body.style.background = "url(" + url + ") no-repeat center center fixed";
		document.body.style.backgroundSize = "cover";

		// add hidden gif as overlay to allow copying
		copyGIF.src = url;
		copyGIF.classList.add("copy", "hidden");
		document.body.insertBefore(copyGIF, document.body.firstChild);
	}
	

	return {
		init: init
	}
}());




