/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxOrbitCamMod = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	this.mesh.vrObjectTypeID = "OCM";
	var mesh = this.mesh;
	var cam;

	var refresh = function ()
	{
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				cam.position.x,
				cam.position.y,
				cam.position.z,
				cam.target.x,
				cam.target.y,
				cam.target.z]);
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		camera.position.x = parseFloat(argList[1]);
		camera.position.y = parseFloat(argList[2]);
		camera.position.z = parseFloat(argList[3]);
		camera.target.x = parseFloat(argList[4]);
		camera.target.y = parseFloat(argList[5]);
		camera.target.z = parseFloat(argList[6]);
		cam = camera;
		controls.addEventListener( 'change', refresh );
	}
}

vrObjectConstructorList.push(oobloxOrbitCamMod); // global list of all available vrObject type constructors
