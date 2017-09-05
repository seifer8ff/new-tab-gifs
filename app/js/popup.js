(function() {

	var settings = {
		singleGIFView: localStorage.getItem("single"),
		keyword: Store.validate(localStorage.getItem("keyword") || 'cat'),
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
		settings.displayForm.single.addEventListener("click", e => {
			localStorage.setItem("single", "true");
			localStorage.setItem("keyword", Store.validate(settings.keyword));
			settings.displayForm.keyword.disabled = false;
			settings.displayForm.keyword.value = settings.keyword;
		});
		// if changing to multi display, remove single input from local storage and disable keyword input
		settings.displayForm.multi.addEventListener("click", e => {
			localStorage.removeItem("single");
			settings.displayForm.keyword.disabled = true;
		});
		// save the entered keyword upon submit of form
		settings.displayForm.form.addEventListener("submit", e => {
			e.preventDefault();
			if (!settings.displayForm.keyword.disabled && 
				settings.displayForm.keyword.value !== localStorage.getItem("keyword") &&
				settings.displayForm.keyword.value.length > 0) {
					localStorage.setItem("keyword", Store.validate(settings.displayForm.keyword.value));
					localStorage.removeItem("randGIFs");
					window.close();
			}
		});
		// save the entered keyword upon popup close
		window.addEventListener("unload", e => {
			if (!settings.displayForm.keyword.disabled && 
				settings.displayForm.keyword.value !== localStorage.getItem("keyword") &&
				settings.displayForm.keyword.value.length > 0) {
				localStorage.setItem("keyword", Store.validate(settings.displayForm.keyword.value));
				localStorage.removeItem("randGIFs");
			}
		})
	}
}());




