/**
 * @author Pascal Gleske / https://github.com/PasGl
 */


oobloxMasterMenu = function ()
{
	this.mesh = new THREE.Mesh( new THREE.SphereGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	///this.group = new THREE.Group();
	///this.group.add(this.mesh);
	///var group = this.group;
	
	this.mesh.vrObjectTypeID = "OMM";

	var mesh=this.mesh;

	var refresh = function (targetScene)
	{
		var position = new THREE.Vector3();
		position.setFromMatrixPosition( mesh.matrixWorld );
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z]);
	};
	
	this.mesh.fillDatGUI = function (targetScene)
	{
		mesh.geometry.computeBoundingBox();
		var datFolder = dat.GUIVR.create('ooblox Menu');
		datFolder.position.copy(mesh.position);
		mesh.position.x=0;
		mesh.position.y=0;
		mesh.position.z=0;

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


		var posScaleRotString = "" + 	mesh.position.x + "+" + mesh.position.y + "+" + mesh.position.z + "+" +
						mesh.scale.x + "+" + mesh.scale.y + "+" + mesh.scale.z + "+" +
						mesh.quaternion.x + "+" + mesh.quaternion.y + "+" + mesh.quaternion.z + "+" + mesh.quaternion.w;
		var addobj = {add: function() {
			var d = new Date();
			var newhref = window.location.href + "&TK" + d.getTime() + "=TTK+" + posScaleRotString + "+9+0.7+240+7+6+10";
			window.history.pushState({}, '', newhref);
			location.reload();}};
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

		refresh(targetScene);
		this.mesh.fillDatGUI(targetScene);
			
	}
}

vrObjectConstructorList.push(oobloxMasterMenu); // global list of all available vrObject type constructors
