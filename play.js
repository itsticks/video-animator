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
					var textNode = document.createTextNode(mediaDevice.label.toLowerCase() || 'camera '+(i+1).toString().toLowerCase());
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
				document.body.append(cameraSelect);

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

vd.width = window.innerWidth;
vd.height= window.innerHeight;
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
var controls = document.createElement('div');
controls.style.backgroundColor = 'white';
controls.style.opacity = '0.5'

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
cnvs.width = window.innerWidth;//video.width;
cnvs.height = window.innerHeight;
cnvs.style.backgroundColor = "#009900";
cnvs.style.backgroundSize = 'cover';
cnvs.style.marginBottom = '20px';
cnvs.style.position = 'fixed';

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

var flip = document.createElement('input');
flip.type = 'checkbox';
flip.style.display = 'inline-block';

var flipLabel = document.createElement('label');
flipLabel.append(document.createTextNode('flip'))
flipLabel.append(flip)

var alphaInput = document.createElement('select');
alphaInput.style.display = 'inline-block';
var alphaInputOptions = ['','red','green','blue'];
alphaInputOptions.forEach(function(x){
	var aio = document.createElement('option');
	aio.value = x.substr(0,1);
	aio.append(document.createTextNode(x));
	alphaInput.append(aio);
})

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
frameSpliceLabel.append(document.createTextNode('nth frame '));
frameSpliceLabel.append(frameSpliceInput);

var opacityInput = document.createElement('input');
opacityInput.type = 'range';
opacityInput.min = 0.1;
opacityInput.max = 1;
opacityInput.step = 0.01
opacityInput.value = 1;
opacityInput.style.display = 'inline-block';
opacityInput.style.width='50px';

var opacityLabel = document.createElement('label');
opacityLabel.append(document.createTextNode('frame opacity '));
opacityLabel.append(opacityInput);


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
	if(alphaInput.value!=""){
			frame = frame.alpha(alphaInput.value);
	}
	if(flipMatrix.checked){
		frame = frame.reversePixels();
	}
	if(flip.checked){
		frame = frame.flip();
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
	var recorder = new CanvasRecorder(cnvs);
	var recordButton = document.createElement('button');
	var recordButtonText = document.createTextNode('record 🎥');
	recordButton.append(recordButtonText);
	recordButton.dataset.recording = '0';
	recordButton.onclick = function(){
		if(recordButton.dataset.recording=='1'){
			recorder.stop();
			recorder.save();
			recordButton.dataset.recording = '0';
			recordButtonText.nodeValue = 'record 🎥';
			recordButton.style.backgroundColor = 'inherit';
		} else {
			recorder.start();
			recordButton.dataset.recording = '1';
			recordButton.style.backgroundColor = 'red';
			recordButtonText.nodeValue = 'Stop 🎥';

		}
	}

	var snapshots = document.createElement('ul');
	function insertSnapshot(pngUrl){
		var ss = document.createElement('li');
		var ssl = document.createElement('a');
		ssl.href = pngUrl.replace("image/png", "image/octet-stream");
		ssl.download = true;
		var ssi = document.createElement('img');
		ssi.src = pngUrl;
		ssi.style.width = "100px";
		ssl.append(ssi);
		ss.append(ssl);
		snapshots.append(ss);
	}

	var downloadCapture = document.createElement('a');
	downloadCapture.href = "";
	downloadCapture.setAttribute("download",true);
	downloadCapture.append(document.createTextNode('download'));

	var captureButton = document.createElement('button');
	var captureButtonText = document.createTextNode('snapshot 📷');

	captureButton.append(captureButtonText);
	downloadCapture.style.display = 'none';

	captureButton.onclick = function(e){
		e.preventDefault();
		insertSnapshot(cnvs.toDataURL("image/png"));
}

controls.append(colorInputLabel,flipLabel,rotateLabel,alphaLabel,frameSpliceLabel,opacityLabel);
container.append(cnvs,vd,controls);

// captureButton, snapshots

document.body.append(container,recordButton);

 playLive();
 webcamSwitch();


})();
