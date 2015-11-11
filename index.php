<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>jQuery UI Sortable - Handle empty lists</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
  <style>
  #wrapper {
  	margin: 20px auto 10px auto;
    width: 1024px;
  }
  #wrapper div {
  	margin: 0;
  	float: left;
  	padding: 0;
  	width: 33%;
  }
  #sortable1, #sortable2, #sortable3 {
  	list-style-type: none;
  	background: #eee;
  	min-height: 50px;
  	margin: 5px;
  	padding: 5px;
  }
  #sortable1 li, #sortable2 li, #sortable3 li { margin: 5px; padding: 5px; font-size: 1.2em; background-color: yellow; }
  #sortable1 li a, #sortable2 li a, #sortable3 li a { font-weight: bold; }
  </style>
  <script>
  $(function() {
    $( "ul.droptrue" ).sortable({
      connectWith: "ul"
    });

    $( "ul.dropfalse" ).sortable({
      connectWith: "ul",
      dropOnEmpty: false
    });

    $( "#sortable1, #sortable2, #sortable3" ).disableSelection();
  });

  $.getJSON(
  	"https://api.github.com/repos/enterprisemediawiki/meza/issues?milestone=9",
  	{},
  	function( issues ) {
  		for( var i in issues ) {
  			var issue = issues[i];

  			$("#sortable1").append(
  				"<li class='ui-state-default'><a href='" + issue.html_url + "'>#" + issue.number + "</a> " + issue.title + "</li>");
  		}
  	}
  );
  </script>
</head>
<body>

<div id="wrapper">

	<div>
	<ul id="sortable1" class="droptrue">
	</ul>
	</div>

	<div>
	<ul id="sortable2" class="droptrue">
	</ul>
	</div>

	<div>
	<ul id="sortable3" class="droptrue">
	</ul>
	</div>
	<br style="clear:both">
</div>

</body>
</html>