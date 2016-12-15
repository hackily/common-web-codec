const jwt = require('jsonwebtoken');

let encodedInput, decodedInput;

document.addEventListener("DOMContentLoaded", function(){
encodedInput = document.getElementById('encode');
decodedInput = document.getElementById('decode');
});

const translateJwt = function(isEncode){
	const input = isEncode ? encodedInput.value : decodedInput.value;
	const output = isEncode ? decodedInput : encodedInput;
	const payload = isEncode ? jwt.sign(input, "shh") : jwt.decode(input);
	output.value = typeof payload === "object" ? JSON.stringify(payload, null, 2) : payload;

}
const translateBase64 = function(isEncode){
		if(isEncode){
		console.log("encode 64");
	}
	if(!isEncode){
		console.log("decode 64");
	}
}
const translateHex = function(isEncode){
		if(isEncode){
		console.log("encode hex");
	}
	if(!isEncode){
		console.log("decode h");
	}
}
const translateHtml = function(isEncode){
		if(isEncode){
		console.log("encode htm");
	}
	if(!isEncode){
		console.log("decode html");
	}
}
const translateBinary = function(isEncode){
		if(isEncode){
		console.log("encode bin");
	}
	if(!isEncode){
		console.log("decode bin");
	}
}

exports.format = {
		"JWT": translateJwt,
		"BASE64": translateBase64,
		"HEX": translateHex,
		"HTML": translateHtml,
		"BINARY": translateBinary
};

