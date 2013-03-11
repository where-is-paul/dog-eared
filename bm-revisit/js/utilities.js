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
