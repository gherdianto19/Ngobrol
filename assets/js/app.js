/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect('http://192.168.1.5:1337');
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {
    log('Socket connected');
    // Listen for Comet messages from Sails

	socket.get('/main/chatinit',null, function (response) {
		log(response);
		if(response.success==true){
			appendinit('<strong>gerry :</strong> Welcome to ngobrol..');
			for(i=0;i<response.data.length;i++){
				appendchat('<strong>'+response.data[i].username+' :</strong> '+response.data[i].chat_text);
			}
		}
	});

	socket.on('message', function messageReceived(response) {

	///////////////////////////////////////////////////////////
	// Replace the following with your own custom logic
	// to run when a new message arrives from the Sails.js
	// server.
	///////////////////////////////////////////////////////////
		appendchat('<strong>'+response.data.username+' :</strong> '+response.data.message);
		$('#btnchat').focus();
		log(response);
	//////////////////////////////////////////////////////

	});

    ///////////////////////////////////////////////////////////
	$(function(){
		//Registrasi
		$('#reg button').click(function(){
			var us = $('#reg input[name=username]').val();
			var pw = $('#reg input[name=password]').val();
			var cw = $('#reg input[name=confirmpassword]').val();
			socket.get('/register',{
				username: us,
				password: pw,
				confirmpassword: cw
			}, function (response) {
				log(response);
				if(response.success==true){
					successbox(response.message);
				}else{
					alertbox(response.error);
				}
			});
		});

		$('#login button').click(function(){
			var us = $('#login input[name=username]').val();
			var pw = $('#login input[name=password]').val();
			socket.get('/login',{
				username: us,
				password: pw
			}, function (response) {
				log(response);
				if(response.success==true){
					successbox(response.message);
					document.location.href = '/';
				}else{
					alertbox(response.error);
				}
			});
		});

		//Chatting
		$('#btnchat').click(function(){
			var ct = $('#formchat input[name=chat_text]').val();
			socket.get('/main/chat',{
				chat_text: ct
			}, function (response) {
				//log(response);
				if(response.success==true){
					//appendchat('<strong>'+response.username+' :</strong> '+response.message);
				}else{
					alertbox('<strong>error code :'+response.code+'</strong>, '+response.error);
				}
			});
			$('#formchat input[name=chat_text]').val('');
		});

		$('#msg').click(function(){
			$("#msg").empty();
			$("#msg").css('margin-top', '0px');
		});
		$('.welcome').click(function(){
			$(".welcome").remove();
		});
	});

	function appendchat(msgs){
		$("#chatcontainer").append('<div class="alert alert-info chat">'+msgs+'</div>');
	}

	function appendinit(msgs){
		$("#chatcontainer").append('<div class="alert alert-success chat">'+msgs+'</div>');
	}

	function alertbox(msgs){
		$("#msg").empty().append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+msgs+'</div>');
		$("#msg").css('margin-top', '5%');
	}

	function successbox(msgs){
		$("#msg").empty().append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+msgs+'</div>');
		$("#msg").css('margin-top', '5%');
	}
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);
