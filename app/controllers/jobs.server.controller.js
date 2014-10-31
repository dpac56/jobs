'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Job = mongoose.model('Job'),
	//Auth = require('../lib/auth'),
	_ = require('lodash');

var Mailgun = require('mailgun-js');

//Your api key, from Mailgun’s Control Panel
var api_key = 'key-c2cf3cd75e9676a5dd8f6bba3fdb4c4a';

//Your domain, from the Mailgun Control Panel
var domain = 'sandbox91972e7ec52c4e69ad16277fd8c26a8f.mailgun.org';

//Your sending email address
var from_who = 'deepak@withstartups.com';
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
 * Add candidates to jobs
 */
exports.addCandidate = function(req, res) {
	var job = req.job;

	job.candidates.push(req.user.id);

	job.save(function(err){
		if (err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

exports.readCandidates = function(req, res){
	var job = req.job;

	res.jsonp(job.candidates);
};

exports.hasCandidateAuthorization = function(req, res, next){
	if (req.originalMethod !== 'POST' || req.route.path !== '/jobs/:jobId/candidates'){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};




/**
 * Send mails to employers
 */

exports.sendMail = function(req, res){
	var mailgun = new Mailgun({apiKey: api_key, domain: domain});

	var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: req.body.email,
    //Subject and text data  
      subject: req.body.subject,
      html: req.body.msg
    };

    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            console.log("message sent by sendmail");
        }
    });

 //    var job = req.job;
 //    console.log(req);

	// job['candidates'].push(req.user.id);

	// job.save(function(err){
	// 	if (err){
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(job);
	// 	}
	// });

    console.log("subject is " + req.body.subject + "and message is " + req.body.msg);
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
	Job.findById(id).populate('user').populate('candidates').exec(function(err, job) {
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

exports.hasAcccountApproved = function(req, res, next) {
  if (req.user.accountStatus !== 'approved') {
    return res.status(403).send({
      message: 'Your account is pending approval'
    });
  }
  next();
};