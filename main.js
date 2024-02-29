import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const renderer = new THREE.WebGLRenderer({antialias: true,});

renderer.setSize(window.innerWidth, window.innerHeight);

document.querySelector("#app").appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(6, 6, 6);

orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const gtlfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

rgbeLoader.load( './HDR_029_Sky_Cloudy_Env.hdr', ( texture ) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gtlfLoader.load( './scene.gltf', ( gltf ) => {
    const model = gltf.scene;
    scene.add(model);
  } );
} );

function animate( time ) {
  renderer.render(scene, camera,);
}

renderer.setAnimationLoop(animate);