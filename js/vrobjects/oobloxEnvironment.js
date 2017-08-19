/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

/**
 * Skybox Textures by Heiko Irrgang / https://93i.de/p/free-skybox-texture-set/
 *
 * Ground Textures by Yughues / http://yughues.deviantart.com
 */

oobloxEnvironment = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.MeshPhongMaterial({}));
	this.mesh.rotation.x = -Math.PI * 0.5;
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.mesh.vrObjectTypeID = "ENV";
	this.mesh.skyboxSettings = {theme: "ThickCloudsWater"};
	var mesh=this.mesh;
	var guioffset = new THREE.Vector3();
	var skyboxSettings = this.mesh.skyboxSettings;

	var datFolder = dat.GUIVR.create('ooBlox Environment');

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.add(datFolder);
	groupNode.name = "vrObjectGroup";

	var hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );

	var heightMaps = [[[0.0,0.0],[0.0,0.0]]];
	var geometries = [new THREE.PlaneGeometry(1, 1, 1, 1)];
	var currentSeed = 123;

	var textureFolder = "pattern_265";
	var groundColor = 0x9d8851;

	function seededRandom() 
	{
			var x = Math.sin(currentSeed++) * 10000;
			return x - Math.floor(x);
	}

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
				thisRow.push((0.5*(lastheightMap[i][j]+lastheightMap[i][j+1])) + ((seededRandom()-0.5)*(Math.pow(0.5,iterationsSoFar))));
				newRow.push((0.5*(lastheightMap[i][j]+lastheightMap[i+1][j])) + ((seededRandom()-0.5)*(Math.pow(0.5,iterationsSoFar))));
				newRow.push(0.0);
			}
			thisRow.push(lastheightMap[i][lastheightMap[i].length -1]);
			newRow.push((0.5*(lastheightMap[i][lastheightMap[i].length -1] + lastheightMap[i+1][lastheightMap[i].length -1] )) + ((seededRandom()-0.5)*(Math.pow(0.5,iterationsSoFar))));
			nextHeightMap.push(thisRow);
			nextHeightMap.push(newRow);
		}
		
		var lastRow = [];
		for(var j = 0; j < lastheightMap[lastheightMap.length -1].length -1; j ++)
		{
			lastRow.push(lastheightMap[lastheightMap.length -1][j]);
			lastRow.push((0.5*(lastheightMap[lastheightMap.length -1][j]+lastheightMap[lastheightMap.length -1][j+1])) + ((seededRandom()-0.5)*(Math.pow(0.5,iterationsSoFar))));
		}
		lastRow.push(lastheightMap[lastheightMap.length -1][lastheightMap[lastheightMap.length -1].length -1]);
		nextHeightMap.push(lastRow);

		heightMaps.push(nextHeightMap);
		geometries.push(new THREE.PlaneGeometry(1, 1, Math.pow(2,iterationsSoFar+1), Math.pow(2,iterationsSoFar+1)));

		for(var i = 1; i < nextHeightMap.length; i+=2)
		{
			for(var j = 1; j < nextHeightMap[i].length; j+=2)
				nextHeightMap[i][j] = 	(0.25 * (nextHeightMap[i-1][j]+nextHeightMap[i+1][j]+nextHeightMap[i][j-1]+nextHeightMap[i][j+1])) + 
							((seededRandom()-0.5)*(Math.pow(0.5,iterationsSoFar+1)));
		}

		var geoindex = 0;

		for(var i = 0; i < nextHeightMap.length; i ++)
		{
			for(var j = 0; j < nextHeightMap[i].length; j ++)
			{
				geometries[geometries.length-1].vertices[geoindex].z = nextHeightMap[i][j];
				geoindex++;
			}
		}

		geometries[geometries.length-1].normalsNeedUpdate = true;
		geometries[geometries.length-1].computeFaceNormals();
	}

	var TPLProperties = function ()	{
		this.theme = "dirt";
		this.randomSeed = 1234567;
		this.iterations = 0;
		this.textureRepsX = 2.0;
		this.textureRepsY = 2.0;
	};
	var conf = new TPLProperties();

	var themes = ["dirt","alienmold","arid","glacial","whitestone","mossy","drygrass","grass","sand","clay"];
	var themenames = ["CloudyLightRays","DarkStormy","FullMoon","SunSet","ThickCloudsWater","TropicalSunnyDay"];

	var refreshURL = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		var guiposition = new THREE.Vector3();
		guiposition.setFromMatrixPosition( datFolder.matrixWorld );

		guioffset.copy(guiposition.sub(position));

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
				conf.textureRepsX,
				conf.textureRepsY,
				conf.randomSeed,
				conf.iterations,
				conf.theme,
				skyboxSettings.theme]);
	}

	var refreshGeometry = function (targetScene)
	{
		while (geometries.length < (conf.iterations+1))
		{addIteration();}
		mesh.geometry = geometries[conf.iterations];
	}

	var refreshGroundTextureReps = function (targetScene)
	{
		mesh.material.map.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.normalMap.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.specularMap.repeat.set( conf.textureRepsX , conf.textureRepsY);
	}

	var refreshGroundTexture = function (targetScene)
	{
		switch (conf.theme)
		{
			case "dirt":
				textureFolder = "pattern_265";
				groundColor = 0x7c7d63;
				break;
			case "alienmold":
				textureFolder = "pattern_266";
				groundColor = 0x515945;
				break;
			case "arid":
				textureFolder = "pattern_267";
				groundColor = 0x656762;
				break;
			case "glacial":
				textureFolder = "pattern_268";
				groundColor = 0xd1d2d1;
				break;
			case "whitestone":
				textureFolder = "pattern_269";
				groundColor = 0xbbc1bb;
				break;
			case "mossy":
				textureFolder = "pattern_42";
				groundColor = 0xd2ce7d;
				break;
			case "drygrass":
				textureFolder = "pattern_43";
				groundColor = 0xe1c583;
				break;
			case "grass":
				textureFolder = "pattern_44";
				groundColor = 0xa59978;
				break;
			case "sand":
				textureFolder = "pattern_45";
				groundColor = 0xc8b89e;
				break;
			case "clay":
				textureFolder = "pattern_46";
				groundColor = 0x714f39;
				break;
		}
		mesh.material.map = new THREE.TGALoader().load( "images/Yughues_patterns/" + textureFolder + "/diffuse.tga");
		mesh.material.map.wrapS = THREE.RepeatWrapping;
		mesh.material.map.wrapT = THREE.RepeatWrapping;
		mesh.material.map.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.map.anisotropy = 16;
		mesh.material.normalMap = new THREE.TGALoader().load( "images/Yughues_patterns/" + textureFolder + "/normal.tga");
		mesh.material.normalMap.wrapS = THREE.RepeatWrapping;
		mesh.material.normalMap.wrapT = THREE.RepeatWrapping;
		mesh.material.normalMap.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.normalMap.anisotropy = 16;
		mesh.material.specularMap = new THREE.TGALoader().load( "images/Yughues_patterns/" + textureFolder + "/specular.tga");
		mesh.material.specularMap.wrapS = THREE.RepeatWrapping;
		mesh.material.specularMap.wrapT = THREE.RepeatWrapping;
		mesh.material.specularMap.repeat.set( conf.textureRepsX , conf.textureRepsY);
		mesh.material.specularMap.anisotropy = 16;
		mesh.material.specular = new THREE.Color( 0x555555 );
	}

	var refreshHemiLight = function (targetScene)
	{
		if (themenames.indexOf(skyboxSettings.theme) >=0 )
		{
			var skyboxname = skyboxSettings.theme;
			targetScene.remove( hemiLight );

			var dirLight = targetScene.getObjectByName( "dirLight" );
			dirLight.myPosition.set( -400, 1400, 400 );

			switch (skyboxname) {
			    case "CloudyLightRays":
				hemiLight = new THREE.HemisphereLight( 0xbeb6ab, groundColor, 0.5 );
				dirLight.myPosition.set( 1040, 1100, -450 );
				dirLight.intensity = 0.4;
				dirLight.color.setHex( 0xfff5d0 );
				break;
			    case "DarkStormy":
				hemiLight = new THREE.HemisphereLight( 0x404141, groundColor, 0.5 );
				dirLight.myPosition.set( 0, 500, 1570 );
				dirLight.intensity = 0.25;
				dirLight.color.setHex( 0xdfd7ca );
				break;
			    case "FullMoon":
				hemiLight = new THREE.HemisphereLight( 0x08090b, groundColor, 0.3 );
				dirLight.myPosition.set( 510, 480, -1380 );
				dirLight.intensity = 0.8;
				dirLight.color.setHex( 0xfefefe );
				break;
			    case "SunSet":
				hemiLight = new THREE.HemisphereLight( 0x7d6452, groundColor, 0.6 );
				dirLight.myPosition.set( 690, 100, -1460 );
				dirLight.intensity = 0.8;
				dirLight.color.setHex( 0xffffbd );
				break;
			    case "ThickCloudsWater":
				hemiLight = new THREE.HemisphereLight( 0x607d98, groundColor, 0.95 );
				dirLight.myPosition.set( 1430, 100, -950 );
				dirLight.intensity = 0.35;
				dirLight.color.setHex( 0xfef499 );
				break;
			    case "TropicalSunnyDay":
				hemiLight = new THREE.HemisphereLight( 0x77a6cd, groundColor, 0.95 );
				dirLight.myPosition.set( 1390, 520, 550 );
				dirLight.intensity = 0.95;
				dirLight.color.setHex( 0xffffff );
				break;
			}
			targetScene.add( hemiLight );
		}
	}

	var refreshSkybox = function (targetScene)
	{
		if (themenames.indexOf(skyboxSettings.theme) >=0 )
		{
			var skyboxname = skyboxSettings.theme;

			switch (skyboxname) {
			    case "CloudyLightRays":
				targetScene.fog = new THREE.Fog( 0x42474c, 1, 800 );
				break;
			    case "DarkStormy":
				targetScene.fog = new THREE.Fog( 0x222629, 1, 500 );
				break;
			    case "FullMoon":
				targetScene.fog = new THREE.Fog( 0x1c2022, 1, 300 );
				break;
			    case "SunSet":
				targetScene.fog = new THREE.Fog( 0x414544, 1, 900 );
				break;
			    case "ThickCloudsWater":
				targetScene.fog = new THREE.Fog( 0x5e4b3f, 1, 900 );
				break;
			    case "TropicalSunnyDay":
				targetScene.fog = new THREE.Fog( 0xf7f9f4, 400, 1300 );
				break;
			}
			var urls = [  skyboxname + "Front2048.png", skyboxname + "Back2048.png",
				skyboxname + "Up2048-rot270.png", skyboxname + "Down2048-rot90.png",
				skyboxname + "Right2048.png", skyboxname + "Left2048.png" ];
			var skyboxpath ="images/SkyboxSet1/"+skyboxname+"/";
			var textureCube	= new THREE.CubeTextureLoader().setPath(skyboxpath).load(urls);
			textureCube.format = THREE.RGBFormat;
			targetScene.background = textureCube;
		}
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);



		var skyFolder = dat.GUIVR.create('Sky (Textures by Heiko Irrgang)');
		var skythemeChanger = skyFolder.add(skyboxSettings,'theme',themenames);
		skythemeChanger.onChange(function(value) {refreshSkybox(targetScene);refreshHemiLight(targetScene);refreshURL(targetScene);});

