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
		.then(function(response) {
			// load gifs
			var gifs = JSON.parse(response);
			var parentDiv = document.getElementById("gif-container");
			var elements = [];
		
			for (var gifKey in gifs.data) {
				if (!gifs.data.hasOwnProperty(gifKey)) {
					continue;
				}
				var gif = gifs.data[gifKey];
				// console.log(gif);
				
				// create gif wrapper div and add low quality gif as bg image
				var div = document.createElement("div");
				div.classList.add("gif-wrapper");
				div.style.width = gif.images.fixed_width.width + "px";
				div.style.height = gif.images.fixed_width.height + "px";
				div.style.backgroundImage = "url(" + gif.images.fixed_width_still.url + ")";

				// add hidden img and data attribute with url
				var img = new Image(gif.images.fixed_width.width, gif.images.fixed_width.height);
				img.classList.add("gif", "hidden");
				img.dataset.src = gif.images.fixed_width.url;

				//append to DOM and return element array 
				div.appendChild(img);
				parentDiv.appendChild(div);
				elements.push(div);
			}
			return elements;
		})
		.catch(function(err) {
			// error response from api
			console.log("request error - status: " + err.status);
			console.log(err);
		})
		.then(function(elements) {
			// for each element, load the full gif
			for (var i = 0; i < elements.length; i++) {
				var parent = elements[i];
				var gif = elements[i].childNodes[0];

				// must use bind because it doesn't invoke function immediately
				// unhide img + remove bg image of wrapper div. Remove height and width styling for mobile
				gif.onload = function(parent) {
					this.classList.remove("hidden");
					parent.style.backgroundImage = "none";
					parent.removeAttribute("style");
				}.bind(gif, parent);

				// img src must be set after onload event registered
				gif.src = gif.dataset.src;
			}
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




