import * as mathjs from 'mathjs';
import * as utils from './utils';
import * as THREE from 'three';


// export default class HeavenlyBody {
//     private mesh: THREE.Mesh | undefined;
//
//     public constructor(
//         // mesh
//
//     ) {}
//
//     getMesh(): THREE.Mesh {
//         if (this.mesh === undefined || this.mesh === null) {
//             let geometry = new THREE.SphereGeometry(this.radius.toNumber('km'));
//             let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//             this.mesh = new THREE.Mesh(geometry, material);
//         }
//         return this.mesh;
//     }
// }