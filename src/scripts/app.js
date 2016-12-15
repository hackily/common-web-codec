const jwt = require('jwt-simple');
const codecs = require('./codec');

document.addEventListener("DOMContentLoaded", function(){
	let codecDirectionality = true;
	let selectedCodec = null;

  document.getElementById("codec-directionality").addEventListener("click", function(){reverseCodecDirection(this)});
	
	for(obj in codecs.format){
		let node = document.createElement("input");
		node.className = "button-primary codec-button";
		node.value = obj;
		node.type="button"
		node.addEventListener("click", function(){activateButton(this)});
		document.getElementById("codec-buttons").appendChild(node)
	}

	const activateButton = function(target){
		const activeElements = target.parentNode.getElementsByClassName("active");
		for(el of activeElements){
			el.classList.remove('active');
		}
		target.classList.add('active');
		selectedCodec = target.value;
		console.log(target.value);
	}
		const reverseCodecDirection = function(element){
		codecDirectionality = !codecDirectionality;
		element.textContent = codecDirectionality ? "->" : "<-";
		codecs.format.JWT(codecDirectionality);
	}

	const runCodec = function(){

		console.log("foo");
	};


	
})



