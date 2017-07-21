/**
 * @author Pascal Gleske / https://github.com/PasGl
 */


oobloxMasterMenu = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	///this.group = new THREE.Group();
	///this.group.add(this.mesh);
	///var group = this.group;
	
	this.mesh.vrObjectTypeID = "OMM";

	var mesh=this.mesh;

	var remFolder;
	var remsAdded=0;

	var refresh = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z]);
		
		var allmodulArgs="";
		var urlCallParametersList= [];
		if (window.location.href.indexOf("?")!=-1)
		{
			allmodulArgs=window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
			urlCallParametersList = allmodulArgs.split("&");
			while (remsAdded<urlCallParametersList.length)
			{		
				var uname = urlCallParametersList[remsAdded].substring(0, urlCallParametersList[remsAdded].indexOf("="));
				var obj = {	myIndex: remsAdded,
						remove: function()
						{	
							urlCallParametersList.splice(this.myIndex, 1);
							var newURLstring = "?"+urlCallParametersList.join("&");
							window.history.pushState({}, '', newURLstring);
							location.reload();
						}};
				remFolder.add(obj,'remove').name(uname);
				remsAdded++;
			}
	
		}
	};
	
	this.mesh.fillDatGUI = function (targetScene, camera)
	{
		mesh.geometry.computeBoundingBox();
		var datFolder = dat.GUIVR.create('ooblox Menu');
		datFolder.position.copy(mesh.position);
		mesh.position.x=-200;
		mesh.position.y=0;
		mesh.position.z=0;

		datFolder.scale.set(20.0,20.0,0.1);

		remFolder = dat.GUIVR.create('Remove');

		datFolder.addFolder(remFolder);
		
		var rezFolder = dat.GUIVR.create('Add');

		
		var addobj = {add: function() {
			var position = new THREE.Vector3();
			targetScene.updateMatrixWorld();
			position.setFromMatrixPosition( mesh.matrixWorld );
			var posScaleRotString = "" + position.x + "+" + position.y + "+" + position.z + "+1+1+1+0+0+0+1";
			var d = new Date();
			var uname = "TK" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=TTK+" + posScaleRotString + "+9+0.7+240+7+6+10";
			window.history.replaceState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("TTK")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);
		}};
		
		rezFolder.add(addobj,'add').name("Torus Knot");
		datFolder.addFolder(rezFolder);
		datFolder.children[0].add(mesh);
		targetScene.add( datFolder );
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var position = new THREE.Vector3();
		position.x = parseFloat(argList[1]);
		position.y = parseFloat(argList[2]);
		position.z = parseFloat(argList[3]);
		this.mesh.position.copy(position);
		this.mesh.fillDatGUI(targetScene, camera);
		refresh(targetScene);
	}
}

vrObjectConstructorList.push(oobloxMasterMenu); // global list of all available vrObject type constructors
