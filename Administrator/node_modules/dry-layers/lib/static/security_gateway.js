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
