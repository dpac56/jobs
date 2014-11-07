Work done/ steps taken/ lessons learnt
1. This is a fully working CRUD module on its own with an authentication system built in. We know that there is already a 'role' field by looking at the schema in app/models/user.server.model.js
2. In public/modules/users/views/authentication/singup.client.view.html we started finding stuff to change for role based authentication. Added anothe form element tied with ng-model = credentials.role
3. This view used AuthenticationController which is in public/modules/users/controllers
4. The signup() function which the form is calling in the view is posting to express route 'auth/signup' with the whole credentials object. We added the role to this objects explicitly (though it could already have been there)
5. We can find the above express route in app/routes/users where this route has a post to users.signup. users is module imported by 'require' at the top and can be found in app/controllers/users
6. In the above 'authentication' module we find what we were looking for - the signup function which is creating a new user from the defined User Schema
7. S0, now we can add a role field to the User Schema in the Signup function in 6 above
8. In jobs.server.controller we added a new function 'hasRoleAuthorization' - this basically returns true if the role is admin
9. To check for the role checking functionality, we added a 'hasRoleAuthorization' field in post function in jobs.server.routes. As expected, only for the accounts that have admin functionality is the the job post function now working. 
10. Express routes without the hash bang would simply show the JSON object being returned
11. There is a mixed data type that can be used in schema, then try to iterate over that field in the view rather than hard coding fields in the schema
12. jobs.server.controller had a jobById function that was limiting what was being sent in the user item, by removing the limit we can send the complete user object
**Some steps may be missing
13. Send email functionality: Add a form in view-job.view with a function sendMail() that call a express route in jobs.server.routes ('/sendmail') that calls an export.sendmail function in jobs.server.controller. The mailgun configuration is also happening in the same file at the moment. [The email is being sent twice at the moment]
14. Set up a LinkedIn app and configure the credentials in config/env/development.js
15. In linkedin.js you can add more profile fields by changing the array profileFields
16. Add candidates to a job - we first create a route in job.server.routes to which a post request is being done. Add a new candidate field in the job schema that has ObjectId schema and a ref user. We also add a different authorization for this function. 
17. The request is being given the job object by the jobById function that comes into being anytime the route has a jobId parameter
18. A cross referenced schema can be populated by the mongoose function .populate [for example there can be an array of ObjectIds that have a reference of some other schema] - This function can also specify what to return
19. We also added a manual approval field in the Job schema 'accountStatus'
20. $resource has some default methods .query expects an array and .get expects an object from the API end point
21. All authentications are done server side in route functions - so even if someone is not authroized, the client side template will still be rendered
22. Adding new items in the menu will require editing the jobs.client.config file









--------------------------------------------
Iteration 1:
- Get role based authentication working so that only the employers can post jobs
---This is working in the sense that employers (role 'admin') can only post jobs ('jobs')
---Also look at the enum function in role in schema

Iteration 2: [Create a new branch]
- Make complete employer profiles
--- Rename all files from jobs to jobs
--- Mash replace in sublime text Jobs -> Jobs & jobs -> jobs
--- Try to not make different schemas for candidate and employer, instead use a mixed schema ie. a profile field in the user that has all the fields required for both but takes in & displays only the role relevant ones.  

Iteration 3: 
- Complete single job listing page
--- Make sure that only the relevant user fields are being sent along with the job object (not the sensitive ones)
--- Figure out the file upload directive and the relation with mongoose































---------------------------------------------------------------------------
[![MEAN.JS Logo](http://meanjs.org/img/logo-small.png)](http://meanjs.org/)

[![Build Status](https://travis-ci.org/meanjs/mean.svg?branch=master)](https://travis-ci.org/meanjs/mean)
[![Dependencies Status](https://david-dm.org/meanjs/mean.svg)](https://david-dm.org/meanjs/mean)

MEAN.JS is a full-stack JavaScript open-source solution, which provides a solid starting point for [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. The idea is to solve the common issues with connecting those frameworks, build a robust framework to support daily development needs, and help developers use better practices while working with popular JavaScript components. 

## Before You Begin 
Before you begin we recommend you read about the basic building blocks that assemble a MEAN.JS application: 
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), particularly [The Express Guide](http://expressjs.com/guide.html); you can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.


## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [Github Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

## Downloading MEAN.JS
There are several ways you can get the MEAN.JS boilerplate: 

### Yo Generator 
The recommended way would be to use the [Official Yo Generator](http://meanjs.org/generator.html) which will generate the latest stable copy of the MEAN.JS boilerplate and supplies multiple sub-generators to ease your daily development cycles.

### Cloning The GitHub Repository
You can also use Git to directly clone the MEAN.JS repository:
```
$ git clone https://github.com/meanjs/mean.git meanjs
```
This will clone the latest version of the MEAN.JS repository to a **meanjs** folder.

### Downloading The Repository Zip File
Another way to use the MEAN.JS boilerplate is to download a zip copy from the [master branch on github](https://github.com/meanjs/mean/archive/master.zip). You can also do this using `wget` command:
```
$ wget https://github.com/meanjs/mean/archive/master.zip -O meanjs.zip; unzip meanjs.zip; rm meanjs.zip
```
Don't forget to rename **mean-master** after your project name.

## Quick Install
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting to develop you MEAN application.

The first thing you should do is install the Node.js dependencies. The boilerplate comes pre-bundled with a package.json file that contains the list of modules you need to start your application, to learn more about the modules installed visit the NPM & Package.json section.

To install Node.js dependencies you're going to use npm again, in the application folder run this in the command-line:

```
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower installcommand to install all the front-end modules needed for the application

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! your application should be running by now, to proceed with your development check the other sections in this documentation. 
If you encounter any problem try the Troubleshooting section.

## Development and deployment With Docker

* Install [Docker](http://www.docker.com/)
* Install [Fig](https://github.com/orchardup/fig)

* Local development and testing with fig: 
```bash
$ fig up
```

* Local development and testing with just Docker:
```bash
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
$
```

* To enable live reload forward 35729 port and mount /app and /public as volumes:
```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspa/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
```

## Getting Started With MEAN.JS
You have your application running but there are a lot of stuff to understand, we recommend you'll go over the [Offical Documentation](http://meanjs.org/docs.html). 
In the docs we'll try to explain both general concepts of MEAN components and give you some guidelines to help you improve your development procees. We tried covering as many aspects as possible, and will keep update it by your request, you can also help us develop the documentation better by checking out the *gh-pages* branch of this repository.

## Community
* Use to [Offical Website](http://meanjs.org) to learn about changes and the roadmap.
* Join #meanjs on freenode.
* Discuss it in the new [Google Group](https://groups.google.com/d/forum/meanjs)
* Ping us on [Twitter](http://twitter.com/meanjsorg) and [Facebook](http://facebook.com/meanjs)

## Live Example
Browse the live MEAN.JS example on [http://meanjs.herokuapp.com](http://meanjs.herokuapp.com).

## Credits
Inspired by the great work of [Madhusudhan Srinivasa](https://github.com/madhums/)
The MEAN name was coined by [Valeri Karpov](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and)

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
