var inf = 10000;

//saving and adding visits to local storage.
function saveVisit(event) {
	var id = this.id;
	addVisit(id, 1);
}

function addVisit(id, val) {
	localStorage[-id] = parseInt(localStorage[-id]) + val;
}

//-----------------------------------------------//


//functions for links in subtext of each post
function bestTime(timeDiff) {
	if (timeDiff.minutes < 60) {
		if (timeDiff.minutes == 1) return "added " + timeDiff.minutes + " minute ago";
		else return "added " + timeDiff.minutes + " minutes ago";
	}
	
	if (timeDiff.hours < 24) {
		if (timeDiff.hours == 1) return "added " + timeDiff.hours + " hour ago";
		else return "added " + timeDiff.hours + " hours ago";
	}
	
	if (timeDiff.days < 365) {
		if (timeDiff.days == 1) return "added " + timeDiff.days + " day ago";
		else return "added " + timeDiff.days + " days ago";
	}
	
	if (timeDiff.years == 1) return "added " + timeDiff.years + " year ago";
	else return "added " + timeDiff.years + " years ago";
}

function showMeLater() {
	var id = $(this).closest('li').attr('id');
	addVisit(id, 2);
	$(this).closest('li').remove();
	replaceBookmark(1);
}

function ignoreForever() {
	var id = $(this).closest('li').attr('id');
	addVisit(id, inf);
	$(this).closest('li').remove();
	replaceBookmark(1);
}

function deleteBookmark(button) {
	var id = $(button).closest('.modal-footer').attr('id');
	chrome.bookmarks.remove(id, function() { console.log("bookmark deleted") } );
	$("li[id="+id+"]").remove();
	$(button).closest('.modal').modal('hide');
	addVisit(id, inf);
}

//-----------------------------------------------//



//functions to write bookmarks to page
function replaceBookmark(num) {
	var writeToExistingList = function(bookmark) {
		//refactor later, this is basically the same as write to list but to an existing list
		var list = $('ol');
		if (localStorage[-bookmark.id] >= inf) return;
		
		var li = createListEntry(bookmark);
		list.append(li);
	}
	
	chrome.extension.sendMessage({numreq: num}, function(response) {
		response.bookmarks.forEach(writeToExistingList);
	});
}

//the bulk of the bookmark creation code.
//creates and styles an <li> entry for the bookmark list
function createListEntry(bookmark) {
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
	
	var ignore = $('<a href="#">');
	ignore.text("ignore forever");
	ignore.click(ignoreForever);
	subtext.append(ignore);
	
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
	
	return li;
}

//-----------------------------------------------//