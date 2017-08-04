/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

/**
 * Textures by Heiko Irrgang / https://93i.de/p/free-skybox-texture-set/
 */

oobloxSkybox = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;

	this.mesh.vrObjectTypeID = "SKY";

	this.mesh.skyboxSettings = {theme: "ThickCloudsWater"};
	var skyboxSettings = this.mesh.skyboxSettings;

	var gui = dat.GUIVR.create('SkyboxSet by Heiko Irrgang');

	var groupNode = new THREE.Group();
	groupNode.add(gui);
	groupNode.name = "vrObjectGroup";

	var mesh=this.mesh;
	var color = this.mesh.material.color;
	var themenames = ["CloudyLightRays","DarkStormy","FullMoon","SunSet","ThickCloudsWater","TropicalSunnyDay"];

	var refreshURL = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z,
				skyboxSettings.theme]);
	}

	var refresh = function (targetScene)
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
				targetScene.fog = new THREE.Fog( 0x343c3a, 1, 300 );
				break;
			    case "SunSet":
				targetScene.fog = new THREE.Fog( 0x414544, 1, 900 );
				break;
			    case "ThickCloudsWater":
				targetScene.fog = new THREE.Fog( 0x5e4b3f, 1, 900 );
				break;
			    case "TropicalSunnyDay":
				targetScene.fog = new THREE.Fog( 0xf7f9f4, 200, 1000 );
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
		refreshURL(targetScene);
	};
	
	this.mesh.fillDatGUI = function (targetScene, camera)
	{
		gui.position.copy(mesh.position);
		mesh.position.set(0,0,0);
		gui.scale.set(20.0,20.0,0.1);
		var themeChanger = gui.add(skyboxSettings,'theme',themenames);
		themeChanger.onChange(function(value) {refresh(targetScene);});
		gui.children[1].add(mesh);
		window.addEventListener("mouseup", function(){refreshURL(targetScene);});
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var position = new THREE.Vector3();
		position.x = parseFloat(argList[1]);
		position.y = parseFloat(argList[2]);
		position.z = parseFloat(argList[3]);
		var chosenTheme = argList[4];
		this.mesh.position.copy(position);
		if (themenames.indexOf(chosenTheme) >=0 )
		{
			this.mesh.skyboxSettings.theme = chosenTheme;
		}
		this.mesh.fillDatGUI(targetScene, camera);
		targetScene.add( groupNode );
		refresh(targetScene);
		var event = new Event('vrObjectInstantiated');
		document.dispatchEvent(event);
	}
}

vrObjectConstructorList.push(oobloxSkybox); // global list of all available vrObject type constructors
