(function(){

var fps = 30;
var animationFrameInterval = 1;//Math.round(1000/fps);
var currentTime = 0;
var frames = [];
var framePopulationCount = 0;
var currentFrame = 0;
var animationCounter = 0;
var framesCaptured = false;

var video = document.createElement('video');
video.width=450;
video.height=360;
video.controls=true;
video.autoplay=true;
video.muted=true;
video.playbackRate=2;
video.crossOrigin = "Anonymous";
video.src= 'https://doc-04-1k-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/bpe4rahfj1gds8jethisnmv45ac7ibhu/1526241600000/01524003728762920652/*/1ZwhE85SPCAo6U5A6aC7D6spHviLSgSBm?e=download';
// https://drive.google.com/uc?export=download&id=1ZwhE85SPCAo6U5A6aC7D6spHviLSgSBm

var canvas = document.createElement('canvas');
canvas.width = video.width;
canvas.height = video.height;
canvas.style.backgroundColor = "#000099";
//canvas.style.backgroundImage = 'url(https://cdn.spacetelescope.org/archives/images/wallpaper2/heic1509a.jpg)';
canvas.style.backgroundSize = 'cover';

var ctx = canvas.getContext('2d');
ctx.fillStyle = "red"
ctx.font = "15px Arial";

var videoInput = document.createElement('input');
videoInput.type = 'url';
videoInput.value='https://doc-04-1k-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/48qtoi7qgrun5g8nl41t7a6hi8hviuon/1526032800000/01524003728762920652/*/1ZwhE85SPCAo6U5A6aC7D6spHviLSgSBm?e=view';
videoInput.onchange = function(e){
	video.src = e.target.value;
}

var colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.value='#009900';
colorInput.onchange = function(e){
	canvas.style.backgroundColor = e.target.value;
}

ImageData.prototype.invert = function(){
	for (var i = 0; i < this.data.length; i += 4) {
		this.data[i] = 255 - this.data[i];     // red
		this.data[i + 1] = 255 - this.data[i + 1]; // green
		this.data[i + 2] = 255 - this.data[i + 2]; // blue
	}
	return this;
}

ImageData.prototype.bugs = function(){
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
	 var r = this.data[i * 4 + 0];
	 var g = this.data[i * 4 + 1];
	 var b = this.data[i * 4 + 2];
	 if (i < this.data.length/4 && g > r && g > b){
		 this.data[i * 4 + 3] = this.data[(this.data.length/4)-(i)+1];
 	}
 }
 return this;
}

ImageData.prototype.scramble = function(){
		for (var i = 0; i < this.data.length; i++) {
	    	this.data[i]=this.data[(this.data.length-i)];
	    }
	    return this;
}

var step = function(){
	if(animationCounter%animationFrameInterval==0 && frames[currentFrame]!=undefined){
			ctx.putImageData(frames[currentFrame],0,0)
						currentFrame++;
			// ctx.clearRect(0,0,50,25)
			// ctx.fillText(animationCounter,10,20)
	}

	animationCounter++;
	if(currentFrame===frames.length){currentFrame=0}
	myreq = requestAnimationFrame(step);

}

video.onended = function(){
	frames = frames.map(function(f,i){
	 return (i%2==0) ? f.bugs() :f.alphaGreen();
	//return f.invert();
	})
	// .map(function(f,i){
	// 	return (i%2==0) ? f.alphaGreen() : f;
	// })

myreq = requestAnimationFrame(step);

}

video.onplaying = function(){
	timerCallback()
}

var timerCallback = function() {
    if (video.paused || video.ended) {
    	clearTimeout(timeout);
      return;
    }
	ctx.drawImage(video,0,0,video.width,video.height);
	  //  ctx.translate(video.width/2, video.height/2);
   // ctx.rotate(2*Math.PI/180);
   //   ctx.translate(-video.width/2, -video.height/2);
	frames.push(ctx.getImageData(0,0,video.width,video.height));
	var timeout = setTimeout(function() {
        timerCallback();
      }, 0);
  }

video.oncanplaythrough = function(){
if(!framesCaptured){
framesCaptured = true;
document.body.append(canvas);
document.body.append(video);
document.body.append(videoInput);
document.body.append(colorInput);
var numberOfFrames = Math.round(video.duration*fps);
}
}


})();
