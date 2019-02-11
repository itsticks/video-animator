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