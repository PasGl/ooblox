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
				controls.target.x,
				controls.target.y,
				controls.target.z]);
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		cam = camera;
		cam.position.x = parseFloat(argList[1]);
		cam.position.y = parseFloat(argList[2]);
		cam.position.z = parseFloat(argList[3]);
		controls.target.x = parseFloat(argList[4]);
		controls.target.y = parseFloat(argList[5]);
		controls.target.z = parseFloat(argList[6]);
		controls.addEventListener( 'change', refresh );
	}
}

vrObjectConstructorList.push(oobloxOrbitCamMod); // global list of all available vrObject type constructors
