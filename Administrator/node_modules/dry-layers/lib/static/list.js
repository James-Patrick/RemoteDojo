/* Copyright (c) 2015 Paul McKay
 *
 * This file is part of the 'dry-layers' package for Node.js and is subject to
 * the terms of the MIT License.  If a copy of the license was not distributed 
 * with this file, you can get one at:
 * https://raw.githubusercontent.com/pmckay/dry-layers/master/LICENSE. 
 */

function List(type, dialog) {
    
    var that = {};

    var data_gateway = DataGateway(type);
    
    that.getItemText = function (data) {
        return data._id;
    }
    
    that.id = '#' + type + '-list'; 
       
    that.load = function () {
        data_gateway.get(function (err, data) {
            var items = [];
            $.each(data, function (i, data) {
                var item = $('<button/>').addClass('list-group-item').attr({
                    type: 'button', 
                    name: 'get', 
                    value: data._id
                });
                item.text(that.getItemText(data));
                item.click(function () {
                    var _id = $(this).val();
                    dialog.load(function () {
                        data_gateway.get(_id, function (err, data) {
                            dialog.setData(data);
                            dialog.modal(function (result) {
                                switch (result) {
                                    case 'remove':
                                        data_gateway.remove(_id, function () {
                                            that.load();
                                        });
                                        break;
                                    case 'ok':
                                        data = dialog.getData();
                                        that.validate(data, function () {
                                            if (err) {
                                               ; 
                                            }
                                            data_gateway.update(_id, data, function (err, data) {
                                                that.load();
                                            });
                                        });
                                        break;
                                    default:
                                        break;
                                }
                            });
                        });
                    });
                });
                items.push(item);
            });
            $(that.id + '-items').empty().append(items);
        });
    }
    
    that.validate = function (data, callback) {
        callback(null, data);
    }
            
    $(that.id + ' ' + 'button[name="add"]').click(function () {
        dialog.load(function () {
            dialog.resetData();
            dialog.modal(function (result) {
                if (result == 'ok') {
                    data = dialog.getData();
                    that.validate(data, function (err, data) {
                        if (err) {
                            ;
                        }
                        data_gateway.insert(data, function () {
                            that.load();
                        });
                    });
                }
            });
        });
    });
    
    that.load();

    return that;

}

