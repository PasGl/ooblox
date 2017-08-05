/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

/**
 * Textures by Heiko Irrgang / https://93i.de/p/free-skybox-texture-set/
 */

oobloxEnvironment = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.MeshStandardMaterial({}));
	this.mesh.rotation.x = -Math.PI * 0.5;
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.mesh.vrObjectTypeID = "ENV";
	this.mesh.skyboxSettings = {theme: "ThickCloudsWater"};
	var mesh=this.mesh;
	var guioffset = new THREE.Vector3();
	var skyboxSettings = this.mesh.skyboxSettings;

	var datFolder = dat.GUIVR.create('SkyboxSet by Heiko Irrgang');

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.add(datFolder);
	groupNode.name = "vrObjectGroup";

	var hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );

	var heightMaps = [[[0.0,0.0],[0.0,0.0]]];
	var geometries = [new THREE.PlaneGeometry(1, 1, 1, 1)];
	var currentSeed = 123;

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
							((seededRandom()-0.5)*(Math.pow(0.5,iterationsSoFar)));
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

	var themes = ["dirt","alienmold","arid","glacial","whitestone"];
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

	var refresh = function (targetScene)
	{







		if (themenames.indexOf(skyboxSettings.theme) >=0 )
		{
			var skyboxname = skyboxSettings.theme;
			targetScene.remove( hemiLight );

			switch (skyboxname) {
			    case "CloudyLightRays":
				targetScene.fog = new THREE.Fog( 0x42474c, 1, 800 );
				hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
				break;
			    case "DarkStormy":
				targetScene.fog = new THREE.Fog( 0x222629, 1, 500 );
				hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
				break;
			    case "FullMoon":
				targetScene.fog = new THREE.Fog( 0x1c2022, 1, 300 );
				hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
				break;
			    case "SunSet":
				targetScene.fog = new THREE.Fog( 0x414544, 1, 900 );
				hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
				break;
			    case "ThickCloudsWater":
				targetScene.fog = new THREE.Fog( 0x5e4b3f, 1, 900 );
				hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
				break;
			    case "TropicalSunnyDay":
				targetScene.fog = new THREE.Fog( 0xf7f9f4, 200, 1000 );
				hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
				break;
			}

			targetScene.add( hemiLight );

			var urls = [  skyboxname + "Front2048.png", skyboxname + "Back2048.png",
				skyboxname + "Up2048-rot270.png", skyboxname + "Down2048-rot90.png",
				skyboxname + "Right2048.png", skyboxname + "Left2048.png" ];
			var skyboxpath ="images/SkyboxSet1/"+skyboxname+"/";
			var textureCube	= new THREE.CubeTextureLoader().setPath(skyboxpath).load(urls);
			textureCube.format = THREE.RGBFormat;
			targetScene.background = textureCube;
		}
		refreshURL(targetScene);
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);

		var themeChanger = datFolder.add(skyboxSettings,'theme',themenames).name("Sky");

		var propFolder = dat.GUIVR.create('Ground');

		var randomSeedSlider = propFolder.add(conf,'randomSeed',0,99999999).step(1);
		randomSeedSlider.onChange(function(){
			heightMaps = [[[0.0,0.0],[0.0,0.0]]];
			geometries = [new THREE.PlaneGeometry(1, 1, 1, 1)];
			currentSeed = conf.randomSeed;
			while (geometries.length < (conf.iterations+1))
			{addIteration();}
			mesh.geometry = geometries[conf.iterations];
			refresh(targetScene);
		});

		var iterSlider = propFolder.add(conf,'iterations',0,9).step(1);
		iterSlider.onChange(function(value) {
			while (geometries.length < (conf.iterations+1))
			{addIteration();}
			mesh.geometry = geometries[conf.iterations];
			refresh(targetScene);
		});

		var sourceChanger = propFolder.add(conf,'theme',themes);
		sourceChanger.onChange(function(value) {refresh(targetScene);});
		var scxSlider = propFolder.add(mesh.scale,'x',1.0,10000.0).name("Scale X");
		scxSlider.onChange(function(){refreshURL(targetScene);});
		var scySlider = propFolder.add(mesh.scale,'y',1.0,10000.0).name("Scale Y");
		scySlider.onChange(function(){refreshURL(targetScene);});
		var sczSlider = propFolder.add(mesh.scale,'z',0.0001,10000.0).name("Scale Z");
		sczSlider.onChange(function(){refreshURL(targetScene);});

		var textureRepsXSlider = propFolder.add(conf,'textureRepsX',1.0,200.0).name("Texture Repeats X");
		textureRepsXSlider.onChange(function(){refresh(targetScene);});

		var textureRepsYSlider = propFolder.add(conf,'textureRepsY',1.0,200.0).name("Texture Repeats Y");
		textureRepsYSlider.onChange(function(){refresh(targetScene);});


		propFolder.add(mesh.material,'wireframe').name("Wireframe");
		datFolder.addFolder(propFolder);

		themeChanger.onChange(function(value) {refresh(targetScene);});
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

		while (geometries.length < (conf.iterations+1))
		{addIteration();}
		mesh.geometry = geometries[conf.iterations];

		refresh(targetScene);
		var event = new Event('vrObjectInstantiated');
		document.dispatchEvent(event);
	}
}

vrObjectConstructorList.push(oobloxEnvironment); // global list of all available vrObject type constructors
