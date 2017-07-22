/**
 * @author Pascal Gleske / https://github.com/PasGl
 */


oobloxMasterMenu = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	this.indicator = new THREE.Mesh( new THREE.SphereGeometry(1.0, 24, 24), new THREE.MeshPhongMaterial({color:"#FF0000",transparent:true,opacity:0.5}));
	var indicator = this.indicator;
	this.mesh.vrObjectTypeID = "OMM";

	var mesh=this.mesh;

	var remFolder;
	var remsAdded=0;

	var urlRefresh = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z]);
	}

	var refresh = function (targetScene)
	{
		urlRefresh(targetScene);
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
							urlRefresh(targetScene);
							allmodulArgs=window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
							urlCallParametersList = allmodulArgs.split("&");	
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
		var datFolder = dat.GUIVR.create('ooblox sandbox Menu');
		datFolder.position.copy(mesh.position);
		mesh.position.x=0;
		mesh.position.y=0;
		mesh.position.z=0;
		indicator.position.y=0;
		indicator.position.z=0;
		indicator.scale.x=0.05;
		indicator.scale.y=0.05;
		indicator.scale.z=10;
		indicator.position.x=-0.25;
		datFolder.scale.set(20.0,20.0,0.1);

		remFolder = dat.GUIVR.create('Remove');
		datFolder.addFolder(remFolder);
		
		var rezFolder = dat.GUIVR.create('Add');

		var tkobj = {add: function() {
			var position = new THREE.Vector3();
			targetScene.updateMatrixWorld();
			position.setFromMatrixPosition( indicator.matrixWorld );
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z + "+1+1+1+0+0+0+1";
			var d = new Date();
			var uname = "TK" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=TTK+" + posScaleRotString + "+9+0.7+240+7+6+10";
			window.history.pushState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("TTK")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);}};
		rezFolder.add(tkobj,'add').name("Torus Knot");

		var psolobj = {add: function() {
			var position = new THREE.Vector3();
			targetScene.updateMatrixWorld();
			position.setFromMatrixPosition( indicator.matrixWorld );
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z + "+1+1+1+0+0+0+1";
			var d = new Date();
			var uname = "PSOL" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=PLS+" + posScaleRotString + "+3+FN(1)+645101582+5+0.6+4.5+0.7+0.36+0.3+0.45+0.4+0.0001+0.0001";
			window.history.pushState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("PLS")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);}};
		rezFolder.add(psolobj,'add').name("PSOL-System");

		var cpgobj = {add: function() {
			var position = new THREE.Vector3();
			targetScene.updateMatrixWorld();
			position.setFromMatrixPosition( indicator.matrixWorld );
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z + "+1+1+1+0+0+0+1";
			var d = new Date();
			var uname = "CPG" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=CPG+" + posScaleRotString + "+4+8356747";
			window.history.pushState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("CPG")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);}};
		rezFolder.add(cpgobj,'add').name("Chord Progression");

		var metobj = {add: function() {
			var position = new THREE.Vector3();
			targetScene.updateMatrixWorld();
			position.setFromMatrixPosition( indicator.matrixWorld );
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z + "+1+1+1+0+0+0+1";
			var d = new Date();
			var uname = "MET" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=MET+" + posScaleRotString + "+128+true";
			window.history.pushState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("MET")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);}};
		rezFolder.add(metobj,'add').name("Metronome");

		datFolder.addFolder(rezFolder);
		datFolder.children[1].add(mesh);
		datFolder.children[1].add(indicator);
		targetScene.add( datFolder );
		datFolder.close();
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
