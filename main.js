import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { calculateSpeed, setupControls, } from './controls';

const renderer = new THREE.WebGLRenderer({antialias: true,});

renderer.setSize(window.innerWidth, window.innerHeight);

document.querySelector("#app").appendChild(renderer.domElement);

// Se establecen los controles
document.querySelector('#app').insertAdjacentHTML('beforeend', `<div id="controls"></div>`);
setupControls(document.querySelector('#controls'));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);

camera.position.set(0, 0, -1);

renderer.setClearColor(0x000000);

const orbit = new OrbitControls(camera, renderer.domElement);

orbit.enableZoom = false;

orbit.update();

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const gtlfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 4;

let mixer;
let starfield;
let hyperspeed;

rgbeLoader.load( './HDR_029_Sky_Cloudy_Env.hdr', ( texture ) => {
  // texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.environment = texture;

  gtlfLoader.load( './scene.gltf', ( gltf ) => {
    // console.log(gltf)
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

let lastTime = (new Date()).getTime();
export let shipYears = 0; // Aumenta 1 año cada segundo


// Función para calcular el tiempo transcurrido en la Tierra
function tiempoTierra() {
  let velocidadNave = calculateSpeed(); // Velocidad de la nave como porcentaje de la velocidad de la luz

  // Asegurarse de que la velocidad de la nave no exceda la velocidad de la luz
  if (velocidadNave >= 1) {
    console.log("La velocidad de la nave no puede exceder la velocidad de la luz.");
    return;
  }

  let tiempoEnTierra = shipYears / Math.sqrt( 1 - Math.pow( ( velocidadNave * 10 ), 2 ) );

  console.table([
    {
      "Velocidad de la nave (%)": velocidadNave * 10,
      "Tiempo en la nave (años)": shipYears,
      "Tiempo en la Tierra (años)": tiempoEnTierra
    }
  ]);

  return tiempoEnTierra;
}

export function truncateToDecimals(num, dec = 2) {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
}

// Calcula el tiempo transcurrido en la Tierra
export let tiempoEnTierra;

function animate( ) {
  // if(!mixer) return;
  requestAnimationFrame(animate);
  
  mixer.update( calculateSpeed() ); // Actualiza el tiempo de la animación
  
  renderer.render( scene, camera, );
  
  let currentTime = (new Date()).getTime();
  
  if (currentTime - lastTime >= 100) {
    lastTime = currentTime;
    shipYears += 0.1;

    tiempoEnTierra = tiempoTierra();
    // console.log("Años en la nave: ", shipYears)
  }

}