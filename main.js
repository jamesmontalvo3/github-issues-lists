
function getIssues () {
	var milestoneNum = $("#milestone").val();

	$.getJSON(
		"https://api.github.com/repos/enterprisemediawiki/meza/issues?milestone=" + milestoneNum,
		{},
		function( issues ) {
			resetColumns();

			for( var i in issues ) {
				var issue = issues[i];

				$("#sortable0").append(
					"<li class='ui-state-default'><a href='" + issue.html_url + "'>#" + issue.number + "</a> " + issue.title + "</li>");
			}
		}
	);
}

function addColumn () {
	var index = $(".sortable-list").size();

	$("#add-new").before(
		"<div class='list-container'><div class='title-wrapper'><input type='text' class='title-box' /></div><ul id='sortable" + index + "' class='droptrue sortable-list'></ul></div>"
	);

	$( "#sortable" + index ).disableSelection().sortable({
		connectWith: "ul"
	});
}

function resetColumns() {
	$(".list-container").remove();

	var cols = 3;
	for( var i = 0; i < cols; i++ ) {
		addColumn();
		// $("#end-of-lists").before(
		// 	"<div><ul id='sortable" + i + "' class='droptrue sortable-list'></ul></div>"
		// );
	}

	// $("#wrapper").append('<br id="end-of-lists" style="clear:both">');

	// var widthPercent = parseInt( 100 / cols );

	//$(".sortable-list").parent().css( {"width": widthPercent } );

	// $( ".sortable-list" ).disableSelection().sortable({
	//	 connectWith: "ul"
	// });

}

// setup
$(function(){
	$("#add-column").button({
		icons: { primary: "ui-icon-plusthick" },
		text: false
	}).click( addColumn );

	$("#get-issues").button().click( getIssues );

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

