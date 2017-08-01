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

	var datFolder = dat.GUIVR.create('ooblox sandbox Menu');

	var groupNode = new THREE.Group();
	groupNode.add(datFolder);
	groupNode.name = "vrObjectGroup";

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
				var remobj = {myuname:uname, remove: function(){removeInstance(this.myuname);}};
				remFolder.add(remobj,'remove').name(uname);;
				remsAdded++;
			}
	
		}
	};
	
	this.mesh.fillDatGUI = function (targetScene, camera)
	{
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
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z;
			var d = new Date();
			var uname = "TK" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=TTK+" + posScaleRotString + 
				"+6+0.4+240+7+"+Math.floor(Math.random() * 25)+"+"+Math.floor(Math.random() * 25) +"+-10+-5+6";
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
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z;
			var d = new Date();
			var uname = "PSOL" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=PLS+" + posScaleRotString + "+3+FN(1)+"+Math.floor(Math.random() * 99999999)+
				"+5+"+(0.4+(0.6*Math.random()))+"+"+(2.0+(3.0*Math.random()))+"+"+(0.1+(0.6*Math.random()))+"+"+(0.2+(0.3*Math.random()))+
				"+"+(0.2+(0.3*Math.random()))+"+"+(0.6*Math.random())+"+"+(0.6*Math.random())+"+"+(0.0001+(0.4*Math.random()))+"+"+(0.0001+(0.4*Math.random()))+"+5+5+0";
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
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z;
			var d = new Date();
			var uname = "CPG" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=CPG+" + posScaleRotString + "+4+" +  Math.floor(Math.random() * 99999999) +"+-10+-5+0";
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
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z;
			var d = new Date();
			var uname = "MET" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=MET+" + posScaleRotString + "+128+true+0+0+0";
			window.history.pushState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("MET")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);}};
		rezFolder.add(metobj,'add').name("Metronome");

		var metobj = {add: function() {
			var position = new THREE.Vector3();
			targetScene.updateMatrixWorld();
			position.setFromMatrixPosition( indicator.matrixWorld );
			var posScaleRotString = "" + position.x  + "+" + position.y + "+" + position.z;
			var d = new Date();
			var uname = "TPL" + d.getTime();
			var newhref = window.location.href + "&" + uname + "=TPL+" + posScaleRotString + "+20.0+20.0+0+0+0+-10+-15+0.1+bark-template.png";
			window.history.pushState({}, '', newhref);
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf("TPL")]();
			importedThing.mesh.uname = uname;
			importedThing.load(targetScene, camera);
			refresh(targetScene);}};
		rezFolder.add(metobj,'add').name("Texture Panel");

		datFolder.addFolder(rezFolder);
		datFolder.children[1].add(mesh);
		datFolder.children[1].add(indicator);
		targetScene.add( groupNode );
		datFolder.close();
		window.addEventListener("mouseup", function(){urlRefresh(targetScene);});
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
