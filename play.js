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
var video = document.createElement('video');
video.width=450;
video.height=360;
video.controls=true;
video.autoplay=true;
video.muted=true;
video.playbackRate=1;
//video.style.position = 'fixed';
//video.style.left = '-1000px';
//video.style.visibility = 'hidden';

var facingMode = window.innerWidth > window.innerHeight ? "user" : "environment";
  video.setAttribute('autoplay',true);
  video.setAttribute('playsinline',true);
video.setAttribute("controls", true);
  

  

var recordButton = document.createElement('button');
recordButton.append(document.createTextNode('Record'));
	recordButton.disabled = false;
recordButton.onclick = function(){
	recording = true;
	recordButton.style.backgroundColor = 'green';
	setTimeout(function(){recording=false;	recordButton.style.backgroundColor = 'inherit';
},3000);
		}

var webcamButton = document.createElement('button');
		webcamButton.append(document.createTextNode('Webcam'));
		webcamButton.onclick = function(){
			if(!webcamOn){
				webcamButton.style.backgroundColor = 'green';
			navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false }).then(function(stream) {
				window.stream = stream; 
			  video.srcObject = stream;
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

var playButton = document.createElement('button');
playButton.append(document.createTextNode('Play'));
playButton.onclick = function(){
	recording = false;
//	track.stop();
	playing = true;
	frames = rawFrames.map(function(f,i){
		return f; //.reversePixels();
		//return (i%2==0) ? f : f.reversePixels();
	   })

   myreq = requestAnimationFrame(step);	
}


var canvas = document.createElement('canvas');
canvas.width = 450//video.width;
canvas.height = 360 //video.height;
canvas.style.backgroundColor = "#000099";
canvas.style.backgroundSize = 'cover';

var ctx = canvas.getContext('2d');
ctx.fillStyle = "red"
ctx.font = "15px Arial";

var videoInput = document.createElement('input');
videoInput.type = 'url';
videoInput.value=video.src;
videoInput.onchange = function(e){
	video.src = e.target.value;
}

var colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.value='#009900';
colorInput.onchange = function(e){
	canvas.style.backgroundColor = e.target.value;
}



var step = function(){
	if(animationCounter%animationFrameInterval==0 && frames[currentFrame]!=undefined){
			ctx.putImageData(frames[currentFrame],0,0)
						currentFrame++;
	}

	animationCounter++;
	//if(currentFrame===frames.length){currentFrame=0}
	if(currentFrame!==frames.length){
	myreq = requestAnimationFrame(step);
	}
	else{
		currentFrame=0
			cancelAnimationFrame(myReq);
			playing = false;
	}
}

video.onpause = function(){
	console.log('paused')
}

video.onplaying = function(){
	console.log('playing')
}

var playLive = function() {
    if (!playingLive) {
    	clearTimeout(timeout);
      return;
	}
	
	ctx.drawImage(video,0,0,video.width,video.height);
	var frame = ctx.getImageData(0,0,video.width,video.height);
	if(frameCount%8===0){
		frame = frame.reversePixels();
	}
	frame.alphaGreen();
	ctx.putImageData(frame,0,0)
	    ctx.translate(video.width/2, video.height/2);
    ctx.rotate(2*Math.PI/180);
      ctx.translate(-video.width/2, -video.height/2);
   if(recording){
	rawFrames.push(ctx.getImageData(0,0,video.width,video.height));
   }
	var timeout = setTimeout(function() {
        playLive();
	  }, 10);
	  frameCount++;
  }

document.body.append(webcamButton,recordButton,playButton,canvas,video,videoInput,colorInput);

 // getWebcam();
 playLive();


})();
