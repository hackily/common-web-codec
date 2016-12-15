const codecJwt = function(isEncode){
	if(isEncode){
		console.log("encode");
	}
	if(!isEncode){
		console.log("decode");
	}
}
const codecBase64 = function(){
}
const codecHex = function(){
}
const codecHtml = function(){
}
const codecBinary = function(){
}

exports.format = {
		"JWT": codecJwt,
		"BASE64": codecBase64,
		"HEX": codecHex,
		"HTML": codecHtml,
		"BINARY": codecBinary
};

