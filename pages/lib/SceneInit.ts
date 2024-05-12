import * as THREE from 'three';
import * as mathjs from 'mathjs';
// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Star from "@/pages/lib/Star";
import System from "@/pages/lib/System";
import Planet from "@/pages/lib/Planet";


export default class SceneInit {
    private controls: OrbitControls | undefined;
    get renderer(): WebGLRenderer | undefined {
        return this._renderer;
    }

    set renderer(value: WebGLRenderer | undefined) {
        this._renderer = value;
    }
    private _renderer: WebGLRenderer | undefined;
    get scene(): Scene | undefined {
        return this._scene;
    }

    set scene(value: Scene | undefined) {
        this._scene = value;
    }
    private _scene: Scene | undefined;
    get stats(): Stats | undefined {
        return this._stats;
    }

    set stats(value: Stats | undefined) {
        this._stats = value;
    }
    private fov: number | undefined;
    private camera: PerspectiveCamera | undefined;
    private _stats: Stats | undefined;

    initScene() {
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            1,
            100000
        );
        this.camera.position.x = 2868;
        this.camera.position.y = -9927;
        this.camera.position.z = 21071;

        this.scene = new THREE.Scene();

        // const starGeometry = new THREE.SphereGeometry(100, 10, 10);
        // const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        // const stars = [];
        // for (let i = 0; i < 1000; i++) {
        //     const star = new THREE.Mesh(starGeometry, starMaterial);
        //     star.position.x = Math.random() * 200000 - 100000;
        //     star.position.y = Math.random() * 20000 - 10000;
        //     star.position.z = Math.random() * 20000 - 10000;
        //     this.scene.add(star);
        //     stars.push(star);
        //     if (i === 0) console.log(star);
        // }

        let system = new System('11 Com');
        let star = new Star(
            system, '11 Com',
            mathjs.unit('0.69 solarmass'), mathjs.unit('0.63 solarradius'),
            mathjs.unit('185.1807118 deg'), mathjs.unit('17.7951762 deg'),
            mathjs.unit('-108.0870000 mas/year'), mathjs.unit('89.6397000 mas/year'),
            mathjs.unit('100.1580000 pc'),
        )
        let planet = new Planet(
            star, '11 Com b',
            mathjs.unit('6165.6 earthmass'), mathjs.unit('12.2 earthradius'),
            mathjs.unit('323.21 days'), mathjs.unit('2454519.4 days'),
            mathjs.unit('1.178 au'), 0.238,
            mathjs.unit('90 deg'), mathjs.unit('91.33 deg')
        )

        let our_system = new System('Our system');
        let sun = new Star(
            our_system, 'Sun',
            mathjs.unit('1 solarmass'), mathjs.unit('1 solarradius'),
            mathjs.unit('286.13 deg'), mathjs.unit('63.87 deg'),
            mathjs.unit('0.1 mas/year'), mathjs.unit('0.1 mas/year'),
            mathjs.unit('0.1138 pc')
        )
        let mars = new Planet(
            star, 'Mars',
            mathjs.unit('0.107 earthmass'), mathjs.unit('0.532 earthradius'),
            mathjs.unit('687 days'), mathjs.unit('2451545.0 days'),
            mathjs.unit('1.52367934191 au'), 0.093400620,
            mathjs.unit('1.8497263889 deg'), mathjs.unit('336 deg'),
        )

        this.scene.add(sun.three_mesh);
        this.camera.position.set(sun.three_mesh.position.x, sun.three_mesh.position.y, sun.three_mesh.position.z);
        // this.scene.add(system.three_group);
        // this.scene.add(our_system.three_group);
        // const spaceTexture = new THREE.TextureLoader().load("space2.jpeg");
        // this.scene.background = spaceTexture;

        // specify a canvas which is already created in the HTML file and tagged by an id
        // aliasing enabled
        this.renderer = new THREE.WebGLRenderer({
            // @ts-ignore
            canvas: document.getElementById("myThreeJsCanvas"),
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // ambient light which is for the whole scene
        // let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        // ambientLight.castShadow = false;
        // this.scene.add(ambientLight);

        // spotlight which is illuminating the chart directly
        // let spotLight = new THREE.SpotLight(0xffffff, 0.55);
        // spotLight.castShadow = true;
        // spotLight.position.set(0, 40, 10);
        // this.scene.add(spotLight);

        // if window resizes
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    animate() {
        // requestAnimationFrame(this.animate.bind(this));
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        // @ts-ignore
        this.stats.update();
        // this.controls.update();
    }

    render() {
        // @ts-ignore
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        // @ts-ignore
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // @ts-ignore
        this.camera.updateProjectionMatrix();
        // @ts-ignore
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}