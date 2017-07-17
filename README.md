ooblox
======

ooblox is a browser-based 3D sandbox framework, with optional VR support, in its infancy.

## why ?

I want to have a framework like this.

It allows me to quickly develop and deploy 3D toys, experiments, visualizations, applications, etc. Having them all in a common framework means these 3D "things" can be combined and reused conveniently. The amount of time/work/code required to create a new kind of "thing" (a new Module/available object type) is significantly reduced by the framework.

## demo

Static html5+js, using WebGl and WebVR via three.js
(primarily Google Chrome for now)

Currently using standard three.js OrbitControls

* Orbit - left mouse | touch: one finger move
* Zoom - middle mouse, or mousewheel | touch: two finger spread or squish
* Pan - right mouse, or arrow keys | touch: three finger swipe

### guitar scene

A scene for guitar practise, with a metronome and a chord progression generator.

* http://51.15.67.244/guitar

### geometry scene

A scene about algorithmic geometry, with a Torus Knot and a (not very good, yet) L-System example.

* http://51.15.67.244/geometry

### demo scene

A scene with one instance of each Module.

* http://51.15.67.244/demo

## ooblox makes use of

* three.js | https://github.com/mrdoob/three.js
* stats.js | https://github.com/mrdoob/stats.js

## ooblox modules make use of

* datguivr | https://github.com/dataarts/dat.guiVR
* SkyboxSet | https://93i.de/p/free-skybox-texture-set/
* FileSaver.js | https://github.com/eligrey/FileSaver.js
* jszip | https://github.com/Stuk/jszip

## contact

https://discord.gg/Ux52EYw

https://www.patreon.com/PasGl

## license

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
