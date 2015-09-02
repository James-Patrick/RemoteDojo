/* Copyright (c) 2015 Paul McKay
 *
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT License.  If a copy of the license was not distributed 
 * with this file, you can get one at:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

function DataGateway(type) {
    
    var that = {};
        
    that.get = function () {
        var callback = arguments[arguments.length - 1];
        switch (arguments.length) {         
            case 1:
                $.ajax({
                    dataType: 'json',
                    error: function (jqXHR, textStatus, errorThrown) {
                        callback(errorThrown, null);
                    },
                    success: function (data, textStatus, jqXHR) {
                        callback(null, data);
                    },
                    type: 'GET',
                    url: url
                });
                break;
            case 2:
                _id = arguments[0];
                $.ajax({
                    dataType: 'json',
                    error: function (jqXHR, textStatus, errorThrown) {
                        callback(errorThrown, null);
                    },
                    success: function (data, textStatus, jqXHR) {
                        callback(null, data);
                    },
                    type: 'GET',
                    url: url + _id
                });
                break;
            default:
                break;
        }
    }
     
    that.insert = function (data, callback) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
                callback(errorThrown, null);
            },
            success: function (data, textStatus, jqXHR) {
                callback(null, data);
            },
            type: 'POST',
            url: url
        });
    }
    
    that.remove = function (id, callback) {
        $.ajax({
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
                callback(errorThrown, null);
            },
            success: function (data, textStatus, jqXHR) {
                callback(null, data);
            },
            type: 'DELETE',
            url: url + id
        });
    }
        
    that.update = function (id, data, callback) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
                callback(errorThrown, null);
            },
            success: function (data, textStatus, jqXHR) {
                callback(null, data);
            },
            type: 'PUT',
            url: url + id
        });
    }

    var url = '/' + type + 's/';

    return that;

}
