var ucApp = angular.module('ucApp', [
  'ucControllers'
]);
/*ucApp.directive('onLastRepeat', function() {
  return function(scope, element, attrs) {
    if (scope.$last) setTimeout(function(){
      scope.$emit('onRepeatLast', element, attrs);
    }, 1);
   };
});*/
ucApp.directive('mapDrawer', function () {
  return function (scope, element, attrs) {
    scope.$watch('globalMap', function() {
      //console.log("gloabalMap changed");
      //scope.drawMap();
      if (scope.$last){
        scope.drawMap();
      };
    });
  };
});