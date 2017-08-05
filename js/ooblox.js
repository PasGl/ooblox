/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, controls, stats, container;
var vrON = false;
var prevTime = performance.now();
var dirLight;
var dirTarget;
var camOffset;
var vrcontrols;
var effect;
var manager;
var clock = new THREE.Clock();

var loadcounter = 0;
var totalModules = 0;

var menusHidden = false;

//var camhelper;

// for modules, to get their parameters from the URL query string
getURLargs = function (uname) {
	var allmodulArgs = window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
	var allmodulArgsList = allmodulArgs.split("&");
	var indexInList = -1;
	for (var i=0;i<allmodulArgsList.length;i++)
	{
		if (uname === allmodulArgsList[i].substring(0, uname.length))
		{
			indexInList = i;
			break;
		}
	}
	var thisModuleArgString = allmodulArgsList[indexInList];
	return thisModuleArgString.split("+");
}

// for modules, to write changes made in their gui back into the URL query string
updateURLargs = function (argList) {
	var allmodulArgs = window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
	var allmodulArgsList = allmodulArgs.split("&");
	var indexInList = -1;
	for (var i=0;i<allmodulArgsList.length;i++)
	{
		if (argList[0] === allmodulArgsList[i].substring(0, argList[0].length))
		{
			indexInList = i;
			break;
		}
	}
	var thisModuleArgs = argList;
	allmodulArgsList[indexInList] = thisModuleArgs[0] + "=" + thisModuleArgs.slice(1,thisModuleArgs.length).join("+");
	var newURLstring = "?"+allmodulArgsList.join("&");
	window.history.replaceState({}, '', newURLstring);
}

// for modules, to remove instances of modules
removeInstance = function (uname) {
	var allmodulArgs=window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
	var allmodulArgsList = allmodulArgs.split("&");
	var indexInList = -1;
	for (var i=0;i<allmodulArgsList.length;i++)
	{
		if (uname === allmodulArgsList[i].substring(0, uname.length))
		{
			indexInList = i;
			break;
		}
	}
	if (indexInList>-1)
	{
		var allmodulArgs=window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
		var urlCallParametersList = allmodulArgs.split("&");	
		urlCallParametersList.splice(indexInList, 1);
		var newURLstring = "?"+urlCallParametersList.join("&");
		window.history.pushState({}, '', newURLstring);
		location.reload();
	}
}

var bootVR = function ()
{
   	// loading all Modules in the folder /js/vrobjects ... needs webserver to autolist that folder (or 403 fail)
    	// otherwise this section needs to be replaced by regular imports in <head> ala <script src="js/vrobjects/ooblox...
	$.get("./js/vrobjects", function(data) 
       	{
		var modules = data.split("href=\"");

		var n = 0;
		while (n<modules.length)
		{
			var thisfilename = modules[n].substring(0,modules[n].indexOf("\""));
			if (thisfilename.substring(thisfilename.length-3,thisfilename.length+1)===".js") {modules[n] = thisfilename;n++;}
			else modules.splice(n,1);
		}

		totalModules = modules.length;
		for (var i=0;i<modules.length;i++)
		{
			var thisfilename= modules[i];
			
			$.getScript('js/vrobjects/'+thisfilename, function()
			{
				loadcounter+=1;
				if (loadcounter==totalModules)
				{
					init();
					animate();
				}
			}).fail(function()
			{
				loadcounter+=1;
				if (loadcounter==totalModules)
				{
					init();
					animate();
				}
			});
		}
        });
}

