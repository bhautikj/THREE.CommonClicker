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



THREE.ButtonCube = function(buttonTextArray, callback){
	var textPanel = new THREE.TextPanel([buttonTextArray], 128);
	var textPanelMesh = textPanel.GetMesh();
	this.cubeMesh = new THREE.Mesh(
						new THREE.BoxGeometry( 1.0, 1.0, 1.0 ),
						new THREE.MeshStandardMaterial({color: 0xEEFFFF})
					);
	textPanelMesh.translateZ(0.55);
	textPanelMesh.translateY(0.4);
	this.cubeMesh.add(textPanelMesh);
	
	THREE.CommonClicker.InteractionTargets.push(this.cubeMesh);
	
	this.cubeMesh.userData.clickCallback = callback;
	// eg function(obj) { obj.material.color.setHex( 0x99FF99 ); };
}

THREE.ButtonCube.prototype.constructor = THREE.ButtonCube

THREE.ButtonCube.prototype.GetMesh = function(text) {
	return this.cubeMesh;
}


THREE.CommonClicker = function(){
};

THREE.CommonClicker.prototype = Object.create( THREE.Object3D.prototype )
THREE.CommonClicker.prototype.constructor = THREE.CommonClicker

THREE.CommonClicker.isOculus = false;
THREE.CommonClicker.Controls = undefined;
THREE.CommonClicker.Raycaster = new THREE.Raycaster();
THREE.CommonClicker.MousePos = new THREE.Vector2();
THREE.CommonClicker.VRController = {};
THREE.CommonClicker.VRScene = undefined;
THREE.CommonClicker.VRCamera = undefined;
THREE.CommonClicker.VRDolly = undefined;
THREE.CommonClicker.VRRenderer = undefined;
THREE.CommonClicker.VRPointer = { "left": undefined, "right": undefined };
THREE.CommonClicker.InteractionTargets = [];
THREE.CommonClicker.PointerDown = {};
THREE.CommonClicker.PointerSelections = { 'left' : [], 'right' : [] };
THREE.CommonClicker.TextPanel = new THREE.TextPanel([""], 28);
THREE.CommonClicker.SupportsVR = false;
THREE.CommonClicker.InVR = false;

THREE.CommonClicker.CheckIfOculus = function() {
	THREE.CommonClicker.isOculus = navigator.userAgent.includes('OculusBrowser');
}

THREE.CommonClicker.OnMouseMove = function( event ) {
	var scope = THREE.CommonClicker;
	
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	scope.MousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	scope.MousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

THREE.CommonClicker.OnMouseDown = function( event ) {
	var scope = THREE.CommonClicker;
	scope.PointerDown["right"] = true;
}

THREE.CommonClicker.OnMouseUp = function( event ) {
	var scope = THREE.CommonClicker;
	scope.PointerDown["right"] = false;
}

THREE.CommonClicker.CreateVRPointer = function(handedness) {
	var rayLength = 30;
	
	var colorDict;
	if (handedness == "left") { // red left
		colorDict = {color: 0xFF9999};
	} else if (handedness = "right") { // blue right
		colorDict = {color: 0x9999FF};
	} else {
		colorDict = {color: 0x99FF99};		
	}
	
	var controllerMaterial = new THREE.MeshStandardMaterial(colorDict);
	
	
	var controllerMesh = new THREE.Mesh(
		new THREE.CylinderGeometry( 0.005, 0.05, 0.1, 6 ),
		controllerMaterial
	);
	var handleMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 0.03, 0.1, 0.03 ),
		controllerMaterial
	);

	var rayMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 0.001, rayLength, 0.001 ),
		controllerMaterial
	);
	
	controllerMaterial.flatShading = true;
	controllerMesh.rotation.x = -Math.PI / 2;
	handleMesh.position.y = -0.05;
	rayMesh.position.y = 0.5*rayLength;
	controllerMesh.add( handleMesh );
	controllerMesh.add( rayMesh );
		
	rayMesh.visible = false;
	controllerMesh.userData.ray = rayMesh;
	return controllerMesh;
}

