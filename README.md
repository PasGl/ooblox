ooblox
======

ooblox is a browser-based 3D sandbox framework, with optional VR support, in its infancy.

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

A scene with one instance of each Module.
* http://51.15.67.244/demo

## Contact

* Discord | https://discord.gg/Ux52EYw
* Patreon | https://www.patreon.com/PasGl

## Deployment & hosting

Git clone from master to your webserver.

Nginx config snippet, that I use (adjust accordingly).

The first entry is for gathering all available Modules automatically.

The second entry allows Modules to find all available textures.

The third entry allows Modules to find all available 3D models.

The other entries are shortcuts for scenes.
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
                rewrite ^ http://51.15.67.244/?aTorusKnot=TTK+-30.52241056830794+-24.060654672392648+-19.148882587418605+9+0.7+246+7+6+10+-10+-5+6&chords=CPG+-20.413473137516963+15.520613613013657+-0.8822046718585383+4+390219+-29.275937545907542+10.236375141624494+0.05410277709049893&metronome=MET+-19.376949262765798+12.911771552356136+0.6836799437677445+128+false+-26.24683861118693+-6.671107515866989+0.4303844745127776&tree=PLS+32.451315494533375+-20.110257252210452+-0.12786119898048298+3+FN(1)+645101582+5+0.6000000000000001+4.5+0.7+0.36+0.3+0.45+0.4+0.0001+0.0001+5+5+0&cammod=OCM+1.6051670373027225+4.2657046391278834+39.79632653680005+1.0816275156575472+3.7453727056881654+-0.1968623964210779&thisMenu=OMM+17.85859540156063+17.07248287315567+-0.27264278541460385+true&TPL1501595683496=TPL+2.776542255211245+1.1955171270653295+0.06590600067666941+30+15+5.9594000000000005+0+0+-6.8305519702257005+-10.47184376458835+0.09066960974727181+ooblox-controls.png&ENV1501867801551=ENV+4.130388194431411+-55.33366744925628+0.03760227668291094+1600+1600+315.1+14.818017337427506+28.08078750781173+-4.8953764355944145+5+5+41382439+7+dirt+ThickCloudsWater;
        }

        location ~ /guitar {
                rewrite ^ http://51.15.67.244/?chords=CPG+0+-7+-5+4+390219+-10+-5+0&metronome=MET+0+10+0+128+true+0+0+0&cammod=OCM+0+0+18+0+0+0;
        }

        location ~ /geometry {
                rewrite ^ http://51.15.67.244/?cammod=OCM+2.926071085541353+-0.3625739555319082+29.485450489706228+0+0+0&PSOL1501143910992=PLS+7.753765452290093+-14.523359921768211+0.9037005075142126+4+FN(1)+41135299+7+0.85+3.8000000000000003+0.41000000000000003+0.46+0.18+0.53+0.4368577100151778+0.11895943772571253+0.16+5+5+0&TK1501143915642=TTK+-10.053305813650777+-5.292586026307477+-24.24374738624524+6+0.4+240+7+7+10+-10+-5+6&ENV1501867801551=ENV+4.130388194431411+-55.33366744925628+0.03760227668291094+1600+1600+315.1+-29.10218852144671+36.551352164013494+-4.430635844088698+5+5+41382439+7+dirt+ThickCloudsWater;
        }

        location ~ /sandbox {
                rewrite ^ http://51.15.67.244/?cammod=OCM+0+3.340685457412943+34.12951013030822+0+0+0&thisMenu=OMM+19.449952428606203+0.023490438479575104+0.13461065549858375+false&TPL1501595236567=TPL+-10.450004873167053+-8.47779597167776+0.36814026312403314+30+15+5.898700000000001+0.39690000000000003+0.1095+-10+-10.28196373816352+0.1+ooblox-controls.png&ENV1501867801551=ENV+4.130388194431408+-55.33366744925629+0.03760227668291094+1600+1600+315.1+17.832533249174052+28.209850964396843+-9.190907131616157+5+5+41382439+7+dirt+ThickCloudsWater;
        }
```

## ooblox makes use of

* three.js | https://github.com/mrdoob/three.js
* stats.js | https://github.com/mrdoob/stats.js
* jquery | https://github.com/jquery/jquery

## ooblox modules make use of

* datguivr | https://github.com/dataarts/dat.guiVR
* SkyboxSet | https://93i.de/p/free-skybox-texture-set/
* Textures & Models by Yughues | https://www.patreon.com/Yughues
* FileSaver.js | https://github.com/eligrey/FileSaver.js
* jszip | https://github.com/Stuk/jszip

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
