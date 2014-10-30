'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	jobs = require('../../app/controllers/jobs');

module.exports = function(app) {
	// Job Routes
	app.route('/jobs')
		.get(jobs.list)
		.post(users.requiresLogin, jobs.hasRoleAuthorization, jobs.create);

	app.route('/jobs/:jobId/candidates')
		.get(jobs.readCandidates)
		.post(users.requiresLogin, jobs.hasCandidateAuthorization, jobs.addCandidate);

	app.route('/jobs/:jobId')
		.get(jobs.read)
		.put(users.requiresLogin, jobs.hasAuthorization, jobs.update)
		.delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);

	app.route('/sendmail')
		.post(jobs.sendMail);

	// Finish by binding the job middleware
	app.param('jobId', jobs.jobByID);
};