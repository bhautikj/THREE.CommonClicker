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

THREE.TextPanel = function(initText, colorString){
	colorString = typeof colorString !== 'undefined' ? colorString : "rgba(255,0,0,0.95)";
	this.canvas1 = document.createElement('canvas');
	this.context1 = this.canvas1.getContext('2d');
	this.context1.font = "Bold 40px Arial";
	this.context1.fillStyle = colorString;
	this.context1.fillText(initText, 0, 50);
	
	this.texture1 = new THREE.Texture(this.canvas1)
	this.texture1.needsUpdate = true;

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

// var canvas1 = document.createElement('canvas');
// var context1 = canvas1.getContext('2d');
// context1.font = "Bold 40px Arial";
// context1.fillStyle = "rgba(255,0,0,0.95)";
// context1.fillText('ZAKZAK!', 0, 50);
//
// // canvas contents will be used for a texture
// var texture1 = new THREE.Texture(canvas1)
// texture1.needsUpdate = true;
//
// var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
// material1.transparent = true;
//
// var mesh1 = new THREE.Mesh(
// 	// size: 1m width
//     new THREE.PlaneGeometry(1.0,canvas1.height/canvas1.width),
//     material1
//   );
//   mesh1.rotateY(Math.PI);
// mesh1.position.set(0,0,
//
// THREE.TextPanel.prototype.Init = function(text) {
// 	var scope = THREE.TextPanel;
// 	console.log(text);
// }