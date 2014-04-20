ucApp.directive('notificationSwitch', function () {
  return {
    restrict: 'A',
    link: function(scope, element) {
      alert('test');
    }
  };
});