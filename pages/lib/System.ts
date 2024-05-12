import * as THREE from 'three';


export default class System {
    private name: string;
    public three_group: THREE.Group;

    public constructor(name: string) {
        this.name = name;
        this.three_group = new THREE.Group();
    }
}