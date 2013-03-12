function loadPage() {
	var list = $('<ol class="media-list">');
	var writeToList = function(bookmark) {
		if (localStorage[-bookmark.id] >= 10000) return;
		//making media components (basic components of a post)
		var body = $('<div class="media-body">');
		var title = $('<h4 class="media-heading">');
		
		//add link to bookmark below
		var anchor = $('<a>');
		anchor.attr('href', bookmark.url);
		anchor.attr('target', '_blank');
		anchor.attr('id', bookmark.id);
		anchor.attr('class', 'sitelink');
		anchor.text(bookmark.title);
		
		//filter out wwws and other oddities in domain names.
		//preserves some leading identifiers on purpose (e.g.
		//www-cs-...
		var domain = ' (' + anchor[0].hostname.replace(/^www(4*)\./i,'') + ')';
		
		//attach link to body text
		title.append(anchor);
		title.append(domain);
		body.append(title);
		
		//compute time differences to show in subtext
		var timeAdded = new Date(bookmark.dateAdded);
		var timeNow = new Date();
		var timeDiff = time_diff(timeAdded, timeNow);
		
		//constructing different subtext options
		var subtext = $('<div class="subtext">');
		var lasttime = bestTime(timeDiff);
		subtext.append(lasttime)
		
		subtext.append(" | ");
		
		var showlater = $('<a href="#">');
		showlater.text("show me later");
		showlater.click(showMeLater);
		subtext.append(showlater);
		
		subtext.append(" | ");
		var deletebm = $('<a href="#deletebm" role="button" data-toggle="modal">');
		deletebm.text("delete");
		subtext.append(deletebm);
		
		body.append(subtext);
		
		//uncomment when its time to add images
		// var img_holder = $('<a class="pull-left" href="#">');
		// var img = $('<img class="media-object" src="http://placehold.it/32x32">');
		// img_holder.append(img);
				
		var li = $('<li class="media">');
		li.attr('id', bookmark.id);
		// li.append(img_holder);
		li.append(body);
		
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

$(document).on('click', 'a[href=#deletebm]', function () {
	var id = $(this).closest('li').attr('id');
	$(".modal-footer").attr('id', id );
	$('#deletebm').modal('show');
	//console.log('yo! ' + id);
}); 

$(document).on('click', '.sitelink', saveVisit);

$('#deletebm .modal-footer .btn-primary').click(deleteBookmark);

function saveVisit(event) {
	var id = this.id;
	addVisit(id, 1);
	$(this).closest('li').remove();
}

function addVisit(id, val) {
	localStorage[-id] = parseInt(localStorage[-id]) + val;
}


function bestTime(timeDiff) {
	if (timeDiff.minutes < 60) {
		if (timeDiff.minutes == 1) return timeDiff.minutes + " minute ago";
		else return timeDiff.minutes + " minutes ago";
	}
	
	if (timeDiff.hours < 24) {
		if (timeDiff.hours == 1) return timeDiff.hours + " hour ago";
		else return timeDiff.hours + " hours ago";
	}
	
	if (timeDiff.days < 365) {
		if (timeDiff.days == 1) return timeDiff.days + " day ago";
		else return timeDiff.days + " days ago";
	}
	
	if (timeDiff.years == 1) return timeDiff.years + " year ago";
	else return timeDiff.years + " years ago";
}

function showMeLater() {
	var id = $(this).closest('li').attr('id');
	addVisit(id, 2);
	$(this).closest('li').remove();
}

function deleteBookmark() {
	var id = $(this).closest('.modal-footer').attr('id');
	chrome.bookmarks.remove(id, function() { console.log("bookmark deleted") } );
	$("li[id="+id+"]").remove();
	$(this).closest('.modal').modal('hide');
	addVisit(id, 10000);
}