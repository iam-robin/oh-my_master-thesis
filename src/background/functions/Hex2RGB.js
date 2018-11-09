export default function Hex2RGB(hex) {
  if (hex.lastIndexOf('#') > -1) {
    hex = hex.replace(/#/, '0x');
  } else {
    hex = '0x' + hex;
  }
  let r = hex >> 16;
  let g = (hex & 0x00ff00) >> 8;
  let b = hex & 0x0000ff;
  return { r: r, g: g, b: b };
}
