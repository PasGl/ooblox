/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

oobloxOrbitCamMod = function ()
{
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	this.mesh.vrObjectTypeID = "OCM";
	var mesh = this.mesh;
	this.cam = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshPhongMaterial({}));
	var cam = this.cam;

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
		this.cam = camera;

		this.cam.position.x = parseFloat(argList[1]);
		this.cam.position.y = parseFloat(argList[2]);
		this.cam.position.z = parseFloat(argList[3]);
		this.cam.target.x = parseFloat(argList[4]);
		this.cam.target.y = parseFloat(argList[5]);
		this.cam.target.z = parseFloat(argList[6]);
		controls.addEventListener( 'change', refresh );
	}
}

vrObjectConstructorList.push(oobloxOrbitCamMod); // global list of all available vrObject type constructors
