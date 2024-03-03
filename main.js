import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const renderer = new THREE.WebGLRenderer({antialias: true,});

renderer.setSize(window.innerWidth, window.innerHeight);

document.querySelector("#app").appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);

renderer.setClearColor(0x000000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(1, 1, 1);

orbit.update();

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const gtlfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

let mixer;
let starfield;
let hyperspeed;

rgbeLoader.load( './HDR_029_Sky_Cloudy_Env.hdr', ( texture ) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gtlfLoader.load( './scene.gltf', ( gltf ) => {
    const model = gltf.scene;
    scene.add(model);

    const animationClips = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    starfield = mixer.clipAction(animationClips[0]);
    hyperspeed = mixer.clipAction(animationClips[1]);

    starfield.play();

    animate();
  } );
} );

function animate( ) {
  requestAnimationFrame(animate);
  mixer.update(0.005); // Actualiza el tiempo de la animación
  renderer.render(scene, camera,);
}

renderer.setAnimationLoop(animate);