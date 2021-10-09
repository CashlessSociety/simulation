
function pad(num: string, size: number){ return ('000000000' + num).substr(-size); }

function debounce(callback, time) {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time);
  };
}


/** Returns an appropriate color for a trust rating
 * -100 = Dark Red
 * -50 = Light Red
 * 0 = White
 * 50 = Light Green
 * 100 = Dark Green
 */
function hexColorForTrustLevel(trustLevel) {
  let hexColorString = '#';
  if (trustLevel < 0) {
    hexColorString += (255).toString(16);
    hexColorString += pad(Math.floor(255 - Math.abs(trustLevel) / 100 * 255).toString(16), 2); // G
    hexColorString += pad(Math.floor(255 - Math.abs(trustLevel) / 100 * 255).toString(16), 2); // B
  } else {
    hexColorString += pad(Math.floor(255 - Math.abs(trustLevel) / 100 * 255).toString(16), 2); // R
    hexColorString += (255).toString(16);
    hexColorString += pad(Math.floor(255 - Math.abs(trustLevel) / 100 * 255).toString(16), 2); // B
  }

  return hexColorString;
}

export {pad, debounce, hexColorForTrustLevel};