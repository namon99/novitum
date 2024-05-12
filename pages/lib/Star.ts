import System from "@/pages/lib/System";
import * as mathjs from 'mathjs';
import * as THREE from 'three';
import * as utils from './utils';
// import HeavenlyBody from "@/pages/lib/HeavenlyBody";


export default class Star {
    private three_group: THREE.Group;
    readonly three_geometry: THREE.SphereGeometry;
    readonly three_material: THREE.MeshBasicMaterial;
    readonly three_mesh: THREE.Mesh;

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
        this.three_geometry = new THREE.SphereGeometry(this.radius.toNumber('au') * 10000 / 46);
        this.three_material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.three_mesh = new THREE.Mesh(this.three_geometry, this.three_material);
        this.three_group = new THREE.Group();
        this.three_group.add(this.three_mesh);
        this.system.three_group.add(this.three_group);
        let xyz = this.getXYZ(946684800);
        this.three_mesh.position.x += xyz.x.toNumber('au');
        this.three_mesh.position.y += xyz.y.toNumber('au');
        this.three_mesh.position.z += xyz.z.toNumber('au');
    }

    getRAByTime(time: number): mathjs.Unit {
        return mathjs.add(this.ra, mathjs.multiply(this.proper_motion_ra, utils.deltaYearsFromJ2000(time)));
    }

    getDecByTime(time: number): mathjs.Unit {
        return mathjs.add(this.dec, mathjs.multiply(this.proper_motion_dec, utils.deltaYearsFromJ2000(time)));
    }

    getX(time: number): mathjs.Unit {
        let ra = this.getRAByTime(time);
        let dec = this.getDecByTime(time);
        // @ts-ignore
        return mathjs.multiply(this.distance, mathjs.cos(dec), mathjs.cos(ra));
    }

    getY(time: number): mathjs.Unit {
        let ra = this.getRAByTime(time);
        let dec = this.getDecByTime(time);
        // @ts-ignore
        return mathjs.multiply(this.distance, mathjs.cos(dec), mathjs.sin(ra));
    }

    getZ(time: number): mathjs.Unit {
        let dec = this.getDecByTime(time);
        // @ts-ignore
        return mathjs.multiply(this.distance, mathjs.sin(dec));
    }

    getXYZ(time: number): { x: mathjs.Unit; y: mathjs.Unit, z: mathjs.Unit } {
        return {x: this.getX(time), y: this.getY(time), z: this.getZ(time)}
    }
}