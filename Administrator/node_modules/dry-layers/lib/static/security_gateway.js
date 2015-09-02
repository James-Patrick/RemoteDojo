/* Copyright (c) 2015 Paul McKay
 *
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT License.  If a copy of the license was not distributed 
 * with this file, you can get one at:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

function SecurityGateway() {
    
    var that = {};

    that.signIn = function (username, password, callback) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
                callback(errorThrown, null);
            },
            success: function (data, textStatus, jqXHR) {
                callback(null, data);
            },
            type: 'POST',
            url: '/sign_in'
        });
    }
    
    that.signOut = function (callback) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            data: {},
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
                callback(errorThrown, null);
            },
            success: function (data, textStatus, jqXHR) {
                callback(null, data);
            },
            type: 'POST',
            url: '/sign_out'
        });
    }
      
    return that;

}
