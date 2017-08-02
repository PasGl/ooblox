/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxDiamondSquareGround = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshStandardMaterial({}));
	this.mesh.rotation.x = -Math.PI * 0.5;
	this.mesh.vrObjectTypeID = "DSG";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Ground');
	groupNode.add( datFolder )

	var TPLProperties = function ()	{this.followGUI = true;this.theme = "1";}
	var conf = new TPLProperties();

	var themes = ["1","2","3","4","5"];

	var refreshURL = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		var guiposition = new THREE.Vector3();
		guiposition.setFromMatrixPosition( datFolder.matrixWorld );

		if (conf.followGUI) mesh.position.copy(guiposition.sub(guioffset));
		else guioffset.copy(guiposition.sub(position));

		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				mesh.position.x,
				mesh.position.y,
				mesh.position.z,
				mesh.scale.x,
				mesh.scale.y,
				mesh.scale.z,
				guioffset.x,
				guioffset.y,
				guioffset.z,
				conf.theme]);
	}

	var refresh = function (targetScene)
	{
		var textureFolder = "pattern_265";
		switch (conf.theme)
		{
			case "1":
				textureFolder = "pattern_265";
				break;
			case "2":
				textureFolder = "pattern_266";
				break;
			case "3":
				textureFolder = "pattern_267";
				break;
			case "4":
				textureFolder = "pattern_268";
				break;
			case "5":
				textureFolder = "pattern_269";
				break;
		}
		mesh.material.map = new THREE.TGALoader().load( "images/3D_pattern_53/" + textureFolder + "/diffuse.tga");
		mesh.material.normalMap = new THREE.TGALoader().load( "images/3D_pattern_53/" + textureFolder + "/normal.tga");
		refreshURL(targetScene);
	}

	this.mesh.fillDatGUI = function (targetScene,mesh)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');

		var propFolder = dat.GUIVR.create('Properties');

		var sourceChanger = propFolder.add(conf,'theme',themes);
		sourceChanger.onChange(function(value) {refresh(targetScene);});
		var scxSlider = propFolder.add(mesh.scale,'x',1.0,1000).name("Scale X");
		scxSlider.onChange(function(){refreshURL(targetScene);});
		var scySlider = propFolder.add(mesh.scale,'y',1.0,1000).name("Scale Y");
		scySlider.onChange(function(){refreshURL(targetScene);});
		var sczSlider = propFolder.add(mesh.scale,'z',0.0001,200).name("Scale Z");
		sczSlider.onChange(function(){refreshURL(targetScene);});
		datFolder.addFolder(propFolder);

		var remobj = {myuname: mesh.uname,remove: function(){removeInstance(this.myuname);}};
		datFolder.add(remobj,'remove').name(mesh.uname);

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
		mesh.scale.z = parseFloat(argList[6]);
		guioffset.x = parseFloat(argList[7]);
		guioffset.y = parseFloat(argList[8]);
		guioffset.z = parseFloat(argList[9]);
		conf.theme = argList[10];
		mesh.fillDatGUI(targetScene,mesh);
		refresh(targetScene);
		var event = new Event('vrObjectInstantiated');
		document.dispatchEvent(event);
	}
}

vrObjectConstructorList.push(oobloxDiamondSquareGround); // global list of all available vrObject type constructors
