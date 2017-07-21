/**
 * @author Pascal Gleske / https://github.com/PasGl
 */


oobloxMasterMenu = function ()
{
	this.mesh = new THREE.Mesh( new THREE.SphereGeometry(5, 20, 20), new THREE.MeshPhongMaterial({color: "#FF0000", transparent: true,opacity: 0.5}));
	
	this.mesh.vrObjectTypeID = "OMM";

	this.mesh.rezChoice = "";

	var mesh=this.mesh;

	var refresh = function (targetScene)
	{
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				mesh.position.x,
				mesh.position.y,
				mesh.position.z,
				mesh.scale.x,
				mesh.scale.y,
				mesh.scale.z,
				mesh.quaternion.x,
				mesh.quaternion.y,
				mesh.quaternion.z,
				mesh.quaternion.w]);
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		mesh.geometry.computeBoundingBox();
		var datFolder = dat.GUIVR.create('ooblox Menu');
		datFolder.position.copy(mesh.position);
		datFolder.position.z += mesh.geometry.boundingBox.max.z;
		datFolder.scale.set(20.0,20.0,0.1);

		var remFolder = dat.GUIVR.create('Remove');
		var allmodulArgs="";
		var urlCallParametersList= [];
		if (window.location.href.indexOf("?")!=-1)
		{
			allmodulArgs=window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
			urlCallParametersList = allmodulArgs.split("&");
	
			for (var i=0;i<urlCallParametersList.length;i++)
			{		
				var uname = urlCallParametersList[i].substring(0, urlCallParametersList[i].indexOf("="));
				var obj = {	myIndex: i,
						remove: function()
						{	
							urlCallParametersList.splice(this.myIndex, 1);
							var newURLstring = "?"+urlCallParametersList.join("&");
							window.history.pushState({}, '', newURLstring);
							location.reload();
						}};
				remFolder.add(obj,'remove').name(uname);
			}
	
		}
		datFolder.addFolder(remFolder);
		
		var rezFolder = dat.GUIVR.create('Add');
		rezFolder.add(mesh,"rezChoice",importTypesAvailable);
		var posFolder = dat.GUIVR.create('Rez Position');
		var posXSlider = posFolder.add(mesh.position,'x',-200.0,200.0);
		posXSlider.onChange(refresh);
		var posYSlider = posFolder.add(mesh.position,'y',-200.0,200.0);
		posYSlider.onChange(refresh);
		var posZSlider = posFolder.add(mesh.position,'z',-200.0,200.0);
		posZSlider.onChange(refresh);
		rezFolder.addFolder(posFolder);
		var scaleFolder = dat.GUIVR.create('Rez Scale');
		var scaleXSlider = scaleFolder.add(mesh.scale,'x',0.01,20.0);
		scaleXSlider.onChange(refresh);
		var scaleYSlider = scaleFolder.add(mesh.scale,'y',0.01,20.0);
		scaleYSlider.onChange(refresh);
		var scaleZSlider = scaleFolder.add(mesh.scale,'z',0.01,20.0);
		scaleZSlider.onChange(refresh);
		rezFolder.addFolder(scaleFolder);
		var rotFolder = dat.GUIVR.create('Rez Rotation');
		var rotXSlider = rotFolder.add(mesh.rotation,'x').min(0).max(Math.PI * 2).step(0.001);
		rotXSlider.onChange(refresh);
		var rotYSlider = rotFolder.add(mesh.rotation,'y').min(0).max(Math.PI * 2).step(0.001);
		rotYSlider.onChange(refresh);
		var rotZSlider = rotFolder.add(mesh.rotation,'z').min(0).max(Math.PI * 2).step(0.001);
		rotZSlider.onChange(refresh);
		rezFolder.addFolder(rotFolder);
		datFolder.addFolder(rezFolder);

		targetScene.add( datFolder );
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var position = new THREE.Vector3();
		position.x = parseFloat(argList[1]);
		position.y = parseFloat(argList[2]);
		position.z = parseFloat(argList[3]);
		var scale = new THREE.Vector3();
		scale.x = parseFloat(argList[4]);
		scale.y = parseFloat(argList[5]);
		scale.z = parseFloat(argList[6]);
		var rotation = new THREE.Quaternion();
		rotation.x = parseFloat(argList[7]);
		rotation.y = parseFloat(argList[8]);
		rotation.z = parseFloat(argList[9]);
		rotation.w = parseFloat(argList[10]);

		this.mesh.quaternion.copy(rotation);
		this.mesh.position.copy(position);
		this.mesh.scale.copy(scale);

		refresh(targetScene);
		this.mesh.fillDatGUI(targetScene);
		targetScene.add(mesh);			
	}
}

vrObjectConstructorList.push(oobloxMasterMenu); // global list of all available vrObject type constructors
