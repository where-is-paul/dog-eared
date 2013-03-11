//first time setup
if (!localStorage['setup']) {
  localStorage['setup'] = true;
  firstTimeSetup();
}

//open new page when icon is clicked
chrome.browserAction.onClicked.addListener(goToFrontpage);

//precompute all bookmarks
var arr = new Array();
allBookmarks(saveToArray);
	
//send bookmarks when extension requests it
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		arr.sort(bmSorter);
		sendResponse({bookmarks: arr});
	});
	

$(document).ready(function () {
	arr.sort(bmSorter);
});

//functions that do all the work
function goToFrontpage() {
	chrome.tabs.create({url: chrome.extension.getURL('frontpage.html')});
}


function firstTimeSetup() {
	var save = function(bookmark) {
		localStorage[hashCode(bookmark.url)] = bookmark.dateAdded;
		localStorage[hashCode(bookmark.url + "useCount")] = 0;
	};
	allBookmarks(save);
}

function bmSorter(bm1, bm2) {
	h1 = hashCode(bm1.url);
	h2 = hashCode(bm2.url);
	//console.log("sorting... " + bm1.url + " " + bm2.url);
	return localStorage[h1] < localStorage[h2];
}

function saveToArray (bookmark) {
	arr.push(bookmark);
}