//		var dirLight = targetScene.getObjectByName( "dirLight" );
//		var dirLightPosXSlider = skyFolder.add(dirLight.myPosition,'x',-2000,2000).listen();
//		var dirLightPosYSlider = skyFolder.add(dirLight.myPosition,'y',0,2000).listen();
//		var dirLightPosZSlider = skyFolder.add(dirLight.myPosition,'z',-2000,2000).listen();

		datFolder.addFolder(skyFolder);

		var propFolder = dat.GUIVR.create('Ground (Textures by Yughues)');
		var randomSeedSlider = propFolder.add(conf,'randomSeed',0,99999999).step(1);
		randomSeedSlider.onChange(function(){
			heightMaps = [[[0.0,0.0],[0.0,0.0]]];
			geometries = [new THREE.PlaneGeometry(1, 1, 1, 1)];
			currentSeed = conf.randomSeed;
			refreshGeometry(targetScene);
			refreshURL(targetScene);
		});

		var iterSlider = propFolder.add(conf,'iterations',0,9).step(1);
		iterSlider.onChange(function(value) {
			refreshGeometry(targetScene);
			refreshURL(targetScene);
		});

		var sourceChanger = propFolder.add(conf,'theme',themes);
		sourceChanger.onChange(function(value) {refreshGroundTexture(targetScene);refreshHemiLight(targetScene);refreshURL(targetScene);});
		var scxSlider = propFolder.add(mesh.scale,'x',1.0,4000.0).name("Width").step(1);
		scxSlider.onChange(function(){refreshURL(targetScene);});
		var scySlider = propFolder.add(mesh.scale,'y',1.0,4000.0).name("Length").step(1);
		scySlider.onChange(function(){refreshURL(targetScene);});
		var sczSlider = propFolder.add(mesh.scale,'z',0.0001,2000.0).name("Height").step(0.01);
		sczSlider.onChange(function(){refreshURL(targetScene);});

		var posYSlider = propFolder.add(mesh.position,'y',-500.0,500.0).name("Elevation").step(0.01);
		posYSlider.onChange(function(){refreshURL(targetScene);});


		var textureRepsXSlider = propFolder.add(conf,'textureRepsX',1.0,100.0).name("Texture Repeats X");
		textureRepsXSlider.onChange(function(){refreshGroundTextureReps(targetScene);refreshURL(targetScene);});

		var textureRepsYSlider = propFolder.add(conf,'textureRepsY',1.0,100.0).name("Texture Repeats Y");
		textureRepsYSlider.onChange(function(){refreshGroundTextureReps(targetScene);refreshURL(targetScene);});


		propFolder.add(mesh.material,'wireframe').name("Wireframe");
		datFolder.addFolder(propFolder);


		window.addEventListener("mouseup", function(){refreshURL(targetScene);});
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
		conf.textureRepsX = parseFloat(argList[10]);
		conf.textureRepsY = parseFloat(argList[11]);
		conf.randomSeed = parseInt(argList[12]);
		currentSeed = conf.randomSeed;
		conf.iterations = parseInt(argList[13]);
		conf.theme = argList[14];
		var chosenTheme = argList[15];
		if (themenames.indexOf(chosenTheme) >=0 )
		{
			this.mesh.skyboxSettings.theme = chosenTheme;
		}
		this.mesh.fillDatGUI(targetScene,mesh);
		targetScene.add( groupNode );
		targetScene.add( hemiLight );

		refreshGeometry(targetScene);
		refreshGroundTexture(targetScene);
		refreshSkybox(targetScene);
		refreshHemiLight(targetScene);
		refreshURL(targetScene);

		var event = new Event('vrObjectInstantiated');
		document.dispatchEvent(event);
	}
}

vrObjectConstructorList.push(oobloxEnvironment); // global list of all available vrObject type constructors
