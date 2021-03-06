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
	this.mesh.traverse(function(e) {
		if (e instanceof THREE.Mesh) {
			e.receiveShadow = true;
			e.castShadow = true;
		}
	});
	this.mesh.vrObjectTypeID = "MET";
	var mesh=this.mesh;
	var tockIsLoaded = false;
	var tickortock = true;
	var timer;
	var animT = 0.0;
	var animStartTime = 0.0;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Metronome');
	groupNode.add( datFolder )

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
		this.followGUI = true;
	};
	var conf = new MetronomeProperties();

	var urlRefresh = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		var guiposition = new THREE.Vector3();
		guiposition.setFromMatrixPosition( datFolder.matrixWorld );

		if (conf.followGUI)
		{
			mesh.position.copy(guiposition.sub(guioffset));
		}
		else
		{
			guioffset.copy(guiposition.sub(position));
		}

		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				mesh.position.x,
				mesh.position.y,
				mesh.position.z,
				conf.BPM,
				conf.pause.toString(),
				guioffset.x,
				guioffset.y,
				guioffset.z]);
	}

	var refresh = function (targetScene)
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
				if (tickortock)	mesh.rotation.z = Math.sin(animT*1.0*Math.PI);
				else mesh.rotation.z = -Math.sin(animT*1.0*Math.PI);
			}
		}
		urlRefresh(targetScene);
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');
		var bpmSlider = datFolder.add(conf,'BPM',1,300).step(1);
		bpmSlider.onChange(function(){refresh(targetScene);});
		var pauseSwitch = datFolder.add(conf,'pause');
		pauseSwitch.onChange(function(){refresh(targetScene);});
		var remobj = {myuname: mesh.uname,remove: function(){removeInstance(this.myuname);}};
		datFolder.add(remobj,'remove').name(mesh.uname);

		targetScene.add( groupNode );
		refresh(targetScene);
		window.addEventListener("mouseup", function(){urlRefresh(targetScene);})
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
		conf.BPM = parseFloat(argList[4]);
		conf.pause = Boolean(argList[5]=="true");
		guioffset.x = parseFloat(argList[6]);
		guioffset.y = parseFloat(argList[7]);
		guioffset.z = parseFloat(argList[8]);
		mesh.add( tocksound );
		mesh.position.copy(position);
		camera.add( listener );
		this.mesh.fillDatGUI(targetScene);
		var event = new Event('vrObjectInstantiated');
		document.dispatchEvent(event);
	}
}

vrObjectConstructorList.push(oobloxMetronome); // global list of all available vrObject type constructors
