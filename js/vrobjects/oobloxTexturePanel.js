/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxTexturePanel = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 0.5), 	[new THREE.MeshStandardMaterial({color:0x000000}),
									 new THREE.MeshStandardMaterial({color:0x000000}), 
									 new THREE.MeshStandardMaterial({color:0x000000}),
									 new THREE.MeshStandardMaterial({color:0x000000}),
									 new THREE.MeshStandardMaterial({color:0xffffff}),
									 new THREE.MeshStandardMaterial({color:0x000000})]);
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.mesh.vrObjectTypeID = "TPL";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Texture Panel');
	groupNode.add( datFolder )

	var TPLProperties = function ()	{
		this.followGUI = true;
		this.textureFilename = "bark-template.png";
		this.transparent = true;
		this.opacity = 0.61;
		this.lights = true;
	}
	var conf = new TPLProperties();

	var textures = [];

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
				mesh.rotation.x,
				mesh.rotation.y,
				mesh.rotation.z,
				guioffset.x,
				guioffset.y,
				guioffset.z,
				conf.transparent.toString(),
				conf.opacity,
				conf.lights.toString(),
				encodeURIComponent(conf.textureFilename)]);
	}

	var refreshMaterial = function (targetScene)
	{
		if (conf.lights) {
			mesh.material[4] = new THREE.MeshLambertMaterial({
				map: (new THREE.TextureLoader().load( "images/textures/" + conf.textureFilename )),
				transparent: Boolean(conf.transparent),
				opacity: conf.opacity
			});
		}
		else {
			mesh.material[4] = new THREE.MeshBasicMaterial({
				map: (new THREE.TextureLoader().load( "images/textures/" + conf.textureFilename )),
				transparent: Boolean(conf.transparent),
				opacity: conf.opacity
			});
		}
	}

	var refresh = function (targetScene)
	{
		mesh.material[4].map = new THREE.TextureLoader().load( "images/textures/" + conf.textureFilename );
		refreshURL(targetScene);
	}

	var fillDatGUI = function (targetScene,mesh)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');

		var propFolder = dat.GUIVR.create('Properties');

		var sourceChanger = propFolder.add(conf,'textureFilename',textures);
		sourceChanger.onChange(function() {refresh(targetScene);});

		var transSwitch = propFolder.add(conf,'transparent').name("Transparent");
		transSwitch.onChange(function(){mesh.material[4].transparent=Boolean(conf.transparent);refreshURL(targetScene);});
		var opacitySlider = propFolder.add(conf,'opacity',0.0,1.0).name("Opacity").step(0.0001);
		opacitySlider.onChange(function(){mesh.material[4].opacity=conf.opacity;refreshURL(targetScene);});
		var lightsSwitch = propFolder.add(conf,'lights').name("Apply lights");
		lightsSwitch.onChange(function(){refreshMaterial(targetScene);refreshURL(targetScene);});

		var scxSlider = propFolder.add(mesh.scale,'x',0.0001,100).name("Scale X");
		scxSlider.onChange(function(){refreshURL(targetScene);});
		var scySlider = propFolder.add(mesh.scale,'y',0.0001,100).name("Scale Y");
		scySlider.onChange(function(){refreshURL(targetScene);});
		var rotxSlider = propFolder.add(mesh.rotation,'x',0.0,Math.PI*2.0).name("Rotation X").step(0.0001);
		rotxSlider.onChange(function(){refreshURL(targetScene);});
		var rotySlider = propFolder.add(mesh.rotation,'y',0.0,Math.PI*2.0).name("Rotation Y").step(0.0001);
		rotySlider.onChange(function(){refreshURL(targetScene);});
		var rotzSlider = propFolder.add(mesh.rotation,'z',0.0,Math.PI*2.0).name("Rotation Z").step(0.0001);
		rotzSlider.onChange(function(){refreshURL(targetScene);});

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
		mesh.rotation.x = parseFloat(argList[6]);
		mesh.rotation.y = parseFloat(argList[7]);
		mesh.rotation.z = parseFloat(argList[8]);
		guioffset.x = parseFloat(argList[9]);
		guioffset.y = parseFloat(argList[10]);
		guioffset.z = parseFloat(argList[11]);
		conf.transparent = Boolean(argList[12]=="true");
		conf.opacity = parseFloat(argList[13]);
		conf.lights = Boolean(argList[14]=="true");
		conf.textureFilename = decodeURIComponent(argList.slice(15).join(""));

		$.get("./images/textures", function(data) {
			textures = data.split("href=\"");
			var n = 0;
			while (n<textures.length)
			{
				var thisfilename = textures[n].substring(0,textures[n].indexOf("\""));

				if ( [".png",".PNG",".jpg",".JPG",".jpeg",".JPEG",".tga",".TGA"].indexOf(thisfilename.substring(thisfilename.length-4,thisfilename.length+1)) >=0)
				{
					textures[n] = thisfilename;
					n++;
				}
				else textures.splice(n,1);
			}
			fillDatGUI(targetScene,mesh);
			refreshMaterial(targetScene);
			refresh(targetScene);
			var event = new Event('vrObjectInstantiated');
			document.dispatchEvent(event);
        	});
	}
}

vrObjectConstructorList.push(oobloxTexturePanel); // global list of all available vrObject type constructors
