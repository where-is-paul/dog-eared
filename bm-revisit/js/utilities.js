function allBookmarks(func) {
	var traverseAll = function(bookmarks) {
		bookmarks.forEach(function(bookmark) {
			if (bookmark.url) {
				func(bookmark);
			}
			
			if (bookmark.children)
				traverseAll(bookmark.children);
		});
	}

	chrome.bookmarks.getTree(traverseAll);
}

function hashCode(str) {
	var hash = 0, i, chr;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+chr;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function time_diff(earlierDate, laterDate) {
	var oDiff = new Object();
	
	//diff is in seconds
	var diff = (laterDate.getTime() - earlierDate.getTime())/1000;

	oDiff.years = Math.floor(diff/60/60/24/365);
	oDiff.days = Math.floor(diff/60/60/24);
	oDiff.hours = Math.floor(diff/60/60);
	oDiff.minutes = Math.floor(diff/60);

	return oDiff;
}

