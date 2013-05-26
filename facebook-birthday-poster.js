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

function getRandomMessage(form) {
	// Only run if messages haven't been retrieved earlier
	if (typeof messages === "undefined") {
		// Get the array of messages from storage
		chrome.storage.sync.get("messages", function(items) {
			messages = items.messages;
			// Submit the form with a random message
			submitForm(form, messages[Math.floor(Math.random() * messages.length)]);
		});
	} else {
		submitForm(form, messages[Math.floor(Math.random() * messages.length)]);
	}
}

function submitform(form, message) {
	// Change the value of the textarea inside the form
	form.value = message;
	form.submit();
}

function getBirthdayForms() {
	// Get all forms of birthdays
	var elements = $$(".fbRemindersBirthdayListItem form", $(".fbBirthdayRemindersContent"));
	return elements;
}

/*function shouldRun() {
	// Get current seconds since 1970
	var curDate = new Date().getTime() / 1000;
	// Last time run, in seconds since 1970
	var lastRun = chrome.storage.sync.get("lastRun");

	// Run if more than one day has passed
	if ((curDate - lastRun) / 3600 > 24) {
		return true;
	} else if () {

	} else {
		return false;
	}
}*/

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