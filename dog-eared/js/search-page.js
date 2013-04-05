$('button').click(function() {
		event.preventDefault();
		var query = $(this).parent().find('input').val();
		chrome.bookmarks.search(query, refreshList);
	}
);

$('input').keypress(function() {
		if (event.which == 13) {
			event.preventDefault();
			var query = $(this).val();
			chrome.bookmarks.search(query, refreshList);
		}
	}
);


//swap with main page
$('.swap-front').click(function() {
		var main_list = top.$("#bookmark-list");
		var search_list = $(document).contents().find("#search-list");
		main_list.empty();
		main_list.append(search_list.contents());
	}
);

function refreshList(bookmarks) {
	//console.log(bookmarks);
	var list = $(document).contents().find("#search-list");
	list.empty();
	
	var writeToList = function(bookmark) {
		if (localStorage[-bookmark.id] >= 10000) return;
			
		var tr = createListEntry(bookmark);
		list.append(tr);
	}
	
	bookmarks.forEach(writeToList);
	$('#bookmarks').append(list);
}