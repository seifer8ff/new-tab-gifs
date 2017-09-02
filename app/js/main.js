(function() {
	
	init();

	
	function init() {
		if (!navigator.onLine) {
			document.body.style.backgroundImage = "url('img/default.gif')";
			document.body.style.backgroundSize = "cover";
			return;
		}

		// get gifs and add them to DOM once gifs finish loading
		XHR.makeRequest("GET", buildURL())
		.catch(function(err) {
			// error response from api
			console.log("request error - status: " + err.status);
			console.log(err);
		})
		.then(function(response) {
			var gifs = JSON.parse(response);
			var gifArray = [];
		
			for (var gifKey in gifs.data) {
				if (!gifs.data.hasOwnProperty(gifKey)) {
					continue;
				}
				gifArray.push(gifs.data[gifKey]);
			}
			return gifArray;
		})
		.then(function(gifs) {
			return Promise.all(gifs.map(function (gif) {
				return new Promise(function(resolve, reject) {
					var parentDiv = document.getElementById("gif-container");
					var div = document.createElement("div");
					div.classList.add("gif-wrapper");
	
					var stillImg = new Image(gif.images.fixed_width.width, gif.images.fixed_width.height);
					stillImg.classList.add("still", "hidden");
					
					// create high quality img that loads after all low quality imgs are done
					var gifImg = new Image(gif.images.fixed_width.width, gif.images.fixed_width.height);
					gifImg.classList.add("gif", "hidden");
					gifImg.dataset.src = gif.images.fixed_width.url;
					
					// only move on once ALL low quality imgs done loading
					// must use bind because function is asynchronous
					stillImg.onload = function(parent) {
						resolve(parent);
					}.bind(stillImg, div);
	
					div.appendChild(stillImg);
					div.appendChild(gifImg);
					parentDiv.appendChild(div);

					// set src to trigger the onload function above (which resolved promise)
					stillImg.src = gif.images.fixed_width_still.url;
				})
			}));
		})
		.then(function(elements) {
			// once all low quality images have loaded, unhide them
			elements.forEach(function(el) {
				var parent = el;
				var stillImg = el.childNodes[0];

				stillImg.classList.remove("hidden");
				window.getComputedStyle(stillImg).opacity;
			});
			return elements;
		})
		.then(function(elements) {
			return Promise.all(elements.map(function (el) {
				var parent = el;
				var stillImg = el.childNodes[0];
				var gif = el.childNodes[1];

				// swap display of still img and gif
				gif.onload = function(parent, stillImg) {
					this.classList.remove("hidden");
					window.getComputedStyle(this).opacity;
					stillImg.classList.add("hidden");
				}.bind(gif, parent, stillImg);

				// img src must be set after onload event registered
				gif.src = gif.dataset.src;
			}));
		})
		.catch(function(err) {
			// error somewhere in the promise chain
			console.log(err);
		})
	}

	function buildURL() {
		var limit;
		// using screen.width because the browser can be resized to max
		if (screen.width < 500 ) {
			limit = 10;
		} else if (screen.width < 1000) {
			limit = 20;
		} else {
			limit = 30;
		}

		return "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=" + limit + "&sort=recent";
	}
}());




