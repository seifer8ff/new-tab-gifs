(function() {

	var settings = {
		keyword: Store.validate(localStorage.getItem("currentKeyword") || 'cat'),
		displayForm: {
			form: document.querySelector("form"),
			single: document.querySelector("#single"),
			multi: document.querySelector("#multi"),
			trending: document.querySelector("#trending"),
			keyword: document.querySelector("#keyword"),
			inputKeyword: document.querySelector("#input-keyword")
		}
	}
	
	init();

	
	function init() {
		// setup state if single display is active
		if (localStorage.getItem("single")) {
			settings.displayForm.single.checked = true;
			settings.displayForm.multi.checked = false;
		}
		if (localStorage.getItem("keyword")) {
			settings.displayForm.keyword.checked = true;
			settings.displayForm.trending.checked = false;
			switchToKeyword();
		}
		
		// the inputKeyword should always reflect what the user previously entered
		settings.displayForm.inputKeyword.value = settings.keyword;
		setEventListeners();
	}

	function setEventListeners() {
		// if changing to single display, add that to local storage
		settings.displayForm.single.addEventListener("click", e => {
			localStorage.setItem("single", "true");
			localStorage.removeItem("GIFs");
		});
		// if changing to multi display, remove single input from local storage
		settings.displayForm.multi.addEventListener("click", e => {
			localStorage.removeItem("single");
			localStorage.removeItem("GIFs");
		});
		// if changing to trending, hide keyword input box
		settings.displayForm.trending.addEventListener("click", e => {
			switchToTrending();
			localStorage.removeItem("GIFs");
			localStorage.removeItem("keyword");
		});
		// if changing to keyword, show keyword input box and set default keyword
		settings.displayForm.keyword.addEventListener("click", e => {
			switchToKeyword();
			localStorage.removeItem("GIFs");
			localStorage.setItem("keyword", "true");
			localStorage.setItem("currentKeyword", Store.validate(settings.keyword));
		});
		// save the entered keyword upon submit of form
		settings.displayForm.form.addEventListener("submit", e => {
			e.preventDefault();
			if (localStorage.getItem("keyword") && 
				settings.displayForm.inputKeyword.value !== localStorage.getItem("currentKeyword") &&
				settings.displayForm.inputKeyword.value.length > 0) {
					localStorage.setItem("currentKeyword", Store.validate(settings.displayForm.inputKeyword.value));
					localStorage.removeItem("GIFs");
					window.close();
			}
		});
		// save the entered keyword upon popup close
		window.addEventListener("unload", e => {
			if (localStorage.getItem("keyword") && 
				settings.displayForm.inputKeyword.value !== localStorage.getItem("currentKeyword") &&
				settings.displayForm.inputKeyword.value.length > 0) {
				localStorage.setItem("currentKeyword", Store.validate(settings.displayForm.inputKeyword.value));
				localStorage.removeItem("GIFs");
			}
		})
	}

	function switchToKeyword() {
		settings.displayForm.inputKeyword.disabled = false;
		settings.displayForm.inputKeyword.value = settings.keyword;
		settings.displayForm.inputKeyword.classList.remove("hidden");
		settings.displayForm.keyword.parentElement.classList.add("input-text");
	}

	function switchToTrending() {
		settings.displayForm.inputKeyword.disabled = true;
		settings.displayForm.inputKeyword.classList.add("hidden");
		settings.displayForm.keyword.parentElement.classList.remove("input-text");
	}
}());




