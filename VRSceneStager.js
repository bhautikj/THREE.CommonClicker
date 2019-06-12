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
	// this.stageNode = this.CreateStage();
};

THREE.SceneStager.prototype.constructor = THREE.SceneStager

THREE.SceneStager.prototype.LabelMesh = function(mesh, x, z, height) {	
	var textPanel = new THREE.TextPanel(["X:" + (-1.0*x).toFixed(1) + " Z:" + z.toFixed(1)], 72);
	var textMesh = textPanel.GetMesh();
	// textMesh.rotateY(Math.PI);
	textMesh.position.set(0,height,0);
	mesh.add(textMesh);

	mesh.translateX(x);
	mesh.translateZ(z);
	this.currentSceneArray.push(mesh);	
	this.currentSceneArray.push(textMesh);
}

THREE.SceneStager.prototype.AddMesh = function(mesh, x, z, height) {	
	this.LabelMesh(mesh,x,z,height);
	this.scene.add(mesh);
}


THREE.SceneStager.prototype.CreateMark = function(x, z) {	
	var cubeMesh = new THREE.Mesh(
						new THREE.BoxGeometry(0.1, 0.1, 0.1 ),
						new THREE.MeshStandardMaterial({color: 0x4444FF})
					);
	cubeMesh.translateY(-0.01);
	this.currentSceneArray.push(cubeMesh);	
	this.LabelMesh(cubeMesh, x, z, 0.1);
	return cubeMesh;
}

THREE.SceneStager.prototype.CreateHexapod = function(x,z) {
	var hexapodRadius = 1.5;
	var geo = new THREE.SphereGeometry(hexapodRadius, 4, 4);
	var mat = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, wireframeLinewidth: 5} );
	var mesh = new THREE.Mesh( geo, mat);
	// mesh.rotateX(Math.PI*0.5);
	
	var humanHeight = 1.8;
	var bodyPole = new THREE.Mesh(
						new THREE.BoxGeometry(0.4, humanHeight, 0.4 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	// bodyPole.translateY(humanHeight*0.5);

	var torso = new THREE.Mesh(
						new THREE.BoxGeometry(0.8, 0.8, 0.6 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	torso.translateY(0.15);
	bodyPole.add(torso);  
	mesh.translateY(hexapodRadius*0.75);
    mesh.add(bodyPole);
	
	this.currentSceneArray.push(bodyPole);	
	this.currentSceneArray.push(torso);	
	
	this.LabelMesh(mesh, x, z, 1.5);
	return mesh;
}

THREE.SceneStager.prototype.CreateTensegrity = function(x,z) {
	var elevation = 2;
	var hexapodRadius = 1.5;
	var geo = new THREE.SphereGeometry(hexapodRadius, 4, 4);
	var mat = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, wireframeLinewidth: 5} );
	var mesh = new THREE.Mesh( geo, mat);
	// mesh.rotateX(Math.PI*0.5);
	
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
	
	this.currentSceneArray.push(bodyPole);	
	this.currentSceneArray.push(torso);	
	mesh.add(bodyPole);

	bodyPole.translateY(-1.0*hexapodRadius*0.75);
	mesh.translateY(hexapodRadius*0.75 + elevation);

	this.LabelMesh(mesh, x, z, -1.5);
	return mesh;
}

THREE.SceneStager.prototype.CreateHumanMesh = function(x,z) {
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
	//track torso separately
	bodyPole.add(torso);
	this.currentSceneArray.push(torso);	
	
	// add label to mesh
	this.LabelMesh(bodyPole,x,z,humanHeight);
	return bodyPole;	
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

THREE.SceneStager.prototype.CreateStage = function() {
	var stageNode = new THREE.Object3D();
	
	//stage
	var stageWidth = 7;
	var stageDepth = 8;
	var stageHeight = 5;

	var stagePlane = new THREE.Mesh( new THREE.PlaneGeometry( stageWidth, stageDepth, 32, 32 ) , 
	                                 new THREE.MeshPhongMaterial( {color: 0x050505, side: THREE.DoubleSide} ) );
	stagePlane.rotateX(Math.PI*0.5);
	stagePlane.translateY(stageDepth*0.5);
	stageNode.add( stagePlane );
	
	var stageRoof = new THREE.Mesh( new THREE.PlaneGeometry( stageWidth, stageDepth, 32, 32 ) , 
	                                 new THREE.MeshPhongMaterial( {color: 0x0E0E11, side: THREE.DoubleSide} ) );
	stageRoof.rotateX(Math.PI*0.5);
	stageRoof.translateY(stageDepth*0.5);
	stageRoof.translateZ(-1.0*stageHeight);
	stageNode.add( stageRoof );

	var stageLeft = new THREE.Mesh( new THREE.PlaneGeometry( stageDepth, stageHeight, 32, 32 ) , 
	                                 new THREE.MeshPhongMaterial( {color: 0x050505, side: THREE.DoubleSide} ) );
	stageLeft.rotateY(Math.PI*0.5);
	stageLeft.translateY(stageHeight*0.5);
	stageLeft.translateX(-0.5*stageDepth);
	stageLeft.translateZ(0.5*stageWidth);
	stageNode.add( stageLeft );

	var stageRight = new THREE.Mesh( new THREE.PlaneGeometry( stageDepth, stageHeight, 32, 32 ) , 
	                                 new THREE.MeshPhongMaterial( {color: 0x0E0E0E, side: THREE.DoubleSide} ) );
	stageRight.rotateY(Math.PI*0.5);
	stageRight.translateY(stageHeight*0.5);
	stageRight.translateX(-0.5*stageDepth);
	stageRight.translateZ(-0.5*stageWidth);
	stageNode.add( stageRight );
	
	
	var stageBack = new THREE.Mesh( new THREE.PlaneGeometry( stageWidth, stageHeight, 32, 32 ) , 
	                                 new THREE.MeshPhongMaterial( {color: 0x051105, side: THREE.DoubleSide} ) );
	// stageBack.rotateX(Math.PI*0.5);
	stageBack.translateY(stageHeight*0.5);
	stageBack.translateZ(stageDepth);
	stageNode.add( stageBack );
	
	return stageNode;
}