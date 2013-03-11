function goToFrontpage() {
	chrome.tabs.create({url: chrome.extension.getURL('frontpage.html')});
}

chrome.browserAction.onClicked.addListener(goToFrontpage);