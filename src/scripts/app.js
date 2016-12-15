const codecs = require('./codec');

document.addEventListener("DOMContentLoaded", function(){
	let codecDirection = true;
	let selectedCodec = null;
	let inputTimer = 0;
	const codecDirectionButton = document.getElementById('codec-directionality');
	const codecButtonsDiv = document.getElementById('codec-buttons'); 

  document.getElementById("codec-directionality").addEventListener("click", function(){reverseCodecDirection(this)});
	document.getElementById("translate").addEventListener("click", function(){runCodec(true)});
	document.getElementById("encode").addEventListener("change", function(e){trackTyping(e, this)});
	document.getElementById("decode").addEventListener("change", function(e){trackTyping(e, this)});
	

	
	for(const obj in codecs.format){
		let node = document.createElement("input");
		node.className = "button-primary codec-button";
		node.value = obj;
		node.type="button"
		node.addEventListener("click", function(){activateButton(this)});
		codecButtonsDiv.appendChild(node)
	}


	const activateButton = function(target){
		const activeElements = target.parentNode.getElementsByClassName("active");
		for(const el of activeElements){
			el.classList.remove('active');
		}
		target.classList.add('active');
		selectedCodec = target.value;
		console.log(target.value);
	}
		const reverseCodecDirection = function(element){
			codecDirection = !codecDirection;
			updateCodecDirection();
	}
		const updateCodecDirection = function(){
			codecDirectionButton.textContent = codecDirection ? "->" : "<-";
		}

	const runCodec = function(userInitiated){
		if(userInitiated && !codecs.format[selectedCodec]){
			logError("You must select a codec to use!");
			return;
		}
		codecs.format[selectedCodec](codecDirection);
		
	};

 const logError = function(message){
	document.getElementById("codec-message").textContent = message;
	console.error(message);
 }

 const trackTyping = function(event, source){
	let timer = event === "paste" ? 0 : 3000;
	if(source.id === 'encode') codecDirection = true;
	if(source.id === 'decode') codecDirection = false;
	updateCodecDirection();

	 clearTimeout(inputTimer);
	 inputTimer = setTimeout(function(){
			runCodec(false);

	 }, 3000)

 }

	
})



