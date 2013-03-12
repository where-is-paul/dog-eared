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
		sendResponse({bookmarks: arr});
	});
	
//functions that do all the work
function goToFrontpage() {
	arr.sort(bmSorter);
	chrome.tabs.create({url: chrome.extension.getURL('frontpage.html')});
}


function firstTimeSetup() {
	var save = function(bookmark) {
		localStorage[bookmark.id] = bookmark.dateAdded;
		localStorage[-bookmark.id] = 0;
	};
	allBookmarks(save);
}

function less(a, b) {
	if (a == b) return 0;
	return (a < b ? -1 : 1);
}

function bmSorter(bm1, bm2) {
	if (localStorage[-bm1.id] == localStorage[-bm2.id])
		return less(localStorage[bm1.id], localStorage[bm2.id]);
	return less(localStorage[-bm1.id], localStorage[-bm2.id]);
}

function saveToArray (bookmark) {
	arr.push(bookmark);
}