/* Copyright (c) 2015 Paul McKay
 * 
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT license.  If the license does not accompany this file, 
 * download it from:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

var express = require('express');
var path = require('path');

module.exports = {

    DataService : require('./data_service.js'),
    
    Registry : require('./registry.js'),
    
    Renderer : require('./renderer.js'),

    SecurityService : require('./security_service.js'),
    
    StaticService : require('./static_service.js')

}
