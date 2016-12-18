const codecs = require('./codec');
const form = require('./form');
const logger = require('./logger');

document.addEventListener("DOMContentLoaded", function(){
	let inputTimer = 0;

	/*
	Bindings
	*/
	const codecButtonsDiv = document.getElementById('codec-buttons');
	const encode = document.getElementById('codec-encode');
	const decode = document.getElementById('codec-decode');
	const codecDirectionButton = document.getElementById('codec-direction');
	const codecMessage = document.getElementById('codec-message');

	logger.configure(codecMessage);
	codecs.setup(encode, decode);
	form.generateCodecOptionButtons(codecButtonsDiv);
	form.setupForm(encode, decode, codecDirectionButton);







	/*
	Event Listeners
	*/

	
})



