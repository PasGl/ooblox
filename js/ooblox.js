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

var bootVR = function ()
{


   	// loading all Modules in the folder /js/vrobjects ... needs webserver to autolist that folder (or 403 fail)
    	// otherwise this section needs to be replaced by regular imports ala <script src="js/vrobjects/ooblox...
	$.get("./js/vrobjects", function(data) 
       	{
		var modules = data.split("href=\"");
		console.log(modules):
		modules.splice(0,1);
		console.log(modules):
		totalModules = modules.length;
		for (var i=0;i<modules.length;i++)
		{
			var thisfilename= modules[i].substring(0,modules[i].indexOf("\""));
			if (thisfilename.substring(thisfilename.length-3,thisfilename.length+1)===".js")
			{	
				console.log(loadcounter,totalModules, thisfilename);												
				$.getScript('js/vrobjects/'+thisfilename, function()
				{
					loadcounter+=1;
					console.log(loadcounter,totalModules);
					if (loadcounter==totalModules)
					{
						init();
						animate();
					}
				});
			}
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
	var t0 = document.createTextNode("ooblox sandbox by PasGl - ");
	p.appendChild(t0);
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
	scene.fog = new THREE.Fog( 0xbfd1e5, 0, 750 );
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
	dirLight.shadow.camera.far = 1560;
	dirLight.shadow.camera.left = -100;
	dirLight.shadow.camera.right = 100;
	dirLight.shadow.camera.top = 100;
	dirLight.shadow.camera.bottom = -100;
	dirLight.shadow.bias = 0.00005;
	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;
	dirLight.target = dirTarget;
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
	THREE.AnimationHandler.update( clock.getDelta() );
	controls.update();

	camOffset = new THREE.Vector3(0,0,-75);
	camOffset.applyQuaternion(camera.quaternion);
	dirLight.position.set(camOffset.x+camera.position.x-400, 1400, camOffset.z+camera.position.z+400 );
	dirTarget.position.set(camOffset.x+camera.position.x, 0, camOffset.z+camera.position.z );

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
