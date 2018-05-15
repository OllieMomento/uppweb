//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Project = require('../model/projects')
var People = require('../model/people')

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

var mongoDB = 'mongodb://OllieMomento:a123456@ds211289.mlab.com:11289/upp';
mongoose.connect(mongoDB, { useMongoClient: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

router.get('/', function (req, res) {
    res.json({ message: 'API Initialized!' });
});

//adding the /projects route to our /api router
router.route('/projects')
    //retrieve all comments from the database
    .get(function (req, res) {
        //looks at our Comment Schema
        Project.find(function (err, projects) {
            if (err)
                res.send(err);
            //responds with a json object of our database projects.
            res.json(projects)
        });
    })
    //post new comment to the database
    .post(function (req, res) {
        var project = new Project();
        //body parser lets us use the req.body
        project.name = req.body.name;
        project.desc = req.body.desc;
        project.start = req.body.start;
        project.end = req.body.end;
        project.image = req.body.image;
        project.status = req.body.status;
        project.path = req.body.path;
        project.artists = req.body.artists;
        project.supervisor = req.body.supervisor;
        project.comments = req.body.comments;
        project.xml = req.body.xml;
        project.seq = req.body.seq;
        project.shots = req.body.shots
        project.assetsXML = req.body.assetsXML
        project.assets = req.body.assets


        project.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Project successfully added!' });
        });
    });

router.route('/projects/:project_id')
    .get(function (req, res) {
        //looks at our Comment Schema
        //res.send(req.params.project_id)
        Project.findById(req.params.project_id, function (err, project) {
            if (err)
                res.send(err);
            //responds with a json object of our database projects.
            res.json(project)
        });
    })

    //The put method gives us the chance to update our project based on the ID passed to the route
    .put(function (req, res) {
        Project.findById(req.params.project_id, function (err, project) {
            if (err)
                res.send(err);
            //setting the new author and text to whatever was changed. If nothing was changed
            // we will not alter the field.
            (req.body.name) ? project.name = req.body.name : null;
            (req.body.desc) ? project.desc = req.body.desc : null;
            (req.body.start) ? project.start = req.body.start : null;
            (req.body.end) ? project.end = req.body.end : null;
            (req.body.image) ? project.image = req.body.image : null;
            (req.body.status) ? project.status = req.body.status : null;
            (req.body.path) ? project.path = req.body.path : null;
            (req.body.artists) ? project.artists = req.body.artists : null;
            (req.body.supervisor) ? project.supervisor = req.body.supervisor : null;
            (req.body.comments) ? project.comments = req.body.comments : null;
            (req.body.xml) ? project.xml = req.body.xml : null;
            (req.body.seq) ? project.seq = req.body.seq : null;
            (req.body.shots) ? project.shots = req.body.shots : null;
            (req.body.assetsXML) ? project.assetsXML = req.body.assetsXML : null;
            (req.body.assets) ? project.assets = req.body.assets : null;

            //save project
            project.save(function (err) {
                if (err)
                    res.send(err);
                res.json({ mesasage: 'Project has been updated' });
            });
        });
    })
    //delete method for removing a comment from our database
    .delete(function (req, res) {
        //selects the comment by its ID, then removes it.
        Project.remove({ _id: req.params.project_id }, function (err, project) {
            if (err)
                res.send(err);
            res.json({ message: 'Project has been deleted' })
        })
    });

//adding the /people route to our /api router
router.route('/people')
    //retrieve all comments from the database
    .get(function (req, res) {
        //looks at our Comment Schema
        People.find(function (err, people) {
            if (err)
                res.send(err);
            //responds with a json object of our database people.
            res.json(people)
        });
    })
    .post(function (req, res) {
        var people = new People();
        //body parser lets us use the req.body
        people.name = req.body.name;
        people.artist = req.body.artist;
        people.supervisor = req.body.supervisor;
        people.projects = req.body.projects
        people.sequence = req.body.sequence
        people.assets = req.body.assets


        people.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'People successfully added!' });
        });
    });

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function () {
    console.log(`api running on port ${port}`);
});