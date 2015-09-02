/* Copyright (c) 2015 Paul McKay
 * 
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT license.  If the license does not accompany this file, 
 * download it from:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

var express = require('express');
var path = require('path');

var StaticService = function () {
    
    this.createRouter = function (collectionName) {
        
        var router = express.Router();
        
        router.get('/data_gateway.js', function (req, res) {
            res.sendFile('data_gateway.js', {
                root : path.join(__dirname, 'static')
            });
        });
        
        router.get('/dialog.js', function (req, res) {
            res.sendFile('dialog.js', {
                root : path.join(__dirname, 'static')
            });
        });
        
        router.get('/list.js', function (req, res) {
            res.sendFile('list.js', {
                root : path.join(__dirname, 'static')
            });
        });
                
        router.get('/security_gateway.js', function (req, res) {
            res.sendFile('security_gateway.js', {
                root : path.join(__dirname, 'static')
            });
        });

        return router;
    }

    if (StaticService.caller != StaticService.getInstance) {
        throw new Error('')
    }
}

StaticService.instance = null;

StaticService.getInstance = function () {
    if (this.instance == null) {
        this.instance = new StaticService();
    }
    return this.instance;
}

module.exports = StaticService.getInstance();
