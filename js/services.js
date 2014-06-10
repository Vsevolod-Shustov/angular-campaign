var ucServices = angular.module('ucServices', []);

ucServices.service('MapService', [ '$rootScope', function(){
  var service = {
    loadMap: function(){
      return JSON.parse(localStorage['globalMap']);
      //alert("It's alive!");
    }
  }
  
  return service;
}]);