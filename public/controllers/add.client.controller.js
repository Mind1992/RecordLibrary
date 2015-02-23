angular.module('RecordLibrary')
  .controller('AddCtrl', ['$scope', '$alert', 'Record', function($scope, $alert, Record) {
    $scope.addRecord = function() {
      Record.save({ recordTitle: $scope.recordTitle },
        function() {
          $scope.recordTitle = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Record has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.recordTitle = '';
          $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }]);
