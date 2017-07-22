/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

/**
 * Some of the probability data has been inspired by https://www.hooktheory.com/trends
 *
 * Additional advice on music theory has been provided by Simon Troup / http://www.digitalmusicart.com/
 */

oobloxChordProgressionGenerator = function ()
{
	this.mesh = new THREE.Mesh( new THREE.PlaneGeometry(40, 5, 10, 10), new THREE.MeshPhongMaterial({}));
	this.mesh.vrObjectTypeID = "CPG";
	this.mesh.uname = "";
	var mesh = this.mesh;

	var CPGProperties = function ()
	{
		this.chords = ["C  ","Dm ","Em ","F  ","G  ","Am ","Bdim","Cmaj7","Dm7","Em7","Fmaj7","G7 ","Am7","Bm7b5","Csus2","Csus4","Dsus2","Dsus4","Esus4","Fsus2","Fsus4","Gsus2","Gsus4","Asus2","Asus4"];
		this.bars = 4;
		this.randomSeed = 123456789;
		this.nextChordProb = [ 	[0.01,0.06,0.04,0.19,0.25,0.10,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from C
					[0.13,0.01,0.09,0.16,0.16,0.18,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Dm
					[0.05,0.08,0.01,0.33,0.08,0.26,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Em
					[0.29,0.05,0.04,0.01,0.29,0.10,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from F
					[0.21,0.06,0.04,0.21,0.01,0.26,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from G
					[0.11,0.06,0.06,0.24,0.20,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Am
					[0.24,0.01,0.04,0.04,0.05,0.21,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Bdim
 					[0.01,0.06,0.04,0.19,0.25,0.10,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Cmaj7
 					[0.13,0.01,0.09,0.16,0.16,0.18,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Dm7
 					[0.05,0.08,0.01,0.33,0.08,0.26,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Em7
 					[0.29,0.05,0.04,0.01,0.29,0.10,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Fmaj7
 					[0.21,0.06,0.04,0.21,0.01,0.26,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from G7
 					[0.11,0.06,0.06,0.24,0.20,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Am7
					[0.04,0.01,0.44,0.04,0.05,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Bm7b5
					[0.50,0.06,0.04,0.01,0.01,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Csus2
					[0.50,0.06,0.04,0.01,0.01,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Csus4
					[0.01,0.50,0.09,0.01,0.01,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Dsus2
					[0.01,0.50,0.09,0.01,0.01,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Dsus4
					[0.05,0.01,0.51,0.01,0.08,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Esus4
 					[0.01,0.01,0.01,0.51,0.01,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Fsus2
 					[0.01,0.01,0.01,0.51,0.01,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Fsus4
					[0.01,0.01,0.01,0.01,0.51,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Gsus2
					[0.01,0.01,0.01,0.01,0.51,0.01,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Gsus4
					[0.01,0.01,0.01,0.01,0.01,0.51,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001], // from Asus2
					[0.01,0.01,0.01,0.01,0.01,0.51,0.005,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.0005,0.001,0.0005,0.001,0.001,0.0005,0.001,0.0005,0.001,0.0005,0.001]];// from Asus4
		this.position = new THREE.Vector3(0,0,0);
	}

	var conf = new CPGProperties();

	var generateProgression = function ()
	{

		var currentSeed = conf.randomSeed;
		function seededRandom() 
		{
			var x = Math.sin(currentSeed++) * 10000;
			return x - Math.floor(x);
		}

		var last = "";

		function pickNext()
		{
			if (conf.chords.indexOf(last) === -1)
			{ 
				last= conf.chords[Math.floor(seededRandom() * conf.chords.length)];
				return last;
			}
			else
			{
				var indexOfThisChord = conf.chords.indexOf(last);
				var p  = seededRandom();
				var pt = 0.0;
				var testindex = 0;

				while (true)
				{	
					if (testindex<conf.chords.length)
					{
						var thisp = conf.nextChordProb[indexOfThisChord][testindex];

						if (pt+thisp > p)
						{
							last = conf.chords[testindex];
							return last;
						}
						else 
						{
							testindex +=1;
							pt += thisp;
						}
					}
					else
					{
						testindex = 0;
					}
				}
			}
		}

		var resultingProgression = []; // list of lists, each inner list = 1 Bar

		for (var i=0;i<conf.bars;i++) 
		{
			var thisBar = [];

			thisBar.push(pickNext());
			if (seededRandom()<0.2) thisBar.push(pickNext());
			else thisBar.push("    ");
			resultingProgression.push(thisBar);
		}

		return resultingProgression;
	}
 	
	var createTexture = function (text) {
					var canvas = document.createElement("canvas");
					var context = canvas.getContext("2d");
					canvas.width = 1024;
					canvas.height = 128;
					context.font = "20pt Arial";
					context.textAlign = "center";
					context.fillRect(0, 0, canvas.width, canvas.height);
					context.fillStyle = "white";
					context.fillText(text, canvas.width / 2, canvas.height / 2);
					var texture = new THREE.Texture(canvas);
					texture.needsUpdate = true;
					var material = new THREE.MeshBasicMaterial({
						map : texture
					});
					mesh.material =  material;
				}

	var refreshURL = function (targetScene)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( mesh.matrixWorld );
		updateURLargs([	mesh.uname,
				mesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z,
				conf.bars,
				conf.randomSeed]);
	}

	var refresh = function (targetScene)
	{
		var progression = generateProgression();
		var progressionString = "|";
		for (var i=0;i<progression.length;i++) 
		{
			var thisBar = "  ";
			for (var j=0;j<progression[i].length;j++) thisBar+=progression[i][j]+"  ";
			progressionString += thisBar + "|";
		}
		createTexture(progressionString);
		refreshURL(targetScene);
	}

	this.mesh.fillDatGUI = function (targetScene,mesh)
	{
		var datFolder = dat.GUIVR.create('Chord Progression');

		datFolder.position.set(conf.position.x,conf.position.y,conf.position.z);
		datFolder.scale.set(20.0,20.0,0.1);
		mesh.scale.set(0.05,0.05,10.0);
		mesh.position.set(0,0.1,0);
		var barsSlider = datFolder.add(conf,'bars',1,8).step(1);
		barsSlider.onChange(function(){refresh(targetScene);});

		var randomSeedSlider = datFolder.add(conf,'randomSeed',0,999999).step(1); // Number.MAX_SAFE_INTEGER
		randomSeedSlider.onChange(function(){refresh(targetScene);});

		datFolder.children[1].add(mesh);
		targetScene.add( datFolder );
		datFolder.close();
		window.addEventListener("mouseup", function(){refreshURL(targetScene);})
	}

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		conf.position = new THREE.Vector3();
		conf.position.x = parseFloat(argList[1]);
		conf.position.y = parseFloat(argList[2]);
		conf.position.z = parseFloat(argList[3]);
		conf.bars = parseInt(argList[11]);
		conf.randomSeed = parseInt(argList[12]);
		this.mesh.position.copy(conf.position);
		this.mesh.fillDatGUI(targetScene,this.mesh);
		refresh(targetScene);
	}
}

vrObjectConstructorList.push(oobloxChordProgressionGenerator); // global list of all available vrObject type constructors
