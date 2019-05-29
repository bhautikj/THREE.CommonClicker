/*
	Copyright 2019 Bhautik J Joshi bjoshi@gmail.com

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
	documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
	Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
	WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
	OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

THREE.TextPanel = function(initTextArray, colorString){
	this.txSize = 14;
	this.txHeight = this.txSize  + 4;
	this.canvas1 = document.createElement('canvas');
	this.canvas1.width = 256;
	this.canvas1.height = 64;
	this.context1 = this.canvas1.getContext('2d');
	//this.context1.font = "Bold 32px Arial";
	this.context1.font = this.txSize + "px/1.4 arial, sans-serif";
	this.context1.fillStyle = colorString;
		
	this.texture1 = new THREE.Texture(this.canvas1)

	this.RenderText(initTextArray);

	this.material1 = new THREE.MeshBasicMaterial( {map: this.texture1, side:THREE.DoubleSide } );
	this.material1.transparent = true;

	this.mesh1 = new THREE.Mesh(
		// size: 1m width
	    new THREE.PlaneGeometry(1.0,this.canvas1.height/this.canvas1.width),
	    this.material1
	);
	this.mesh1.rotateY(Math.PI);
};

THREE.TextPanel.prototype.constructor = THREE.TextPanel

THREE.TextPanel.prototype.RenderText = function(textArray) {
	this.context1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
	for (var i = 0; i < textArray.length; i++) {
		this.context1.fillText(textArray[i], 0, this.txHeight + i*this.txHeight);
	}
	this.texture1.needsUpdate = true;
}

THREE.TextPanel.prototype.GetMesh = function(text) {
	return this.mesh1;
}


