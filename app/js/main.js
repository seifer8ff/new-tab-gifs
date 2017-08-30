(function() {
	var keyword = localStorage.getItem("keyword") || "cat";
	var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC&limit=20&sort=recent";
	var searchForm = document.querySelector("#form-search");
	var queryInput = searchForm.querySelector("input");
	var cursor = searchForm.querySelector(".cursor");
	var queryLengthMin = 6;
	var queryLengthMax = 18;



	init();

	
	


	function init() {
		// get gifs and add them to DOM once gifs finish loading
		XHR.makeRequest("GET", giphyURL)
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
					// set width and height to force positioning 
					stillImg.style.width = gif.images.fixed_width.width + "px";
					stillImg.style.height = gif.images.fixed_width.height + "px";
					stillImg.classList.add("gif");
					
					// create high quality img that loads after all low quality imgs are done
					var gifImg = new Image(gif.images.fixed_width.width, gif.images.fixed_width.height);
					gifImg.classList.add("gif", "hidden");
					gifImg.dataset.src = gif.images.fixed_width.url;
					
					// only move on once ALL low quality imgs done loading
					// must use bind because function is asynchronous
					stillImg.onload = function(parent) {
						// remove style to allow for mobile styles to take over
						this.removeAttribute("style");
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
			return Promise.all(elements.map(function (el) {
				var parent = el;
				var stillImg = el.childNodes[0];
				var gif = el.childNodes[1];

				// swap low qual img with high qual
				gif.onload = function(parent, stillImg) {
					this.classList.remove("hidden");
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

		addEventListeners();
	}

	function addEventListeners() {
		queryInput.placeholder = keyword;
		queryInput.size = keyword.length + 4;

		searchForm.addEventListener("submit", function(e) {
			var newQuery = validateQuery(queryInput.value, keyword);
			localStorage.setItem("keyword", newQuery);
		});

		// increase/decrease input size when typing
		queryInput.addEventListener("keydown", function(e) {
			if (queryInput.value.length + 4 < queryLengthMin) {
				queryInput.size = queryLengthMin;
				return;
			}
			if (queryInput.value.length + 4 > queryLengthMax) {
				queryInput.size = queryLengthMax;
				return;
			}
			queryInput.size = queryInput.value.length + 4;
		});

		// hide or display blinking cursor depending on input focus
		queryInput.addEventListener("focus", function(e) {
			cursor.style.display = "none";
			queryInput.placeholder = "";
		});
		queryInput.addEventListener("blur", function(e) {
			cursor.style.display = "initial";
			queryInput.value = null;
			queryInput.size = keyword.length + 4;
			queryInput.placeholder = keyword;
		});
	}

	function validateQuery(q, defaultQ) {
		if (!q) {
			return defaultQ;
		}
		if (q.length > queryLengthMax) {
			q = q.slice(0, queryLengthMax);
		}
		q = q.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
		q = q.trim();
		q = q.replace(/\s+/gim,"+");
		return q;
	}
}());




