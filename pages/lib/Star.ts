import System from "@/pages/lib/System";
import * as mathjs from 'mathjs';
import * as THREE from 'three';
import * as utils from '../scene/utils';
// import {CSS2DRenderer, CSS2DObject} from './CSS2DRenderer';


export class StarPosition {
    constructor(
        readonly ra: mathjs.Unit,  // in deg
        readonly dec: mathjs.Unit,  // in deg
        readonly proper_motion_ra: mathjs.Unit,  // in mas/yr
        readonly proper_motion_dec: mathjs.Unit,  // in mas/yr
        readonly distance: mathjs.Unit,  // in pc
    ) {}

    getRAByTime(time: number): mathjs.Unit {
        return mathjs.evaluate(
            "ra + pm_ra * time", {
                ra: this.ra,
                pm_ra: this.proper_motion_ra,
                time: utils.deltaYearsFromJ2000(time)
            }
        );
    }

    getDecByTime(time: number): mathjs.Unit {
        return mathjs.evaluate(
            "dec + pm_dec * time", {
                dec: this.dec,
                pm_dec: this.proper_motion_dec,
                time: utils.deltaYearsFromJ2000(time)
            }
        );
    }

    getX(time: number): mathjs.Unit {
        let ra = this.getRAByTime(time);
        let dec = this.getDecByTime(time);
        return mathjs.evaluate(
            "d * cos(dec) * cos(ra)", {d: this.distance, dec: dec, ra: ra}
        );
    }

    getY(time: number): mathjs.Unit {
        let ra = this.getRAByTime(time);
        let dec = this.getDecByTime(time);
        return mathjs.evaluate(
            "d * cos(dec) * sin(ra)", {d: this.distance, dec: dec, ra: ra}
        );
    }

    getZ(time: number): mathjs.Unit {
        let dec = this.getDecByTime(time);
        return mathjs.evaluate(
            "d * sin(dec)", {d: this.distance, dec: dec}
        );
    }

    getXYZ(time: number): { x: mathjs.Unit; y: mathjs.Unit, z: mathjs.Unit } {
        return {x: this.getX(time), y: this.getY(time), z: this.getZ(time)};
    }
}


class StarMesh extends THREE.Mesh {
    constructor(radius: number) {
        let geometry = new THREE.SphereGeometry(radius);
        let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        super(geometry, material);
    }
}


export default class Star {
    readonly position: StarPosition;

    readonly group: THREE.Group;
    readonly mesh: THREE.Mesh;

    // public text: HTMLDivElement;
    // public label: CSS2DObject;

    public constructor(
        readonly system: System,
        readonly name: string,
        readonly mass: mathjs.Unit,  // in solar mass
        readonly radius: mathjs.Unit,  // in solar radius
        readonly ra: mathjs.Unit,  // in deg
        readonly dec: mathjs.Unit,  // in deg
        readonly proper_motion_ra: mathjs.Unit,  // in mas/yr
        readonly proper_motion_dec: mathjs.Unit,  // in mas/yr
        readonly distance: mathjs.Unit,  // in pc
    ) {
        this.position = new StarPosition(ra, dec, proper_motion_ra, proper_motion_dec, distance);
        this.mesh = new StarMesh(this.radius.toNumber('au'));
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        this.system.group.add(this.group);

        let xyz = this.position.getXYZ(946684800);
        this.mesh.position.x += xyz.x.toNumber('au');
        this.mesh.position.y += xyz.y.toNumber('au');
        this.mesh.position.z += xyz.z.toNumber('au');

        // this.text = document.createElement('div');
        // this.text.className = 'label';
        // this.text.style.color = 'rgba(255,0,0,1)';
        // this.text.textContent = this.name;
        // console.log(this.text);
        //
        // this.label = new CSS2DObject(this.text);
        // this.label.position.copy(this.three_mesh.position);
        // this.group.add(this.label);
    }
}