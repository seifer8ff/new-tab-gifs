(function() {
	var keyword = localStorage.getItem("keyword") || "cat";
	var giphyURL = "http://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC&limit=20&sort=recent";
	var searchForm = document.querySelector("#form-search");
	var queryInput = searchForm.querySelector("input");
	var queryLengthMin = 6;
	var queryLengthMax = 20;



	init();

	
	


	function init() {
		queryInput.placeholder = keyword;
		queryInput.size = keyword.length + 4;

		searchForm.addEventListener("submit", function(e) {
			localStorage.setItem("keyword", queryInput.value);
			//e.preventDefault();
		});
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
		})
	}
	
	
	
	
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
			console.log(gif);
			
			var img = new Image();
	
			img.onload = function() {
			  parentDiv.appendChild(this);
			}.bind(img)
	
			img.src = gif.images.fixed_width.url;
		}
	})
	.catch(function(err) {
		// error response from api (either incorrect battletag or too many requests)
		console.log("request error - status: " + err.status);
		console.log(err);
	});
}())




