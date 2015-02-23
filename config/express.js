var config = require('./config'),
		express = require('express'),
		path = require('path'),
		morgan = require('morgan'),
		compress = require('compression'),
		cookieParser = require('cookie-parser');
		methodOverride = require('method-override'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		superagent = require('superagent'),
		async = require('async'),
    _ = require('lodash'),
		bcrypt = require('bcryptjs');

module.exports = function() {
	var app = express();

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(express.static('./public'));


	// require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/records.server.routes.js')(app);

	app.get('*', function(req, res) {
	  res.redirect('/#' + req.originalUrl);
	});

	app.use(function(err, req, res, next) {
	  console.error(err.stack);
	  res.send(500, { message: err.message });
	});

	return app;
};
