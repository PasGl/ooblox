/**
 * @author Pascal Gleske / https://github.com/PasGl
 */

function arrayClone(ori)
{
	var newA = [];
	for (var i=0;i<ori.length;i++)
	{
		var newAI = ori[i].clone();
		newA.push(newAI);
	}
	return newA;
}

function parseFloatDefault(params,defaultVal)
{
	var val = parseFloat(params);
	if (params.length==0) val = defaultVal;
	else if (val===NaN) val = defaultVal;
	return (val);
}

function PSOLRule (char, params, probability, production)
{
	this.char = char;
	this.params = params;
	this.probability = probability;
	this.production = production;
}

function PTurtle3D ()
{
	this.position = new THREE.Vector3(0,0,0);
	this.orientation = new THREE.Quaternion();
	this.scale = new THREE.Vector3(0.5,0.5,0.5);
	this.step = 2.0;
	this.angle = 0.15;
	this.diameterDelta = 0.03;
	this.stepDelta = 0.03;
	this.tropismAngle = 0.15;
	this.gravityAngle = 0.15;
	this.tropismDelta = 0.03;
	this.gravityDelta = 0.03;
	this.primaryColor = "#FFFFFF";//+("000000"+Math.floor(Math.random()*16777215).toString(16)).slice(-6);
	this.secondaryColor = "#FF0000";//+("000000"+Math.floor(Math.random()*16777215).toString(16)).slice(-6);
	this.tertiaryColor =  "#00FF00";//+("000000"+Math.floor(Math.random()*16777215).toString(16)).slice(-6);

	this.rotate = function (axis,angle)
	{
		var rot = new THREE.Quaternion();
		rot.setFromAxisAngle(axis,angle);
		this.orientation.multiply(rot);
	}

	this.clone = function ()
	{
		var newTurtle = new PTurtle3D ();
		newTurtle.position = this.position.clone();
		newTurtle.orientation = this.orientation.clone();
		newTurtle.scale = this.scale.clone();
		newTurtle.step = this.step;
		newTurtle.angle = this.angle;
		newTurtle.diameterDelta = this.diameterDelta;
		newTurtle.stepDelta = this.stepDelta;
		newTurtle.tropismAngle = this.tropismAngle;
		newTurtle.gravityAngle = this.gravityAngle;
		newTurtle.tropismDelta = this.tropismDelta;
		newTurtle.gravityDelta = this.gravityDelta;
		newTurtle.primaryColor = this.primaryColor;
		newTurtle.secondaryColor = this.secondaryColor;
		newTurtle.tertiaryColor = this.tertiaryColor;
		return newTurtle;
	}
}

