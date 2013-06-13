var messages,
birthdays;

// Five second delay because the birthday box is only generated after Facebook has fully loaded
// Two seconds is usually enough, but apparently not always
setTimeout(function() {
	birthdays = getBirthdayForms();
	// Check if any forms have been found
	if (typeof birthdays !== "undefined" && birthdays.length > 0) {
		// Loop over them
		birthdays.forEach(function(form) {
			// Chrome storage is asynchronous, so we have to use a callback instead of return
			getRandomMessage($("textarea", form), form);
		});
		// Hide the birthdays after we're done
		// TODO: Replace the textarea with a message saying you've responded to the birthday
		//$("#birthday_reminders_link").classList.add("hidden_elem");
	}
}, 5000);

function getRandomMessage(textarea, form) {
	// Only run if messages haven't been retrieved earlier
	if (typeof messages === "undefined") {
		// Get the array of messages from storage
		chrome.storage.sync.get("messages", function(items) {
			messages = items.messages;
			// Submit the form with a random message
			submitForm(textarea, form, messages[Math.floor(Math.random() * messages.length)]);
		});
	} else {
		submitForm(textarea, form, messages[Math.floor(Math.random() * messages.length)]);
	}
}

// We use an async xhr request to submit the form
function submitForm(textarea, form, message) {
	// Change the value of the textarea inside the form
	textarea.value = message;

	var segments = []

	for (var i = 0, length = form.elements.length; i < length; i++) {
		var field = form.elements[i];
		// Skip fields without a name
		if (!field.hasAttribute["name"]) {
			continue;
		}
		segments.push(field.name + "=" + field.value);
	}

	// The xhr request
	var oReq = new XMLHttpRequest();
	oReq.onload = submitFormSuccess;
	oReq.open("POST", form.action, true);
	oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	oReq.send(segments.join("&"));
	//oReq.open("POST", form.action, true);
	//oReq.send(new FormData(form));

}

function submitFormSuccess(e) {
	alert(e.responseText);
}

function getBirthdayForms() {
	// Get all forms of birthdays
	var elements = $$(".fbRemindersBirthdayListItem form", $(".fbBirthdayRemindersContent"));
	return elements;
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