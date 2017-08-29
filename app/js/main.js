(function() {
	var keyword = localStorage.getItem("keyword") || "cat";
	var giphyURL = "http://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC&limit=20&sort=recent";
	var searchForm = document.querySelector("#form-search");
	var queryInput = searchForm.querySelector("input");
	var cursor = searchForm.querySelector(".cursor");
	var queryLengthMin = 6;
	var queryLengthMax = 18;



	init();

	
	


	function init() {
		queryInput.placeholder = keyword;
		queryInput.size = keyword.length + 4;

		searchForm.addEventListener("submit", function(e) {
			localStorage.setItem("keyword", queryInput.value);
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
		});
		queryInput.addEventListener("blur", function(e) {
			cursor.style.display = "initial";
			queryInput.value = null;
			queryInput.size = keyword.length + 4;
		});
	}
	
	
	
	// get gifs and add them to DOM once gifs finish loading
	XHR.makeRequest("GET", giphyURL)
	.then(function(response) {
		// load gifs
		var gifs = JSON.parse(response);
		var parentDiv = document.getElementById("gif-container");
	
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

			// add hidden img and add everything to DOM
			var img = new Image(gif.images.fixed_width.width, gif.images.fixed_width.height);
			img.classList.add("gif", "hidden");

			div.appendChild(img);
			parentDiv.appendChild(div);
			
			// must use bind because it doesn't invoke function immediately
			// unhide img + remove bg image of wrapper div. Remove height and width styling for mobile
			img.onload = function(parent) {
				this.classList.remove("hidden");
				parent.style.backgroundImage = "none";
				parent.removeAttribute("style");
			}.bind(img, div);

			// img src must be set after onload event registered
			img.src = gif.images.fixed_width.url;
		}
	})
	.catch(function(err) {
		// error response from api (either incorrect battletag or too many requests)
		console.log("request error - status: " + err.status);
		console.log(err);
	});
}())




