chrome.browserAction.setBadgeBackgroundColor({color: [0, 191, 255, 255]});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.method == "getAdblock"){
		sendResponse(localStorage.getItem("adblock") == "true");
	}else if(request.method == "newUpdate"){
		if(localStorage.getItem("version") != chrome.runtime.getManifest().version){
			localStorage.setItem("version", chrome.runtime.getManifest().version);
			sendResponse(true);
		}else
			sendResponse(false);
	}else if(request.method == "getPostBlock"){
		sendResponse(localStorage.getItem("blockRegex"));
	}else
		sendResponse(null);
});
