THREE.MultiSync = function(){};

THREE.MultiSync.prototype = Object.create( THREE.Object3D.prototype )
THREE.MultiSync.prototype.constructor = THREE.MultiSync

THREE.MultiSync.remoteSync = undefined;
THREE.MultiSync.clientId = undefined;
THREE.MultiSync.mirrorRemoteCreateCallback = undefined;
THREE.MultiSync.scene = undefined;
THREE.MultiSync.camera = undefined;

THREE.MultiSync.Init = function(scene, camera, mirrorRemoteCreateCallback) {
	var scope = THREE.MultiSync;
	scope.remoteSync = new THREE.RemoteSync(
												  new THREE.PeerJSClient( {
														// key: ''
												  } )
												);
												
	scope.remoteSync.addEventListener( 'open', scope.onOpen );
	scope.remoteSync.addEventListener( 'close', scope.onClose );
	scope.remoteSync.addEventListener( 'error', scope.onError );
	scope.remoteSync.addEventListener( 'connect', scope.onConnect );
	scope.remoteSync.addEventListener( 'disconnect', scope.onDisconnect );
	scope.remoteSync.addEventListener( 'receive', scope.onReceive );
	scope.remoteSync.addEventListener( 'add', scope.onAdd );
	scope.remoteSync.addEventListener( 'remove', scope.onRemove );
	scope.mirrorRemoteCreateCallback = mirrorRemoteCreateCallback;
	scope.scene = scene;
	scope.camera = camera;
}

THREE.MultiSync.sync = function() {
	var scope = THREE.MultiSync;
	scope.remoteSync.sync();
}

THREE.MultiSync.SceneAddSharedObject = function( mesh ) {
	var scope = THREE.MultiSync;
	scope.addSharedObject(mesh);
	scope.scene.add(mesh);
}

THREE.MultiSync.SceneAddLocalObject = function( mesh, type ) {
	var scope = THREE.MultiSync;
	scope.addLocalObject(mesh, {type: type});
	scope.scene.add(mesh);
}


THREE.MultiSync.onOpen = function( id ) {
	var scope = THREE.MultiSync;
	scope.clientId = id;

	document.getElementById( 'your_id' ).innerText = 'Your ID: ' + id;
	document.getElementById( 'link' ).appendChild( scope.createLink() );
	scope.remoteSync.addLocalObject( scope.camera, { type: 'camera' } );
	scope.connectFromURL();
}

THREE.MultiSync.connectFromURL = function() {
	var scope = THREE.MultiSync;
	var url = location.href;
	var index = url.indexOf( '?' );

	if ( index >= 0 ) {
		var id = url.slice( index + 1 );
		scope.connect( id );
	}
}

THREE.MultiSync.connect = function( id ) {
	var scope = THREE.MultiSync;
	if ( id === scope.clientId ) {
		showMessage( id + ' is your id' );
		return;
	}

	var message = document.getElementById( 'message' );
	scope.showMessage( 'Connecting with ' + id );
	scope.remoteSync.connect( id );
}


THREE.MultiSync.showMessage = function( str ) {
	var scope = THREE.MultiSync;
	var message = document.getElementById( 'message' );
	message.innerText = str;
}


THREE.MultiSync.onClose = function( destId ) {
	var scope = THREE.MultiSync;
	scope.showMessage( 'Disconnected with ' + destId );
}

THREE.MultiSync.onError = function( error ) {
	var scope = THREE.MultiSync;
	scope.showMessage( error );
}

THREE.MultiSync.onConnect = function( destId ) {
	var scope = THREE.MultiSync;
	scope.showMessage( 'Connected with ' + destId );

}

THREE.MultiSync.onDisconnect = function( destId, object ) {
	var scope = THREE.MultiSync;
	scope.showMessage( 'Disconnected with ' + destId );
}


THREE.MultiSync.onReceive = function( data ) {
	var scope = THREE.MultiSync;
}

THREE.MultiSync.onAdd = function( destId, objectId, info ) {
	var scope = THREE.MultiSync;
	var mesh = scope.mirrorRemoteCreateCallback(info.type)
	console.log("created",mesh,"of type",info.type);
	scope.scene.add( mesh );
	scope.remoteSync.addRemoteObject( destId, objectId, mesh );
}

THREE.MultiSync.onRemove = function( destId, objectId, object ) {
	var scope = THREE.MultiSync;
	if ( object.parent !== null ) object.parent.remove( object );
}

THREE.MultiSync.createLink = function() {
	var scope = THREE.MultiSync;
	var a = document.createElement( 'a' );

	var url = location.href;
	var index = url.indexOf( '?' );
	if ( index >= 0 ) url = url.slice( 0, index );

	a.href = url + '?' + scope.clientId;
	a.text = 'Share this link';
	a.target = '_blank';

	return a;
}




