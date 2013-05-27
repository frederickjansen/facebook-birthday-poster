var messages,
birthdays;

// Two second delay because the birthday box is only generated after Facebook has fully loaded
setTimeout(function() {
	birthdays = getBirthdayForms();

	// Check if any forms have been found
	if (typeof birthdays !== "undefined" && birthdays.length > 0) {
		// Loop over them
		birthdays.forEach(function(form) {
			// Chrome storage is asynchronous, so we have to use a callback instead of return
			getRandomMessage($("textarea", form));
		});
	}
}, 2000);

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
function submitform(textarea, message) {
	// Change the value of the textarea inside the form
	textarea.value = message;
	// Trigger a return keyboard event on the textarea inside the form
	triggerKeyboardEvent(textarea, 13);
}

function getBirthdayForms() {
	// Get all forms of birthdays
	var elements = $$(".fbRemindersBirthdayListItem form", $(".fbBirthdayRemindersContent"));
	return elements;
}

// Calling submit() on a form breaks ajax, so we simulate a return keypress and let the website handle the rest
function triggerKeyboardEvent(element, keyCode) {
	var eventObj = new CustomEvent("keydown", {
		"keyCode": keyCode,
		"which": keyCode
	});

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