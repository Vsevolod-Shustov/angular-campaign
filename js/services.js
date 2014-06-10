var ucServices = angular.module('ucServices', []);

ucServices.service('MapService', [ '$rootScope', function(){
  var service = {
    loadMap: function(){
      globalMap = JSON.parse(localStorage['globalMap']);
      return globalMap;
    },
    saveMap: function(){
      $scope.deleteBlankHexes();
      localStorage['globalMap'] = JSON.stringify($scope.globalMap);
    },
    addHex: function(hex){
      globalMap[hex["x"] + " " + hex["y"]] = hex;
    }
  }
  
  return service;
}]);