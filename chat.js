var chatWindow = document.getElementById("chatWindow");
var message = document.getElementById("message");
var chatForm = document.getElementById("chatForm");
var submit = document.getElementById("submit");
var user_type = document.getElementById("user_type");

var testcept = function() {
	return 2;
}

submit.onclick = function() {
	if($(user_type).text()=="Mentor")
	{
		socket.emit('pm', {message: $(message).val(), name: getParameterByName('user'),url:"/img/mentor.png"});
		var msg=$(message).val();
		var img = "<img style='width:15%;;' src='/img/mentor.png'>";
		if(msg.length>0){
		var input = "<p>"+img+""+$(message).val() +"</p>";
		$(chatWindow).append(input);
		$(message).val('');
		chatWindow.scrollTop = chatWindow.scrollHeight;
		return false;
		} else {
			alert("Input can not be empty!");
		}
	}
	if($(user_type).text()=="Ninja")
	{
		socket.emit('pm', {message: $(message).val(), name: getParameterByName('user'),url:"/img/ninja.png"});
		var msg=$(message).val();
		var img = "<img style='width:15%;;' src='/img/ninja.png'>";
		if(msg.length>0){
		var input = "<p>"+img+""+$(message).val() +"</p>";
		$(chatWindow).append(input);
		$(message).val('');
		chatWindow.scrollTop = chatWindow.scrollHeight;
		return false;
		} else {
			alert("Input can not be empty!");
		}
		
	}
}
$(chatForm).submit(submit.onclick);
socket.on('pm', function(data) {
	var img = "<img style='width:15%;' src='"+data.url+"'>";
	var input = "<p>"+img+"" + data.message + "</p>";
	$(chatWindow).append(input);
	chatWindow.scrollTop = chatWindow.scrollHeight;
});
