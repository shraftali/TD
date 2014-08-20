/* 
 * Lazy Line Painter - Path Object 
 * Generated using 'SVG to Lazy Line Converter'
 * 
 * http://lazylinepainter.info 
 * Copyright 2013, Cam O'Connell  
 *  
 */ 
 
/*var pathObj = {
    "path": {
        "strokepath": [
            {
                "path": "M518,770c17.634,5.614,39.636-4.634,52.997-15.977c7.037-5.975,9.256-15.909,13.254-24.729 c10.583-23.345,31.532-38.781,52.781-52.29c15.24-9.689,34.581-12.687,46.213-27.81c10.248-13.323,28.005-47.92,28.005-47.92 s9.261-20.071,3.776-28.304c-5.694-8.545-17.385-8.237-26.032-10.915C671.959,556.778,662.082,541.915,654,527",
                "duration": 1000
            }
        ],
        "dimensions": {
            "width": 1337,
            "height": 1080
        }
    }
}; 
 */
 
/* 
 Setup and Paint your lazyline! 
 */ 
  $(document).ready(function(){ 
    $("#hit").click(function(){
    console.log('clicked');
        $.getJSON("js/data.json",function(result){
            var pathObj = result;
            $('#path').lazylinepainter( 
         {
            "svgData": pathObj,
            "strokeWidth": 2 ,
            "strokeColor": "orange",
            "stroke-dasharray":5,
            "stroke-miterlimit":10
        }).lazylinepainter('paint');
      });
    });
    
    
    
  
 });