(function(){

	ImageData.prototype.invert = function(){
		for (var i = 0; i < this.data.length; i += 4) {
			this.data[i] = 255 - this.data[i];     // red
			this.data[i + 1] = 255 - this.data[i + 1]; // green
			this.data[i + 2] = 255 - this.data[i + 2]; // blue
		}
		return this;
	}
	
	ImageData.prototype.gray = function(){
		for (var i = 0; i < this.data.length; i += 4) {
		var r = this.data[i + 0];
		var g = this.data[i + 1];
		var b = this.data[i + 2];
	
		var v = r + g + b;
		v /= 3;
	
		this.data[i + 0] = v;
		this.data[i + 1] = v;
		this.data[i + 2] = v;
	}
	return this;
	}
	
	ImageData.prototype.alphaGreen = function(){
		for (var i = 0; i < this.data.length/4; i++) {
		 var r = this.data[i * 4 + 0];
		 var g = this.data[i * 4 + 1];
		 var b = this.data[i * 4 + 2];
		 if (g > r && g > b){
			 this.data[i * 4 + 3] = 0;
		 }
	 }
	 return this;
	}
	
	ImageData.prototype.alphaNonGreen = function(){
		for (var i = 0; i < this.data.length/4; i++) {
		 var r = this.data[i * 4 + 0];
		 var g = this.data[i * 4 + 1];
		 var b = this.data[i * 4 + 2];
		 if (r > g || b > g){
			 this.data[i * 4 + 3] = 0;
		 }
	 }
	 return this;
	}
	
	
	ImageData.prototype.greenScramble = function(){
		for (var i = 0; i < this.data.length; i++) {
			// if(i<this.data.length/2){
			//  this.data[i] = this.data[this.data.length/4 + i];
		 // }
		// else{
		this.data[i] = Math.round(this.data.length/i) %2<1 ? this.data[this.data.length-i] : this.data.reverse()[i]
		// }
	 }
	 return this;
	}
	
	ImageData.prototype.reversePixels = function(){
		this.data=this.data.reverse();
		return this;
	}
	
	ImageData.prototype.sortPixels = function(){
		this.data=this.data.sort();
		return this;
	}
	
	ImageData.prototype.scramble = function(){
			for (var i = 0; i < this.data.length; i++) {
				this.data[i]=this.data[(this.data.length-i)];
			}
			return this;
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

vd.width = window.innerWidth <= 450 ? window.innerWidth -20 : 450;
vd.height=vd.width / 1.25;
vd.controls=true;
vd.autoplay=true;
vd.muted=true;
vd.playbackRate=1;
vd.setAttribute('autoplay',true);
vd.setAttribute('playsinline',true);
vd.setAttribute("controls", true);
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
cnvs.width = window.innerWidth <= 450 ? window.innerWidth -20 : 450;//video.width;
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
colorInput.onchange = function(e){
	cnvs.style.backgroundColor = e.target.value;
}

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
flipMatrixLabel.append(document.createTextNode('flip matrix'))
flipMatrixLabel.append(flipMatrix)

var alphaInput = document.createElement('input');
alphaInput.type = 'checkbox';
alphaInput.style.display = 'inline-block';

var alphaLabel = document.createElement('label');
alphaLabel.append(document.createTextNode('alpha'));
alphaLabel.append(alphaInput);

var frameSpliceInput = document.createElement('input');
frameSpliceInput.type = 'number';
frameSpliceInput.value = 1;
frameSpliceInput.style.display = 'inline-block';
frameSpliceInput.style.width='30px';

var frameSpliceLabel = document.createElement('label');
frameSpliceLabel.append(document.createTextNode('frame splice '));
frameSpliceLabel.append(frameSpliceInput);

var altCameraInput = document.createElement('input');
altCameraInput.type = 'checkbox';
altCameraInput.style.display = 'inline-block';

altCameraInput.onchange = function(){
	webcamButton.click();
	webcamButton.click();
}

var altCameraLabel = document.createElement('label');
altCameraLabel.append(document.createTextNode('switch cam '));
altCameraLabel.append(altCameraInput);

var recordButton = document.createElement('button');
recordButton.append(document.createTextNode('Record'));
	recordButton.disabled = false;
recordButton.onclick = function(){
	recording = true;
	recordButton.style.backgroundColor = 'green';
	setTimeout(function(){recording=false;	recordButton.style.backgroundColor = 'inherit';
},5000);
		}


var webcamButton = document.createElement('button');
		webcamButton.append(document.createTextNode('🎥'));
		webcamButton.onclick = function(){
			var facingMode = altCameraInput.checked ? "user" : "environment";

			if(!webcamOn){
				webcamButton.style.backgroundColor = 'red';
			navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false }).then(function(stream) {
				window.stream = stream; 
			  vd.srcObject = stream;
			  track = stream.getTracks()[0];
			  webcamOn = true;
			  playingLive = true;
			}).catch(function(error){
				console.error(error);
			});	
		} else{
			track.stop();
			webcamOn = false;
			webcamButton.style.backgroundColor = 'inherit';
		}
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
	var frame = ctx.getImageData(0,0,vd.width,vd.height);
	if(frameCount%frameSpliceInput.value===0){
	if(alphaInput.checked){
			frame = frame.alphaGreen();
	}
	if(flipMatrix.checked){
		frame = frame.reversePixels();
	}

}
	ctx.putImageData(frame,0,0)

	if(rotateInput.checked){
		if(frameCount%frameSpliceInput.value===0){
	    ctx.translate(vd.width/2, vd.height/2);
    	ctx.rotate(2*Math.PI/180);
	  	ctx.translate(-vd.width/2, -vd.height/2);
		}
	}else{
		ctx.resetTransform();
	}

   if(recording){
	rawFrames.push(ctx.getImageData(0,0,vd.width,vd.height));
   }
	var timeout = setTimeout(function() {
        playLive();
	  }, 10);
	  frameCount++;
  }

container.append(cnvs,vd,webcamButton,rotateLabel,flipMatrixLabel,alphaLabel,frameSpliceLabel,altCameraLabel);
// videoInput,recordButton,playButton,colorInput
document.body.append(container);

 playLive();


})();
