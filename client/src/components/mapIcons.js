import L from 'leaflet';

export function coloredIcon(color) {
  return L.divIcon({
    className: 'urbanfix-pin',
    html: `<span style="
      display:block;width:16px;height:16px;border-radius:50%;
      background:${color};border:2px solid rgba(255,255,255,0.85);
      box-shadow:0 0 0 3px ${color}33;
    "></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

export function pinPulseIcon(color) {
  return L.divIcon({
    className: 'urbanfix-pin-pulse',
    html: `<span style="
      display:block;width:20px;height:20px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 0 0 4px ${color}55;
    "></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}
