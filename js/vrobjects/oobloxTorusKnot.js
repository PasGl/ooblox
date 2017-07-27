/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxTorusKnot = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({metalness: 0.01,roughness: 0.3}));
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.mesh.vrObjectTypeID = "TTK";
	var mesh=this.mesh;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Torus Knot');
	groupNode.add( datFolder );

	var TorusKnotProperties = function ()
	{
		this.radius = 5;
		this.tube = 0.5;
		this.radialSegments = 200;
		this.tubularSegments = 16;
		this.p = 3;
		this.q = 7;
		this.followGUI = true;	
	}

	var conf = new TorusKnotProperties();

	var refreshURL = function (targetScene)
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
				conf.radius,
				conf.tube,
				conf.radialSegments,
				conf.tubularSegments,
				conf.p,
				conf.q,
				guioffset.x,
				guioffset.y,
				guioffset.z]);
	}

	var refresh = function (targetScene)
	{
		mesh.geometry = new THREE.TorusKnotGeometry(
		conf.radius,
		conf.tube,
		conf.radialSegments,
		conf.tubularSegments,
		conf.p,
		conf.q);
		refreshURL(targetScene);
	}
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		//mesh.scale.set(0.05,0.05,10.0);

		var followFlag = datFolder.add(conf,'followGUI');

		var propFolder = dat.GUIVR.create('Properties');
		var radiusSlider = propFolder.add(conf,'radius',0.0001,20);
		radiusSlider.onChange(function(){refresh(targetScene);});
		var tubeSlider = propFolder.add(conf,'tube',0.0001,2);
		tubeSlider.onChange(function(){refresh(targetScene);});
		var radialSegmentsSlider = propFolder.add(conf,'radialSegments',8,500).step(1);
		radialSegmentsSlider.onChange(function(){refresh(targetScene);});
		var tubularSegmentsSlider = propFolder.add(conf,'tubularSegments',3,32).step(1);
		tubularSegmentsSlider.onChange(function(){refresh(targetScene);});
		var pSlider = propFolder.add(conf,'p',0,32).step(1);
		pSlider.onChange(function(){refresh(targetScene);});
		var qSlider = propFolder.add(conf,'q',0,32).step(1);
		qSlider.onChange(function(){refresh(targetScene);});
		datFolder.addFolder(propFolder);

		var matFolder = dat.GUIVR.create('Material');
		matFolder.add(mesh.material,'visible');
		matFolder.add(mesh.material,'wireframe');
		matFolder.add(mesh.material,'wireframeLinewidth',1,20).name("wire width").step(1);
		matFolder.add(mesh.material,'metalness',0.0,1.0);
		matFolder.add(mesh.material,'roughness',0.0,1.0);
		matFolder.add(mesh.material,'color');
		datFolder.addFolder(matFolder);

		var remobj = {myuname: mesh.uname,remove: function(){removeInstance(this.myuname);}};
		datFolder.add(remobj,'remove').name(mesh.uname);

		window.addEventListener("mouseup", function(){refreshURL(targetScene);});
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var position = new THREE.Vector3();
		position.x = parseFloat(argList[1]);
		position.y = parseFloat(argList[2]);
		position.z = parseFloat(argList[3]);
		conf.radius = parseFloat(argList[4]);
		conf.tube = parseFloat(argList[5]);
		conf.radialSegments = parseInt(argList[6]);
		conf.tubularSegments = parseInt(argList[7]);
		conf.p = parseInt(argList[8]);
		conf.q = parseInt(argList[9]);
		guioffset.x = parseFloat(argList[10]);
		guioffset.y = parseFloat(argList[11]);
		guioffset.z = parseFloat(argList[12]);
		this.mesh.position.copy(position);
		this.mesh.fillDatGUI(targetScene);
		targetScene.add( groupNode );
		refresh(targetScene);	
	}
}

vrObjectConstructorList.push(oobloxTorusKnot); // global list of all available vrObject type constructors
