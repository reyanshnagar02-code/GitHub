import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { coloredIcon } from './mapIcons.js';
import { pinColor } from './StatusBadge.jsx';
import { DEFAULT_CENTER } from '../constants.js';

export function IssueMap({ issues, onSelect, center = DEFAULT_CENTER, zoom = 14, scrollWheelZoom = true }) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.lat, issue.lng]}
          icon={coloredIcon(pinColor(issue.status))}
          eventHandlers={onSelect ? { click: () => onSelect(issue) } : undefined}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-navy-950">{issue.title}</p>
              <p className="text-navy-700">{issue.category} &middot; {issue.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