function init()
{

	createCamera();
	container = document.getElementById( 'container' );

	controls =  new THREE.OrbitControls( camera );

	createScene();

	vrcontrols = new THREE.VRControls( camera );
	
	processURLParams();
	createRenderer();
	
	effect = new THREE.VREffect( renderer );
	effect.setSize( window.innerWidth, window.innerHeight );

	manager = new WebVRManager(renderer, effect);

	dat.GUIVR.enableMouse( camera );

	stats = new Stats();
	stats.dom.style.opacity= "0.61";
	container.appendChild( stats.dom );

	// beginning of shameless self-promotion (the bar on top)
	var infoDiv = document.createElement("div");
	infoDiv.style.position = "fixed";
	infoDiv.style.top = "0px";
	infoDiv.style.left = "80px";
	infoDiv.style.right = "0px";
	infoDiv.style.color = "#002";
	infoDiv.style.backgroundColor = '#0ff';
	infoDiv.style.opacity= "0.61";
	infoDiv.style.height = "42px";
	infoDiv.style.textAlign = "center";
	infoDiv.style.verticalAlign = "middle";
	infoDiv.style.borderTop = "3px solid #002"
	infoDiv.style.borderBottom = "3px solid #002"
	infoDiv.style.borderRight = "3px solid #002"
	var p = document.createElement("P");
	var t0 = document.createTextNode("ooblox by PasGl - ");
	p.appendChild(t0);

	var l1 = document.createElement("A");
	l1.href = "sandbox";
	l1.target= "_self";
	l1.style.color = "#002";
	var lt1 = document.createTextNode("sandbox");
	l1.appendChild(lt1);  
	p.appendChild(l1);
	var ls1 = document.createTextNode(" - ");
	p.appendChild(ls1);

	var l2 = document.createElement("A");
	l2.href = "guitar";
	l2.target= "_self";
	l2.style.color = "#002";
	var lt2 = document.createTextNode("guitar");
	l2.appendChild(lt2);  
	p.appendChild(l2);
	var ls2 = document.createTextNode(" - ");
	p.appendChild(ls2);

	var l3 = document.createElement("A");
	l3.href = "geometry";
	l3.target= "_self";
	l3.style.color = "#002";
	var lt3 = document.createTextNode("geometry");
	l3.appendChild(lt3);  
	p.appendChild(l3);
	var ls3 = document.createTextNode(" - ");
	p.appendChild(ls3);

	var l4 = document.createElement("A");
	l4.href = "demo";
	l4.target= "_self";
	l4.style.color = "#002";
	var lt4 = document.createTextNode("testing");
	l4.appendChild(lt4);  
	p.appendChild(l4);
	var ls4 = document.createTextNode(" - ");
	p.appendChild(ls4);

	var a1 = document.createElement("A");
	a1.href = "https://github.com/PasGl/ooblox";
	a1.target= "_blank";
	a1.style.color = "#002";
	var t1 = document.createTextNode("Code @ Github");
	a1.appendChild(t1);  
	p.appendChild(a1);
	var s1 = document.createTextNode(" - ");
	p.appendChild(s1);
	var a2 = document.createElement("A");
	a2.href = "https://discord.gg/Ux52EYw";
	a2.target= "_blank";
	a2.style.color = "#002";
	var t2 = document.createTextNode("Contact @ Discord");
	a2.appendChild(t2);  
	p.appendChild(a2);
	var s2 = document.createTextNode(" - ");
	p.appendChild(s2);
	var a3 = document.createElement("A");
	a3.href = "https://www.patreon.com/PasGl";
	a3.target= "_blank";
	a3.style.color = "#002";
	var t3 = document.createTextNode("Support me @ Patreon");
	a3.appendChild(t3);  
	p.appendChild(a3);
        infoDiv.appendChild(p);
	container.appendChild(infoDiv);
	// end of shameless self-promotion
}

function createCamera()
{
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 20;
}

function createScene()
{
	scene = new THREE.Scene();
	scene.name = "Scene";
	scene.fog = new THREE.Fog( 0xbfd1e5, 1, 1050 );
	var hemiLight = new THREE.HemisphereLight( 0xbfd1e5, 0x9d8851, 0.6 );
	hemiLight.position.set( -400, 1400, 400 );
	scene.add(hemiLight);
	dirTarget = new THREE.Object3D();
	dirTarget.name = "dirTarget";
	scene.add( dirTarget );
	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.position.set( -400, 1400, 400 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.near = 1400;
	dirLight.shadow.camera.far = 2000;
	dirLight.shadow.camera.left = -150;
	dirLight.shadow.camera.right = 150;
	dirLight.shadow.camera.top = 150;
	dirLight.shadow.camera.bottom = -150;
	dirLight.shadow.bias = 0.00005;
	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;
	dirLight.target = dirTarget;

	//camhelper = new THREE.CameraHelper( dirLight.shadow.camera );
	//scene.add( camhelper );

	scene.add( dirLight );
}

function processURLParams()
{
	// prepare URL query string
	var allmodulArgs="";
	var urlCallParametersList= [];
	if (window.location.href.indexOf("?")!=-1)
	{
		if ((window.location.href.indexOf("?")+1)<window.location.href.length)
		{
			allmodulArgs=window.location.href.substring(window.location.href.indexOf("?")+1, window.location.href.length);
			urlCallParametersList = allmodulArgs.split("&");
		}
	}

	// gather the vrObjectTypeID from each available Module
	for (var typeIndex = 0;typeIndex<vrObjectConstructorList.length;typeIndex++)
	{
		importTypesAvailable.push((new vrObjectConstructorList[typeIndex](scene)).mesh.vrObjectTypeID);
	}

	// instantiate modules according to URL query string
	for (var i=0;i<urlCallParametersList.length;i++)
	{
			var uname = urlCallParametersList[i].slice(0,urlCallParametersList[i].indexOf("="));
			var vrObjectTypeID = urlCallParametersList[i].slice(urlCallParametersList[i].indexOf("=")+1,urlCallParametersList[i].indexOf("+"));
			var importedThing = new vrObjectConstructorList[importTypesAvailable.indexOf(vrObjectTypeID)]();
			importedThing.mesh.uname = uname;
			importedThing.load(scene, camera);
	}
}

function createRenderer()
{
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0xbfd1e5 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	effect.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
	requestAnimationFrame( animate );
	clock.getDelta();//THREE.AnimationHandler.update( clock.getDelta() );
	controls.update();

	camOffset = new THREE.Vector3(0,0,-75);
	camOffset.applyQuaternion(camera.quaternion);
	dirLight.position.set(camOffset.x+camera.position.x-400, 1400+camera.position.y, camOffset.z+camera.position.z+400 );
	dirTarget.position.set(camOffset.x+camera.position.x, 0+camera.position.y, camOffset.z+camera.position.z );

	//camhelper.update();

	if (manager.isVRMode())
	{
		effect.render(scene, camera);
		vrcontrols.update();
	}
	else
	{
		renderer.render(scene, camera);	
	}
	
	stats.update();
}
