describe('MapCtrl', function(){
  var scope = {};
  beforeEach(angular.mock.module('ucApp'));
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    localStorage['globalMap'] = JSON.stringify({"0 0":{"x":"0","y":"0","terrain":"plains"}});
    scope = $rootScope.$new();
    $controller('MapCtrl', {$scope: scope});
  }));
  it('should have variable text = "Hello World!"', function(){
    expect(scope.text).toBe('Hello World!');
  });
  it('should add blank hexes to the map', function(){
    //scope.globalMap = {"0 0":{"x":"0","y":"0","terrain":"plains"}};
    scope.addBlankHexes();
    expect(Object.keys(scope.globalMap).length).toBe(7);
    //expect(scope.globalMap.length).toBe(7);
  });
});