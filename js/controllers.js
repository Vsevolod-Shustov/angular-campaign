var ucControllers = angular.module('ucControllers', []);

var ae = angular.element;

function isInt(value) {
  return !isNaN(value) && parseInt(value) == value;
}

ucControllers.controller('MapCtrl', ['$scope', '$compile', 'LocalStorageService', function($scope, $compile, LocalStorageService){
  $scope.text = 'Hello World!';
  $scope.globalMap = {};
  $scope.globalMap = LocalStorageService.load('globalMap');
  $scope.hexForm = {};
  
  //watch map
  /*$scope.$watch(function(){
    return jQuery('#hexes-anchor>.hex').size() },  
    function(){
      $scope.drawMap();
    }
  );*/
  //$scope.$watch('globalMap',function(){$scope.drawMap()},true);
  
  //hex manipulation
  //add hex
  $scope.addHex = function() {
    var hex = {};
    if(!$scope.hexForm.terrain) {
      console.log('Hex must have terrain.');
    } else {
      hex["x"] = $scope.hexForm.x;
      hex["y"] = $scope.hexForm.y;
      hex["terrain"] = $scope.hexForm.terrain;
      $scope.globalMap[hex["x"] + " " + hex["y"]] = hex;
    };
    //$scope.drawMap();
  };
  
  //delete hex
  $scope.deleteHex = function(){
    var hex = {};
    hex["x"] = $scope.hexForm.x;
    hex["y"] = $scope.hexForm.y;
    var hexToDelete = hex["x"] + " " + hex["y"];
    delete $scope.globalMap[hexToDelete];
    //$scope.drawMap();
  };
  
  //save map
  $scope.saveMap = function(){
    $scope.deleteBlankHexes();
    LocalStorageService.save('globalMap', $scope.globalMap);
  };
  
  //load map
  $scope.loadMap = function(){
    $scope.globalMap = LocalStorageService.load('globalMap');
  };
  
  //click hex
  $scope.hexClick = function($event) {
    //console.log(jQuery($event.currentTarget).attr('class'));
    $scope.currentHex = $scope.globalMap[jQuery($event.currentTarget).data('x') + " " + jQuery($event.currentTarget).data('y')];
    $scope.hexForm.x = $scope.currentHex.x;
    $scope.hexForm.y = $scope.currentHex.y;
    $scope.hexForm.terrain = $scope.currentHex.terrain;
  };
    
  //clear map
  $scope.clearMap = function(){
    $scope.globalMap = {};
  };
  
  //empty save data
  $scope.clearSave = function(){
    localStorage.removeItem('globalMap');
  };

  //get coordinates of nearby hexes
  $scope.nearbyHexes = function(x, y){
    x = parseInt(x);
    y = parseInt(y);
    if(y%2==0) {
      var result = {
        "right":{"x":(x+1), "y":y},//right
        "left":{"x":(x-1), "y":y},//left
        "top left":{"x":(x-1), "y":(y-1)},//top left
        "bottom right":{"x":x, "y":(y+1)},//bottom right
        "bottom left":{"x":(x-1), "y":(y+1)},//bottom left
        "top right":{"x":x, "y":(y-1)}//top right
      };
    } else {
      var result = {
        "right":{"x":(x+1), "y":y},//right
        "left":{"x":(x-1), "y":y},//left
        "top left":{"x":(x), "y":(y-1)},//top left
        "bottom right":{"x":(x+1), "y":(y+1)},//bottom right
        "bottom left":{"x":x, "y":(y+1)},//bottom left
        "top right":{"x":(x+1), "y":(y-1)}//top right
      };
    };
    return result;
  };
  
  //add blank hexes
  $scope.addBlankHexes = function(){
    angular.forEach($scope.globalMap, function(value, key){
      if(value.terrain != "empty"){
        angular.forEach($scope.nearbyHexes(value.x, value.y), function(value, key){
          var hex = {};
          hex["x"] = value.x;
          hex["y"] = value.y;
          hex["terrain"] = "empty";
          var hexToWrite = value.x+" "+value.y;
          if(!$scope.globalMap[hexToWrite]){
            $scope.globalMap[hexToWrite] = hex;
          };
        });
      };
    });
  };
  
  //delete blank hexes
  $scope.deleteBlankHexes = function(){
    angular.forEach($scope.globalMap, function(value, key){
      if(value.terrain == "empty") {delete $scope.globalMap[key]};
    });
  };
  
  //draw the map
  /*$scope.drawMap = function() {
    $scope.deleteBlankHexes();
    $scope.addBlankHexes();
    //variables for determining map size
    var maxX = 0;
    var maxY = 0;
    var minX = 0;
    var minY = 0;
    var maxXY = 0;
    var minXY = 0;
    var hexWidth = 154;//this includes horizontal margin between hexes
    var hexHeight = 172;//this DOES NOT include vertical margin between hexes
    var hexVerticalOffset = 42;

    //position hexes
    jQuery('.hex').each(function(){
      var x = jQuery(this).data("x");
      var y = jQuery(this).data("y");
      var xPos = x*hexWidth-hexWidth/2;
      if(y%2!=0){xPos+=hexWidth/2};
      var yPos = y*hexHeight;
      if(y>0){yPos-=hexVerticalOffset*y};
      if(y<0){yPos+=hexVerticalOffset*Math.abs(y)};
      jQuery(this).css('top', yPos).css('left', xPos).css('z-index', 10);
      
      //set data to determine map size
      if(x>=0 && x>maxX){maxX = x; maxXY = y};
      if(y>0 && y>maxY){maxY = y};
      if(x<0 && x<minX){minX = x; minXY = y};
      if(y<0 && y<minY){minY = y};
    });
    
    //yet another cycle to determine map size, thanks to odd rows' horizontal offset
    jQuery('.hex').each(function(){
      var x = jQuery(this).data("x");
      var y = jQuery(this).data("y");
      if(x>=0 && x==maxX && y%2!=0 && maxXY%2==0){maxX = x; maxXY = y};
      if(x<0 && x==minX && y%2==0 && minXY%2!=0){minX = x; minXY = y};
    });
    
    //set map size
    if((maxXY%2!=0 && minXY%2!=0)||(maxXY%2==0 && minXY%2==0)){
      var mapWidth = (maxX - minX + 1)*hexWidth;
    } else {
      var mapWidth = (maxX - minX + 1.5)*hexWidth;
    };
    var mapHeight = (maxY - minY + 1)*(hexHeight - hexVerticalOffset)+hexVerticalOffset;
    jQuery('#map').css('width', mapWidth).css('height', mapHeight).css('background','#dde');
    
    //set view offset
    if(minXY%2==0) {
      var viewOffsetX = (Math.abs(minX)+1)*hexWidth;
    } else {
      var viewOffsetX = (Math.abs(minX)+0.5)*hexWidth;
    };
    var viewOffsetY = (Math.abs(minY))*(hexHeight - hexVerticalOffset) + hexHeight/2;
    jQuery('#hexes-anchor').css('top', viewOffsetY).css('left', viewOffsetX);
  };*/
}]);