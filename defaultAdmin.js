use coderdojo
var defaultAdmin = db.user.find({_id:'1'});
if (defaultAdmin.length() == 0)
	db.user.insert({_id : '1', 'username' : 'default', 'password' : 'secret', 'roles' : ['Administrator']});