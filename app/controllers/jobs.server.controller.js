'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Job = mongoose.model('Job'),
	//Auth = require('../lib/auth'),
	_ = require('lodash');

/**
 * Create a job
 */
exports.create = function(req, res) {
	var job = new Job(req.body);
	job.user = req.user;

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Show the current job
 */
exports.read = function(req, res) {
	res.jsonp(req.job);
};

/**
 * Update a job
 */
exports.update = function(req, res) {
	var job = req.job;

	job = _.extend(job, req.body);

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Delete an job
 */
exports.delete = function(req, res) {
	var job = req.job;

	job.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * List of Jobs
 */
exports.list = function(req, res) {
	Job.find().sort('-created').populate('user', 'displayName').exec(function(err, jobs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobs);
		}
	});
};

/**
 * Job middleware
 */
exports.jobByID = function(req, res, next, id) {
	Job.findById(id).populate('user').exec(function(err, job) {
		if (err) return next(err);
		if (!job) return next(new Error('Failed to load job ' + id));
		req.job = job;
		next();
	});
};

/**
 * Job authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.job.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

exports.hasRoleAuthorization = function(req, res, next) {
  if (req.user.roles[0] !== 'admin') {
    return res.status(403).send({
      message: 'User Role is not authorized'
    });
  }
  next();
};