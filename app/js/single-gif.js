var SingleGIF =  (function() {

	var settings = {
		url: ""
	} 
	
	function init(url) {
		settings.url = url;

		if (localStorage.getItem("GIFs")) {
			if (!Store.isExpired("GIFs")) {
				var gifs = Store.getLocal("GIFs");
				var randGIF = gifs[Math.floor(Math.random() * gifs.length)];
				return addGIFToBody(randGIF);
			} else {
				localStorage.removeItem("GIFs");
			}
		} 

		XHR.makeRequest("GET", settings.url)
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
			Store.setLocal("GIFs", gifs, 60 * 60 * 1000);
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
		if (gif.images.original.size > 1000000) {
			if (gif.images.downsized.url && gif.images.downsized.size < 1000000) {
				console.log('serving downsized');
				url = gif.images.downsized.url;
			} else if (gif.images.downsized_small.url && gif.images.downsized_small.size < 1000000) {
				console.log('serving downsized_small');
				url = gif.images.downsized_small.url;
			} else if (gif.images.fixed_width.url && gif.images.fixed_width.size < 1000000) {
				console.log('serving fixed_width');
				url = gif.images.fixed_width.url;
			} else if (gif.images.fixed_height.url && gif.images.fixed_height.size < 1000000) {
				console.log('serving fixed_height');
				url = gif.images.fixed_height.url;
			} else if (gif.images.fixed_height_small.url && gif.images.fixed_height_small.size < 1000000) {
				console.log('serving fixed_height_small');
				url = gif.images.fixed_height_small.url;
			} else if (gif.images.fixed_height_downsampled.url) {
				console.log('serving fixed_height_downsampled');
				url = gif.images.fixed_height_downsampled.url;
			}
		} else {
			console.log('serving original');
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




