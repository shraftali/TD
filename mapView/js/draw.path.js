/**
 * Description: Short description.
 * Version: 1.0.0
 * Last update: 2014/09/10
 * Author: Nitin Tyagi <ntyagi2@sapient.com>
 *
 *  Dependencies -
     Jquery
    raphael-min
     jquery.lazylinepainter
     jquery.panzoom.min
 */

(function ( $, window, document, undefined ) {


    var pluginName = 'DrawPath',
        defaults = {
          data : {},
          selectors : {
            btn : '.hit'
          },
          dimSpace : '0.5',
          noDimSpace : "1",
          events : {
            'selectedSpaceIDEvent' : 'selectedSpace.mapChart',
            'changedSpaceIDEvent' : 'changedSpace.ControlPannel',
            'filterdSpaceIDEvent' : 'filterdSpace.mapChart',
            'clearFilteredSpaceIDEvent' : 'clearFilteredSpace.mapChart'
          },
          cache : {
            'hitTarget' : {}
          },
          active : true,
          activeHit : true
        };


    // The actual plugin constructor
    function mapChart( element, options ) {
        this.element = element;
        this.options = $.extend( true, {}, defaults, options) ;
        this.$el = $(element);
        this.spaceId = this.$el.attr('id');
        this._defaults = defaults;
        this._name = pluginName;

        this.init();

    }

    mapChart.prototype.init = function () {
      //console.log(this.$el.siblings(this.options.selectors.btn));
    this.options.cache.hitTarget = this.$el.siblings(this.options.selectors.btn);
    this.attachEvents();

    //console.log("init");
        // initialize the panzoom with options.
        $("#svg-container").panzoom({
          duration: 400,
          scale: 0,
          contain: "invert", //"invert",
          // minScale: 0,
          // maxScale: 10
        });



        // zoom in on the you are here
        $("#svg-container").panzoom('zoom', 5, {
          // increment: 2,

          animate: true,
          focal: {
            clientX: $("#HERE401").position().left,
            clientY: $("#HERE401").position().top
          },

        });

        //var restingPoint = this.determineRestingPoint();

//        $("#svg-container").panzoom("pan", (restingPoint[0] - $("#HERE401").position().left) / 20, (restingPoint[1] - $("#HERE401").position().top) / 20, { relative: true, animate: true});


    };

    mapChart.prototype.attachEvents = function(){

    var that = this;
    this.options.cache.hitTarget.on('click', function(e){
      e.preventDefault();
          that.clickCapture();
      });

      // Draw Row Multiple walk path
      $(window).on(this.options.events.drawRowPathEvent, function(e, vendorID){
           var i, len = vendorID.data.length;
           for (i = 0; i<len; i++){
            if (vendorID.data[i] === that.spaceId){
              console.log(that.spaceId)
              that.animPath(vendorID.data[i]);
            }
            else{
              that.erasePath();
            }
          }
      });

      // Erase Row Multiple walk path
      $(window).on(this.options.events.eraseRowPathEvent, function(e, vendorID){
          that.erasePath();
      });

      // Called on Window trigger to animate path
      $(window).on(this.options.events.changedSpaceIDEvent, function(e, vendorID){
          if (that.spaceId === vendorID){
            that.animPath(vendorID);
          }
          else{
            that.erasePath(vendorID);
          }
      });

      // Call the Erase Path Function on Windows event
       $(window).on(this.options.events.selectedSpaceIDEvent, function(e, vendorID){
          that.erasePath(vendorID);
      });

        $(window).on('animationComplete', function(event, SpaceID) {
         event.preventDefault();
         //console.log('inside animationComplete - ' + SpaceID + '/' + that.spaceId);
         that.options.activeHit = true;
            that.makeActive();
         /*if (SpaceID === that.spaceId) {
          console.log('yes')
         };*/
       });
       // Filter Space
       $(window).on(this.options.events.filterdSpaceIDEvent, function(e, vendorID){
        var i, len = vendorID.data.length;
        that.options.active = false;
        for (i = 0; i<len; i++){
          if (vendorID.data[i] === that.spaceId){
            that.options.active = true;
            that.makeActive();
          }
        }
        // if not found
        if (that.options.active === false){
          that.makeInactive();
        }
       });

       // Clear Filters
       $(window).on(this.options.events.clearFilteredSpaceIDEvent, function(e){
        that.options.active = true;
        that.options.cache.hitTarget.css({
          opacity: that.options.noDimSpace
        });

       });

  };
  //Used with Filtered Space
  mapChart.prototype.makeInactive = function(){
    //console.log('inside makeInactive')
    this.options.cache.hitTarget.css({
            opacity: this.options.dimSpace
          });
  };
  mapChart.prototype.makeActive = function(){
    //console.log('inside makeActive');
    this.options.cache.hitTarget.css({
            opacity: this.options.noDimSpace
          });
  };
  // Capture Click
  mapChart.prototype.clickCapture = function() {
    if (this.options.active === true && this.options.activeHit === true){
      this.animPath(this.spaceId);
      this.callContPanel();
    }
  };

  // Animate Path
  mapChart.prototype.animPath = function(SpaceID){
      $("#"+SpaceID).lazylinepainter({
        "svgData": this.options.data,
        "strokeWidth": 2 ,
        "strokeColor": "orange",
        "stroke-dasharray":5,
        "stroke-miterlimit":10,
         "onComplete": function () {
              $(window).trigger('animationComplete', SpaceID);
          }
      }).lazylinepainter('paint');
     //ggi this.handleZoom(SpaceID);
   };

  //Erase Path
  mapChart.prototype.erasePath = function(vendorID){
      //console.log('in erasePath');

      if (this.spaceId !== vendorID){
          $('#'+this.spaceId).lazylinepainter('destroy');
          this.options.activeHit = false;
          this.makeInactive();
          g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          var $g = $(g).attr({
            id: this.spaceId ,
            class: 'g-spot'
          });
          $('#mainmap').after($g);
      }

  };

  mapChart.prototype.callContPanel = function(){
   $(window).trigger(this.options.events.selectedSpaceIDEvent, this.spaceId);
  };

  /*mapChart.prototype.determineRestingPoint = function(){
      var restingPointX,
          restingPointY;

      restingPointX = ($("#svg-container").width() / 4) * 5;
      restingPointY = ($("#svg-container").height() / 16);
      console.log("resting point: ", restingPointX, restingPointY);

      return [restingPointX, restingPointY];

  };*/

  // handleZoom Functionality
  /*mapChart.prototype.handleZoom = function(spaceID){
    var restingPoint = this.determineRestingPoint();
    var buffer = 50;
    console.log("current matrix: ", $("#svg-container").panzoom("getMatrix"));
    // Current zoom
    var z = $("#svg-container").panzoom("getMatrix")[0];
    console.log("current scale: ", z);
    // get spaceID x and y of target element
    // x
    var x = Math.ceil($("#"+spaceID).position().left);
    // y
    var y = Math.ceil($("#"+spaceID).position().top);
    console.log(x, y);


    // current position of the "you are here"
    var hereX = $("#HERE401").position().left;
    var hereY = $("#HERE401").position().top;
    console.log("here xy: ", hereX, hereY);


    // // normalize those values! Remove the scale!
    x = x / z;
    y = y / z;

    hereX = hereX / z;
    hereY = hereY / z;

    console.log("new values: ", x, y, hereX, hereY);


    // Width to create a bounding box
    // width (change in x)
    var w = (hereX - x) + (buffer * 2);

    // height (change in y)
    var h = (hereY - y ) + (buffer * 2);
    console.log("width + height: ", w, h);

    var markerWidth = 15.58;
    var markerHeight = 30,
        below = false,
        above = false;

    // get the bounding box for the whole path
    // If the point we are going to is below the you are here, we need to take into account
    // the height of the you are here label. If it's above, we need to take into account
    // another 1/2 the width of the you are here label
    if(y <= hereY){
      // get a bounding box that includes .5 times the width of you are here
      console.log('above!');
      above = true;
      w = w + (markerWidth / 2);
      console.log('new width: ', w);
    } else if (y >= hereY){
      console.log("Below!");
      h = h + markerHeight;
      below = true;
      console.log('new height', h);
    }

    // dont' check ^^ just do it.

    var containerWidth = $('#svg-container').width(),
        containerHeight = $("#svg-container").height();

        console.log("container: ", containerWidth, containerHeight);


    // width ratio
    var wR = (w / containerWidth) * 100;

    // height ratio
    var hR = (h / containerHeight) * 100;
    console.log("wR, hR: ", wR, hR);


    var nZ;
    if(wR > hR){
      nZ = hR;
    } else {
      nZ = wR;
    }
    // nZ = z - nZ;
    // new zoom level
    console.log("nz: ", nZ);

    // absolute value of the zoom
    // Negative numbers would cause a flipped image
    if(nZ < 0){
      nZ = nZ * (-1);
    }

    // part of 100% that each section will be
    // we know that the plugin seems to toss out any value greater than 5
    var zoomLevel = Math.max( 5, (100 / (nZ)));
    console.log("zoom level: ", zoomLevel);


    //do the zoom!
    $("#svg-container").panzoom('zoom',zoomLevel, {
      animate: true,
      duration: 400,
      focal: {
        clientX: w / 2,
        clientY: h / 2
      },
      silent: true
    });


    console.log("after matrix: ", $("#svg-container").panzoom("getMatrix"));


    // get the NEW center point based on w/h calculated earlier
    var newCenterX = w / 2;
    var newCenterY = h / 2;

    console.log("new center point: ", newCenterX, newCenterY);

    var translateX = ((restingPoint[0] - newCenterX) * (-1)) / 4 ;
    var translateY = (restingPoint[1] - newCenterY) * (-1);
    // console.log("translate: ", translateX, translateY);
    $("#svg-container").panzoom("pan", translateX, translateY, { relative: true, animate: true});

  };*/

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new mapChart( this, options ));
            }
        });
    }

})( jQuery, window, document );
//Get the spaceID
//$(window).on('changedSpace.ControlPannel', function(e, spaceid){ console.log(e, spaceid)});
//Trigger the path
//$(window).trigger('changedSpace.ControlPannel', 'path_1');
//Trigger Filters
//$(window).trigger("filterdSpace.mapChart", [{data: ['path_2', 'path_3']}])
//Trigger Clear Filters
//$(window).trigger("clearFilteredSpace.mapChart")
