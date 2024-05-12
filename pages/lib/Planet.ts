import * as mathjs from 'mathjs';
import * as THREE from 'three';
import Star from "@/pages/lib/Star";
import {CONST} from './const';


export default class Planet {
    readonly average_rate_of_sweep: mathjs.Unit;  // in rad/days
    readonly ascending_node_longitude: mathjs.Unit;  // in deg
    readonly mean_anomaly: mathjs.Unit;  // in deg

    private three_group: THREE.Group;
    private three_geometry: THREE.SphereGeometry;
    private three_material: THREE.MeshBasicMaterial;
    private three_mesh: THREE.Mesh;

    public constructor(
        readonly star: Star,
        readonly name: string,
        readonly mass: mathjs.Unit,  // in earth mass
        readonly radius: mathjs.Unit,  // in earth radius
        readonly orbital_period: mathjs.Unit,  // in days
        readonly epoch_of_periastron: mathjs.Unit,  // in days [JD]
        readonly semi_major_axis: mathjs.Unit,  // in au
        readonly eccentricity: number,  // number
        readonly inclination: mathjs.Unit,  // in deg
        readonly argument_of_periastron: mathjs.Unit,  // in deg
    ) {
        this.ascending_node_longitude = mathjs.evaluate(
            "atan((-sin(w)) / (cos(w) * sin(i)))",
            {
                w: this.argument_of_periastron,
                i: this.inclination,
            }
        )
        let epoch_of_periastron_in_J2000 = mathjs.unit(
            this.epoch_of_periastron.toNumber("days") - CONST.DAYS_FROM_JD_TO_J2000, "days"
        );
        this.average_rate_of_sweep = mathjs.evaluate(
            "(2 * pi rad) / P",
            {
                P: this.orbital_period,
            }
        )
        this.mean_anomaly = mathjs.evaluate(
            "n * t",
            {
                n: this.average_rate_of_sweep,
                t: epoch_of_periastron_in_J2000,
            }
        );

        this.three_geometry = new THREE.SphereGeometry(this.radius.toNumber('au'));
        this.three_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.three_mesh = new THREE.Mesh(this.three_geometry, this.three_material);
        this.three_group = new THREE.Group();
        this.three_group.add(this.three_mesh);
        this.star.system.three_group.add(this.three_group);
    }

    getTrueAnomalyByTime(time: number): mathjs.Unit {
        return mathjs.evaluate("M0 + n * (t - t0)", {
            M0: this.mean_anomaly,
            n: this.average_rate_of_sweep,
            t: mathjs.unit(time, "sec"),
            t0: this.epoch_of_periastron,
        });
    }

    getRadiusVector(trueAnomaly: mathjs.Unit) {
        return mathjs.evaluate("(a * (1 - pow(e, 2))) / (1 + (e * cos(v)))", {
            a: this.semi_major_axis,
            e: this.eccentricity,
            v: trueAnomaly
        })
    }

    getX(radiusVector: mathjs.Unit, trueAnomaly: mathjs.Unit, starX: mathjs.Unit): mathjs.Unit {
        return mathjs.evaluate(
            "r * (cos(w + v) * cos(om) - sin(w + v) * cos(i) * sin(om)) + X0",
            {
                r: radiusVector,
                om: this.ascending_node_longitude,
                w: this.argument_of_periastron,
                v: trueAnomaly,
                i: this.inclination,
                X0: starX,
            }
        )
    }

    getY(radiusVector: mathjs.Unit, trueAnomaly: mathjs.Unit, starY: mathjs.Unit): mathjs.Unit {
        return mathjs.evaluate(
            "r * (cos(w + v) * sin(om) + sin(w + v) * cos(i) * cos(om)) + Y0",
            {
                r: radiusVector,
                om: this.ascending_node_longitude,
                w: this.argument_of_periastron,
                v: trueAnomaly,
                i: this.inclination,
                Y0: starY,
            }
        )
    }

    getZ(radiusVector: mathjs.Unit, trueAnomaly: mathjs.Unit, starZ: mathjs.Unit): mathjs.Unit {
        return mathjs.evaluate(
            "r * (sin(w + v) * sin(i)) + Z0",
            {
                r: radiusVector,
                w: this.argument_of_periastron,
                v: trueAnomaly,
                i: this.inclination,
                Z0: starZ
            }
        )
    }

    getCoordinatesByTime(time: number): {x: mathjs.Unit, y: mathjs.Unit, z: mathjs.Unit} {
        let trueAnomaly = this.getTrueAnomalyByTime(time);
        let radiusVector = this.getRadiusVector(trueAnomaly);
        let starXYZ = this.star.getXYZ(time);

        let x = this.getX(radiusVector, trueAnomaly, starXYZ.x);
        let y = this.getY(radiusVector, trueAnomaly, starXYZ.y);
        let z = this.getZ(radiusVector, trueAnomaly, starXYZ.z);

        return {x: x, y: y, z: z};
    }
}