var records = require('../../app/controllers/records.server.controller');

module.exports = function(app) {
  app.route('/api/records')
    .get(records.list)
    .post(records.create);

  app.route('/api/records/:id')
    .get(records.read)
}
