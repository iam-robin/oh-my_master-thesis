import Hex2RGB from './Hex2RGB';

export default function findClosestColor(r, g, b, table) {
  let rgb = { r: r, g: g, b: b };
  let delta = 3 * 256 * 256;
  let temp = { r: 0, g: 0, b: 0 };
  let colorFound;

  for (let i = 0; i < table.length; i++) {
    temp = Hex2RGB(table[i].hex);
    if (Math.pow(temp.r - rgb.r, 2) + Math.pow(temp.g - rgb.g, 2) + Math.pow(temp.b - rgb.b, 2) < delta) {
      delta = Math.pow(temp.r - rgb.r, 2) + Math.pow(temp.g - rgb.g, 2) + Math.pow(temp.b - rgb.b, 2);
      colorFound = table[i];
    }
  }
  return colorFound;
}
