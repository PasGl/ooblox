/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxMeshLoader = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshStandardMaterial({transparent:true,opacity:0.0}));
	this.mesh.vrObjectTypeID = "OML";
	this.mesh.uname = "";
	var mesh = this.mesh;
	mesh.receiveShadow = true;
	mesh.castShadow = true;

	var loadedModel = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshStandardMaterial({}));
	mesh.add(loadedModel);

	var TPLProperties = function ()	{this.followGUI = true;this.modelFilename = "Object.dae";this.models=["Object.dae"];}
	var conf = new TPLProperties();

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.receiveShadow = true;
	groupNode.castShadow = true;
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
				loadedModel.traverse(function(e) {
					if (e instanceof THREE.Mesh) {
						e.receiveShadow = true;
        					e.castShadow = true;
      					}
				}
			});
			refreshURL(targetScene);
		}
		else if ([".obj",".OBJ"].indexOf(conf.modelFilename.substring(conf.modelFilename.length-4,conf.modelFilename.length+1)) >=0)
		{
			var loader = new THREE.OBJLoader();
			loader.load('models/'+conf.modelFilename, function ( obj ) 
			{
				mesh.remove(loadedModel);
				loadedModel = obj;
				mesh.add(loadedModel);
				loadedModel.traverse(function(e) {
					if (e instanceof THREE.Mesh) {
						e.receiveShadow = true;
        					e.castShadow = true;
      					}
				}
			});
			refreshURL(targetScene);
		}
		else if ([".stl",".STL"].indexOf(conf.modelFilename.substring(conf.modelFilename.length-4,conf.modelFilename.length+1)) >=0)
		{
			var loader = new THREE.STLLoader();
			loader.load('models/'+conf.modelFilename, function ( stl ) 
			{
				mesh.remove(loadedModel);
				loadedModel = stl;
				mesh.add(loadedModel);
				loadedModel.traverse(function(e) {
					if (e instanceof THREE.Mesh) {
						e.receiveShadow = true;
        					e.castShadow = true;
      					}
				}
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
		var scxSlider = propFolder.add(mesh.scale,'x',0.0001,100).name("Scale X");
		scxSlider.onChange(function(){refreshURL(targetScene, mesh);});
		var scySlider = propFolder.add(mesh.scale,'y',0.0001,100).name("Scale Y");
		scySlider.onChange(function(){refreshURL(targetScene, mesh);});
		var sczSlider = propFolder.add(mesh.scale,'z',0.0001,100).name("Scale Z");
		sczSlider.onChange(function(){refreshURL(targetScene, mesh);});
		var rotxSlider = propFolder.add(mesh.rotation,'x',0.0,Math.PI*2.0).name("Rotation X").step(0.0001);
		rotxSlider.onChange(function(){refreshURL(targetScene, mesh);});
		var rotySlider = propFolder.add(mesh.rotation,'y',0.0,Math.PI*2.0).name("Rotation Y").step(0.0001);
		rotySlider.onChange(function(){refreshURL(targetScene, mesh);});
		var rotzSlider = propFolder.add(mesh.rotation,'z',0.0,Math.PI*2.0).name("Rotation Z").step(0.0001);
		rotzSlider.onChange(function(){refreshURL(targetScene, mesh);});
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
