(function() {

	var settings = {
		singleGIFView: localStorage.getItem("single"),
		keyword: localStorage.getItem("keyword") || 'cat',
		displayForm: {
			form: document.querySelector("form"),
			single: document.querySelector("#single"),
			multi: document.querySelector("#multi"),
			keyword: document.querySelector("#keyword")
		}
	}
	
	init();

	
	function init() {
		// setup state if single display is active
		if (settings.singleGIFView) {
			settings.displayForm.single.checked = true;
			settings.displayForm.multi.checked = false;
			settings.displayForm.keyword.disabled = false;
		}
		// the keyword should always reflect what the user previously entered
		settings.displayForm.keyword.value = settings.keyword;
		setEventListeners();
	}

	function setEventListeners() {
		// if changing to single display, add that to local storage and set state of multi and keyword input
		settings.displayForm.single.addEventListener("click", function(e) {
			localStorage.setItem("single", "true");
			localStorage.setItem("keyword", settings.keyword);
			settings.displayForm.keyword.disabled = false;
			settings.displayForm.keyword.value = settings.keyword;
		});
		// if changing to multi display, remove single input from local storage and disable keyword input
		settings.displayForm.multi.addEventListener("click", function(e) {
			localStorage.removeItem("single");
			settings.displayForm.keyword.disabled = true;
		});
		// save the entered keyword upon popup close
		window.addEventListener("unload", function(e) {
			if (!settings.displayForm.keyword.disabled && settings.displayForm.keyword.value.length > 0) {
				localStorage.setItem("keyword", settings.displayForm.keyword.value);
			}
		})
	}
}());




