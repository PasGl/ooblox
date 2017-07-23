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

	this.datFolder = null;

	var mesh=this.mesh;
	var color = this.mesh.material.color;
	var themenames = ["CloudyLightRays","DarkStormy","FullMoon","SunSet","ThickCloudsWater","TropicalSunnyDay"];

	var refresh = function (targetScene)
	{
		if (themenames.indexOf(skyboxSettings.theme) >=0 )
		{
			var skyboxname = skyboxSettings.theme;
			var urls = [  skyboxname + "Front2048.png", skyboxname + "Back2048.png",
				skyboxname + "Up2048-rot270.png", skyboxname + "Down2048-rot90.png",
				skyboxname + "Right2048.png", skyboxname + "Left2048.png" ];
			var skyboxpath ="images/SkyboxSet1/"+skyboxname+"/";
			var textureCube	= new THREE.CubeTextureLoader().setPath(skyboxpath).load(urls);
			textureCube.format = THREE.RGBFormat;
			targetScene.background = textureCube;
		}


		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				skyboxSettings.theme]);
	};
	
	this.mesh.fillDatGUI = function (targetScene, camera)
	{
		var gui = dat.GUIVR.create('SkyboxSet by Heiko Irrgang');
		gui.position.set(0.0, 40.00, 0.0);
		gui.scale.set(20.0,20.0,0.1);
		var themeChanger = gui.add(skyboxSettings,'theme',themenames);
		themeChanger.onChange(function(value) {refresh(targetScene);});
		targetScene.add( gui );
		console.log(gui);
		console.log(controls);
		gui.addEventListener("onReleased", function(){ console.log("Fuck yeah 1"); });   //urlRefresh(targetScene);})
		gui.children[0].addEventListener("onReleased", function(){ console.log("Fuck yeah 2"); });   //urlRefresh(targetScene);})
		gui.children[1].addEventListener("onReleased", function(){ console.log("Fuck yeah 3"); });   //urlRefresh(targetScene);})
		gui.children[2].addEventListener("onReleased", function(){ console.log("Fuck yeah 4"); });   //urlRefresh(targetScene);})
		controls.addEventListener("onReleased", function(){ console.log("Fuck yeah 5"); });   //urlRefresh(targetScene);})
		
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var chosenTheme = argList[1];
		
		if (themenames.indexOf(chosenTheme) >=0 )
		{
			this.mesh.skyboxSettings.theme = chosenTheme;
		}
		refresh(targetScene);
		this.mesh.fillDatGUI(targetScene, camera);	
	}
}

vrObjectConstructorList.push(oobloxSkybox); // global list of all available vrObject type constructors
