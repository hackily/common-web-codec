	let messageDiv = null;
	module.exports.configure = function(div){
		messageDiv = div;
	}

	module.exports.error = function(message){
		messageDiv.textContent = message;
		console.error(message);
	}

	module.exports.info = function(message){
		messageDiv.textContent = message;
	}

	module.exports.clear = function(){
		messageDiv.textContent = '\xa0';
	}