$(document).ready(function(){ 
$(".hit").click(function(){
	var path = $(this).parent('g').attr('relPath');

    $.getJSON("js/data/data.json",function(result){
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

/*$(document).ready(function(){
  //Function which simulates zoom on the map on pinchin/pinchout
  $('#map').hammer()
    .on("pinchin", function(e) {
      var scale = $(this).css('transform');
      scale = (scale == null ? $(this).css('-webkit-transform') : scale); 
      scale = (scale == null ? $(this).css('-ms-transform') : scale);
      scale = scale.split(" ");
      scale = parseFloat(scale[0].substring(7, scale[0].length - 1));

      if(scale > 1) {
        scale = ('scale(' + (scale - .1).toString() + ')');
        $(this).css({'transform':scale, '-ms-transform':scale, '-webkit-transform':scale });
      }
    })
    .on("pinchout", function(e) {
      var scale = $(this).css('transform');
      scale = (scale == null ? $(this).css('-webkit-transform') : scale); 
      scale = (scale == null ? $(this).css('-ms-transform') : scale);
      scale = scale.split(" ");
      scale = parseFloat(scale[0].substring(7, scale[0].length - 1));

      if(scale < 5) {
        scale = ('scale(' + (scale + .1).toString() + ')');
        $(this).css({'transform':scale, '-ms-transform':scale, '-webkit-transform':scale});
      }
  });
});*/