var MultiGIF = (function() {
	
	var settings = {
		gifContainer: document.getElementById("gif-container"),
		gifFragment: document.createDocumentFragment(),
		limit: getGIFLimit(screen.width),
		url: ""
	} 
	
	function init(url) {
		settings.url = url;

		// get GIFs, add to GIF stills to DOM, and swap still imgs with gifs
		getTrendingGIFs()
		.then(gifs => {
			return shuffle(gifs).slice(0, settings.limit);
		})
		.then(gifs => {
			return Promise.all(gifs.map(addGIFToFragment));
		})
		.then(elements => {
			settings.gifContainer.appendChild(settings.gifFragment);
			return elements;
		})
		.then(elements => {
			// once all low quality images have loaded, unhide them
			elements.forEach(function(el) {
				var parent = el;
				var stillImg = el.childNodes[0];

				stillImg.classList.remove("hidden");
				window.getComputedStyle(stillImg).opacity;
			});
			return elements;
		})
		.then(elements => {
			return Promise.all(elements.map(el => {
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
		.catch(err => {
			// error somewhere in the promise chain
			console.log(err);
		})
	}

	function getTrendingGIFs() {
		return new Promise(function(resolve, reject) {
			// if gifs are in local storage + not expired, resolve
			if (localStorage.getItem("GIFs")) {
				if (!Store.isExpired("GIFs")) {
					return resolve(Store.getLocal("GIFs"));
				} else {
					localStorage.removeItem("GIFs");
				}
			} 

			// only make an api request if gifs in localStorage are expired
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
				return Array.from(response.data);
			})
			.then(gifs => {
				Store.setLocal("GIFs", gifs, 60 * 20 * 1000);
				return resolve(gifs);
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

	function shuffle(array) {
		for (var i = array.length - 1; i > 0; i -= 1) {
		  var j = Math.floor(Math.random() * (i + 1))
		  var temp = array[i]
		  array[i] = array[j]
		  array[j] = temp
		}
		return array;
	  }

	return {
		init: init
	}

}());




