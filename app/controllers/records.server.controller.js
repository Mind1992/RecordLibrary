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
  var userQuery = req.body.recordTitle.toLowerCase().replace(/[^A-Z0-9]/ig, "_");
  console.log(userQuery);

  async.waterfall([
    function(callback) {
      superagent.get('https://api.discogs.com/database/search?q=' + userQuery + '&type=master')
        .set({ Accept: 'application/json', Authorization: 'Discogs key=' + key + ', secret=' + secret})
        .end(function(e, discogsResponse){
          if (!discogsResponse.body.results[0]) {
            return res.send(400, {message: req.body.recordTitle + ' was not found.'});
          }
          var recordResult = discogsResponse.body.results[0];
          callback(e, recordResult);
        });
    },
    function(recordResult, callback) {
      superagent.get('https://api.discogs.com/masters/' + recordResult.id)
        .set({ Accept: 'application/json', Authorization: 'Discogs key=' + key + ', secret=' + secret})
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
    }, function(record, callback) {
      superagent.get('https://api.spotify.com/v1/search?q=' + record.artists[0].name + '+' + record.title + '&type=album' )
        .set({ Accept: 'application/json'})
        .end(function(e, spotifyResponse){
          if (e) next(e);
          var albumId = spotifyResponse.body.albums.items[0].id;
          callback(e, record, albumId)
        });
    }, function(record, albumId, callback) {
      superagent.get('https://api.spotify.com/v1/albums/' + albumId + '/tracks' )
        .set({ Accept: 'application/json'})
        .end(function(e, spotifyResponse){
          if (e) next(e);
          for (var i = 0; i < record.tracklist.length; i++) {
            record.tracklist[i].preview_url = spotifyResponse.body.items[i].preview_url;
          };
          callback(e, record)
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

