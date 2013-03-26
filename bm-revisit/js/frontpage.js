function loadPage() {
	var list = $('<ol class="media-list" id="bookmark-list">');
	var writeToList = function(bookmark) {
		if (localStorage[-bookmark.id] >= 10000) return;
			
		var li = createListEntry(bookmark);
		list.append(li);
	}

	chrome.extension.sendMessage({newlist: true}, function(response) {
		response.bookmarks.forEach(writeToList);
	});

	$(document).ready(function () {
		$('#bookmarks').append(list);
	});
}

loadPage();

//bookmark deletion dialog.
$(document).on('click', 'a[href=#deletebm]', function () {
	var id = $(this).closest('li').attr('id');
	$(".modal-footer").attr('id', id );
	$('#deletebm').modal('show');
}); 
$('#deletebm .modal-footer .btn-primary').click(function() {
		deleteBookmark(this);
		replaceBookmark(1);
	}
);

//handles clicking on bookmarks
$(document).on('click', '.sitelink', saveVisit);

//clicking logo refreshes page.
$(document).on('click', '.app-name', function() { document.location.reload(true) });

$(window).scroll(function () { 
	if (window.innerHeight + $(document).scrollTop() >= $(document).height() ) {
		if ($('#bookmark-list > li').length % 10 == 0) {
			$('#bookmark-list').append('<hr>');
		}
		replaceBookmark(1);
	}
});