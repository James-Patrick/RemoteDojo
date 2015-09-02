function Dialog(id) {
    
    var that = {};
       
    var getArrayName = function (name) {
        var index = name.indexOf("[]");
        if (index <= -1) {
            return null;
        }
        if (index + 2 < name.length) {
            return null;
        }
        return name.substr(0, index);
    }
    
    that.getData = function () {
        var data = {}
        $(id + ' input').each(function () {
            var arrayName = getArrayName(this.name);
            if (arrayName) {
                if (!data[arrayName]) {
                    data[arrayName] = [];
                }
                if ($(this).prop("checked")) {
                    data[arrayName].push($(this).val());
                }
            }
            else {
                data[this.name] = $(this).val();
            }
        });
        return data;
    }
    
    that.id = id;

    that.load = function (callback) {
        callback();
    }
    
    that.modal = function (handler) {
        
        var result;
        
        $(id + ' ' + 'button').click(function () {
            result = $(this).val();
        });
        
        $(id).one('hidden.bs.modal', function () {
            handler(result);
        });
        
        $(id).modal();

    }
    
    that.resetData = function (data) {
        $(id + ' input').each(function () {
            var arrayName = getArrayName(this.name);
            if (arrayName) {
                $(this).prop("checked", false);
            }
            else {
                $(this).val('');
            }
        });
    }
    
    that.setData = function (data) {
        $(id + ' input').each(function () {
            var arrayName = getArrayName(this.name);
            if (arrayName) {
                var checked = (-1 < $.inArray($(this).val(), data[arrayName]));
                $(this).prop("checked", checked);
            }
            else {
                $(this).val(data[this.name]);
            }            
        });
    }

    return that;

}

function DataDialog(type) {

    var id = '#' + type + '-dialog';
    
    that = Dialog(id);

    return that;
}

