'use strict';
const express = require('express');
const app = express();
var request = require("request");
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'heri@heri.co',
        pass: '##############'
    }
});

let mailOptions = {
	from: null,
	to: null,
	subject: null,
	text: null,
	html: null
}

app.get('/', function (req, res) {
  res.send("Welcome to our SMS to Email App");
});

app.get('/sendmail/', function(req, res){

	let sms = {
			number: req.query.sender,
			message: decodeURIComponent(req.query.message)
	}

	var email = sms.message.split("#"); // creates an array with the params


	if(email[0] == ":email"){
		mailOptions = {
			from: '"Cool SMSC 😎" <heri@heri.co>',
			to: email[1], // Sender or senders saved in the array
			subject: 'Mail from Phone Number: ' + sms.number, // Subject line
			text: email[2], // plain text body
			html: '<p>' + email[2] + '</p>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {

				var error_message = "There has been an error into sending your email";

				// Inform the the email did not go SMS
				request("http://localhost:13131/cgi-bin/sendsms?username=root&password=sms&to=" + sms.number + "&text=" + error_message + "&smsc=smsc0&mclass=0",
					function(error, response, body) {
					  console.log(body);
					});
				//return console.log(error);
				return console.log("Couldn't sent the email, there has been an error!");
			}

			// Inform the User that the email has been sent SMS
				var success_message = "Your email has been successfully sent to: " + email[1] + "\nThank you for using the service";

				// Inform the the email did not go SMS
				request("http://localhost:13131/cgi-bin/sendsms?username=root&password=sms&to=" + sms.number + "&text=" + success_message + "&smsc=smsc0",
					function(error, response, body) {
					  console.log(body);
					});

			//console.log('Message %s sent: %s', info.messageId, info.response);
			console.log('# ' + sms.number + '\n \tMessage: ' + email[2]+ '\n \tTo: ' + email[1] + '\n=========================\n');
		});

	}else{
			// Inform the user that the format is not right
			var error_message = "You entered wrong foramt for the service. Try again!";
			console.log(error_message);
			// Inform the the email did not go SMS
			request("http://localhost:13131/cgi-bin/sendsms?username=root&password=sms&to=" + sms.number + "&text=" + error_message + "&smsc=smsc0&mclass=0",
				function(error, response, body) {
				  console.log(body);
				});
	}


});



app.listen(3000, function () {
  console.log('SMS-EMAIL app running on listening on port 3000!\n--------------\n');
});



