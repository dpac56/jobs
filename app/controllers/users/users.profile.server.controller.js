'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

//send all candidates
exports.getCandidates = function(req, res) {
	User.find({'roles': "candidate"}).exec(function(err, candidates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidates);
		}
	});;
};

exports.getCandidateById = function(req, res, id) {
	
	id = req.params.userId;
	
	User.findOne({"_id": id}).exec(function(err, candidates) {
		res.jsonp(candidates);
	});
};

exports.isEmployer = function(req, res, next){
	console.log(req.user.roles[0])
	if (req.user.roles[0] !== 'employer'){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
