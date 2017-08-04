/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxMeshLoader = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshStandardMaterial({transparent:true,opacity:0.0}));
	this.mesh.vrObjectTypeID = "OML";
	this.mesh.uname = "";
	var mesh = this.mesh;
	
	var loadedModel = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshStandardMaterial({}));
	mesh.add(loadedModel);

	var TPLProperties = function ()	{this.followGUI = true;this.modelFilename = "Object.dae";this.models=["Object.dae"];}
	var conf = new TPLProperties();

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Mesh');
	groupNode.add(datFolder)

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
		
		if ([".dae",".DAE"].indexOf(conf.modelFilename.substring(conf.modelFilename.length-4,conf.modelFilename.length+1)) >=0)
		{
			var loader = new THREE.ColladaLoader();
			loader.load('models/'+conf.modelFilename, function ( collada ) 
			{
				mesh.remove(loadedModel);
				loadedModel = collada.scene;
				mesh.add(loadedModel);
			});
			refreshURL(targetScene);
		}
	}

	var fillDatGUI = function (targetScene,mesh)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');
		var propFolder = dat.GUIVR.create('Properties');

		var sourceChanger = propFolder.add(conf,'modelFilename',conf.models);
		sourceChanger.onChange(function(value) {refresh(targetScene);});



		datFolder.addFolder(propFolder);
		var remobj = {myuname: mesh.uname,remove: function(){removeInstance(this.myuname);}};
		datFolder.add(remobj,'remove').name(mesh.uname);
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
		conf.modelFilename = decodeURIComponent(argList.slice(13).join(""));
		targetScene.add( groupNode );

		$.get("./models", function(data) {
			conf.models = data.split("href=\"");
			var n = 0;
			while (n<conf.models.length)
			{
				var thisfilename = conf.models[n].substring(0,conf.models[n].indexOf("\""));

				if ( [".dae",".DAE",".obj",".OBJ",".stl",".STL"].indexOf(thisfilename.substring(thisfilename.length-4,thisfilename.length+1)) >=0)
				{
					conf.models[n] = thisfilename;
					n++;
				}
				else conf.models.splice(n,1);
			}
			fillDatGUI(targetScene,mesh);
			refresh(targetScene);
			window.addEventListener("mouseup", function(){refreshURL(targetScene);});
			var event = new Event('vrObjectInstantiated');
			document.dispatchEvent(event);
        	});
	}
}

vrObjectConstructorList.push(oobloxMeshLoader); // global list of all available vrObject type constructors
