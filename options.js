var msgElement = $("#messages"),
isSaving = false;

loadSettings();

// Capture all click events inside of .content so we can mimick jQuery's live()
$(".content").addEventListener("click", clickHandler, false);
// Focusout event instead of blur, because it bubbles
$(".content").addEventListener("focusout", blurHandler, false);
// Capture return as an alternative way of saving
$(".content").addEventListener("keydown", keydownHandler, false);

function clickHandler(e) {
	e.preventDefault();

	// Delete message if delete icon clicked
	if (e.target.webkitMatchesSelector(".delete")) {
		deleteMessage(e.target.parentElement);
	// Replace message with input field if clicked directly
	} else if (e.target.webkitMatchesSelector(".birthdayMessage")) {
		editMessage(e.target);
	// Add new input field if the new message button is clicked
	} else if (e.target.webkitMatchesSelector("#addMessage")) {
		addMessage();
	}
}

// Handle the input field's blur event
function blurHandler(e) {
	// If it's the input field
	if (e.target.webkitMatchesSelector("#inputMessage")) {
		// Don't try to save if keyboard has triggered already
		if (!isSaving) {
			// Delete the message if empty
			if (e.target.value === "") {
				deleteMessage(e.target.parentElement)
			// Save it otherwise
			} else {
				saveMessage(e.target);
			}
		}
	}
}

// Handle the input field's keydown event
function keydownHandler(e) {
	// Return key
	if (e.keyCode === 13) {
		if (e.target.webkitMatchesSelector("#inputMessage")) {
			// We don't want focusout to try and delete this item again
			isSaving = true;
			// Delete the message if empty
			if (e.target.value === "") {
				deleteMessage(e.target.parentElement)
			// Save it otherwise
			} else {
				saveMessage(e.target);
			}
			isSaving = false;
		}
	}
}

// Save settings to Chrome's storage
function saveSettings() {
	// Get all messages (with <a>)
	var messagesAnchor = $$(".birthdayMessage"),
	messages = [];

	// Loop through all anchors
	messagesAnchor.forEach(function(message) {
		// Add the content to an array
		messages.push(message.textContent);
	});

	// Save them
	chrome.storage.sync.set({"messages": messages}, function() {
		//console.log("Settings saved");
	});
}

// Delete a message
function deleteMessage(message, save) {
	// Start with li -> ul -> remove child li
	message.parentElement.removeChild(message);
	saveSettings();
}

// Add an input field to the list of messages
function addMessage() {
	var html = "<li>"
	html += "<input type=\"text\" autofocus=\"autofocus\" id=\"inputMessage\" placeholder=\"Your message\">"
	html += "<a href=\"#\" class=\"delete\">delete</a>";
	html += "</li>"
	msgElement.insertAdjacentHTML("beforeend", html);
}

// Turn anchor into input field
function editMessage(el) {
	var html = "<input type=\"text\" autofocus=\"autofocus\" id=\"inputMessage\" placeholder=\"Your message\" value=\"" + el.textContent + "\">"
	// Add input field before anchor
	el.insertAdjacentHTML("beforebegin", html);
	// Remove anchor
	el.parentElement.removeChild(el);
}

// Turn input field into anchor and save all messages
function saveMessage(input) {
	var html = "<a href=\"#\" class=\"birthdayMessage\">" + input.value + "</a>"
	// Add anchor before input field
	input.insertAdjacentHTML("beforebegin", html);
	// Remove input field
	input.parentElement.removeChild(input);
	
	saveSettings();
}

// Populate list of messages
function loadSettings() {
	// Get messages from storage
	chrome.storage.sync.get("messages", function(items) {
		items.messages.forEach(function(message) {
			// Template for message
			var html = "<li>";
			html += "<a href=\"#\" class=\"birthdayMessage\">" + message + "</a>";
			html += "<a href=\"#\" class=\"delete\">delete</a>";
			html += "</li>"
			// Add it to the list
			msgElement.insertAdjacentHTML("beforeend", html);
		});
	});
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