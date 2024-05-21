import * as THREE from 'three';


export default class System {
    private name: string;
    public group: THREE.Group;

    public constructor(name: string) {
        this.name = name;
        this.group = new THREE.Group();
    }
}