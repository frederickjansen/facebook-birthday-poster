// Save options to Chrome's storage
function saveOptions() {
	// Get all messages (with <a>)
	var messagesAnchor = $$(".birthdayMessage"),
	messages;

	// Loop through all anchors
	messagesAnchor.forEach(function(message) {
		// Add the content to an array
		messages[] = message.textContent;
	});

	// Save them
	chrome.storage.sync.set({"messages": messages}, function() {
		console.log("Settings saved");
	});
}

function loadOptions() {
	
}

function $$(selector, context) {
	context = context || document;
	return Array.prototype.slice.call(context.querySelectorAll(selector), 0);
}