function PSOLSystem ()
{
	this.generation = 0;
	this.speciesName = "PSOL-System";
	this.speciesDescription = "Parametric, Stochastic, context-free L-System";
	this.finalVertexCount = 0;
	this.finalGeometry;
	var finalGeometry = this.finalGeometry;
	this.mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({}));
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;

	this.mesh.vrObjectTypeID = "PLS";

	var PSOLGUIProperties = function ()
	{
		this.iterations = 4;
		this.axiom = "F";
		this.iterationsDone=0;
		this.iterationsLeft=0;
	        this.randomSeed=0;
		this.rules = new Array();
		this.diameter = 0.5;
		this.circleSegments = 5;
		this.initTurtle = new PTurtle3D ();
	};

	var conf = new PSOLGUIProperties();

	this.initPresetRandom = function()
	{
		conf.rules.push(new PSOLRule("N","x",0.666,"dbF/(2.39996)[&FgrtpFN(x*1.05)]/(2.39996)[&FgrtpFN(x*1.05)]/(2.39996)&FgrtpFN(x*1.05)"));
		conf.rules.push(new PSOLRule("F","",0.02,"FF"));
	}

 	this.flower = function (turtle)
	{
		var tsx = turtle.scale.x * 15.0;
		var closingGeometry = new THREE.PlaneGeometry(tsx*2.0,tsx*2.0,1,1);




		var closingGeometryMatrix = new THREE.Matrix4 ();
		closingGeometryMatrix.compose(
			turtle.position.clone().add( (new THREE.Vector3( 0, tsx, 0 )).applyQuaternion(turtle.orientation)),
			turtle.orientation.clone(),
			(new THREE.Vector3( 1.0, 1.0, 1.0 )));
		closingGeometry.applyMatrix(closingGeometryMatrix);
		return closingGeometry;
	}
	var flower = this.flower;

	this.iterate = function ()
	{
		conf.iterationsLeft = conf.iterations;
		if (conf.iterationsLeft<0) conf.iterationsLeft =0;
		conf.iterationsDone = 0;
		
		var currentString = conf.axiom;
		var currentSeed = conf.randomSeed;
		//alert("M "+conf.iterationsLeft+ " "+currentString);
		function seededRandom() 
		{
			var x = Math.sin(currentSeed++) * 10000;
			return x - Math.floor(x);
		}

		while (conf.iterationsLeft>0)
		{
			//alert("i "+conf.iterationsDone+ " "+currentString);
			var nextString = "";
			conf.iterationsLeft-=1;
			conf.iterationsDone+=1;
			var i=0;
			while (i<currentString.length)
			{
				var probabilitySum = 0.0;
				var char = currentString[i];
				var params = "";
				if ((i+1)<currentString.length)
				{
					if (currentString[i+1]=="(")
					{
						var bCounter = 1;
						i++;
						while ((i+1)<currentString.length)
						{
							i++;
							if (currentString[i]=="(")
							{
								bCounter++;
								params += "(";
							}
							else if (currentString[i]==")")
							{
								bCounter--;
								if (bCounter==0) break ;
								else params += ")";
							}
							else params += currentString[i];
						}
					}
				}
				var paramsArray = params.split(",");
				if (params=="") paramsArray = [];
				var rulefound = false;
				for (var r=0;r<conf.rules.length;r++)
				{
					if (conf.rules[r].char==char)
					{
						if (conf.rules[r].params.length == paramsArray.length)
						{
							if (seededRandom()<=(conf.rules[r].probability+probabilitySum))
							{
								rulefound = true;
								var prod = conf.rules[r].production;

								for (var x=0;x<conf.rules[r].params.length;x++)
								{
									var pchar = conf.rules[r].params[x];
									var val = parseFloatDefault(paramsArray[x],0);

									var inBrackets = 0;
									var newProd = "";

									for (var c=0;c<prod.length;c++)
									{
										if (prod[c] == "(")
										{
											newProd += "(";
											inBrackets++;
										}
										else if (prod[c] == ")")
										{
											newProd += ")";
											inBrackets--;
										}
										else if ((prod[c] == pchar) && (inBrackets>0))
										{
											newProd += paramsArray[x];
										}
										else newProd+=prod[c];
									}
									prod = newProd;
								}
								var inBrackets = 0;
								var newProd = "";
								var calcSegment = "";
								for (var c=0;c<prod.length;c++)
								{
									if (prod[c] == "(")
									{
										
										if (inBrackets==0)
										{
											newProd += "(";
											calcSegment = "";
										}
										else calcSegment += "(";
										inBrackets++;
									}
									else if (prod[c] == ")")
									{
										inBrackets--;
										if (inBrackets==0)
										{
											calcSegment.replace(/[^-()\d*+/.]/g, '');
											newProd += ""+eval(calcSegment)+")";
											calcSegment = "";
										}
										else calcSegment+=")";
									}
									else if (prod[c] == ",")
									{
										calcSegment.replace(/[^-()\d*+/.]/g, '');
										newProd += ""+eval(calcSegment)+",";
										calcSegment = "";
									}
									else if (inBrackets>0)
									{
										calcSegment += prod[c];
									}
									else newProd+=prod[c];
								}
								nextString += newProd;
								break;
							}
							else probabilitySum += conf.rules[r].probability;
						}
					}
				}
				if (!rulefound)
				{
					nextString += char;
					if (params != "") nextString += "("+params+")";
				}
				i++;
			}
			currentString = nextString;
		}
		return (currentString);
	}
	var iterate = this.iterate;

	this.interpret = function (currentString)
	{
		var currentTurtle = conf.initTurtle.clone();
		var turtleStack = [];
		var tubeStack = [];
		var matrix = new THREE.Matrix4();
		finalGeometry = new THREE.Geometry();
		var tubePoints = [currentTurtle.position.clone()];
		var tubeRadii = [currentTurtle.scale.clone()];
		for (var i=0;i<currentString.length;i++)
		{
			var char = currentString[i];
			var params = "";
			if ((i+1)<currentString.length)
			{
				if (currentString[i+1]=="(")
				{
					i++;
					while ((i+1)<currentString.length)
					{
						i++;
						if (currentString[i]==")") break;
						else params += currentString[i];
					}
				}
			}
			switch (char)
			{
				case "A":
				case "B":
				case "C":
				case "D":
				case "E":
				case "F":
					var step = parseFloatDefault(params,currentTurtle.step);
					var stepvec = new THREE.Vector3(0,step,0);
					stepvec.applyQuaternion(currentTurtle.orientation);
					currentTurtle.position.add(stepvec);
					tubePoints.push(currentTurtle.position.clone());
					tubeRadii.push(currentTurtle.scale.clone());
					break;
				case "N":
					var stepvec = new THREE.Vector3(0,currentTurtle.scale.x*5.0,0);
					stepvec.applyQuaternion(currentTurtle.orientation);
					currentTurtle.position.add(stepvec);
					tubePoints.push(currentTurtle.position.clone());
					tubeRadii.push(currentTurtle.scale.clone());

					stepvec = new THREE.Vector3(0,currentTurtle.scale.x*5.0,0);
					stepvec.applyQuaternion(currentTurtle.orientation);
					tubePoints.push(currentTurtle.position.clone().add(stepvec));
					tubeRadii.push(new THREE.Vector3(0,0,0));
					if (tubePoints.length>1)
					{
						var tubeSpline =  new THREE.CatmullRomCurve3(tubePoints);
						var tubeSplineRadii =  new THREE.CatmullRomCurve3(tubeRadii);
						var tubeGeometry = new THREE.BBTubeGeometry(
							tubeSpline,
							tubeSplineRadii,
							(tubePoints.length-1)*3,
							conf.circleSegments,
							false,
							false);
						finalGeometry.merge( tubeGeometry,tubeGeometry.matrix,0 );
					}
					tubePoints = [];
					tubeRadii = [];
					var closingGeometry = flower(currentTurtle);
					finalGeometry.merge( closingGeometry,closingGeometry.matrix,1 );
					break;
				case "+":
					var angle = parseFloatDefault(params,currentTurtle.angle);
					currentTurtle.rotate(new THREE.Vector3(1,0,0),angle);
					break;
				case "-":
					var angle = parseFloatDefault(params,currentTurtle.angle);
					currentTurtle.rotate(new THREE.Vector3(-1,0,0),angle);
					break;
				case "/":
					var angle = parseFloatDefault(params,currentTurtle.angle);
					currentTurtle.rotate(new THREE.Vector3(0,1,0),angle);
					break;
				case "\\":
					var angle = parseFloatDefault(params,currentTurtle.angle);
					currentTurtle.rotate(new THREE.Vector3(0,-1,0),angle);
					break;
				case "&":
					var angle = parseFloatDefault(params,currentTurtle.angle);
					currentTurtle.rotate(new THREE.Vector3(0,0,1),angle);
					break;
				case "^":
					var angle = parseFloatDefault(params,currentTurtle.angle);
					currentTurtle.rotate(new THREE.Vector3(0,0,-1),angle);
					break;
				case "[":
					turtleStack.push(currentTurtle.clone());
					var acP = arrayClone(tubePoints);
					var acT = arrayClone(tubeRadii);
					tubeStack.push({points: acP,
							radii: acT});
					tubePoints = [currentTurtle.position.clone()];
					tubeRadii = [currentTurtle.scale.clone()];
					break;
				case "]":
					if (tubePoints.length>1)
					{
						var tubeSpline =  new THREE.CatmullRomCurve3(tubePoints);
						var tubeSplineRadii =  new THREE.CatmullRomCurve3(tubeRadii);
						var tubeGeometry = new THREE.BBTubeGeometry(
							tubeSpline,
							tubeSplineRadii,
							(tubePoints.length-1)*3,
							conf.circleSegments,
							false,
							false);
						finalGeometry.merge( tubeGeometry,tubeGeometry.matrix,0 );
					}
					currentTurtle = turtleStack.pop();
					var tR = tubeStack.pop();
					tubePoints = tR.points;
					tubeRadii = tR.radii;
					break;
				case "q":
					var val = parseFloatDefault(params,1.03);
					currentTurtle.diameterDelta *= val;
					break;
				case "w":
					var val = parseFloatDefault(params,0.97);
					currentTurtle.diameterDelta *= val;
					break;
				case "e":
					var val = parseFloatDefault(params,1.03);
					currentTurtle.stepDelta *= val;
					break;
				case "j":
					var val = parseFloatDefault(params,0.97);
					currentTurtle.stepDelta *= val;
					break;
				case "f":
					var val = parseFloatDefault(params,1.03);
					currentTurtle.tropismDelta *= val;
					break;
				case "h":
					var val = parseFloatDefault(params,0.97);
					currentTurtle.tropismDelta *= val;
					break;
				case "m":
					var val = parseFloatDefault(params,1.03);
					currentTurtle.gravityDelta *= val;
					break;
				case "n":
					var val = parseFloatDefault(params,0.97);
					currentTurtle.gravityDelta *= val;
					break;
				case "o":
					var val = parseFloatDefault(params,currentTurtle.tropismDelta);
					currentTurtle.tropismAngle *= 1.0-val;
					break;
				case "p":
					var val = parseFloatDefault(params,currentTurtle.tropismDelta);
					currentTurtle.tropismAngle *= 1.0+val;
					break;
				case "r":
					var val = parseFloatDefault(params,currentTurtle.gravityDelta);
					currentTurtle.gravityAngle *= 1.0-val;
					break;
				case "u":
					var val = parseFloatDefault(params,currentTurtle.gravityDelta);
					currentTurtle.gravityAngle *= 1.0+val;
					break;
				case "!":
					var val = parseFloatDefault(params,currentTurtle.scale);
					currentTurtle.scale.x = val;
					currentTurtle.scale.z = val;
					break;
				case "d":
					var val = parseFloatDefault(params,currentTurtle.diameterDelta);
					currentTurtle.scale.x *= 1.0-val;
					currentTurtle.scale.z *= 1.0-val;
					break;
				case "i":
					var val = parseFloatDefault(params,currentTurtle.diameterDelta);
					currentTurtle.scale.x *= 1.0+val;
					currentTurtle.scale.z *= 1.0+val;
					break;
				case "b":
					var val = parseFloatDefault(params,currentTurtle.stepDelta);
					currentTurtle.step *= 1.0-val;
					break;
				case "a":
					var val = parseFloatDefault(params,currentTurtle.stepDelta);
					currentTurtle.step *= 1.0+val;
					break;
				case "t":
					var val = parseFloatDefault(params,currentTurtle.tropismAngle);
					var sourceV = new THREE.Vector3(0.0,1.0,0.0);
					var t = new THREE.Vector3(0.00001,1.00001,0.00001);
					sourceV.applyQuaternion(currentTurtle.orientation);
					var axis = new THREE.Vector3();
					axis.crossVectors(sourceV,t);
					axis.normalize();
					var maxAngle = Math.acos(sourceV.dot(t));
					if (isNaN(maxAngle)) maxAngle=0.0;
					if (maxAngle>Math.PI) alert(huh);
					var addedRot = new THREE.Quaternion();
					if (val>maxAngle) addedRot.setFromAxisAngle(axis,maxAngle);
					else addedRot.setFromAxisAngle(axis,val);
					currentTurtle.orientation.multiply(addedRot);
					break;
				case "g":
					var val = parseFloatDefault(params,currentTurtle.gravityAngle);
					var sourceV = new THREE.Vector3(0.0,1.0,0.0);
					var t = new THREE.Vector3(0.00001,-1.00001,0.00001);
					sourceV.applyQuaternion(currentTurtle.orientation);
					var axis = new THREE.Vector3();
					axis.crossVectors(sourceV,t);
					axis.normalize();
					var maxAngle = Math.acos(sourceV.dot(t));
					if (isNaN(maxAngle)) maxAngle=0.0;
					var addedRot = new THREE.Quaternion();
					if (val>maxAngle) addedRot.setFromAxisAngle(axis,maxAngle);
					else addedRot.setFromAxisAngle(axis,val);
					currentTurtle.orientation.multiply(addedRot);
					break;
			}

		}
		if (tubePoints.length>1)
		{
			var tubeSpline =  new THREE.CatmullRomCurve3( tubePoints );
			var tubeSplineRadii =  new THREE.CatmullRomCurve3(tubeRadii);
			var tubeGeometry = new THREE.BBTubeGeometry(
				tubeSpline, 
				tubeSplineRadii,
				(tubePoints.length-1)*3,
				conf.circleSegments,
				false,
				false);
			finalGeometry.merge( tubeGeometry,tubeGeometry.matrix,0 );
		}
	}
	var interpret = this.interpret;

	this.finalize = function (mesh)
	{
		finalGeometry.computeBoundingBox();
		this.finalVertexCount = finalGeometry.vertices.length;
		var c1 = new THREE.Color(conf.initTurtle.primaryColor);
		var c2 = new THREE.Color(conf.initTurtle.secondaryColor);
		var c3 = new THREE.Color(conf.initTurtle.tertiaryColor);
		mesh.geometry = finalGeometry;
		mesh.material  = [new THREE.MeshPhongMaterial(
				{
					color: c1.getHex(),
					specular: 0x333333,
					shading: THREE.SmoothShading
				}),
				new THREE.MeshPhongMaterial(
				{
					color: c2.getHex(),
					specular: 0x333333,
					shading: THREE.SmoothShading,
					side: THREE.DoubleSide
				}),
			 	new THREE.MeshPhongMaterial(
				{
					color: c3.getHex(),
					specular: 0x333333,
					shading: THREE.SmoothShading
				})];

	}
	var finalize = this.finalize;

	this.fillGUI = function (targetScene,thismesh)
	{

		var datFolder = dat.GUIVR.create(thismesh.uname+' (PSOL-System)');
		datFolder.position.set(thismesh.position.x+10,thismesh.position.y+10,thismesh.position.z);
		datFolder.scale.set(10.0,10.0,0.1);
		thismesh.position.set(-1.0,-1.0,0);
		thismesh.scale.set(0.1,0.1,10.0);
		
		var iterationsSlider = datFolder.add(conf,'iterations',0,6).step(1);
		iterationsSlider.onChange(function(){refresh(targetScene,thismesh);});

		var axiomText = datFolder.add(conf,'axiom',["F","FN(1)"]);
		axiomText.onChange(function(){refresh(targetScene,thismesh);});
		
		var randomSeedSlider = datFolder.add(conf,'randomSeed',0,99999999).step(1);
		randomSeedSlider.onChange(function(){refresh(targetScene,thismesh);});

		var circleSegmentsSlider = datFolder.add(conf,'circleSegments',3,50).step(1);
		circleSegmentsSlider.onChange(function(){refresh(targetScene,thismesh);});

		var diameterSlider = datFolder.add(conf,'diameter',0.1,3.0);
		diameterSlider.onChange(function(value) 
		{
			conf.initTurtle.scale.x=value;
			conf.initTurtle.scale.y=value;
			conf.initTurtle.scale.z=value;
			refresh(targetScene,thismesh);
		});

		var stepSlider = datFolder.add(conf.initTurtle,'step',0.1,10.0);
		stepSlider.onChange(function(){refresh(targetScene,thismesh);});
		var angleSlider = datFolder.add(conf.initTurtle,'angle',0.001,1.5);
		angleSlider.onChange(function(){refresh(targetScene,thismesh);});
		var diameterDeltaSlider = datFolder.add(conf.initTurtle,'diameterDelta',0.0001,0.5);
		diameterDeltaSlider.onChange(function(){refresh(targetScene,thismesh);});
		var stepDeltaSlider = datFolder.add(conf.initTurtle,'stepDelta',0.0001,0.5);
		stepDeltaSlider.onChange(function(){refresh(targetScene,thismesh);});
		var tropismAngleSlider = datFolder.add(conf.initTurtle,'tropismAngle',0.001,1.5);
		tropismAngleSlider.onChange(function(){refresh(targetScene,thismesh);});
		var gravityAngleSlider = datFolder.add(conf.initTurtle,'gravityAngle',0.001,1.5);
		gravityAngleSlider.onChange(function(){refresh(targetScene,thismesh);});
		var tropismDeltaSlider = datFolder.add(conf.initTurtle,'tropismDelta',0.0001,0.5);
		tropismDeltaSlider.onChange(function(){refresh(targetScene,thismesh);});
		var gravityDeltaSlider = datFolder.add(conf.initTurtle,'gravityDelta',0.0001,0.5);
		gravityDeltaSlider.onChange(function(){refresh(targetScene,thismesh);});

		var obj = {obj_and_stl:function()
		{
			var zip = new JSZip();
			var exporter = new THREE.OBJExporter();
			var txt = exporter.parse(thismesh);
			zip.file("PSOLSystem.obj", txt);
			exporter = new THREE.STLExporter();
			txt = exporter.parse(thismesh);
			zip.file("PSOLSystem.stl", txt);
			var content = zip.generate({type:"blob"});
			saveAs(content, "PSOLSystem.zip");
		}};
		datFolder.add(obj,'obj_and_stl').name('export');
		datFolder.children[1].add(thismesh);
		targetScene.add( datFolder );
		datFolder.close();
		window.addEventListener("mouseup", function(){updateMyURLArgs(targetScene,thismesh);});
	}


	this.updateMyURLArgs = function (targetScene,thismesh)
	{
		var position = new THREE.Vector3();
		targetScene.updateMatrixWorld();
		position.setFromMatrixPosition( thismesh.matrixWorld );
		updateURLargs([	thismesh.uname,
				thismesh.vrObjectTypeID,
				position.x,
				position.y,
				position.z,
				conf.iterations,
				conf.axiom,
				conf.randomSeed,
				conf.circleSegments,
				conf.initTurtle.scale.x,
				conf.initTurtle.step,
				conf.initTurtle.angle,
				conf.initTurtle.diameterDelta,
				conf.initTurtle.stepDelta,
				conf.initTurtle.tropismAngle,
				conf.initTurtle.gravityAngle,
				conf.initTurtle.tropismDelta,
				conf.initTurtle.gravityDelta]);
	}
	var updateMyURLArgs = this.updateMyURLArgs;

	this.refresh = function (targetScene,thismesh)
	{
		interpret(iterate());
		finalize(thismesh);
		updateMyURLArgs(targetScene,thismesh);
	}
	var refresh = this.refresh;

	this.load = function (targetScene, camera)
	{
		var argList = getURLargs(this.mesh.uname);
		var position = new THREE.Vector3();
		position.x = parseFloat(argList[1]);
		position.y = parseFloat(argList[2]);
		position.z = parseFloat(argList[3]);
		conf.iterations = parseInt(argList[4]);
		conf.axiom = argList[5];
		conf.randomSeed = parseInt(argList[6]);
		conf.circleSegments = parseInt(argList[7]);
		conf.diameter = parseFloat(argList[8]);
		conf.initTurtle.step = parseFloat(argList[9]);
		conf.initTurtle.angle = parseFloat(argList[10]);
		conf.initTurtle.diameterDelta = parseFloat(argList[11]);
		conf.initTurtle.stepDelta = parseFloat(argList[12]);
		conf.initTurtle.tropismAngle = parseFloat(argList[13]);
		conf.initTurtle.gravityAngle = parseFloat(argList[14]);
		conf.initTurtle.tropismDelta = parseFloat(argList[15]);
		conf.initTurtle.gravityDelta = parseFloat(argList[16]);
		conf.initTurtle.scale = new THREE.Vector3(conf.diameter,conf.diameter,conf.diameter);
		this.mesh.position.copy(position);
		this.initPresetRandom();
		this.fillGUI(targetScene,this.mesh);
		refresh(targetScene,this.mesh);
	}
}

vrObjectConstructorList.push(PSOLSystem); // global list of all available vrObject type constructors
