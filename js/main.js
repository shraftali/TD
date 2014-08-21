$(document).ready(function(){ 
$(".hit").click(function(){
	var path = $(this).parent('g').attr('relPath');
    $.getJSON("js/data.json",function(result){
        var pathObj = result;
        $("#"+path).lazylinepainter({
			"svgData": pathObj,
			"strokeWidth": 2 ,
			"strokeColor": "orange",
			"stroke-dasharray":5,
			"stroke-miterlimit":10
		}).lazylinepainter('paint');
	});
});
});