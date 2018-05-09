(function(){

var fps = 30;
var animationFrameInterval = Math.round(1000/fps);
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
video.src= 'DSC_0028.mov';

var canvas = document.createElement('canvas');
canvas.width = video.width;
canvas.height = video.height;

var ctx = canvas.getContext('2d');
ctx.fillStyle = "red"
ctx.font = "15px Arial";


video.onended = function(){
var step = function(){
	ctx.clearRect(0,0,50,25)
			ctx.fillText(animationCounter,10,20)
	if(animationCounter%animationFrameInterval==0 && frames[currentFrame]!=undefined){ 
			ctx.putImageData(frames[currentFrame],450,360)
						currentFrame++;
	}
	animationCounter++;
	myreq = requestAnimationFrame(step);
}
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
	frames.push(ctx.getImageData(0,0,video.width,video.height));	    
	var timeout = setTimeout(function() {
        timerCallback();
      }, 0);
  }

video.oncanplaythrough = function(){
if(!framesCaptured){
framesCaptured = true;
document.body.append(video);
document.body.append(canvas);

var numberOfFrames = Math.round(video.duration*fps);
}
}

// frames = Array.from(Array(numberOfFrames))
// .map(x=>{
// 	video.currentTime=currentTime;
// 	currentTime=currentTime+(1/fps);
// 	ctx.drawImage(video,0,0,video.width,video.height);
// 	return ctx.getImageData(0,0,video.width,video.height);	
// })



// video.play();
// var framePopulation = setInterval(function(){
// 	//video.currentTime=currentTime;
// 	//currentTime=currentTime+(1/fps);
// 	video.pause();
// 	if(framePopulationCount==numberOfFrames){
// 		clearInterval(framePopulation)
// 	}
// 	framePopulationCount++;
// },1000/fps)

// for(var i = 0; i<=numberOfFrames; i++){
// 	video.currentTime=currentTime;
// 	currentTime=currentTime+(1/fps);
// }

// video.onpause = function(){
// 	ctx.drawImage(video,0,0,video.width,video.height);	
// 	frames.push(ctx.getImageData(0,0,video.width,video.height));
// 	video.play()
// }





})();