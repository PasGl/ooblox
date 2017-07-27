ooblox
======

ooblox is a browser-based 3D sandbox framework, with optional VR support, in its infancy.

## Why ?

I want to have a framework like this.

It allows me to quickly develop and deploy 3D toys, experiments, visualizations, applications, etc. Having them all in a common framework means these 3D "things" can be combined and reused conveniently. The amount of time/work/code required to create a new kind of "thing" (a new Module/available object type) is significantly reduced by the framework.

## Demo

Standard three.js OrbitControls:
* Orbit - left mouse | touch: one finger move
* Zoom - middle mouse, or mousewheel | touch: two finger spread or squish
* Pan - right mouse, or arrow keys | touch: three finger swipe

### Sandbox scene

A scene set up to serve as sandbox.
* http://51.15.67.244/sandbox

### Guitar scene

A scene for guitar practise, with a metronome and a chord progression generator.
* http://51.15.67.244/guitar

### Geometry scene

A scene about algorithmic geometry, with a Torus Knot and a (not very good, yet) L-System example.
* http://51.15.67.244/geometry

### Dev-test scene

A scene with one instance of each Module.
* http://51.15.67.244/demo

## Deployment & hosting

Git clone from master to your webserver.

Nginx config snippet, that I use (adjust accordingly).
The first entry is for gathering all available Modules automatically.
The other entries are shortcuts for scenes.
```
        location ~ /js/vrobjects {
                autoindex on;
        }

        location ~ /demo {
                rewrite ^ http://51.15.67.244/?skybox=SKY+17.18366365783808+20.204247132755004+-0.39036985763498677+ThickCloudsWater&aTorusKnot=TTK+-22.30541847666609+-7.278443326301495+-19.474794097198178+9+0.7+246+7+6+10&chords=CPG+-9.80109879385909+21.315645183973334+-1.0965245997685713+4+390219&metronome=MET+-30.72378925766444+11.353101572013376+0.852497313116638+128+true&tree=PLS+10.634798521314313+-11.283363665386496+0.04289023235015321+3+FN(1)+645101582+5+0.6000000000000001+4.5+0.7+0.36+0.3+0.45+0.4+0.0001+0.0001&cammod=OCM+1.6051670373027225+4.2657046391278834+39.79632653680005+1.0816275156575472+3.7453727056881654+-0.1968623964210779&thisMenu=OMM+21.896019973310807+-12.729133403045104+0.06223876929249883;
        }

        location ~ /guitar {
                rewrite ^ http://51.15.67.244/?skybox=SKY+0+20+0+TropicalSunnyDay&chords=CPG+0+-7+-5+4+390219&metronome=MET+0+10+0+128+true&cammod=OCM+0+0+18+0+0+0;
        }

        location ~ /geometry {
                rewrite ^ http://51.15.67.244/?skybox=SKY+-2.536320824189655+25.640957852963872+-0.7051197316204849+ThickCloudsWater&cammod=OCM+2.7797675312643015+-0.34444525775531276+28.011177965220917+0+0+0&PSOL1501143910992=PLS+7.753765452290093+-14.523359921768211+0.9037005075142126+4+FN(1)+41135299+7+0.85+3.8000000000000003+0.41000000000000003+0.46+0.18+0.53+0.4368577100151778+0.11895943772571253+0.16&TK1501143915642=TTK+-18.61178360933779+-6.39698466500699+-23.408003389731+6+0.4+240+7+7+10;
        }

        location ~ /sandbox {
                rewrite ^ http://51.15.67.244/?skybox=SKY+0+20+0+ThickCloudsWater&cammod=OCM+0+0+40+0+0+0&thisMenu=OMM+5+0+0;
        }
```

## Contact

* Discord | https://discord.gg/Ux52EYw
* Patreon | https://www.patreon.com/PasGl

## ooblox makes use of

* three.js | https://github.com/mrdoob/three.js
* stats.js | https://github.com/mrdoob/stats.js
* jquery | https://github.com/jquery/jquery

## ooblox modules make use of

* datguivr | https://github.com/dataarts/dat.guiVR
* SkyboxSet | https://93i.de/p/free-skybox-texture-set/
* FileSaver.js | https://github.com/eligrey/FileSaver.js
* jszip | https://github.com/Stuk/jszip

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
