/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxMeshLoader = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshStandardMaterial({}));
	this.mesh.vrObjectTypeID = "OML";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Mesh');
	groupNode.add( datFolder );

	var TPLProperties = function ()	{this.followGUI = true;this.modelFilename = "Object.dae";}
	var conf = new TPLProperties();

	var models = [];

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
				mesh.rotation.x,
				mesh.rotation.y,
				mesh.rotation.z,
				guioffset.x,
				guioffset.y,
				guioffset.z,
				encodeURIComponent(conf.modelFilename)]);
	}

	var refresh = function (targetScene)
	{
		var uname = mesh.uname;
		var vrObjectTypeID = mesh.vrObjectTypeID;
		var position = (new THREE.Vector3()).copy(mesh.position);
		var scale = (new THREE.Vector3()).copy(mesh.scale);
		var rotation = (new THREE.Quaternion()).copy(mesh.rotation);

		if ([".dae",".DAE"].indexOf(conf.modelFilename.substring(conf.modelFilename.length-4,conf.modelFilename.length+1)) >=0)
		{
			var loader = new THREE.ColladaLoader();
			loader.load('models/'+conf.modelFilename, function ( collada ) 
			{
				groupNode.remove(mesh);
				mesh = collada.scene;
				mesh.position.copy(position);
				mesh.scale.copy(scale);
				mesh.rotation.copy(rotation);
				mesh.uname = uname;
				mesh.vrObjectTypeID = vrObjectTypeID;
				groupNode.add(mesh);
				groupNode.remove( datFolder );
				fillDatGUI(targetScene);
			});
		}	
	}

	var fillDatGUI = function (targetScene)
	{
		datFolder = dat.GUIVR.create('Mesh');
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');

		var propFolder = dat.GUIVR.create('Properties');

		var sourceChanger = propFolder.add(conf,'modelFilename',models);
		sourceChanger.onChange(function(value) {refresh(targetScene);});

		//propFolder.add(mesh.material,'transparent').name("Texture transparent");

		var scxSlider = propFolder.add(mesh.scale,'x',0.0001,100).name("Scale X");
		scxSlider.onChange(function(){refreshURL(targetScene);});
		var scySlider = propFolder.add(mesh.scale,'y',0.0001,100).name("Scale Y");
		scySlider.onChange(function(){refreshURL(targetScene);});
		var sczSlider = propFolder.add(mesh.scale,'z',0.0001,100).name("Scale Z");
		sczSlider.onChange(function(){refreshURL(targetScene);});
		var rotxSlider = propFolder.add(mesh.rotation,'x',0.0,Math.PI*2.0).name("Rotation X").step(0.0001);
		rotxSlider.onChange(function(){refreshURL(targetScene);});
		var rotySlider = propFolder.add(mesh.rotation,'y',0.0,Math.PI*2.0).name("Rotation Y").step(0.0001);
		rotySlider.onChange(function(){refreshURL(targetScene);});
		var rotzSlider = propFolder.add(mesh.rotation,'z',0.0,Math.PI*2.0).name("Rotation Z").step(0.0001);
		rotzSlider.onChange(function(){refreshURL(targetScene);});
		datFolder.addFolder(propFolder);

		var remobj = {myuname: mesh.uname,remove: function(){removeInstance(this.myuname);}};
		datFolder.add(remobj,'remove').name(mesh.uname);

		groupNode.add( datFolder );
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
		mesh.rotation.x = parseFloat(argList[7]);
		mesh.rotation.y = parseFloat(argList[8]);
		mesh.rotation.z = parseFloat(argList[9]);
		guioffset.x = parseFloat(argList[10]);
		guioffset.y = parseFloat(argList[11]);
		guioffset.z = parseFloat(argList[12]);
		conf.textureFilename = decodeURIComponent(argList.slice(13).join(""));

		$.get("./models", function(data) {
			models = data.split("href=\"");
			var n = 0;
			while (n<models.length)
			{
				var thisfilename = models[n].substring(0,models[n].indexOf("\""));

				if ( [".dae",".DAE",".obj",".OBJ",".stl",".STL"].indexOf(thisfilename.substring(thisfilename.length-4,thisfilename.length+1)) >=0)
				{
					models[n] = thisfilename;
					n++;
				}
				else models.splice(n,1);
			}
			targetScene.add( groupNode );
			refresh(targetScene);
			window.addEventListener("mouseup", function(){refreshURL(targetScene);});
			var event = new Event('vrObjectInstantiated');
			document.dispatchEvent(event);
        	});
	}
}

vrObjectConstructorList.push(oobloxMeshLoader); // global list of all available vrObject type constructors
