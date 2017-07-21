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
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		var datFolder = dat.GUIVR.create('ooblox Menu');
//		datFolder.position.set(0.0, 0.0, 0.0);
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
				var obj = {	choice: uname,
						remove: function()
						{	
							urlCallParametersList.splice(i, 1);
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
		var posYSlider = posFolder.add(mesh.position,'y',-200.0,200.0);
		var posZSlider = posFolder.add(mesh.position,'z',-200.0,200.0);
		rezFolder.addFolder(posFolder);
		var scaleFolder = dat.GUIVR.create('Rez Scale');
		var scaleXSlider = scaleFolder.add(mesh.scale,'x',0.01,20.0);
		var scaleYSlider = scaleFolder.add(mesh.scale,'y',0.01,20.0);
		var scaleZSlider = scaleFolder.add(mesh.scale,'z',0.01,20.0);
		rezFolder.addFolder(scaleFolder);
		var rotFolder = dat.GUIVR.create('Rez Rotation');
		var rotXSlider = rotFolder.add(mesh.rotation,'x').min(0).max(Math.PI * 2).step(0.001);
		var rotYSlider = rotFolder.add(mesh.rotation,'y').min(0).max(Math.PI * 2).step(0.001);
		var rotZSlider = rotFolder.add(mesh.rotation,'z').min(0).max(Math.PI * 2).step(0.001);
		rezFolder.addFolder(rotFolder);
		datFolder.addFolder(rezFolder);

		targetScene.add( datFolder );
	}

	this.load = function (targetScene, camera)
	{
		refresh(targetScene);
		this.mesh.fillDatGUI(targetScene);
		targetScene.add(mesh);			
	}
}

vrObjectConstructorList.push(oobloxMasterMenu); // global list of all available vrObject type constructors
