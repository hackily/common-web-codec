const jwt = require('jsonwebtoken');
const lz = require('lzutf8');
const logger = require('./logger');


let encodedInput, decodedInput;
var base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0;var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);var c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


let AsciiToBin={toAscii:function(a){return a.replace(/\s*[01]{8}\s*/g,function(a){return String.fromCharCode(parseInt(a,2))})},toBinary:function(a,b){return a.replace(/[\s\S]/g,function(a){a=AsciiToBin.zeroPad(a.charCodeAt().toString(2));return!1==b?a:a+" "})},zeroPad:function(a){return"00000000".slice(String(a).length)+a}};



let input = null;
let output = null;
let isEncode = null;
let encode = null;
let decode = null;

module.exports.setup = function(encodeDiv, decodeDiv){
	encode = encodeDiv;
	decode = decodeDiv;
}

const mapIO = function(isEncode){
	input = isEncode ? encode.value : decode.value;
	output = isEncode ? decode : encode;
}

const translateJwt = function(isEncode){
	mapIO(isEncode);
	if(isEncode)	logger.info("Note that produced encoded JWT will not be valid");

	let payload = isEncode ? jwt.sign(input, "shh") : jwt.decode(input);
	if(payload === null) payload = "Invalid JWT";
	
	output.value = typeof payload === "object" ? JSON.stringify(payload, null, 2) : payload;
	

}
const translateBase64 = function(isEncode){
	mapIO(isEncode);
	const payload = isEncode ? base64.encode(input) : base64.decode(input);
	output.value = payload;
}
const translateHex = function(isEncode){
	mapIO(isEncode);
	let payload = isEncode ? parseInt(input).toString(16).toUpperCase() : parseInt(input, 16);
	output.value = payload;
}
const translateUri = function(isEncode){
	mapIO(isEncode);
	const payload = isEncode ? encodeURIComponent(input) : decodeURIComponent(input);
	output.value = payload;
}
const translateBinary = function(isEncode){
	mapIO(isEncode);
	if(isEncode && !/^\d+$/.test(input) || (!isEncode && /[^0-1]/g.test(decode.value))){
		output.value = 'Invalid Input';
		return;
	}

	const payload = isEncode ? (parseInt(input) >>> 0).toString(2) : parseInt(input, 2);
	output.value = payload;
}

const translateAscii = function(isEncode){
	mapIO(isEncode);
	const payload = isEncode ? AsciiToBin.toBinary(input) : AsciiToBin.toAscii(input);
	output.value = payload;
}

const lzCompress = function(isEncode){
	mapIO(isEncode);
	if(isEncode){
		output.value = "Please wait while we compress your message.";
		lz.compressAsync(input, {'outputEncoding': 'Base64'}, function(result, error){
		if(error === undefined) output.value = result;
		if(error) output.value = 'Compression Error: ' + error.message
	})

	}
	else{
		output.value = "Please wait while we decompress your message.";
		lz.decompressAsync(input, {'inputEncoding': 'Base64'}, function(result, error){
			if(error === undefined) output.value = result;
			if(error) output.value = 'Decompression Error: ' + error.message;
			fn();
		});	
	}
}

const translateTime = function(isEncode) {
	mapIO(isEncode);
	const payload = isEncode ? new Date(input).getTime() : new Date(+input).toString();
	output.value = payload;
}

exports.format = {
		"JWT": {"encode": "payload", "decode": "JSON Web Token", "fn": translateJwt},
		"BASE64": {"encode": "text", "decode": "base64", "fn": translateBase64},
		"HEX": {"encode": "decimal", "decode": "hexadecimal", "fn":translateHex},
		"URI": {"encode": "url", "decode": "url-encoded", "fn":translateUri},
		"BINARY": {"encode": "decimal", "decode": "binary", "fn":translateBinary},
		"ASCII": {"encode": "text", "decode": "ASCII", "fn":translateAscii},
		"LZ COMPRESS": {"encode": "text", "decode": "LZ compressed string", "fn":lzCompress},
		"TIMESTAMP": {"encode": "date-time", "decode": "milliseconds since January 1, 1970", "fn":translateTime}
};

