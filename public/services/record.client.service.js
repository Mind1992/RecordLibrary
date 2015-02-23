angular.module('RecordLibrary')
  .factory('Record', ['$resource', function($resource) {
    return $resource('/api/records/:_id');
  }]);
