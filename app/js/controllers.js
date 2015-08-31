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
  };
  
  //delete hex
  $scope.deleteHex = function(){
    var hex = {};
    hex["x"] = $scope.hexForm.x;
    hex["y"] = $scope.hexForm.y;
    var hexToDelete = hex["x"] + " " + hex["y"];
    if($scope.globalMap[hexToDelete].terrain == 'empty'){
      console.log("Can't delete empty hexes");
    } else {
      delete $scope.globalMap[hexToDelete];
    };
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
}]);