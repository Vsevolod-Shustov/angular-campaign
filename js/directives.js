var ucDirectives = angular.module('ucDirectives', []);

ucDirectives.directive('mapDrawer', function(){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      console.log(scope.globalMap);
      var svgWidth = window.innerWidth;
      var svgHeight = window.innerHeight;
      var hexWidth = 150;
      var hexHeight = 2*hexWidth/Math.sqrt(3);
      var hexSideLength = hexHeight*Math.sin(Math.PI/6);
      var hexVerticalOffset = (hexHeight-hexSideLength)/2;
      var hexagon = [
        {"x":hexWidth/2, "y":0},
        {"x":hexWidth, "y":(hexHeight-hexSideLength)/2},
        {"x":hexWidth, "y":hexHeight/2+(hexHeight-hexSideLength)/2},
        {"x":hexWidth/2, "y":hexHeight},
        {"x":0, "y":hexHeight/2+(hexHeight-hexSideLength)/2},
        {"x":0, "y":(hexHeight-hexSideLength)/2}
      ];
      var svg = d3.select('#map')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('id', 'map-holder-svg');
      var mapholder = svg.append('g')
        .attr('id', 'map-holder-g');
      scope.firstload = true
        
      scope.$watch('globalMap',function(newMap){
        var newMapArr = Object.keys(newMap).map(function (key) {return newMap[key]});
        var hex = mapholder.selectAll("g.hex")
          .data(newMapArr);
        //scope.deleteBlankHexes();
        //scope.addBlankHexes();
        
        hex.enter()
          .append("g")
          .classed('hex', true)
          .attr('class', function(d){return d3.select(this).attr("class") + " "+d.terrain;})
          .attr("transform", function(d, i) {
            var xPos = d.x*hexWidth-hexWidth/2;
            if(d.y%2!=0){xPos+=hexWidth/2};
            var yPos = d.y*hexHeight;
            if(d.y>0){yPos-=hexVerticalOffset*d.y};
            if(d.y<0){yPos+=hexVerticalOffset*Math.abs(d.y)};
            return "translate(" + d3.round(xPos) + ',' + d3.round(yPos) + ")";
          });

        hex.append('polygon')
          .attr('data-x', function(d){return d.x;})
          .attr('data-y', function(d){return d.y;})
          .attr('data-terrain', function(d){return d.terrain;})
          .attr('points', function(){
            var hexagonString="";
            for(i=0;i<hexagon.length;i++){
              hexagonString += d3.round(hexagon[i].x);
              hexagonString += ',';
              hexagonString += d3.round(hexagon[i].y);
              hexagonString += ' ';
            };
            hexagonString = hexagonString.substr(0, hexagonString.length - 1);
            return hexagonString;
          });
        
        hex.append('text')
          .attr("x", hexWidth/2)
          .attr('y', 20)
          .attr("dy", ".35em")
          .attr("fill", "#000")
          .attr('text-anchor', 'middle')
          .text(function(d){return d.x+' '+d.y});
        hex.append('text')
          .attr("x", hexWidth/2)
          .attr('y', 40)
          .attr("dy", ".35em")
          .attr("fill", "#000")
          .attr('text-anchor', 'middle')
          .text(function(d){return d.terrain});
        
        hex.exit().remove();

        positionTheMap();
        
        scope.firstload = false;
      },true);//end update
      
      //drag the map
      var drag = d3.behavior.drag().on("drag", dragmove);
      //var mapholder = d3.select('#map-holder-g');
      mapholder.call(drag);
      function dragmove() {
        var t = d3.transform(mapholder.attr("transform"));
        var xmove = t.translate[0] + d3.event.dx;
        var ymove = t.translate[1] + d3.event.dy;
        mapholder.attr('transform', 'translate('+xmove+','+ymove+')');
      };
      
      var positionTheMap = function(){
        console.log('positioning the map...');
        //position top left corner of the map to top left corner of svg
        var mapXresetPos = document.getElementById("map-holder-g").getBBox().x; mapXresetPos*=-1;
        var mapYresetPos = document.getElementById("map-holder-g").getBBox().y; mapYresetPos*=-1;
        //mapholder.attr("transform", "translate("+mapXresetPos+","+mapYresetPos+")");

        //center the map
        var mapXpos = (d3.select("#map-holder-svg").attr('width') - document.getElementById("map-holder-g").getBBox().width)/2;
        var mapXpos = mapXpos + mapXresetPos;
        var mapYpos = (d3.select("#map-holder-svg").attr('height') - document.getElementById("map-holder-g").getBBox().height)/2;
        var mapYpos = mapYpos + mapYresetPos
        //console.log(document.getElementById("map-holder-g").getBBox());
        if(scope.firstload == true) {
          mapholder.attr("transform", "translate("+mapXpos+","+mapYpos+")");
        } else {
          mapholder.transition(500).attr("transform", "translate("+mapXpos+","+mapYpos+")");
        };
      };
      
      $(window).resize(function(){
        scope.firstload = true;
        $('#map-holder-svg').attr('width', window.innerWidth).attr('height', window.innerHeight);
        positionTheMap();
      });
    }
  }
});