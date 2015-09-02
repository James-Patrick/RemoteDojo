/* Copyright (c) 2015 Paul McKay
 * 
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT license.  If the license does not accompany this file, 
 * download it from:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

var Registry = function () {
    
    var database = null;
    
    var error = null;
    
    this.getCollection = function(name) {
        return database.collection(name);
    }

    this.getDatabase = function() {
        return database;
    }
    
    this.getError = function() {
        return error;
    }

    this.setDatabase = function(value) {
        database = value;
    }
    
    this.setError = function(value) {
        error = value
    }
    
    if (Registry.caller != Registry.getInstance) {
        throw new Error('')
    }
}

Registry.instance = null;

Registry.getInstance = function() {
    if (this.instance == null) {
        this.instance = new Registry();
    }
    return this.instance;
}

module.exports = Registry.getInstance();
