var ucDirectives = angular.module('ucDirectives', []);

ucDirectives.directive('bordersDrawer', function(){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      
    }
  }
});

ucDirectives.directive('mapDrawer', function(){
  return {
    restrict: "EA",
    //template: "<svg width='640' height='480'></svg>",
    link: function(scope, elem, attrs){
      console.log(scope.globalMap);
      var svgWidth = window.innerWidth;
      var svgHeight = window.innerHeight;
      var hexWidth = 150;
      var hexHeight = 2*hexWidth/Math.sqrt(3);
      var hexSideLength = hexHeight*Math.sin(Math.PI/6);
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
        .attr('height', svgHeight);
      scope.$watch('globalMap',function(newMap){
        //console.log(scope.globalMap);
        console.log(newMap);
        newMapArr = Object.keys(newMap).map(function (key) {return newMap[key]});
        var hex = svg.selectAll("g")
          .data(newMapArr)
          .enter()
          .append("g")
          .classed('hex', true)
          .attr("transform", function(d, i) { return "translate(" + i * (hexWidth + 1) + ",0)"; });

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
          .attr("x", 10)
          .attr('y', 10)
          .attr("dy", ".35em")
          .attr("fill", "#000")
          .text(function(d){return d.x});
      },true);
    }
  }
});