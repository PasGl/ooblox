/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxMeshLoader = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.MeshStandardMaterial({transparent:true,opacity:0.0}));
	this.mesh.vrObjectTypeID = "OML";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var loadedModel = new THREE.Mesh( new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.MeshStandardMaterial({}));
	mesh.add(loadedModel);

	var sourceTreeChanger  = dat.GUIVR.create('Source: models/');

	var SourceTreeNode = function ()
	{
		this.foldername="Source File";
		this.prefix="";
		this.folders=[];
		this.files=[];
		this.fillGUI = function (guiFolder,targetScene,prefix) 
		{
			if (this.files.length > 0)
			{
				var sourceChanger = guiFolder.add(conf,'modelFilename',this.files);
				var tScene = targetScene;
				sourceChanger.onChange(function(value) {conf.modelFilename = prefix+value;refresh(tScene);});
			}
			if (this.folders.length > 0)
			{
				for(var i=0;i<this.folders.length;i++)
				{
					var thisFolder  = dat.GUIVR.create('models/' + this.folders[i].prefix);
					this.folders[i].fillGUI(thisFolder,targetScene,prefix+this.folders[i].foldername+"/");
					guiFolder.addFolder(thisFolder);
				}
			}
		}
	}

	var sourceTree = new SourceTreeNode();

	var TPLProperties = function ()
	{
		this.followGUI = true;
		this.modelFilename = "Object.dae";
		this.models = ["Object.dae"];
	}

	var conf = new TPLProperties();

	var groupNode = new THREE.Group();
	groupNode.add(this.mesh);
	groupNode.name = "vrObjectGroup";
	var guioffset = new THREE.Vector3();

	var datFolder = dat.GUIVR.create('Mesh');
	groupNode.add(datFolder);

	var foldercounter = 1;

	var recBuildSourceTree = function (folderToBeAdded,nodeToBeAddedTo,targetScene)
	{
		var foldercounter = 1;
		$.get("models/"+folderToBeAdded, function(data) {
			nodeToBeAddedTo.files = data.split("href=\"");
			var n = 0;
			while (n<nodeToBeAddedTo.files.length)
			{
				var thisfilename =nodeToBeAddedTo.files[n].substring(0,nodeToBeAddedTo.files[n].indexOf("\""));

				if ( [".dae",".DAE",".obj",".OBJ",".stl",".STL"].indexOf(thisfilename.substring(thisfilename.length-4,thisfilename.length+1)) >=0)
				{
					nodeToBeAddedTo.files[n] = thisfilename;
					n++;
				}
				else if (thisfilename.slice(-1) == "/")
				{
					thisfilename = thisfilename.slice(0,-1);
					if (["..","."].indexOf(thisfilename) == -1) 
					{
						foldercounter += 1;
						var newNode = new SourceTreeNode();
						newNode.foldername = thisfilename;
						newNode.prefix = nodeToBeAddedTo.prefix + thisfilename+ "/" ;
						nodeToBeAddedTo.folders.push(newNode);
						recBuildSourceTree(newNode.prefix,newNode,targetScene);
						nodeToBeAddedTo.files.splice(n,1);
					}
					else
					{
						nodeToBeAddedTo.files.splice(n,1);
					}
				} 
				else
				{
					nodeToBeAddedTo.files.splice(n,1);
				}
			}
			foldercounter -= 1;
			if (foldercounter == 0) {sourceTree.fillGUI(sourceTreeChanger,targetScene,"./models/");}
        	});
	}

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
			loader.load(conf.modelFilename, function ( collada ) 
			{
				mesh.remove(loadedModel);
				loadedModel = collada.scene;
				mesh.add(loadedModel);
				loadedModel.traverse(function(e) {
					if (e instanceof THREE.Mesh) {
						e.receiveShadow = true;
        					e.castShadow = true;
      					}
				});
			});
			refreshURL(targetScene);
		}
		else if ([".obj",".OBJ"].indexOf(conf.modelFilename.substring(conf.modelFilename.length-4,conf.modelFilename.length+1)) >=0)
		{
			var loader = new THREE.OBJLoader();
			loader.load(conf.modelFilename, function ( obj ) 
			{
				mesh.remove(loadedModel);
				loadedModel = obj;
				mesh.add(loadedModel);
				loadedModel.traverse(function(e) {
					if (e instanceof THREE.Mesh) {
						e.receiveShadow = true;
        					e.castShadow = true;
      					}
				});

				if (conf.modelFilename.indexOf("Yughues") > -1) 
				{
					console.log(conf.modelFilename);
					//loadedModel.material.map = new THREE.TGALoader().load( "images/3D_pattern_53/" + textureFolder + "/diffuse.tga");
				}
			});
			refreshURL(targetScene);
		}
		else if ([".stl",".STL"].indexOf(conf.modelFilename.substring(conf.modelFilename.length-4,conf.modelFilename.length+1)) >=0)
		{
			var loader = new THREE.STLLoader();
			loader.load(conf.modelFilename, function ( stl ) 
			{
				mesh.remove(loadedModel);
				loadedModel = stl;
				mesh.add(loadedModel);
				loadedModel.traverse(function(e) {
					if (e instanceof THREE.Mesh) {
						e.receiveShadow = true;
        					e.castShadow = true;
      					}
				});
			});
			refreshURL(targetScene);
		}
	}

	var fillDatGUI = function (targetScene,mesh)
	{
		datFolder.position.copy(guioffset).add(mesh.position);
		datFolder.scale.set(20.0,20.0,0.1);
		var followFlag = datFolder.add(conf,'followGUI');

		datFolder.addFolder(sourceTreeChanger);

		var propFolder = dat.GUIVR.create('Properties');
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

		recBuildSourceTree("",sourceTree,targetScene);

		fillDatGUI(targetScene,mesh);
		refresh(targetScene);
		window.addEventListener("mouseup", function(){refreshURL(targetScene);});
		var event = new Event('vrObjectInstantiated');
		document.dispatchEvent(event);	
	}
}

vrObjectConstructorList.push(oobloxMeshLoader); // global list of all available vrObject type constructors
