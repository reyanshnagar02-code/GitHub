import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';
import { pinPulseIcon } from './mapIcons.js';
import { DEFAULT_CENTER } from '../constants.js';

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom() < 15 ? 16 : map.getZoom());
  }, [position]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function LocationPicker({ position, onChange }) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser — drop a pin manually.');
      return;
    }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setGeoError('Could not get your location — drop a pin manually on the map.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  useEffect(() => {
    useMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-white/50">Tap the map to drop a pin at the exact spot.</p>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="btn-secondary !px-3 !py-1.5 text-xs"
        >
          <LocateFixed size={14} /> {locating ? 'Locating…' : 'Use my location'}
        </button>
      </div>
      {geoError && <p className="mb-2 text-xs text-amber-400">{geoError}</p>}
      <div className="h-64 overflow-hidden rounded-lg border border-white/10">
        <MapContainer center={position || DEFAULT_CENTER} zoom={position ? 16 : 13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {position && <Marker position={position} icon={pinPulseIcon('#2dd4bf')} />}
          <Recenter position={position} />
        </MapContainer>
      </div>
      {position && (
        <p className="mt-1.5 text-xs text-white/40">
          Selected: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      )}
    </div>
  );
}
