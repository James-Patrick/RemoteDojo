$(document).ready(function(){

	var validator = $("#login-form").validate({
		rules:{
			register_name  		: 	{required:true , minlength:5,digits:false},
			register_email 		: 	{required:true , email:true},
			register_contact 	: 	{required:true , digits:true, minlength: 10},
			register_usertype 	: 	{required:true},
			register_password 	: 	{required:true, minlength:8},
			register_c_password :  	{required:true, minlength:8,equalTo:"#register_password"}
		},
		messages:{
			register_name  		: 	{required:"<div style='color:red;font-size:12px'>Name is required field.</div>" , minlength:"<div style='color:red;font-size:12px'>Name should have minimum 5 characters.</div>",digits :"<div style='color:red;font-size:12px'>Name cannot contain numbers.</div>"},
			register_email 		: 	{required:"<div style='color:red;font-size:12px'>Email is required field.</div>" , email:"<div style='color:red;font-size:12px'>Please provide a valid email-id.</div>"},
			register_contact 	: 	{required:"<div style='color:red;font-size:12px'>Contact number is a required field</div>" , digits:"<div style='color:red;font-size:12px'>Please enter only numbers.</div>", minlength: "<div style='color:red;font-size:12px'>Contact number should have minimum 10 characters.</div>"},
			register_usertype 	: 	{required:"<div style='color:red;font-size:12px'>User Type is a required field.</div>"},
			register_password 	: 	{required:"<div style='color:red;font-size:12px'>Password is a required field</div>", minlength:"<div style='color:red;font-size:12px'>Password should have atleast 8 characters.</div>"},
			register_c_password :  	{required:"<div style='color:red;font-size:12px'>Confirm Password is a required field</div>", minlength:"<div style='color:red;font-size:12px'>Confirm Password should have atleast 8 characters.</div>",equalTo:"<div style='color:red;font-size:10px'>Password and Confirm PAssword donot match.</div>"}
		}
	});

	$("#register_reset").on('click',function(){
		$("#login-form")[0].reset();
	});
});
