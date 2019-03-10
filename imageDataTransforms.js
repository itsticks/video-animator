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

	ImageData.prototype.flip = function(){  // Traverse every row and flip the pixels
	for (i=0; i<this.height; i++)
	{
	 // We only need to do half of every row since we're flipping the halves
	  for (j=0; j<this.width/2; j++)
	  {
		 var index=(i*4)*this.width+(j*4);
		 var mirrorIndex=((i+1)*4)*this.width-((j+1)*4);
		 for (p=0; p<4; p++)
		 {
		   var temp=this.data[index+p];
		   this.data[index+p]=this.data[mirrorIndex+p];
		   this.data[mirrorIndex+p]=temp;
		 }
	  }
	}
	return this;
}

ImageData.prototype.alpha = function(color,swap){
	var colors = ['r','g','b'];
	var othercolors = colors.filter(x=>x!=color);

	for (var i = 0; i < this.data.length/4; i++) {
	 var pixels = {
	 'r': this.data[i * 4 + 0],
	 'g': this.data[i * 4 + 1],
	 'b': this.data[i * 4 + 2]
	}
	 if (pixels[color] > pixels[othercolors[0]] && pixels[color] > pixels[othercolors[1]]) {
	//	 this.data[i * 4 + 0] = swap.r;
	//	 this.data[i * 4 + 1] = swap.g;
	//	 this.data[i * 4 + 2] = swap.b;
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
	
	ImageData.prototype.cleanReverse = function(){
		this.data = this.data.map(function(x,i){
return i % 4 == 0 || i % 5 == 0 || i % 6 == 0
		})
	}

	ImageData.prototype.reversePixels = function(){
		var reversedData=this.data.reverse();
		this.data = this.data.map(function(x,i){
			return i%2==0 ? x : reversedData[i];
		})
		return this;
	}

	// x.map(function(y,j){return j%2==0 ?y.reverse():y})
	
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