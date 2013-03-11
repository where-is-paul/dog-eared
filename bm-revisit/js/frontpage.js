var list = $('<ol>');

chrome.bookmarks.getTree(function(bookmarks) {
  printBookmarks(bookmarks);
});


function printBookmarks(bookmarks) {
	bookmarks.forEach(function(bookmark) {
		if (bookmark.url) {
			var anchor = $('<a>');
			anchor.attr('href', bookmark.url);
			anchor.text(bookmark.title);
			
			var li = $('<li>');
			li.append(anchor);
			list.append(li);
		}
		
		if (bookmark.children)
			printBookmarks(bookmark.children);
	});
}

//console.log(list);
document.addEventListener('DOMContentLoaded', function () {
  $('#bookmarks').append(list);
});
