var options = null;
var label = document.querySelector(".Card__TextInput .label");
var textbox = document.querySelector('[aria-label="Email Address"]');
var footer = document.querySelector("#login-parent > div > footer");
var button = document.getElementsByTagName('button')[0];



chrome.storage.sync.get().then((items) => {
	options = items;
	updateUi();
	setDomainEvents();
	console.log(options);
});

function updateUi(){

	if(options.changeLabel) {
		labelText = options.userLabel;

		label.innerText = labelText;
		textbox.setAttribute('aria-label', labelText)
	}

}

function addDomain() {

	domain = options.domain;

	if(!textbox.value.includes('@' + domain)){

		textbox.value += '@' + domain;
	}
}

function setDomainEvents() {

	if(options.appendDomain) {

		button.addEventListener('mousedown', (event) => {
			console.log("mouse down");
			addDomain();
		});

		textbox.addEventListener("keydown", function(event) {

		  if (event.key === 'Enter') {
		  	console.log(event);
		  	event.preventDefault();
		  	addDomain();
		  	button.focus();
		  	button.click();
		  }
		});
	}
}

