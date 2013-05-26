// Save default messages to Chrome's storage
chrome.runtime.onInstalled.addListener(function(details)
{
	// Can be install, update and chrome_update
	switch(details.reason)
	{
		case "install":
			saveInitialMessages();
			break;
		default:
			break;
	}
});

function saveInitialMessages() {
	chrome.storage.sync.set({
		"messages": [
			"Happy birthday! xx",
			"Happy bday, hope you have a good one! x"
		]
	}, function() {
		console.log("Settings saved init");
	});
}