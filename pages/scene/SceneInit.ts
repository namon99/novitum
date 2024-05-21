import * as THREE from 'three';
import * as mathjs from 'mathjs';
// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer';
// @ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Star from "@/pages/lib/Star";
import System from "@/pages/lib/System";
import Planet from "@/pages/lib/Planet";


export default class SceneInit {
    private controls: OrbitControls;
    private labelRenderer: CSS2DRenderer;
    private renderer: WebGLRenderer;
    private readonly camera: PerspectiveCamera;
    private readonly scene: Scene;
    private readonly stats: Stats;

    constructor() {
        let container = document.createElement("div")
        container.id = 'container';
        document.body.appendChild(container);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild( this.labelRenderer.domElement );

        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.0001,
            100000000
        );

        this.scene = new THREE.Scene();

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // if window resizes
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    initScene() {
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
            sun, 'Mars',
            mathjs.unit('0.107 earthmass'), mathjs.unit('0.532 earthradius'),
            mathjs.unit('687 days'), mathjs.unit('2451545.0 days'),
            mathjs.unit('1.52367934191 au'), 0.093400620,
            mathjs.unit('1.8497263889 deg'), mathjs.unit('336 deg'),
        )

        this.scene.add(system.group);
        this.scene.add(our_system.group);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = sun.mesh.position;
        this.controls.minDistance = 0.02;
        this.controls.maxDistance = 0.5;
        this.controls.update();

        // Создание геометрии и материала для частиц
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = Math.random() * 200000 - 100000;
            const y = Math.random() * 200000 - 100000;
            const z = Math.random() * 200000 - 100000;
            starVertices.push(x, y, z);
        }  // TODO: переделать на координаты реальных звёзд

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        // Создание точек (частиц) и добавление их в сцену
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.stats.update();
        this.controls.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}