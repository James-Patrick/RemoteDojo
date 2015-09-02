/* Copyright (c) 2015 Paul McKay
 * 
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT license.  If the license does not accompany this file, 
 * download it from:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

var express = require('express');
var mongodb = require('mongodb');

var Registry = require('./registry.js');
var ObjectID = mongodb.ObjectID;

var DataService = function () {
    
    this.createRouter = function (collectionName) {
        
        var router = express.Router();

        router.delete('/:id', function (req, res) {
            var collection = Registry.getCollection(collectionName);
            collection.remove({ _id : req.params.id }, function (err, doc) {
                if (err) {
                    res.status(500).json({ error : err })
                    return;
                }
                res.json({});
            });
        });
        
        router.get('/', function (req, res) {
            var collection = Registry.getCollection(collectionName);
            collection.find().toArray(function (err, doc) {
                if (err) {
                    res.status(500).json({ error : err })
                    return;
                }
                res.json(doc);
            });
        });
        
        router.get('/:id', function (req, res) {
            var collection = Registry.getCollection(collectionName);
            collection.findOne({ _id : req.params.id }, function (err, doc) {
                if (err) {
                    res.status(500).json({ error : err })
                    return;
                }
                res.json(doc);
            });
        });
        
        router.post('/', function (req, res) {
            var collection = Registry.getCollection(collectionName);
            req.body._id = (new ObjectID()).toString();
            console.log(JSON.stringify(req.body));
            collection.insertOne(req.body, function (err, result) {
                if (err) {
                    res.status(500).json({ error : err })
                    return;
                }
                res.json({});
            });
        });
        
        router.put('/:id', function (req, res) {
            var collection = Registry.getCollection(collectionName);
            collection.replaceOne({ _id : req.params.id }, req.body, function (err, result) {
                if (err) {
                    res.status(500).json({ error : err })
                    return;
                }
                res.json({});
            });
        });

        return router;
    }

    if (DataService.caller != DataService.getInstance) {
        throw new Error('')
    }
}

DataService.instance = null;

DataService.getInstance = function () {
    if (this.instance == null) {
        this.instance = new DataService();
    }
    return this.instance;
}

module.exports = DataService.getInstance();

