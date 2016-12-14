document.addEventListener("DOMContentLoaded", function(){ 
	var codecDirectionality = true;
	var codecs = ["JWT", "BASE64", "HEX", "HTML", "BINARY"];
	var selectedCodec = null;

  document.getElementById("codec-directionality").addEventListener("click", function(){reverseCodecDirection(this);
	})
	for(var n = codecs.length; n > 0; n--){
		var node = document.createElement("input");
		node.className = "button-primary codec-button";
		node.value = codecs[codecs.length-n];
		node.type="button"
		node.addEventListener("click", function(){activateButton(this)});


		document.getElementById("codec-buttons").appendChild(node)
	}

	function reverseCodecDirection(element){
		codecDirectionality = !codecDirectionality;
		element.textContent = codecDirectionality ? "->" : "<-";
	}

	function activateButton(target){
		var activeElements = target.parentNode.getElementsByClassName("active");
		for(el of activeElements){
			el.classList.remove('active');
		}
		target.classList.add('active');
		selectedCodec = target.value;
		
		console.log(selectedCodec);
		//document.getElementBy
	}
})

