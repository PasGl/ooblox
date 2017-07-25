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
                rewrite ^ http://51.15.67.244/?skybox=SKY+0+20+0+ThickCloudsWater&aTorusKnot=TTK+-30+10+-20+9+0.7+246+7+6+10&chords=CPG+12+-20+0+4+390219&metronome=MET+7+25+0+128+true&tree=PLS+10+-10+-20+3+FN(1)+645101582+5+0.6+4.5+0.7+0.36+0.3+0.45+0.4+0.0001+0.0001&cammod=OCM+0+0+40+0+0+0&thisMenu=OMM+31+7+0;
        }

        location ~ /guitar {
                rewrite ^ http://51.15.67.244/?skybox=SKY+0+20+0+TropicalSunnyDay&chords=CPG+0+-7+-5+4+390219&metronome=MET+0+10+0+128+true;
        }

        location ~ /geometry {
                rewrite ^ http://51.15.67.244/?skybox=SKY+0+20+0+ThickCloudsWater&aTorusKnot=TTK+-30+-10+-20+9+0.7+246+7+6+10&tree=PLS+10+-10+-20+3+FN(1)+645101582+5+0.6000000000000001+4.5+0.7+0.36+0.3+0.45+0.4+0.0001+0.0001;
        }

        location ~ /sandbox {
                rewrite ^ http://51.15.67.244/?skybox=SKY+0+20+0+ThickCloudsWater&cammod=OCM+0+5+40+0+0+0&thisMenu=OMM+5+0+0;
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
