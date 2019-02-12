var test;

(function(){

	function webcamSwitch(){
		//var facingMode = altCameraInput.checked ? "user" : "environment";
		var videoConstraints = document.getElementById('cameraSelect') != null && document.getElementById('cameraSelect').value!="" ?
		 {deviceId:{ exact: document.getElementById('cameraSelect').value }} : {} //{ facingMode: facingMode }

		navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then(function(stream) {
			window.stream = stream; 
		  vd.srcObject = stream;
		  track = stream.getTracks()[0];
		  webcamOn = true;
		  playingLive = true;

		  if(document.getElementById('cameraSelect')===null){
			navigator.mediaDevices.enumerateDevices().then(function(mediaDevices){
				var cameraSelect = document.createElement('select');
				cameraSelect.id = 'cameraSelect';
				var noOption = document.createElement('option');
					noOption.value = 'Off';
					var txtNode = document.createTextNode('Off');
					noOption.append(txtNode);
					cameraSelect.append(noOption);
				mediaDevices.forEach((mediaDevice,i) => {
				  if (mediaDevice.kind === 'videoinput') {
					var cameraOption = document.createElement('option');
					cameraOption.value = mediaDevice.deviceId;
					var textNode = document.createTextNode(mediaDevice.label || 'Camera '+(i+1).toString());
					cameraOption.append(textNode);
					cameraSelect.append(cameraOption);
					cameraSelect.value = track.getSettings().deviceId;
					cameraSelect.onchange = function(){
						if(this.value!="Off"){
						webcamSwitch();
						}
						else{
							track.stop();
						}
					}
				  }
				});
				controls.append(cameraSelect);

			});
		}
		}).catch(function(error){
			console.error(error);
			var errorMessage = document.createElement('p');
			errorMessage.append(document.createTextNode(errorMessage));
			document.body.append(errorMessage);
			test = errorMessage;
		});	
	
			}

var animationFrameInterval = 1;//Math.round(1000/fps);
var frames = [];
var myReq;
var rawFrames = [];
var currentFrame = 0;
var frameCount = 0;
var animationCounter = 0;
var recording = false;
var playing = false;
var playingLive = true;
var webcamOn = false;
var track;
var vd = document.createElement('video');

vd.width = window.innerWidth <= 800 ? window.innerWidth -20 : 800;
vd.height=vd.width / 1.25;
vd.controls=true;
vd.autoplay=true;
vd.playbackRate=1;
vd.setAttribute('playsinline',true);

vd.style.position = 'fixed';
vd.style.top = '8px';
vd.style.zIndex = '-1';

var container = document.createElement('div');
container.style.margin = 'auto';
container.style.width = vd.width + "px";

var playButton = document.createElement('button');
playButton.append(document.createTextNode('Play'));
playButton.onclick = function(){
	recording = false;
	playing = true;
	frames = rawFrames.map(function(f,i){
		return f;
	   })

   myreq = requestAnimationFrame(step);	
}


var cnvs = document.createElement('canvas');
cnvs.width = window.innerWidth <= 800 ? window.innerWidth -20 : 800;//video.width;
cnvs.height = cnvs.width / 1.25 ;
cnvs.style.backgroundColor = "#009900";
cnvs.style.backgroundSize = 'cover';
cnvs.style.marginBottom = '20px';

var ctx = cnvs.getContext('2d');
ctx.fillStyle = "red"
ctx.font = "15px Arial";

var videoInput = document.createElement('input');
videoInput.type = 'url';
videoInput.value=vd.src;
videoInput.onchange = function(e){
	vd.src = e.target.value;
}

var colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.value='#009900';
colorInput.style.display = 'inline-block';
colorInput.onchange = function(e){
	cnvs.style.backgroundColor = e.target.value;
}

var colorInputLabel = document.createElement('label');
colorInputLabel.append(document.createTextNode('bg color '))
colorInputLabel.append(colorInput)

var rotateInput = document.createElement('input');
rotateInput.type = 'checkbox';
rotateInput.style.display = 'inline-block';

var rotateLabel = document.createElement('label');
rotateLabel.append(document.createTextNode('spin'))
rotateLabel.append(rotateInput)

var flipMatrix = document.createElement('input');
flipMatrix.type = 'checkbox';
flipMatrix.style.display = 'inline-block';

var flipMatrixLabel = document.createElement('label');
flipMatrixLabel.append(document.createTextNode('reverse pixels'))
flipMatrixLabel.append(flipMatrix)

var alphaInput = document.createElement('input');
alphaInput.type = 'checkbox';
alphaInput.style.display = 'inline-block';

var alphaLabel = document.createElement('label');
alphaLabel.append(document.createTextNode('alpha'));
alphaLabel.append(alphaInput);

var frameSpliceInput = document.createElement('input');
frameSpliceInput.type = 'range';
frameSpliceInput.min = 0;
frameSpliceInput.max = 10;
frameSpliceInput.step = 1;
frameSpliceInput.value = 1;
frameSpliceInput.style.display = 'inline-block';
frameSpliceInput.style.width='50px';

var frameSpliceLabel = document.createElement('label');
frameSpliceLabel.append(document.createTextNode('nth frame fx'));
frameSpliceLabel.append(frameSpliceInput);

var opacityInput = document.createElement('input');
opacityInput.type = 'range';
opacityInput.min = 0.1;
opacityInput.max = 1;
opacityInput.step = 0.1
opacityInput.value = 0.5;
opacityInput.style.display = 'inline-block';
opacityInput.style.width='50px';

var opacityLabel = document.createElement('label');
opacityLabel.append(document.createTextNode('opacity '));
opacityLabel.append(opacityInput);


var recordButton = document.createElement('button');
recordButton.append(document.createTextNode('Record'));
	recordButton.disabled = false;
recordButton.onclick = function(){
	recording = true;
	recordButton.style.backgroundColor = 'green';
	setTimeout(function(){recording=false;	recordButton.style.backgroundColor = 'inherit';
},5000);
		}



var step = function(){
	if(animationCounter%animationFrameInterval==0 && frames[currentFrame]!=undefined){
			ctx.putImageData(frames[currentFrame],0,0)
						currentFrame++;
	}
	animationCounter++;
	if(currentFrame!==frames.length){
	myreq = requestAnimationFrame(step);
	}
	else{
		currentFrame=0
			cancelAnimationFrame(myReq);
			playing = false;
	}

}



var playLive = function() {
    if (!playingLive) {
    	clearTimeout(timeout);
      return;
	}
	

	
	ctx.drawImage(vd,0,0,vd.width,vd.height);
	ctx.globalAlpha  = opacityInput.value;

	var frame = ctx.getImageData(0,0,vd.width,vd.height);
	if(frameCount%frameSpliceInput.value===0){
	if(alphaInput.checked){
			frame = frame.alphaGreen();
	}
	if(flipMatrix.checked){
		frame = frame.reversePixels();
	}

}


	if(rotateInput.checked){
		if(frameCount%frameSpliceInput.value===0){
	    ctx.translate(vd.width/2, vd.height/2);
    	ctx.rotate(2*Math.PI/180);
	  	ctx.translate(-vd.width/2, -vd.height/2);
		}
	}else{
		ctx.resetTransform();
	}

	//ctx.drawImage(imageObj, 0,0,vd.width,vd.height);

	ctx.putImageData(frame,0,0)
	if(flipMatrix.checked){
		ctx.translate(vd.width/2, vd.height/2);
		ctx.rotate(Math.PI);
		ctx.translate(-vd.width/2, -vd.height/2);
		console.log('rotate')
	}

	
	// var imageObj = new Image();
	// imageObj.crossOrigin = "Anonymous";
	// imageObj.src = 'https://images.weserv.nl/?url=www.glasgow.gov.uk/georgesquarewebcam/fullsize3.jpg';

//	imageObj.onload = function(){
	//ctx.drawImage(imageObj, 0,0,vd.width,vd.height)
//	var frameAsImage = new Image();
//	frameAsImage.src = cnvs.toDataURL("image/png");
//	frameAsImage.onload = function(){
	//	ctx.drawImage(frameAsImage,0,0,vd.width,vd.height)
		var timeout = setTimeout(function() {
			playLive();
		  }, 10);
		  frameCount++;
//	}
// }

   if(recording){
	rawFrames.push(ctx.getImageData(0,0,vd.width,vd.height));
   }



  }

var controls = document.createElement('div');
controls.style.display = 'none';
var start = document.createElement('button');
start.append(document.createTextNode('Start eCard'));


// colins birthday card special automaticness
start.onclick = function(){
	controls.style.display = 'none';
	this.disabled = true;
	var sound = new Audio("https://freemusicarchive.org/file/music/WFMU/Furchick/The_New_Birthday_Song_Contest/Furchick_-_Hey_hey_birthday_song.mp3");
	sound.play();
	sound.loop = true;
var alphaChange = 0.1;
var spliceChange = 1;


var rotateIntrvl = setInterval(function(){
rotateInput.checked = rotateInput.checked ? false : true;
	},8000)

var flipIntrvl	= setInterval(function(){
		flipMatrix.checked = flipMatrix.checked ? false : true;
			},7000)

var opacityIntrvl = setInterval(function(){
				if(opacityInput.value===opacityInput.max){alphaChange=-0.1}
				if(opacityInput.value===opacityInput.min){alphaChange=0.1}
				var newVal = parseFloat(opacityInput.value)+parseFloat(alphaChange);
				opacityInput.value = newVal;
			},1000);

			var spliceInterval = '';
var frameSpliceTimeout = setTimeout(function(){
	spliceInterval = setInterval(function(){
				if(frameSpliceInput.value===frameSpliceInput.max){spliceChange=-1}
				if(frameSpliceInput.value===frameSpliceInput.min){spliceChange=1}
				var newVal = parseFloat(frameSpliceInput.value)+parseFloat(spliceChange);
				frameSpliceInput.value = newVal;
			},1000);
		},10000)


		setTimeout(function(){
			clearInterval(rotateIntrvl);
			clearInterval(flipIntrvl);
			clearInterval(spliceInterval);
			clearTimeout(frameSpliceTimeout);
			clearInterval(opacityIntrvl);
			controls.style.display = "block";
			sound.pause();
			start.disabled = false;
		},40000)
}


controls.append(rotateLabel,flipMatrixLabel,alphaLabel,frameSpliceLabel,opacityLabel,colorInputLabel)

container.append(cnvs,vd,controls, start);
// videoInput,recordButton,playButton,colorInput
document.body.append(container);

 playLive();
 webcamSwitch();

})();
