loadSettings();

document.addEventListener("click", clickHandler, false);

function clickHandler(e) {
	e.preventDefault();

	if (e.target.webkitMatchesSelector(".delete")) {
		deleteMessage(e.target);
	} else if (e.target.webkitMatchesSelector(".birthdayMessage")) {

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
		console.log("Settings saved");
	});
}

function deleteMessage(message) {
	message.parentElement.parentElement.removeChild(message.parentElement);
	saveSettings();
}

function addMessage() {

}

// Populate list of messages
function loadSettings() {
	var msgElement = $("#messages");

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