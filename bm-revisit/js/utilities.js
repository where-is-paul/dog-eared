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

//fisher-yeats random shuffle
Array.prototype.shuffle = function() {
    for (var i = this.length - 1; i > 0; i--) {
		//may consider using a distribution weighted by access frequencies
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
	
	var unaccessed = [];
	var accessed = [];
	for (var i = 0; i < this.length; i++) {
		var id = -parseInt(this[i].id);
		var freq = localStorage[id];
		if (freq == 0) {
			unaccessed.push(this[i]);
		} else {
			accessed.push(this[i]);
		}
	}
	
	accessed.sort();
    return unaccessed.concat(accessed);
}