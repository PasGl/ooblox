/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxTexturePanel = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshPhongMaterial({}));
	this.mesh.vrObjectTypeID = "TPL";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Texture Panel');
	groupNode.add( datFolder )

	var TPLProperties = function ()
	{
		this.followGUI = true;	
	}

	var conf = new TPLProperties();


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
				mesh.scale.x,
				mesh.scale.y,
				mesh.rotation.x,
				mesh.rotation.y,
				mesh.rotation.z,
				guioffset.x,
				guioffset.y,
				guioffset.z,
				encodeURIComponent(conf.textureFilename)]);
	}

	var refresh = function (targetScene)
	{
		mesh.material.map = new THREE.TextureLoader().load( conf.textureFilename );
		refreshURL(targetScene);
	}

	this.mesh.fillDatGUI = function (targetScene,mesh)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');

		var propFolder = dat.GUIVR.create('Properties');
		var scxSlider = propFolder.add(mesh.scale,'x',0.0001,100).name("Scale X");
		scxSlider.onChange(function(){refreshURL(targetScene);});
		var scySlider = propFolder.add(mesh.scale,'y',0.0001,100).name("Scale Y");
		scySlider.onChange(function(){refreshURL(targetScene);});
		var rotxSlider = propFolder.add(mesh.rotation,'x',0.0,Math.PI*2.0).name("Rotation X");
		rotxSlider.onChange(function(){refreshURL(targetScene);});
		var rotySlider = propFolder.add(mesh.rotation,'y',0.0,Math.PI*2.0).name("Rotation Y");;
		rotySlider.onChange(function(){refreshURL(targetScene);});
		var rotzSlider = propFolder.add(mesh.rotation,'z',0.0,Math.PI*2.0).name("Rotation Z");;
		rotzSlider.onChange(function(){refreshURL(targetScene);});
		datFolder.addFolder(propFolder);

		targetScene.add( groupNode );
		window.addEventListener("mouseup", function(){refreshURL(targetScene);})
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(mesh.uname);
		mesh.position.x = parseFloat(argList[1]);
		mesh.position.y = parseFloat(argList[2]);
		mesh.position.z = parseFloat(argList[3]);
		mesh.scale.x = parseFloat(argList[4]);
		mesh.scale.y = parseFloat(argList[5]);
		mesh.rotation.x = parseFloat(argList[6]);
		mesh.rotation.y = parseFloat(argList[7]);
		mesh.rotation.z = parseFloat(argList[8]);
		guioffset.x = parseFloat(argList[9]);
		guioffset.y = parseFloat(argList[10]);
		guioffset.z = parseFloat(argList[11]);
		conf.textureFilename = decodeURIComponent(argList.slice(12).join(""));
		this.mesh.fillDatGUI(targetScene,this.mesh);
		refresh(targetScene);
	}
}

vrObjectConstructorList.push(oobloxTexturePanel); // global list of all available vrObject type constructors
