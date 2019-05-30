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

THREE.SceneStager = function(scene){
	this.scene = scene;
	this.currentSceneArray = [];
};

THREE.SceneStager.prototype.constructor = THREE.SceneStager

THREE.SceneStager.prototype.AddMesh = function(mesh, x, z, height) {	
	var textPanel = new THREE.TextPanel(["X:" + (-1.0*x).toFixed(1) + " Z:" + z.toFixed(1)], 72);
	var textMesh = textPanel.GetMesh();
	// textMesh.rotateY(Math.PI);
	textMesh.position.set(0,height,0);
	mesh.add(textMesh);

	mesh.translateX(x);
	mesh.translateZ(z);
	this.scene.add(mesh);
	this.currentSceneArray.push(mesh);	
	this.currentSceneArray.push(textMesh);
}

THREE.SceneStager.prototype.AddUnitCube = function(x, z) {	
	var cubeMesh = new THREE.Mesh(
						new THREE.BoxGeometry(1.0, 1.0, 1.0 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	cubeMesh.translateY(0.5);
	this.AddMesh(cubeMesh, x, z, 1);
}

THREE.SceneStager.prototype.AddHexapod = function(x,z) {
	var hexapodRadius = 1.5;
	var geo = new THREE.SphereGeometry(hexapodRadius, 4, 4);
	var mat = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, wireframeLinewidth: 5} );
	var mesh = new THREE.Mesh( geo, mat);
	// mesh.rotateX(Math.PI*0.5);
	mesh.translateY(hexapodRadius*0.75);
	
	var humanHeight = 1.8;
	var bodyPole = new THREE.Mesh(
						new THREE.BoxGeometry(0.4, humanHeight, 0.4 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	bodyPole.translateY(humanHeight*0.5);

	var torso = new THREE.Mesh(
						new THREE.BoxGeometry(0.8, 0.8, 0.6 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	torso.translateY(0.15);
	bodyPole.add(torso);  
	bodyPole.translateX(x);
	bodyPole.translateZ(z);
  this.scene.add(bodyPole);
	this.currentSceneArray.push(bodyPole);	
	this.currentSceneArray.push(torso);	
	
	
	this.AddMesh(mesh, x, z, 1.5);
}

THREE.SceneStager.prototype.AddTensegrity = function(x,z) {
	var elevation = 2;
	var hexapodRadius = 1.5;
	var geo = new THREE.SphereGeometry(hexapodRadius, 4, 4);
	var mat = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, wireframeLinewidth: 5} );
	var mesh = new THREE.Mesh( geo, mat);
	// mesh.rotateX(Math.PI*0.5);
	mesh.translateY(hexapodRadius*0.75 + elevation);
	
	var humanHeight = 1.8;
	var bodyPole = new THREE.Mesh(
						new THREE.BoxGeometry(0.4, humanHeight, 0.4 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	bodyPole.translateY(humanHeight*0.5);

	var torso = new THREE.Mesh(
						new THREE.BoxGeometry(0.8, 0.8, 0.6 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	torso.translateY(0.15);
	bodyPole.add(torso);  
	bodyPole.translateX(x);
	bodyPole.translateZ(z);
	bodyPole.translateY(elevation);
	
  this.scene.add(bodyPole);
	this.currentSceneArray.push(bodyPole);	
	this.currentSceneArray.push(torso);	
	
	
	this.AddMesh(mesh, x, z, -1.5);
}


THREE.SceneStager.prototype.AddHuman = function(x, z) {	
	var humanHeight = 1.8;
	var bodyPole = new THREE.Mesh(
						new THREE.BoxGeometry(0.4, humanHeight, 0.4 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	bodyPole.translateY(humanHeight*0.5);

	var torso = new THREE.Mesh(
						new THREE.BoxGeometry(0.8, 0.8, 0.6 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	torso.translateY(0.15);
	bodyPole.add(torso);
	
	//track torso separately
	this.currentSceneArray.push(torso);	
	this.AddMesh(bodyPole, x, z, 1.5);
}


THREE.SceneStager.prototype.ClearStage = function() {
	for (var i = 0; i < this.currentSceneArray.length; i++) {
		this.scene.remove(this.currentSceneArray[i]);
		this.currentSceneArray[i].geometry.dispose();
		this.currentSceneArray[i].material.dispose();
		this.currentSceneArray[i] = undefined;
	}
	this.currentSceneArray = [];
}