THREE.CommonClicker.Init = function(scene, camera, renderer, enableVR) {
	var scope = THREE.CommonClicker;
	
	scope.CheckIfOculus();
 
	if (navigator.getVRDisplays)
		scope.supportsVR = true;
	else
		scope.supportsVR = false;

	scope.VRScene = scene;
	scope.VRRenderer = renderer;
	scope.VRDolly = new THREE.Object3D();
	scope.VRCamera = camera;
	
	scope.VRDolly.add(scope.VRCamera);
	
	// TODO: fix z-axis issue: https://github.com/mrdoob/three.js/issues/13753

	
	for (var hand in scope.VRController) {
		if (scope.VRController.hasOwnProperty(hand)) {
				scope.VRScene.add( scope.VRController[hand] );
				scope.VRController[hand].head = scope.VRCamera;
		}
	}
	
	if (!scope.supportsVR) {
		scope.VRCamera.rotateY(Math.PI);		
		scope.VRScene.add(scope.VRDolly);
		// scope.VRDolly.rotateY(Math.PI);
		scope.Controls = new THREE.OrbitControls( scope.VRCamera, scope.VRRenderer.domElement );
		scope.Controls.target.set( 0, 0, 1 );
		var textMesh = scope.TextPanel.GetMesh();
		textMesh.rotateY(Math.PI);
		scope.VRCamera.add(textMesh);
		textMesh.position.set(0,0.5,-2);
	} else {
		// see: https://github.com/stewdio/THREE.VRController/pull/20/files?utf8=%E2%9C%93&diff=unified&w=1
		if (!THREE.CommonClicker.isOculus)
			scope.VRRenderer.vr.standing = true
			
		scope.VRScene.add(scope.VRDolly);
		// not working - controls still in old orientation
		// scope.VRDolly.rotateY(Math.PI);
		
		if (enableVR === undefined || enableVR == true) {
			scope.VRRenderer.vr.enabled  = true;
			document.body.appendChild( WEBVR.createButton( scope.VRRenderer ) );	
		}
	}

	window.addEventListener( 'mousemove', THREE.CommonClicker.OnMouseMove, false );
	window.addEventListener( 'mousedown', THREE.CommonClicker.OnMouseDown, false );
	window.addEventListener( 'mouseup', THREE.CommonClicker.OnMouseUp, false );
}


THREE.CommonClicker.UpdateText = function (textArray) {
	var scope = THREE.CommonClicker;
	scope.TextPanel.RenderText(textArray);
}

THREE.CommonClicker.Update = function () {
	var scope = THREE.CommonClicker;
	
  if (!scope.supportsVR) {
		scope.Controls.update();
	} else {
		// tweak VR position	
		//scope.VRCamera.rotation.y  += Math.PI;
	}

	THREE.VRController.update();
	THREE.CommonClicker.PointerIntersect();
}

THREE.CommonClicker.PointerButtonDown = function(data, hand) {
	var scope = THREE.CommonClicker;
	
	// scope.VRPointer.material.color.setHex( 0x99FF99 );
	scope.VRPointer[hand].userData.ray.visible = true;
	scope.PointerDown[hand] = true;
}

THREE.CommonClicker.PointerButtonUp = function(data, hand) {
	var scope = THREE.CommonClicker;
	
	// scope.VRPointer.material.color.setHex( 0xFF9999 );
	scope.VRPointer[hand].userData.ray.visible = false;
	scope.PointerDown[hand] = false;
}

THREE.CommonClicker.AddPanelButton = function(buttonTextArray, buttonIndex, callback) {
	var scope = THREE.CommonClicker;
	var buttonCube = new THREE.ButtonCube(buttonTextArray, callback);
	buttonCubeMesh = buttonCube.GetMesh();
	buttonCubeMesh.rotateY(Math.PI);
	buttonCubeMesh.scale.set(0.15, 0.15, 0.15);
	buttonCubeMesh.translateX(0.5  - 0.25*buttonIndex);
	buttonCubeMesh.translateY(-0.5);
	scope.TextPanel.GetMesh().add(buttonCubeMesh);
}

THREE.CommonClicker.EnterVR = function() {
	
}

THREE.CommonClicker.ExitVR = function() {
	
}

THREE.CommonClicker.IsInVR = function() {
	var scope = THREE.CommonClicker;
	if (scope.VRRenderer != undefined) {
		return scope.VRRenderer.vr.isPresenting();
	} else {
		return false;
	}
}

THREE.CommonClicker.CheckInVR = function() {
	var scope = THREE.CommonClicker;
	var currentState = scope.IsInVR();
	if (currentState != scope.InVR) {
		if (currentState == true) {
			scope.EnterVR();
		} else {
			scope.ExitVR();
		}
		scope.InVR = currentState;
	}
}

