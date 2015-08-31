var ucServices = angular.module('ucServices', []);

ucServices.service('LocalStorageService', [ '$rootScope', function(){
  var service = {
    load: function(key, value){
    if(localStorage[key]){
      console.log(key + ' loaded');
      return JSON.parse(localStorage[key]);
    } else {
      console.log(key + ' not found. Have one hex map instead.');
      return {'0 0':{'terrain':'plains','x':0,'y':0}};
    }
    },
    save: function(key, value){
      localStorage[key] = JSON.stringify(value);
    }
  } 
  return service;
}]);