/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxMetronome = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({metalness: 0.5, roughness: 0.12}));
	var pendulum = new THREE.Mesh( new THREE.BoxGeometry(0.5, 9, 0.5), new THREE.MeshStandardMaterial({metalness: 0.5, roughness: 0.12}));
	pendulum.position.y = -5.0;
	this.mesh.add(pendulum);
	var ball = new THREE.Mesh( new THREE.SphereGeometry(2, 64, 64), new THREE.MeshStandardMaterial({metalness: 0.5, roughness: 0.12}));
	ball.position.y = -10.0;
	ball.scale.z = 0.5;
	this.mesh.add(ball);
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;

	this.mesh.vrObjectTypeID = "MET";

	var mesh=this.mesh;

	var tockIsLoaded = false;
	var tickortock = true;

	var timer;
	var animT = 0.0;
	var animStartTime = 0.0;

	var listener = new THREE.AudioListener();
	var audioLoader = new THREE.AudioLoader();
	var tocksound = new THREE.PositionalAudio( listener );
	audioLoader.load( 'sounds/tock.ogg', function( buffer ) {
		tocksound.setBuffer( buffer );
		tocksound.setRefDistance( 20 );
		tockIsLoaded = true;
	});

	var MetronomeProperties = function ()
	{
		this.BPM = 128.0;
		this.pause = false;
	};
	var conf = new MetronomeProperties();
	var refresh = function ()
	{
		clearInterval(timer);
		mesh.onBeforeRender = function ( renderer, scene, camera, geometry, material, group ){};
		if (!conf.pause)	
		{
			timer = setInterval(function () { 
				if (tockIsLoaded) {tocksound.play();}
				animT = 0.0;
				tickortock=!tickortock;}, 60000.0/conf.BPM);
			animStartTime = Date.now();
			mesh.onBeforeRender = function( renderer, scene, camera, geometry, material, group )
			{
				var now = Date.now();
				animT += ((now - animStartTime) /  (60000.0/conf.BPM));
				animStartTime = now;
				//console.log(animT);
				if (tickortock)	mesh.rotation.z = Math.sin(animT*1.0*Math.PI);
				else mesh.rotation.z = -Math.sin(animT*1.0*Math.PI);
			}
		}

		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );

		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z,
				mesh.scale.x,
				mesh.scale.y,
				mesh.scale.z,
				mesh.quaternion.x,
				mesh.quaternion.y,
				mesh.quaternion.z,
				mesh.quaternion.w,
				conf.BPM,
				conf.pause.toString()]);
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		var datFolder = dat.GUIVR.create('Metronome');
		datFolder.position.copy(mesh.position);
		datFolder.position.z -= 1.0;
		datFolder.scale.set(20.0,20.0,0.1);
		mesh.scale.set(0.05,0.05,10.0);
		
		var bpmSlider = datFolder.add(conf,'BPM',1,300).step(1);
		bpmSlider.onChange(refresh);
		var pauseSwitch = datFolder.add(conf,'pause');
		pauseSwitch.onChange(refresh);

		targetScene.add( datFolder );
		datFolder.close();
		datFolder.children[0].add(mesh);
	}

	this.mesh.kill = function ()
	{
		clearInterval(timer);
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var position = new THREE.Vector3();
		position.x = parseFloat(argList[1]);
		position.y = parseFloat(argList[2]);
		position.z = parseFloat(argList[3]);
		var scale = new THREE.Vector3();
		scale.x = parseFloat(argList[4]);
		scale.y = parseFloat(argList[5]);
		scale.z = parseFloat(argList[6]);
		var rotation = new THREE.Quaternion();
		rotation.x = parseFloat(argList[7]);
		rotation.y = parseFloat(argList[8]);
		rotation.z = parseFloat(argList[9]);
		rotation.w = parseFloat(argList[10]);

		conf.BPM = parseFloat(argList[11]);
		conf.pause = Boolean(argList[12]=="true");

		mesh.add( tocksound );

		mesh.quaternion.copy(rotation);
		mesh.position.copy(position);
		mesh.scale.copy(scale);

		//targetScene.add(mesh);

		camera.add( listener );

		this.mesh.fillDatGUI(targetScene);

		refresh();
	}
}

vrObjectConstructorList.push(oobloxMetronome); // global list of all available vrObject type constructors
