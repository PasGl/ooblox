/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxTorusKnot = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({}));
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.mesh.vrObjectTypeID = "TTK";

	var mesh=this.mesh;

	var TorusKnotProperties = function ()
	{
		this.radius = 5;
		this.tube = 0.5;
		this.radialSegments = 200;
		this.tubularSegments = 16;
		this.p = 3;
		this.q = 7;	
	}

	var conf = new TorusKnotProperties();

	var refresh = function ()
	{
		mesh.geometry = new THREE.TorusKnotGeometry(
		conf.radius,
		conf.tube,
		conf.radialSegments,
		conf.tubularSegments,
		conf.p,
		conf.q);

		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				mesh.position.x,
				mesh.position.y,
				mesh.position.z,
				mesh.scale.x,
				mesh.scale.y,
				mesh.scale.z,
				mesh.quaternion.x,
				mesh.quaternion.y,
				mesh.quaternion.z,
				mesh.quaternion.w,
				conf.radius,
				conf.tube,
				conf.radialSegments,
				conf.tubularSegments,
				conf.p,
				conf.q]);
	}
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		mesh.geometry.computeBoundingBox();
		var datFolder = dat.GUIVR.create(mesh.uname+' (Torus Knot)');
		datFolder.position.copy(mesh.position);
		datFolder.position.z += mesh.geometry.boundingBox.max.z;
		datFolder.position.x += mesh.geometry.boundingBox.max.x*0.5;
		datFolder.position.y += mesh.geometry.boundingBox.max.y*0.5;
		datFolder.scale.set(20.0,20.0,0.1);
		var radiusSlider = datFolder.add(conf,'radius',0.0001,20);
		radiusSlider.onChange(refresh);
		var tubeSlider = datFolder.add(conf,'tube',0.0001,2);
		tubeSlider.onChange(refresh);
		var radialSegmentsSlider = datFolder.add(conf,'radialSegments',8,300).step(1);
		radialSegmentsSlider.onChange(refresh);
		var tubularSegmentsSlider = datFolder.add(conf,'tubularSegments',3,32).step(1);
		tubularSegmentsSlider.onChange(refresh);
		var pSlider = datFolder.add(conf,'p',0,32).step(1);
		pSlider.onChange(refresh);
		var qSlider = datFolder.add(conf,'q',0,32).step(1);
		qSlider.onChange(refresh);

		var posFolder = dat.GUIVR.create('Position');
		var posXSlider = posFolder.add(mesh.position,'x',-200.0,200.0);
		posXSlider.onChange(refresh);
		var posYSlider = posFolder.add(mesh.position,'y',-200.0,200.0);
		posYSlider.onChange(refresh);
		var posZSlider = posFolder.add(mesh.position,'z',-200.0,200.0);
		posZSlider.onChange(refresh);
		datFolder.addFolder(posFolder);

		var scaleFolder = dat.GUIVR.create('Scale');
		var scaleXSlider = scaleFolder.add(mesh.scale,'x',0.01,20.0);
		scaleXSlider.onChange(refresh);
		var scaleYSlider = scaleFolder.add(mesh.scale,'y',0.01,20.0);
		scaleYSlider.onChange(refresh);
		var scaleZSlider = scaleFolder.add(mesh.scale,'z',0.01,20.0);
		scaleZSlider.onChange(refresh);
		datFolder.addFolder(scaleFolder);

		var rotFolder = dat.GUIVR.create('Rotation');
		var rotXSlider = rotFolder.add(mesh.rotation,'x').min(0).max(Math.PI * 2).step(0.001);
		rotXSlider.onChange(refresh);
		var rotYSlider = rotFolder.add(mesh.rotation,'y').min(0).max(Math.PI * 2).step(0.001);
		rotYSlider.onChange(refresh);
		var rotZSlider = rotFolder.add(mesh.rotation,'z').min(0).max(Math.PI * 2).step(0.001);
		rotZSlider.onChange(refresh);
		datFolder.addFolder(rotFolder);

		targetScene.add( datFolder );
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

		conf.radius = parseFloat(argList[11]);
		conf.tube = parseFloat(argList[12]);
		conf.radialSegments = parseInt(argList[13]);
		conf.tubularSegments = parseInt(argList[14]);
		conf.p = parseInt(argList[15]);
		conf.q = parseInt(argList[16]);

		this.mesh.quaternion.copy(rotation);
		this.mesh.position.copy(position);
		this.mesh.scale.copy(scale);

		targetScene.add(this.mesh);

		refresh();

		this.mesh.fillDatGUI(targetScene);

		
	}
}

vrObjectConstructorList.push(oobloxTorusKnot); // global list of all available vrObject type constructors
