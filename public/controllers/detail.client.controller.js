angular.module('RecordLibrary')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Record',
    function($scope, $rootScope, $routeParams, Record) {
      Record.get({ _id: $routeParams.id }, function(record) {
        $scope.record = record;

        $scope.playing = false;
        $scope.audio = document.createElement('audio');
        $scope.audio.src = record.tracklist[0].preview_url[0];;
        $scope.play = function() {
          $scope.audio.play();
          $scope.playing = true;
        };
        $scope.stop = function() {
          $scope.audio.pause();
          $scope.playing = false;
        };
        $scope.audio.addEventListener('ended', function() {
          $scope.$apply(function() {
            $scope.stop()
          });
        });
      });
    }]);
