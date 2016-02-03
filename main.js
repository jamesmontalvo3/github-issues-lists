(function() {

	var storageAvailable = function (type) {
		try {
			var storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}

	if ( storageAvailable('localStorage') ) {
		window.useStorage = true;
	}
	else {
		window.useStorage = false;
	}

});

// function to get query string parameters
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

window.useStorage = true;
window.localStorageColumnKey = "githubIssueIdColumn";
function getColumnFromId ( id ) {
	if ( window.useStorage ) {
		var column = localStorage.getItem( localStorageColumnKey + id );
		returnVal = column ? column : 0;
	}
	else {
		returnVal = 0;
	}
	return returnVal;
}

function setColumnFromId ( id, columnNum ) {
	if ( window.useStorage ) {
		localStorage.setItem( localStorageColumnKey + id, columnNum );
	}
}

function getColumnsFromQueryString () {
	var qs = $.QueryString['columns'];
	var output = {};
	if ( ! qs ) {
		return output;
	}
	var idColString = qs.split(";");
	for (var j in idColString) {
		if ( ! idColString[j].trim() ) {
			continue; // if empty string, do nothing
		}
		pair = idColString[j].split(':');
		id = pair[0];
		col = pair[1];
		output[id] = col;
	}
	return output;
}

function getTitleStringFromQueryString () {
	var titles = $.QueryString['titles'];
	if ( ! titles ) {
		return '';
	}
	else {
		return decodeURIComponent( titles );
	}
}

function getIssues () {
	var milestoneNum = $("#milestone").val();

	$.getJSON(
		"https://api.github.com/repos/enterprisemediawiki/meza/issues?milestone=" + milestoneNum,
		{},
		function( issues ) {
			resetColumns();
			var columnNum;
			var highestColumn = $(".sortable-list").size() - 1;
			for( var i in issues ) {
				var issue = issues[i];
				columnIndex = getColumnFromId( issue.id );
				if ( columnIndex > highestColumn ) {
					addColumn( columnIndex ); // will add columns up to this column index
				}
				$("#sortable" + columnIndex).append(
					"<li class='ui-state-default' github-id='" + issue.id + "'><a href='" + issue.html_url + "'>#" + issue.number + "</a> " + issue.title + "</li>");
			}
		}
	);
}

function getColumnTitle ( index ) {
	var qs = $.QueryString['titles'];
	if ( ! qs ) {
		return '';
	}
	return qs.split(";")[index];
}

function addColumn ( fillToIndex ) {

	var newIndex = $(".sortable-list").size();
	var columnTitle = getColumnTitle( newIndex );

	$("#add-new").before(
		"<div class='list-container'><div class='title-wrapper'><input type='text' class='title-box' value='" + columnTitle + "' /></div><ul id='sortable" + newIndex + "' column-num='" + newIndex + "' class='droptrue sortable-list'></ul></div>"
	);

	$( "#sortable" + newIndex ).disableSelection().sortable({
		connectWith: "ul",
		stop: function( event, ui ) { // FIXME: this fires twice.
			setColumnFromId( ui.item.attr( 'github-id' ), ui.item.parent().attr( 'column-num' ) );
			updateURI();
		}
	});

	$( "#sortable" + newIndex ).parent().find( ".title-box" ).change( function() {
		updateURI();
	})

	if ( fillToIndex && newIndex < fillToIndex ) {
		addColumn( fillToIndex );
	}
}

function updateURI () {
	var columnsString = '';
	$(".sortable-list li").each( function( i, e ) {
		var $e = $(e);
		var id = $e.attr( 'github-id' );
		var col = $e.parent().attr( 'column-num' );
		columnsString += id + ":" + col + ";";
	});
	titlesString = constructTitlesString();
	window.history.pushState("some object", "some title", location.pathname + "?columns=" + columnsString + "&titles=" + titlesString);
}

function constructTitlesString () {
	var titlesString = '';
	$(".title-box").each( function( i, e ) {
		titlesString += $(e).val() + ";";
	});
	localStorage.setItem( "titles", titlesString );
	titlesString = encodeURIComponent( titlesString );
	return titlesString;
}

function resetColumns() {
	$(".list-container").remove();

	var cols = 3;
	for( var i = 0; i < cols; i++ ) {
		addColumn();
	}

}

// setup
$(function(){
	$("#add-column").button({
		icons: { primary: "ui-icon-plusthick" },
		text: false
	}).click( addColumn );

	$("#get-issues").button().click( getIssues );

	// preset IDs to certain columns per query string
	var presets = getColumnsFromQueryString();
	for ( var id in presets ) {
		setColumnFromId( id, presets[id] );
	}

	var titlesString = getTitleStringFromQueryString();
	localStorage.setItem( "titles", titlesString );


	$.getJSON(
		"https://api.github.com/repos/enterprisemediawiki/meza/milestones",
		{},
		function( milestones ) {
			for( var i in milestones ) {
				var ms = milestones[i];

				$("#milestone").append(
					"<option value='" + ms.number + "'>" + ms.title + "</option>"
				);
			}
		}
	);

});

