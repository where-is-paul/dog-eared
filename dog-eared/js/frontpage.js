function loadPage(settings) {
	if (settings.newpage) {
		var list = $('<table class="table table-hover" id="bookmark-list">');
	} else {
		var list = $('#bookmark-list');
		list.empty();
	}
	
	var writeToList = function(bookmark) {
		if (localStorage[-bookmark.id] >= 10000) return;
			
		var tr = createListEntry(bookmark);
		list.append(tr);
	}

	chrome.extension.sendMessage({newlist: true, shuffle: settings.randomize}, function(response) {
		response.bookmarks.forEach(writeToList);
	});

	if (settings.newpage) {
		$(document).ready(function () {
			$('#bookmarks').append(list);
		});
	}
}

loadPage({randomize: true, newpage: true});

//old newtab button
$('.default-newtab').click(function() {
		chrome.tabs.update({ "url": "chrome-internal://newtab/"});
	}
);

//bookmark deletion dialog.
$(document).on('click', 'a[href=#deletebm]', function () {
	var tr = $(this).closest('tr');
	var id = tr.attr('id');
	
	// var title = li.find('a')[0].text;
	// $(".modal-body").append(title);
	
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
	if (window.innerHeight + $(document).scrollTop() >= $(document).height() - 10) {
		replaceBookmark(5);
	}
});