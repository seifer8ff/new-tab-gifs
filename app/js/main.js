


makeRequest("GET", "http://api.giphy.com/v1/gifs/search?q=kitty&api_key=dc6zaTOxFJmzC&limit=5&sort=recent")
.then(function(response) {
	// load gifs
	var gifs = JSON.parse(response);

	for (var gifKey in gifs.data) {
	    if (!gifs.data.hasOwnProperty(gifKey)) {
	        continue;
	    }
	    var gif = gifs.data[gifKey];
	    console.log(gif);

	    //Do your logic with the property here
	    var img = new Image();
		var parentDiv = document.getElementById("parent-div");

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

function makeRequest (method, url) {
	console.log("Making a " + method + " request to " + url);
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status == 200) {
					resolve(xhr.response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			}
		}
		xhr.onerror = function() {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		}
		xhr.send();
	});
}




