# THREE.CommonClicker

Simple single-button abstraction for single-click threejs Raycaster Desktop (mouse) + VR (controller) using [three.js](https://github.com/mrdoob/three.js/) and [THREE.VRController](https://github.com/stewdio/THREE.VRController). Updated to work with THREE.r95 and Oculus Go.

## Usage
Requires ThreeJS + WebVR + OrbitControls + THREE.VRController:

```
<script src="https://cdn.rawgit.com/mrdoob/three.js/r95/build/three.js"></script>
<script src="https://cdn.rawgit.com/mrdoob/three.js/r95/examples/js/vr/WebVR.js"></script>
<script src="https://cdn.rawgit.com/mrdoob/three.js/r95/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdn.rawgit.com/stewdio/THREE.VRController/master/VRController.js"></script>
```

Inlcude CommonClicker:

```
<script src="VRCommonClicker.js"></script>
```

Create your interaction objects to be raycast against - put your callbacks into the `.userData.clickCallback` for actions on click, and `.userData.hoverCallback` for actions on hover. For example:

```
var populateInteractionTargetsRandomly = function(num, scene) {
	var scope = THREE.CommonClicker;
	var MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0xFFEEEE});

	for ( var i = 0; i < num; i++ ) {
		var cubeMesh = new THREE.Mesh(
			new THREE.BoxGeometry( 0.5, 0.5, 0.5 ),
			new THREE.MeshStandardMaterial({color: 0xFFEEEE})
		);
		cubeMesh.position.x = Math.random() * 10 - 5;
		cubeMesh.position.y = Math.random() * 10 - 5;
		cubeMesh.position.z = Math.random() * 10 - 5;
		scope.InteractionTargets.push(cubeMesh);
		scene.add(cubeMesh);

		cubeMesh.userData.clickCallback = function(obj) {
			obj.material.color.setHex( 0x99FF99 );
		};

		cubeMesh.userData.hoverCallback = function(obj) {
			obj.material.color.setHex( 0x9999FF );
		};
	}	
}
```

Initialize CommonClicker using the scene, camera and renderer:
```
THREE.CommonClicker.Init(scene, camera, renderer);	
```

and update it before render in your render loop:
```
THREE.CommonClicker.Update();
```


## Example
See `CommonClickerTest.html` in the repo.

