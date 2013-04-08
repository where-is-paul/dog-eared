$(function() {
	var timer;
	$('input').keyup(function() {
			clearTimeout(timer);
			var ms = 200; // milliseconds
			var query = $(this).val();
			var search = function() { 
					if (query.length == 0) {
						loadPage({randomize: false, newpage: false});
					} else {	
						chrome.bookmarks.search(query, refreshList);
					}
				};
			timer = setTimeout(search, ms);
		}
	);
});

function refreshList(bookmarks) {
	//console.log(bookmarks);
	var list = $("#bookmark-list");
	list.empty();
	
	var writeToList = function(bookmark) {
		if (localStorage[-bookmark.id] >= 10000) return;
			
		var tr = createListEntry(bookmark);
		list.append(tr);
	}
	
	bookmarks.forEach(writeToList);
	//$('#bookmarks').append(list);
}