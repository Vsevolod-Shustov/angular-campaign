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
        .append('g')
        .attr('id', 'map-holder-g');
      scope.$watch('globalMap',function(newMap){
        //console.log(scope.globalMap);
        console.log(newMap);
        var newMapArr = Object.keys(newMap).map(function (key) {return newMap[key]});
        var hex = svg.selectAll("g.hex")
          .data(newMapArr);
        
        hex.enter()
          .append("g")
          .classed('hex', true)
          .attr("transform", function(d, i) {
            var xPos = d.x*hexWidth-hexWidth/2;
            if(d.y%2!=0){xPos+=hexWidth/2};
            var yPos = d.y*hexHeight;
            if(d.y>0){yPos-=hexVerticalOffset*d.y};
            if(d.y<0){yPos+=hexVerticalOffset*Math.abs(d.y)};
            return "translate(" + d3.round(xPos) + ',' + d3.round(yPos) + ")";
          });

        hex.append('polygon')
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
        
        svg.attr("transform", "translate(400,200)");
      },true);
      
      //drag the map
      var drag = d3.behavior.drag().on("drag", dragmove);
      var mapholder = d3.select('#map-holder-g');
      mapholder.call(drag);
      function dragmove() {
        var t = d3.transform(mapholder.attr("transform"));
        var xmove = t.translate[0] + d3.event.dx;
        var ymove = t.translate[1] + d3.event.dy;
        mapholder.attr('transform', 'translate('+xmove+','+ymove+')');
      };
    }
  }
});