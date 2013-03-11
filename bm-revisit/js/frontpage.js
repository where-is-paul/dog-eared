function loadPage() {
	var list = $('<ol>');
	var writeToList = function(bookmark) {
		var anchor = $('<a>');
		anchor.attr('href', bookmark.url);
		anchor.text(bookmark.title);
		
		var li = $('<li>');
		li.append(anchor);
		list.append(li);
	};
	
	chrome.extension.sendMessage({}, function(response) {
		response.bookmarks.forEach(writeToList);
	});

	$(document).ready(function () {
		$('#bookmarks').append(list);
	});
}

loadPage();