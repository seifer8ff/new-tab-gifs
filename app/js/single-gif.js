var SingleGIF =  (function() {

	var settings = {
		keyword: localStorage.getItem("keyword") || "cat",
		URL: "https://api.giphy.com/v1/gifs/random?q=cat&api_key=dc6zaTOxFJmzC&rating=g"
	} 
	settings.URL = "https://api.giphy.com/v1/gifs/random?tag=" + settings.keyword + "&api_key=dc6zaTOxFJmzC&rating=g";
	
	function init() {
		XHR.makeRequest("GET", settings.URL)
		.catch(function(err) {
			// error response from api
			console.log("request error - status: " + err.status);
			console.log(err);
		})
		.then(function(response) {
			return JSON.parse(response);
		})
		.catch(function(err) {
			console.log("error parsing response");
		})
		.then(function(response) {
			var size = response.data.image_width * response.data.image_height * response.data.image_frames;
			console.log(response.data);
			console.log("gif frames= " + response.data.image_frames);
			console.log("gif total size= " + size);
			// downsample large gifs to speed up load time
			if (size > 10000000) {
				document.body.style.background = "url(" + response.data.fixed_width_downsampled_url + ") no-repeat center center fixed";
			} else {
				document.body.style.background = "url(" + response.data.image_original_url + ") no-repeat center center fixed";
			}
			document.body.style.backgroundSize = "cover";
		})
	}

	return {
		init: init
	}
}());




