var MultiGIF = (function() {
	
	var settings = {
		gifContainer: document.getElementById("gif-container"),
		gifFragment: document.createDocumentFragment(),
		limit: getGIFLimit(screen.width),
		URL: "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=30&rating=g&sort=recent"
	} 
	settings.URL = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=" + settings.limit + "&rating=g&sort=recent";
	
	function init() {
		// get GIFs, add to GIF stills to DOM, and swap still imgs with gifs
		getTrendingGIFs()
		.then(function(gifs) {
			return Promise.all(gifs.map(addGIFToFragment));
		})
		.then(function(elements) {
			settings.gifContainer.appendChild(settings.gifFragment);
			return elements;
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

	function getTrendingGIFs() {
		return new Promise(function(resolve, reject) {
			// if gifs are in local storage + not expired, resolve
			if (localStorage.getItem("gifObj")) {
				gifObj = JSON.parse(localStorage.getItem("gifObj"));
				if (!isExpired(gifObj.expires)) {
					return resolve(gifObj.gifs);
				}
			} 

			// only make an api request if gifs in localStorage are expired
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
				console.log(response);
				var gifArray = [];
			
				for (var gifKey in response.data) {
					if (!response.data.hasOwnProperty(gifKey)) {
						continue;
					}
					gifArray.push(response.data[gifKey]);
				}
				return gifArray;
			})
			.then(function(gifArray) {
				var gifObj = {
					gifs: gifArray,
					expires: new Date().getTime() + 60 * 20 * 1000
				}
				localStorage.setItem("gifObj", JSON.stringify(gifObj));
				return resolve(gifObj.gifs);
			})
		});
	}

	function addGIFToFragment(gif) {
		return new Promise(function(resolve, reject) {
			var div = document.createElement("div");
			div.classList.add("gif-wrapper");

			var stillImg = new Image(gif.images.fixed_width_downsampled.width, gif.images.fixed_width_downsampled.height);
			stillImg.classList.add("still", "hidden");
			
			// create high quality img that loads after all low quality imgs are done
			var gifImg = new Image(gif.images.fixed_width_downsampled.width, gif.images.fixed_width_downsampled.height);
			gifImg.classList.add("gif", "hidden");
			gifImg.dataset.src = gif.images.fixed_width_downsampled.url;
			
			// only move on once ALL low quality imgs done loading
			// must use bind because function is asynchronous
			stillImg.onload = function(parent) {
				resolve(parent);
			}.bind(stillImg, div);

			// set src to trigger the onload function above (which resolved promise)
			stillImg.src = gif.images.fixed_width_small_still.url;

			settings.gifFragment.appendChild(div);
			div.appendChild(stillImg);
			div.appendChild(gifImg);
		})
	}

	function getGIFLimit(width) {
		if (width < 500 ) {
			return 10;
		} else if (width < 1000) {
			return 20;
		} else {
			return 30;
		}
	}

	function isExpired(date) {
		var now = new Date().getTime();
		if (now >= date) {
			return true;
		} else {
			return false;
		}
	}

	return {
		init: init
	}

}());




