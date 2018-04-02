//model/projects.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var ProjectsSchema = new Schema({
    name: String,

    desc: String,
    start: Date,
    end: Date,
    image: Buffer,
    status: String,
    path: String,
    artists: [String],
    supervisor: String,
    comments: [{
        author: String,
        date: String,
        text: String,
        id: Number
    }],
    xml: String,
    seq: [{
        id: Number,
        name: String,
        nodes: [Number],
        edge: [{
            source: Number,
            target: Number
        }]
    }],
    shots: [{
        id: Number,
        name: String,
        desc: String,
        comments: [{
            author: String,
            date: String,
            text: String,
            id: Number
        }],
        artists: [String],
        supervisor: String,
        status: String

    }],
    assetsXML: String
});

//export our module to use in server.js
module.exports = mongoose.model('Project', ProjectsSchema);