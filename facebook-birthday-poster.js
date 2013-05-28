var messages,
birthdays,
container;

// Five second delay because the birthday box is only generated after Facebook has fully loaded
setTimeout(function() {
	birthdays = getBirthdayForms();

	// Check if any forms have been found
	if (typeof birthdays !== "undefined" && birthdays.length > 0) {
		container = getContainer();
		triggerContainer();
		// Loop over them
		birthdays.forEach(function(form) {
			// Chrome storage is asynchronous, so we have to use a callback instead of return
			getRandomMessage($("textarea", form));
		});
	}
}, 5000);

function getRandomMessage(textarea) {
	// Only run if messages haven't been retrieved earlier
	if (typeof messages === "undefined") {
		// Get the array of messages from storage
		chrome.storage.sync.get("messages", function(items) {
			messages = items.messages;
			// Submit the form with a random message
			submitForm(textarea, messages[Math.floor(Math.random() * messages.length)]);
		});
	} else {
		submitForm(textarea, messages[Math.floor(Math.random() * messages.length)]);
	}
}

// We don't submit the form itself, since that breaks ajax
// Instead we simulate a return on the textarea and let Facebook handle the rest
function submitForm(textarea, message) {
	// Change the value of the textarea inside the form
	textarea.value = message;
	// Inject the code that submits the message into the DOM
	injectJS();
}

// Because Chrome extensions run inside of a sandbox, triggering the return from inside the content script doesn't work
// Instead we inject the code directly into the DOM and run it from there
function injectJS() {
	var body = document.getElementsByTagName('body')[0],
    script = document.createElement('script');

    script.textContent = '(' + toInject + ')()';
    body.appendChild(script);
}

function toInject() {
	var el = document.querySelector(".fbRemindersBirthdayListItem textarea");
	// Trigger a return keyboard event on the textarea inside the form
	triggerKeyboardEvent(el, 13);

	// Calling submit() on a form breaks ajax, so we simulate a return keypress and let the website handle the rest
	function triggerKeyboardEvent(element, keyCode) {
		var eventObj = document.createEvent("KeyboardEvent");
		eventObj.initEvent("keydown", true, true);
		eventObj.keyCode = keyCode;
		eventObj.which = keyCode;

		element.dispatchEvent(eventObj); 
	}
}

function getBirthdayForms() {
	// Get all forms of birthdays
	var elements = $$(".fbRemindersBirthdayListItem form", $(".fbBirthdayRemindersContent"));
	return elements;
}

// We need the container to be able to apply the class hidden_elem to it
function getContainer() {
	// This turns u_ps_0_2_6 into u_ps_0_2_0, the id of the parent container
	var el = birthdays[0].id;
	el = el.slice(0, -1);
	el += "0";
	el = $("#"+el);
	return el;
}

// The form is only fully instantianed after clicking on the birthday reminders link
// We simulate this click and then instantly hide the container again
function triggerContainer() {
	var link = $("#birthday_reminders_link");
	triggerMouseEvent(link);
	container.classList.add("hidden_elem");
}

// Trigger a mouse click event
function triggerMouseEvent(element) {
	var eventObj = document.createEvent("MouseEvent");
	eventObj.initEvent("click", true, true);

	element.dispatchEvent(eventObj);
}

// Select first occurence
function $(selector, context) {
	context = context || document;
	return context.querySelector(selector);
}

// Select all occurences and return as an array
function $$(selector, context) {
	context = context || document;
	// Turn NodeList into array by slicing all items
	// See http://stackoverflow.com/questions/7056925/how-does-array-prototype-slice-call-work
	return Array.prototype.slice.call(context.querySelectorAll(selector), 0);
}