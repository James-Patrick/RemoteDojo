/* Copyright (c) 2015 Paul McKay
 * 
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT license.  If the license does not accompany this file, 
 * download it from:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

var jade = require('jade');
var path = require('path');

var Renderer = function () {
    
    this.render = function (view, locals) {
        var template = jade.compileFile(path.join(__dirname, view));
        html = template(locals);
        return html;
    }
        
    if (Renderer.caller != Renderer.getInstance) {
        throw new Error('')
    }
}

Renderer.instance = null;

Renderer.getInstance = function () {
    if (this.instance == null) {
        this.instance = new Renderer();
    }
    return this.instance;
}

module.exports = Renderer.getInstance();
