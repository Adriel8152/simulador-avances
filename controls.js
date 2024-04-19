import './style.css'
import { shipYears, tiempoEnTierra, truncateToDecimals } from './main';

const maxSpeed = 0.099999;
let speed = 0;

export function setupControls(element) {
  element.innerHTML += `
    <div class='acelerator_container'>
      <input type="range" id="acelerator" value="50" />
    </div>

    <div class='info'></div>
  `
}

export const calculateSpeed = () => {
  const $acelerator = document.querySelector('#acelerator');
  const acelerationValue = ( parseInt( $acelerator.value ) / 10000000 ) - 0.000005;

  speed += acelerationValue;

  speed = Math.max(-maxSpeed, Math.min(maxSpeed, speed));

  updateDisplayedSpeedValue(document.querySelector('.info'), speed);

  return speed;
}

const updateDisplayedSpeedValue = ( element, speed ) => {
  let speedValue = truncateToDecimals( speed, 4 );

  element.innerHTML = `
    <div>Velocidad: ${ ( ( speedValue > 0 ? speedValue : (-1 * speedValue) ) * 1000 ).toFixed(1) }% c (Velocidad de la luz) </div>
    <div>Años transcurridos en la Nave: ${ parseInt(shipYears).toFixed() } </div>
    <div>Años transcurridos en la Tierra: ${ parseInt(tiempoEnTierra).toFixed() } </div>
  `;
}