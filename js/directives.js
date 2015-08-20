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
      svgWidth = window.innerWidth;
      svgHeight = window.innerHeight;
      hexWidth = 150;
      hexHeight = 2*hexWidth/Math.sqrt(3);
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
          .attr("transform", function(d, i) { return "translate(" + i * (hexWidth + 1) + ",0)"; });
        
        hex.append('rect')
          .attr('width', hexWidth)
          .attr('height', hexHeight)
          .attr('fill', '#fed');
        
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