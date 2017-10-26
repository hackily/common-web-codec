const codecs = require('./codec');
const config = require('./appConfig');
const logger = require('./logger');


let selectedCodec = null;
let codecDirection = true;
let inputTimeDelay = config.inputTimer;
let timeOut = null;
let encode = null;
let decode = null;
let codecDirectionButton = null;
let codecCache = {};
let encodeTypeLabel = null;
let decodeTypeLabel = null;


module.exports.setupForm = function(en, de, button, encodeType, decodeType){

	encode = en;
	decode = de;
	codecDirectionButton = button;
	encodeTypeLabel = encodeType;
	decodeTypeLabel = decodeType;
	selectedCodec = document.getElementsByClassName('active')[0].value;
	encode.parentNode.parentNode.addEventListener('input', trackTyping);
}

module.exports.generateCodecOptionButtons = function(target){
		for(const obj in codecs.format){
			let node = document.createElement("input");
			node.className = "button-primary codec-button";
			node.value = obj;
			node.type="button";
			target.appendChild(node)
		}
		let translateNode = document.createElement('input');
		translateNode.className = "button-primary u-pull-right"
		translateNode.value = "Translate";
		translateNode.id = "codec-translate";
		translateNode.type = "button";
		target.appendChild(translateNode);
		target.firstChild.classList.add('active');
		//Add one eventlistener for the entire form
		target.parentNode.addEventListener("click", activateButton);
	}

	const activateButton = (event) => {
		logger.clear();
		if(event.target.classList.contains('codec-button')){
			codecCache[selectedCodec+'encode'] = encode.value;
			codecCache[selectedCodec+'decode'] = decode.value;
			encode.value = codecCache[event.target.value+'encode'] === undefined ? '' : codecCache[event.target.value+'encode'];
			decode.value = codecCache[event.target.value+'encode'] === undefined ? '' : codecCache[event.target.value+'decode'];
			resizeTextArea();

			removeActiveClassFromChildren(event.target.parentNode);
			event.target.classList.add('active');
			selectedCodec = event.target.value;
			encodeTypeLabel.textContent = codecs.format[selectedCodec].encode;
			decodeTypeLabel.textContent = codecs.format[selectedCodec].decode;



		}
		if(event.target.id === 'codec-translate'){
			runCodec(false);
		}
		if(event.target.id === 'codec-direction' || event.target.parentNode.id === 'codec-direction'){
			reverseCodecDirection(event.target);
		}
	}



	const removeActiveClassFromChildren = function(target){
		const activeElements = target.getElementsByClassName("active");
		for(const el of activeElements){
			el.classList.remove('active');
		}
	}

	const reverseCodecDirection = function(element){
		logger.clear();
		codecDirection = !codecDirection;
		updateCodecDirection();
	}
	const updateCodecDirection = function(){
		codecDirectionButton.getElementsByTagName('div')[0].style = codecDirection ? 'transform: rotate(0deg); transition: transform 500ms ease;' : 'transform: rotate(180deg); transition: transform 500ms ease;';
	}

	const runCodec = function(userInitiated){
		if(userInitiated && !codecs.format[selectedCodec]){
			logError("You must select a codec to use!");
			return;
		}
		codecs.format[selectedCodec].fn(codecDirection);
		resizeTextArea();
		
	};



	const trackTyping = function(event){
		//If the directionality does not match with the textarea that just received an input, switch the direction.
		if((codecDirection === true && event.target === decode) || (codecDirection === false && event.target === encode)) {
			reverseCodecDirection();
		}
		
		//Delay is customizable in appConfig.json
		clearTimeout(timeOut);
		timeOut = setTimeout(function(){
			runCodec(false);
			resizeTextArea();

		}, inputTimeDelay)
	}

	const resizeTextArea = function(){
		encode.style.height = 0;
		decode.style.height = 0;

		let eHeight = encode.scrollHeight;
		let dHeight = decode.scrollHeight;
		encode.setAttribute('style','height:'+eHeight+'px');
		decode.setAttribute('style','height:'+dHeight+'px');
	}