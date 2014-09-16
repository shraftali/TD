$(document).ready(function(){

  $.getJSON('js/data/data.json', function(result) {
     $('.g-spot').DrawPath({'data' : result });
  });
});

function init(){
  // initialize the panzoom
  $("#svg-container").panzoom({
    duration: 400,
  });
  console.log("you are here: ", $("#Layer_2").position().top);

  // zoom in on the you are here
  $("#svg-container").panzoom('zoom', {
    increment: 2,
    animate: true,
    focal: {
      clientX: $("#Layer_2").position().left,
      clientY: $("#Layer_2").position().top
    }
  });
}

