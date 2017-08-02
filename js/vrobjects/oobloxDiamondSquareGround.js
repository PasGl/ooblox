/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

/**
 * Textures by Nobiax / http://yughues.deviantart.com
 */

oobloxDiamondSquareGround = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.MeshStandardMaterial({}));
	this.mesh.rotation.x = -Math.PI * 0.5;
	this.mesh.vrObjectTypeID = "DSG";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Ground (Texures by Nobiax)');
	groupNode.add( datFolder );

	var heightMaps = [[[0.0,0.0],[0.0,0.0]]];
	var geometries = [new THREE.PlaneGeometry(1, 1, 1, 1)];

	var addIteration = function ()
	{
		var iterationsSoFar = heightMaps.length-1;
		lastheightMap = heightMaps[iterationsSoFar];
		var nextHeightMap = [];


		for(var i = 0; i < lastheightMap.length -1; i ++)
		{
			var thisRow = [];
			var newRow = [];
			for(var j = 0; j < lastheightMap[i].length -1; j ++)
			{
				thisRow.push(lastheightMap[i][j]);
				thisRow.push(0.0);
				newRow.push(0.0);
				newRow.push(0.0);
			}
			thisRow.push(lastheightMap[i][lastheightMap[i].length -1]);
			newRow.push(0.0);
			nextHeightMap.push(thisRow);
			nextHeightMap.push(newRow);
		}
		
		var lastRow = [];
		for(var j = 0; j < lastheightMap[lastheightMap.length -1].length -1; j ++)
		{
			lastRow.push(lastheightMap[lastheightMap.length -1][j]);
			lastRow.push(0.0);
		}
		lastRow.push(lastheightMap[lastheightMap.length -1][lastheightMap[lastheightMap.length -1].length -1]);
		nextHeightMap.push(lastRow);

		heightMaps.push(nextHeightMap);
		geometries.push(new THREE.PlaneGeometry(1, 1, Math.pow(2,iterationsSoFar+1), Math.pow(2,iterationsSoFar+1)));

		var geoindex = 0;

		for(var i = 0; i < nextHeightMap.length; i ++)
		{
			for(var j = 0; j < nextHeightMap[i].length; j ++)
			{
				geometries[geometries.length-1].vertices[geoindex].z = nextHeightMap[i][j];
				geoindex++;
			}
		}
	}

	var TPLProperties = function ()	{
		this.followGUI = true;
		this.theme = "1";
		this.randomSeed = 1234567;
		this.iterations = 0;
		this.textureRepsX = 2.0;
		this.textureRepsY = 2.0;
	};
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
		mesh.material.map.wrapS = THREE.RepeatWrapping;
		mesh.material.map.wrapT = THREE.RepeatWrapping;
		mesh.material.map.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.normalMap = new THREE.TGALoader().load( "images/3D_pattern_53/" + textureFolder + "/normal.tga");
		mesh.material.normalMap.wrapS = THREE.RepeatWrapping;
		mesh.material.normalMap.wrapT = THREE.RepeatWrapping;
		mesh.material.normalMap.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.emissiveMap = new THREE.TGALoader().load( "images/3D_pattern_53/" + textureFolder + "/specular.tga");
		mesh.material.emissiveMap.wrapS = THREE.RepeatWrapping;
		mesh.material.emissiveMap.wrapT = THREE.RepeatWrapping;
		mesh.material.emissiveMap.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.emissive = new THREE.Color( 0x555555 );
		mesh.material.metalness = 0.1;
		mesh.material.roughness = 0.5;
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
		propFolder.add(mesh.material,'wireframe').name("Wireframe");
		datFolder.addFolder(propFolder);

		var remobj = {myuname: mesh.uname,remove: function(){removeInstance(this.myuname);}};
		datFolder.add(remobj,'remove').name(mesh.uname);

		targetScene.add( groupNode );
		window.addEventListener("mouseup", function(){refreshURL(targetScene);})
	}

	this.load = function (targetScene, camera)
	{
		heightMaps = [[[0.0,0.0],[0.0,0.0]]];
		geometries = [new THREE.PlaneGeometry(1, 1, 1, 1)];
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
		addIteration();
		mesh.geometry = geometries[geometries.length-1];
	}
}

vrObjectConstructorList.push(oobloxDiamondSquareGround); // global list of all available vrObject type constructors
