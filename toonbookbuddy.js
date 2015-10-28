chrome.browserAction.setBadgeBackgroundColor({color: [0, 191, 255, 255]});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.method == "getAdblock")
		sendResponse(localStorage.getItem("adblock") == "true");
	else
		sendResponse(null);
});
