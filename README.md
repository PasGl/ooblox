ooblox
======

ooblox is a browser-based 3D sandbox framework, with optional VR support, in its infancy.

![ooblox - screenshots](/images/screenshots.gif)

## Why ?

I want to have a framework like this.

It allows me to quickly develop and deploy 3D toys, experiments, visualizations, applications, etc. Having them all in a common framework means these 3D "things" can be combined and reused conveniently. The amount of time/work/code required to create a new kind of "thing" (a new Module/available object type) is significantly reduced by the framework.

## Demo

### Sandbox scene

A scene set up to serve as sandbox.
* http://51.15.67.244/sandbox

### Guitar scene

A scene for guitar practise, with a metronome and a chord progression generator.
* http://51.15.67.244/guitar

### Geometry scene

A scene about algorithmic geometry, with a Torus Knot and a (not very good, yet) L-System example.
* http://51.15.67.244/geometry

### Test scene

A scene with (at least) one instance of each Module.
* http://51.15.67.244/demo

## Modules (so far)

Each module implements an "Object Type" that ooblox can instatiate via URL query string, to assemble the scene.

*  `Type`| Description | Module-file
*  CPG | Chord progression generator | [oobloxChordProgressionGenerator.js](./js/vrobjects/oobloxChordProgressionGenerator.js)
*  ENV | Skybox, Diamond-Square ground, Lights & Fog | [oobloxEnvironment.js](./js/vrobjects/oobloxEnvironment.js)
*  OMM | Menu to add and remove objects | [oobloxMasterMenu.js](./js/vrobjects/oobloxMasterMenu.js)
*  OML | Mesh loader for Collada, OBJ and STL | [oobloxMeshLoader.js](./js/vrobjects/oobloxMeshLoader.js)
*  MET | Metronom | [oobloxMetronome.js](./js/vrobjects/oobloxMetronome.js)
*  OCM | Camera perspective | [oobloxOrbitCamMod.js](./js/vrobjects/oobloxOrbitCamMod.js)
*  PLS | Tree-generator based on L-System | [oobloxPSOLSystem.js](./js/vrobjects/oobloxPSOLSystem.js)
*  TPL | Texture Panel | [oobloxTexturePanel.js](./js/vrobjects/oobloxTexturePanel.js)
*  TTK | three.js torus-knot as ooblox module | [oobloxTorusKnot.js](./js/vrobjects/oobloxTorusKnot.js)

### URL query string
```
index.html?nameOfInstance1=TYPE+param1+param2+....+paramLast&nameOfInstance2=TYPE+param1+...
```
*  `&` separates Instances.
*  Instances need unique names.
*  `TYPE` is one of the available 3-letter Module codes.
*  `+` separates parameters for an instance.
*  Modules implement their own logic on how parameters are to be used (see `this.load` in Module-files).

## Contact

* Discord | https://discord.gg/Ux52EYw
* Patreon | https://www.patreon.com/PasGl

## Deployment & hosting

Git clone from master to your webserver.
Nginx config snippet, that I use (adjust accordingly):
*  The first entry is for gathering all available Modules automatically.
*  The second entry allows Modules to find all available textures.
*  The third entry allows Modules to find all available 3D models.
*  The other entries are shortcuts for scenes.
```
        location ~ /js/vrobjects {
                autoindex on;
        }

        location ~ /images/textures {
                autoindex on;
        }

        location ~ /models {
                autoindex on;
        }

        location ~ /demo {
                rewrite ^ http://51.15.67.244/?cammod=OCM+0+0+30+0+0+-75&thisMenu=OMM+16+-2.5+-26+true&infoPanel=TPL+-20.0+-17.0+-30+30+15+6+0.50+0.16+-17+14.0+0+true+0.61+false+ooblox-controls.png&environment=ENV+0+-18+0+1600+1600+92+13+41.5+-20+13+13+29385260+5+mossy+TropicalSunnyDay&aTorusKnot=TTK+-46+-6+-55+6+0.4+240+7+9+7+-31+16.5+-3.0&aTree=PLS+1+-25.5+-77+4+FN(1)+37491667+7+1.87+6.2+0.57+0.39+0.28+0.18+0.17+0.1+0.17+16.5+22.5+-0.25+pattern_230+21&chords1=CPG+70+17+-84+4+21477896+-10+-5+0&metronom1=MET+50.5+14.5+-84+128+true+-11+-15+-1.5&mesh1=OML+30.56+-25.55+-10.46+0.1+0.1+0.1+1+0.13+0.7+6.2+10.8+6.7+3.1+models%2FYughues%2Fpallet_v2.obj&mesh2=OML+30.67+-24.1+-10.44+0.1+0.1+0.1+1+0.13+0.7+6.2+7.7+11.8+-6.8+models%2FYughues%2Ffuel_can.obj;
        }

        location ~ /guitar {
                rewrite ^ http://51.15.67.244/?chords=CPG+0+-7+-5+4+390219+-10+-5+0&metronome=MET+0+10+0+128+true+0+0+0&cammod=OCM+0+0+18+0+0+0;
        }

        location ~ /geometry {
                rewrite ^ http://51.15.67.244/?cammod=OCM+-7+-69.5+-9+-4.5+-69.4+-47&PSOL1501143910992=PLS+10+-89.5+-42.5+5+FN(1)+41135299+7+0.85+3.8+0.4+0.46+0.18+0.53+0.44+0.12+0.16+-3.6+14.8+13.4+pattern_230+21&TK1501143915642=TTK+-28+-69+-36+6+0.4+240+7+7+10+0.2+18+-5.9&ENV1501867801551=ENV+0+-55+0+1600+1600+315+27.7+-16.2+-37.5+35+35+41382439+7+dirt+CloudyLightRays;
        }

        location ~ /sandbox {
                rewrite ^ http://51.15.67.244/?cammod=OCM+0+0+5+0+0+-30&thisMenu=OMM+16+-2.5+-26+false&infoPanel=TPL+-20.0+-17.0+-30+30+15+6+0.50+0.16+-17+14.0+0+true+0.61+false+ooblox-controls.png&environment=ENV+0+-18+0+1600+1600+92+13+41.5+-20+13+13+29385260+5+sand+TropicalSunnyDay;
        }
```

## ooblox makes use of

* three.js | https://github.com/mrdoob/three.js
* stats.js | https://github.com/mrdoob/stats.js
* jquery | https://github.com/jquery/jquery

## ooblox modules make use of

* datguivr | https://github.com/dataarts/dat.guiVR
* SkyboxSet by Heiko Irrgang | https://93i.de/p/free-skybox-texture-set/
* Textures & Models by Yughues | https://www.patreon.com/Yughues
* FileSaver.js | https://github.com/eligrey/FileSaver.js
* jszip | https://github.com/Stuk/jszip

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