THREE.CommonClicker.PointerIntersect = function() {
	var scope = THREE.CommonClicker;
	// var objs = [];
	// var gotClick = false;

	for (var hand in scope.PointerDown) {
		if (scope.PointerDown.hasOwnProperty(hand)) {
			if (scope.PointerDown[hand] == true) {
				// gotClick = true;
				if (scope.supportsVR) {
					if (scope.VRController[hand] != undefined) {
							// borrowed from DATGuiVR
							const tPosition = new THREE.Vector3();
							const tDirection = new THREE.Vector3( 0, 0, -1 );
							const tMatrix = new THREE.Matrix4();

							var mat = scope.VRController[hand].matrixWorld ;							
							tPosition.set(0,0,0).setFromMatrixPosition( mat );
							tMatrix.identity().extractRotation( mat );
							tDirection.set(0,0,-1).applyMatrix4( tMatrix ).normalize();
						  scope.Raycaster.set(tPosition,  tDirection);
							scope.PointerSelections[hand] = [];
							var objs = scope.Raycaster.intersectObjects( scope.InteractionTargets );
							for ( var i = 0; i < objs.length; i++ ) {
								var obj = objs[ i ];
								if (obj.object.userData.clickCallback != undefined) {
									scope.PointerSelections[hand].push(obj);
								}
							}
					}
				} else {
					var hand = 'right';
					scope.Raycaster.setFromCamera( scope.MousePos, scope.VRCamera );
					scope.PointerSelections[hand] = [];
					var objs = scope.Raycaster.intersectObjects( scope.InteractionTargets );
					for ( var i = 0; i < objs.length; i++ ) {
						var obj = objs[ i ];
						if (obj.object.userData.clickCallback != undefined) {
							scope.PointerSelections[hand].push(obj);
						}
					}
				}
			}
		}
	}			

	for (var hand in scope.PointerDown) {
		if (scope.PointerDown.hasOwnProperty(hand)) {
			if (scope.PointerDown[hand] == false) {
				if (scope.PointerSelections[hand] != '') {
					for ( var i = 0; i < scope.PointerSelections[hand].length; i++ ) {
						scope.PointerSelections[hand][i].object.userData.clickCallback(scope.PointerSelections[hand][i].object);
					}
				}
				scope.PointerSelections[hand] = [];
			}
		}
	}
	// for ( var i = 0; i < objs.length; i++ ) {
	// 	var obj = objs[ i ];
	// 	if (gotClick) {
	// 		if (obj.object.userData.clickCallback != undefined)
	// 			obj.object.userData.clickCallback(obj.object);
	// 	}
	// }
	
}

window.addEventListener( 'vr controller connected', function( event ){
	var scope = THREE.CommonClicker;
	
	// Controller is THREE.Object3D
	var controller = event.detail;
	var hand = controller.hand;

	document.getElementById("info").innerText += "\n" + hand + " CONNECTED";

	if (scope.VRScene !== undefined) {
		scope.VRScene.add( controller );
		controller.head = scope.VRCamera;
		// controller.head = scope.VRDolly;
	}
	
	scope.VRController[hand] = controller;

	if (!scope.isOculus){
		controller.standingMatrix = renderer.vr.getStandingMatrix()
	} else {
		if ( !controller.armModel ) controller.standingMatrix = renderer.vr.getStandingMatrix();
	}

	
	if (scope.VRPointer[hand] == undefined) {
		scope.VRPointer[hand] = THREE.CommonClicker.CreateVRPointer(controller.hand);
		controller.add (scope.VRPointer[hand]);
	}
	
	if (hand == "left") {
		var textMesh = scope.TextPanel.GetMesh();
		textMesh.rotateY(Math.PI);
		scope.VRPointer["left"].add(textMesh);
		textMesh.position.set(0,0.25,-1);
	}


	controller.addEventListener( 'primary press began', function( event ){
		var scope = THREE.CommonClicker;
		scope.PointerButtonDown(event, hand);
	})
	
	controller.addEventListener( 'primary press ended', function( event ){
		var scope = THREE.CommonClicker;
		scope.PointerButtonUp(event, hand);
	})

	controller.addEventListener( 'disconnected', function( event ){
		document.getElementById("info").innerText += "\n" + hand + " DISCONNECTED VIA CONTROLLER";
		var scope = THREE.CommonClicker;
	  controller.remove(scope.VRPointer[hand]);
		if (scope.VRScene === undefined)
			return;
		scope.VRScene.remove(scope.VRPointer[hand]);
		
	})

})
