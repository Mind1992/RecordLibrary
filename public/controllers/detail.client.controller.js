angular.module('RecordLibrary')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Record',
    function($scope, $rootScope, $routeParams, Record) {
      Record.get({ _id: $routeParams.id }, function(record) {
        $scope.record = record;
      });
    }]);
