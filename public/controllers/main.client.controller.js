angular.module('RecordLibrary')
  .controller('MainCtrl', ['$scope', 'Record', function($scope, Record) {

    $scope.genres = ['Electronic', 'Rock', 'Funk / Soul', 'Jazz', 'Folk, World, & Country',
                     'Hip Hop', 'Classical', 'Reggae', 'Latin', 'Stage & Screen', 'Blues',
                     'Non-Music', 'Children\'s', 'Brass & Military', 'House'];

    $scope.headingTitle = 'Top 12 Records';

    $scope.records = Record.query();

    $scope.filterByGenre = function(genre) {
      $scope.records = Record.query({ genres: genre });
      $scope.headingTitle = genre;
    };
  }]);
