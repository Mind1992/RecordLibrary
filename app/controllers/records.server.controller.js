var async = require('async'),
    superagent = require('superagent'),
    _ = require('lodash'),
    config = require('../../config/config'),
    mongoose = require('mongoose'),
    Record = mongoose.model('Record');

var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

exports.list = function(req, res, next) {
  var query = Record.find();
  if (req.query.genres) {
    query.where({ genres: req.query.genres });
  } else {
    query.limit(12);
  }
  query.exec(function(err, records) {
    if (err) return next(err);
    res.send(records);
  });
};

exports.read = function(req, res, next) {
  Record.findById(req.params.id, function(err, record){
    if (err) return next(err);
      res.send(record);
  });
};

exports.create = function(req, res, next) {
  var key = config.key;
  var secret = config.secret;
  var userQuery = req.body.recordTitle;

  async.waterfall([
    function(callback) {
      superagent.get('https://api.discogs.com/database/search?q=' + userQuery + '&type=master' + '&key=' + key + '&secret=' + secret)
        .set({ Accept: 'application/json'})
        .end(function(e, discogsResponse){
          if (e) next(e);
          var recordResult = discogsResponse.body.results[0];
          callback(e, recordResult);
        });
    },
    function(recordResult, callback) {
      superagent.get('https://api.discogs.com/masters/' + recordResult.id)
        .set({ Accept: 'application/json'})
        .end(function(e, discogsResponse){
          if (e) next(e);
          var result = discogsResponse.body;
          var record = new Record({
            _id: result.id,
            title: result.title,
            genres: result.genres,
            styles: result.styles,
            artists: result.artists,
            year: result.year,
            images: result.images[0].resource_url,
            tracklist: result.tracklist
          });
          callback(e, record);
        });
    }
  ], function(e, record) {
    if (e) return next(e);
    record.save(function(e) {
      if (e) {
        if (e.code == 11000) {
          return res.send(409, {message: record.title + ' already exists.'});
        }
        return next(e);
      }
      res.send(200);
    });
  });
};

